'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

type Props = React.ComponentProps<typeof motion.button> & { strength?: number };

/** Primary CTA that leans toward the pointer on a spring. */
export function MagneticButton({ children, className = '', strength = 0.3, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.4 });

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={`inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-ink shadow-[0_0_40px_-8px_rgba(240,147,251,0.6)] transition-shadow hover:shadow-[0_0_60px_-6px_rgba(240,147,251,0.85)] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
