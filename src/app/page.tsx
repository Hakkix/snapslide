import { Hero } from '@/components/hero/Hero';
import { SliceSection } from '@/components/sections/SliceSection';
import { DifficultySection } from '@/components/sections/DifficultySection';
import { Game } from '@/components/game/Game';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <SliceSection />
      <DifficultySection />
      <Game />
      <Footer />
    </main>
  );
}
