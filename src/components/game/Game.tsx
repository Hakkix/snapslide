'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Move, RotateCcw, Shuffle, Timer, Trophy, X } from 'lucide-react';
import {
  $difficulty,
  $elapsedTime,
  $isPlaying,
  $isWon,
  $moves,
  DIFFICULTY_LABELS,
  incrementTime,
  resetGame,
  setDifficulty,
  startGame,
  type Difficulty,
} from '@/stores/gameStore';
import { formatTime, scramblePuzzle } from '@/lib/puzzle';
import { Board } from './Board';
import { ImageDrop } from './ImageDrop';
import { MagneticButton } from '@/components/sections/MagneticButton';

function Stat({ icon: Icon, label, value }: { icon: typeof Timer; label: string; value: string }) {
  return (
    <div className="flex-1 rounded-2xl border border-line bg-ink-2 px-4 py-3">
      <p className="flex items-center gap-1.5 text-xs text-zinc-500">
        <Icon className="size-3.5" /> {label}
      </p>
      <div className="relative mt-1 h-8 overflow-hidden font-mono text-2xl tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className="block"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Game() {
  const difficulty = useStore($difficulty);
  const isPlaying = useStore($isPlaying);
  const isWon = useStore($isWon);
  const moves = useStore($moves);
  const elapsed = useStore($elapsedTime);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isPlaying || isWon) return;
    const id = window.setInterval(incrementTime, 1000);
    return () => window.clearInterval(id);
  }, [isPlaying, isWon]);

  const start = () => {
    const { tiles, emptyPos } = scramblePuzzle(difficulty, difficulty * difficulty * 20); // More moves for harder difficulties
    setDismissed(false);
    startGame(tiles, emptyPos);
  };

  return (
    <section id="play" className="relative border-t border-line py-24 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(102,126,234,0.18),transparent_65%)]"
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 [grid-template-areas:'head'_'board'_'controls'] md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-x-16 md:gap-y-6 md:px-10 md:[grid-template-areas:'head_board'_'controls_board'] md:[grid-template-rows:auto_1fr]">
        <div className="[grid-area:head]">
          <p className="mb-3 font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase">Play</p>
          <h2 className="text-[clamp(2.4rem,5vw,4rem)] leading-[0.95] font-bold tracking-[-0.04em]">Your move.</h2>
        </div>

        <div className="flex flex-col gap-6 [grid-area:controls]">
          <ImageDrop />

          <div>
            <p id="difficulty-label" className="mb-2 text-sm text-zinc-400">
              Difficulty
            </p>
            <ToggleGroup.Root
              type="single"
              aria-labelledby="difficulty-label"
              value={String(difficulty)}
              onValueChange={(v) => v && setDifficulty(Number(v) as Difficulty)}
              disabled={isPlaying}
              className="grid grid-cols-4 gap-1 rounded-2xl border border-line bg-ink-2 p-1"
            >
              {(Object.keys(DIFFICULTY_LABELS) as `${Difficulty}`[]).map((d) => (
                <ToggleGroup.Item
                  key={d}
                  value={d}
                  aria-label={DIFFICULTY_LABELS[Number(d) as Difficulty]}
                  className="relative rounded-xl py-2.5 font-mono text-sm text-zinc-400 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-orchid disabled:cursor-not-allowed disabled:opacity-50 data-[state=on]:text-ink"
                >
                  {String(difficulty) === d && (
                    <motion.span
                      layoutId="difficulty-pill"
                      className="absolute inset-0 rounded-xl bg-white"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    {d}×{d}
                  </span>
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </div>

          <div className="flex gap-3">
            <Stat icon={Timer} label="Time" value={formatTime(elapsed)} />
            <Stat icon={Move} label="Moves" value={String(moves)} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton onClick={start} strength={0.2}>
              <Shuffle className="size-4" /> {isPlaying ? 'Shuffle again' : 'Start new game'}
            </MagneticButton>
            <button
              type="button"
              onClick={resetGame}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-4 text-sm text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
            >
              <RotateCcw className="size-4" /> Reset
            </button>
          </div>

          <p className="text-sm text-zinc-500">
            Tap a tile next to the empty square to slide it. Put every tile back in place to win.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[min(100%,40rem)] [grid-area:board] md:self-center">
          <Board />
        </div>
      </div>

      <Dialog.Root open={isWon && !dismissed} onOpenChange={(open) => !open && setDismissed(true)}>
        <AnimatePresence>
          {isWon && !dismissed && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount>
                <motion.div
                  className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2.5rem)] max-w-sm rounded-3xl border border-line bg-ink-2 p-8 text-center shadow-2xl"
                  initial={{ opacity: 0, scale: 0.85, x: '-50%', y: '-40%' }}
                  animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                  exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-45%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.35 }}
                >
                  <Dialog.Close className="absolute top-4 right-4 rounded-full p-1.5 text-zinc-500 hover:text-white" aria-label="Close">
                    <X className="size-4" />
                  </Dialog.Close>
                  <Trophy className="mx-auto size-10 text-orchid" />
                  <Dialog.Title className="mt-4 text-3xl font-bold tracking-tight">Solved.</Dialog.Title>
                  <Dialog.Description className="mt-2 text-zinc-400">
                    {DIFFICULTY_LABELS[difficulty]} in {moves} moves and {formatTime(elapsed)}.
                  </Dialog.Description>
                  <MagneticButton onClick={start} className="mt-7" strength={0.15}>
                    <Shuffle className="size-4" /> Play again
                  </MagneticButton>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </section>
  );
}
