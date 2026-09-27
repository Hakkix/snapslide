import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import './globals.css';

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: 'SnapSlide — Turn any photo into a sliding puzzle',
  description: 'SnapSlide - A modern sliding tile puzzle game. Upload an image, slide the tiles, solve the puzzle.',
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = { themeColor: '#07070b' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-ink font-sans text-zinc-100 antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
