'use client';

import { motion } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { $difficulty, $isPlaying, setDifficulty, type Difficulty } from '@/stores/gameStore';
import { DEFAULT_IMAGE } from '@/lib/puzzle';
import { useScrollTo } from '@/lib/scrollTo';

const LEVELS: { n: Difficulty; name: string; note: string }[] = [
  { n: 3, name: 'Easy', note: '8 tiles. A warm-up.' },
  { n: 4, name: 'Classic', note: '15 tiles. The original.' },
  { n: 5, name: 'Hard', note: '24 tiles. Plan ahead.' },
  { n: 6, name: 'Expert', note: '35 tiles. Bring coffee.' },
];

function MiniGrid({ n }: { n: number }) {
  return (
    <motion.div
      variants={{ rest: { gap: 2 }, hover: { gap: 6 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="grid aspect-square w-full"
      style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
    >
      {Array.from({ length: n * n }, (_, i) => {
        const last = i === n * n - 1;
        return (
          <motion.div
            key={i}
            variants={{ rest: { scale: 1 }, hover: { scale: last ? 0.6 : 0.96 } }}
            className={`aspect-square rounded-[3px] ${last ? 'border border-dashed border-white/25' : ''}`}
            style={
              last
                ? undefined
                : {
                    backgroundImage: `url(${DEFAULT_IMAGE})`,
                    backgroundSize: `${n * 100}%`,
                    backgroundPosition: `${((i % n) / (n - 1)) * 100}% ${(Math.floor(i / n) / (n - 1)) * 100}%`,
                  }
            }
          />
        );
      })}
    </motion.div>
  );
}

export function DifficultySection() {
  const difficulty = useStore($difficulty);
  const isPlaying = useStore($isPlaying);
  const scrollTo = useScrollTo();

  return (
    <section className="relative border-t border-line py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] font-bold tracking-[-0.04em]">
            Pick your <span className="text-gradient">grid.</span>
          </h2>
          <p className="max-w-xs text-zinc-400">
            From a nine-square warm-up to a 36-square grind. Time and moves are tracked on every run.
          </p>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: '-15%' }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
        >
          {LEVELS.map(({ n, name, note }) => {
            const selected = difficulty === n;
            return (
              <motion.li
                key={n}
                variants={{ hidden: { opacity: 0, y: 40 }, shown: { opacity: 1, y: 0 } }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              >
                <motion.button
                  type="button"
                  disabled={isPlaying}
                  aria-pressed={selected}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  whileFocus="hover"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setDifficulty(n);
                    scrollTo('#play');
                  }}
                  className={`group flex w-full flex-col gap-5 rounded-2xl border p-4 text-left transition-colors md:p-6 ${
                    selected ? 'border-orchid/60 bg-white/[0.06]' : 'border-line bg-ink-2 hover:border-white/20'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <MiniGrid n={n} />
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xl font-semibold tracking-tight md:text-2xl">{name}</span>
                      <span className="font-mono text-xs text-zinc-500">
                        {n}×{n}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">{note}</p>
                  </div>
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
