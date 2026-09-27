'use client';

import { useLenis } from 'lenis/react';
import { useCallback } from 'react';

/** Scroll to a selector through Lenis when it is running, natively otherwise. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (target: string) => {
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.4, offset: -16 });
      } else {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [lenis],
  );
}
