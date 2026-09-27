'use client';

import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Single scroll pipeline: Lenis is driven by the GSAP ticker, and every Lenis
 * scroll event updates ScrollTrigger, so pinned/scrubbed timelines and the
 * smoothed scroll position never disagree by a frame.
 */
function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return null;
}

/** Users who prefer reduced motion get native scrolling; ScrollTrigger still works. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }}>
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}
