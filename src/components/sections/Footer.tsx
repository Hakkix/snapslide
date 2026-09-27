export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 py-10 text-sm text-zinc-500 md:flex-row md:items-center md:px-10">
        <p>
          <span className="font-semibold text-zinc-300">SnapSlide</span> — any photo, one empty square.
        </p>
        <p className="font-mono text-xs">Next.js · React Three Fiber · GSAP · Lenis · Framer Motion</p>
      </div>
    </footer>
  );
}
