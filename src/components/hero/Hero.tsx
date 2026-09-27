'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useScrollTo } from '@/lib/scrollTo';
import { MagneticButton } from '@/components/sections/MagneticButton';

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="size-40 animate-pulse rounded-3xl bg-gradient-to-br from-iris/30 via-plum/20 to-orchid/30 blur-2xl" />
    </div>
  ),
});

const LINES = ['Snap it.', 'Slice it.', 'Slide it.'];

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [inView, setInView] = useState(true);
  const reduceMotion = useReducedMotion() ?? false;
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro
        .from('[data-line]', { yPercent: 110, duration: reduceMotion ? 0 : 1.3, stagger: 0.09 })
        .from('[data-fade]', { autoAlpha: 0, y: 24, duration: reduceMotion ? 0 : 1, stagger: 0.08 }, '-=0.9');

      ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
        onToggle: (self) => setInView(self.isActive),
      });

      gsap.to('[data-parallax]', {
        yPercent: -35,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: '70% top', scrub: true },
      });
    },
    { scope: section, dependencies: [reduceMotion] },
  );

  return (
    <section ref={section} className="grain relative flex min-h-svh items-end overflow-hidden md:items-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 right-[-20%] size-[80vmax] rounded-full bg-[radial-gradient(circle,rgba(118,75,162,0.35),transparent_60%)]"
      />

      <div className="absolute inset-x-0 top-[4%] h-[46%] md:inset-y-0 md:right-0 md:left-[38%] md:h-auto" aria-hidden>
        <HeroScene progress={progress} animate={!reduceMotion} active={inView} />
      </div>

      <div data-parallax className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-24 pb-16 md:px-10">
        <p data-fade className="mb-6 font-mono text-xs tracking-[0.3em] text-zinc-400 uppercase">
          SnapSlide / sliding puzzle
        </p>
        <h1 className="text-[clamp(3.2rem,11vw,9.5rem)] leading-[0.88] font-bold tracking-[-0.045em]">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span data-line className={`block ${i === LINES.length - 1 ? 'text-gradient' : ''}`}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p data-fade className="mt-8 max-w-md text-lg text-zinc-400 md:text-xl">
          Drop in any photo and it becomes a sliding tile puzzle, right in your browser. Nothing is uploaded.
        </p>
        <div data-fade className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton onClick={() => scrollTo('#play')}>
            <Play className="size-4" fill="currentColor" /> Play now
          </MagneticButton>
          <button
            type="button"
            onClick={() => scrollTo('#how')}
            className="group inline-flex items-center gap-2 rounded-full px-5 py-4 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            How it works
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
