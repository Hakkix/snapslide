'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $difficulty, $imageUrl, $isPlaying, $isWon, $tiles, moveTile } from '@/stores/gameStore';
import { DEFAULT_IMAGE } from '@/lib/puzzle';

export function Board() {
  const n = useStore($difficulty);
  const tiles = useStore($tiles);
  const imageUrl = useStore($imageUrl) ?? DEFAULT_IMAGE;
  const isPlaying = useStore($isPlaying);
  const isWon = useStore($isWon);
  const reduceMotion = useReducedMotion();

  const total = n * n;
  // Before the first game, show the solved picture; tiles[] is empty until then.
  const slots = tiles.length === total ? tiles : Array.from({ length: total }, (_, i) => i);
  const spring = reduceMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 38, mass: 0.7 };

  return (
    <div className="relative aspect-square w-full rounded-3xl border border-line bg-ink-2 shadow-[0_40px_120px_-40px_rgba(118,75,162,0.55)]">
      <div className="absolute inset-2 md:inset-3">
        {Array.from({ length: total }, (_, tile) => {
          const isLast = tile === total - 1;
          // The last tile is the empty square; it only appears once the puzzle is solved.
          if (isLast && !isWon) return null;

          const slot = isLast ? total - 1 : slots[tile];
          const col = slot % n;
          const row = Math.floor(slot / n);

          return (
            <motion.button
              key={`${n}-${tile}`}
              type="button"
              aria-label={`Tile ${tile + 1}`}
              disabled={!isPlaying}
              onClick={() => moveTile(slot)}
              initial={isLast ? { opacity: 0, scale: 0.6 } : false}
              animate={{ x: `${col * 100}%`, y: `${row * 100}%`, opacity: 1, scale: 1 }}
              whileHover={isPlaying && !reduceMotion ? { scale: 0.97 } : undefined}
              whileTap={isPlaying ? { scale: 0.93 } : undefined}
              transition={spring}
              className="absolute top-0 left-0 p-[2px] outline-none focus-visible:z-10 enabled:cursor-pointer md:p-[3px]"
              style={{ width: `${100 / n}%`, height: `${100 / n}%` }}
            >
              <span
                className="block size-full rounded-md ring-orchid ring-offset-2 ring-offset-ink-2 md:rounded-lg [button:focus-visible>&]:ring-2"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${n * 100}%`,
                  backgroundPosition: `${((tile % n) / (n - 1)) * 100}% ${(Math.floor(tile / n) / (n - 1)) * 100}%`,
                }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
