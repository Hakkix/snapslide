'use client';

import { useRef } from 'react';
import { Camera, Grid2x2, Move } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { DEFAULT_IMAGE } from '@/lib/puzzle';

const N = 4;
// Visual-only scramble for the demo: SCRAMBLED[tile] = slot, slot 14 is left empty.
const SCRAMBLED = [5, 0, 2, 3, 4, 10, 6, 7, 1, 8, 11, 15, 12, 9, 13];

const STEPS = [
  {
    icon: Camera,
    title: 'Snap',
    body: 'Drop any JPG, PNG or WebP. It is read straight from your device and never leaves the browser.',
  },
  {
    icon: Grid2x2,
    title: 'Slice',
    body: 'No image processing, no server. Every tile shows the same picture, offset with CSS background-position.',
  },
  {
    icon: Move,
    title: 'Slide',
    body: 'Scrambled by walking the empty square backwards through legal moves, so every puzzle is solvable.',
  },
];

export function SliceSection() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tiles = gsap.utils.toArray<HTMLElement>('[data-tile]');
      const spread = (i: number) => ({ col: (i % N) - (N - 1) / 2, row: Math.floor(i / N) - (N - 1) / 2 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // 01 Snap: the photo lands.
      tl.fromTo('[data-art]', { scale: 0.78, rotate: -6 }, { scale: 1, rotate: 0, duration: 1 })
        .to('[data-rail]', { scaleY: 1 / 3, duration: 1 }, '<')
        // 02 Slice: tiles separate.
        .addLabel('slice')
        .to('[data-step="0"]', { autoAlpha: 0, y: -30, duration: 0.4 }, 'slice')
        .fromTo('[data-step="1"]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 'slice+=0.3')
        .to(
          tiles,
          {
            xPercent: (i) => spread(i).col * 10,
            yPercent: (i) => spread(i).row * 10,
            scale: 0.94,
            borderRadius: 12,
            duration: 1,
            stagger: { each: 0.02, from: 'center', grid: [N, N] },
          },
          'slice',
        )
        .to('[data-rail]', { scaleY: 2 / 3, duration: 1 }, 'slice')
        // 03 Slide: one tile goes, the rest scramble.
        .addLabel('slide')
        .to('[data-step="1"]', { autoAlpha: 0, y: -30, duration: 0.4 }, 'slide')
        .fromTo('[data-step="2"]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 'slide+=0.3')
        .to(tiles[N * N - 1], { autoAlpha: 0, scale: 0.4, duration: 0.5 }, 'slide')
        .to(
          tiles.slice(0, N * N - 1),
          {
            xPercent: (i) => {
              const to = SCRAMBLED[i] % N;
              return (to - (i % N)) * 100 + (to - (N - 1) / 2) * 10;
            },
            yPercent: (i) => {
              const to = Math.floor(SCRAMBLED[i] / N);
              return (to - Math.floor(i / N)) * 100 + (to - (N - 1) / 2) * 10;
            },
            duration: 1.2,
            stagger: 0.03,
            ease: 'expo.inOut',
          },
          'slide+=0.2',
        )
        .to('[data-rail]', { scaleY: 1, duration: 1 }, 'slide');
    },
    { scope: section },
  );

  return (
    <section id="how" ref={section} className="relative flex h-svh items-center overflow-hidden border-t border-line">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 md:grid-cols-[1fr_1.1fr] md:gap-16 md:px-10">
        <div className="relative flex gap-6 md:gap-8">
          <div className="relative w-px self-stretch bg-line">
            <div data-rail className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-iris via-plum to-orchid" />
          </div>
          <div className="grid flex-1">
            <p className="mb-4 font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase">How it works</p>
            <div className="grid [grid-template-areas:'stack']">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <div
                  key={title}
                  data-step={i}
                  className={`[grid-area:stack] ${i === 0 ? '' : 'invisible opacity-0'}`}
                >
                  <div className="mb-5 flex items-center gap-3 font-mono text-sm text-zinc-500">
                    <span>0{i + 1}</span>
                    <Icon className="size-4 text-orchid" />
                  </div>
                  <h2 className="text-[clamp(3rem,9vw,7rem)] leading-none font-bold tracking-[-0.04em]">{title}</h2>
                  <p className="mt-5 max-w-sm text-base text-zinc-400 md:text-lg">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[min(78vw,46svh)] md:max-w-[min(34rem,70svh)]">
          <div data-art className="relative aspect-square will-change-transform">
            {Array.from({ length: N * N }, (_, i) => (
              <div
                key={i}
                data-tile
                className="absolute will-change-transform"
                style={{
                  left: `${(i % N) * (100 / N)}%`,
                  top: `${Math.floor(i / N) * (100 / N)}%`,
                  width: `${100 / N}%`,
                  height: `${100 / N}%`,
                  backgroundImage: `url(${DEFAULT_IMAGE})`,
                  backgroundSize: `${N * 100}%`,
                  backgroundPosition: `${((i % N) / (N - 1)) * 100}% ${(Math.floor(i / N) / (N - 1)) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
