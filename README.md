SnapSlide 🧩 https://snapslide.vercel.app 

SnapSlide is a modern, web-based sliding tile puzzle game. Unlike traditional puzzles, SnapSlide allows users to upload their own images, which are instantly converted into interactive puzzles.
The landing page is a scroll-driven experience: a live 3D puzzle in the hero, a pinned scroll sequence that shows the image being sliced and scrambled, and the playable board with spring-animated tiles.
✨ Features
 * 📸 Custom Image Upload: Users can upload any JPG/PNG. The game processes the image client-side (no server upload required for privacy and speed).
 * 🧠 Guaranteed Solvability: Uses a "Reverse Walk" algorithm (scrambling by valid moves) rather than random placement, ensuring every generated puzzle can be solved.
 * 🎚️ Dynamic Difficulty: Selectable grid sizes:
   * Easy (3 \times 3)
   * Classic (4 \times 4)
   * Hard (5 \times 5)
   * Expert (6 \times 6)
 * ⏱️ Stat Tracking: Tracks time taken and total moves made.
 * 📱 Responsive: Fully playable on desktop and mobile devices.
🛠️ Tech Stack
 * Core Framework: Next.js (App Router) + React.
 * Styling: Tailwind CSS.
 * Motion: Lenis (smooth scroll) synced to GSAP ScrollTrigger; Framer Motion for tile springs, gestures and dialogs.
 * 3D: Three.js via React Three Fiber and drei (hero scene, loaded client-only with next/dynamic).
 * UI primitives: Radix UI (Dialog, ToggleGroup), lucide-react icons.
 * State Management: Nano Stores (shared game state, read in React via @nanostores/react).
🚀 Getting Started
Prerequisites
 * Node.js v20.9 or higher.
 * npm, pnpm, or yarn.
Installation
 * Clone the repository
   git clone https://github.com/your-username/snapslide.git
cd snapslide

 * Install dependencies
   npm install

 * Start the development server
   npm run dev

   The game will be available at http://localhost:3000.
📂 Project Structure
/
├── public/
│   └── art/snapslide.svg     # Default puzzle artwork
├── src/
│   ├── app/                  # layout.tsx, page.tsx, globals.css
│   ├── components/
│   │   ├── providers/        # SmoothScroll (Lenis <-> GSAP ticker sync)
│   │   ├── hero/             # Hero + R3F HeroScene (client-only)
│   │   ├── sections/         # Pinned slice sequence, difficulty cards, footer
│   │   └── game/             # Game controls, Board, ImageDrop
│   ├── lib/                  # Scramble algorithm, GSAP registration, scroll helper
│   └── stores/gameStore.ts   # Nano Store for global state (time, moves, isPlaying)
└── next.config.ts

🧠 How It Works
1. The Slicing Mechanic
We do not physically slice the image file, as that would require heavy server-side processing (e.g., using Sharp). Instead, we use CSS visual trickery:
 * The image is set as the background-image for all tile <div>s.
 * We calculate the background-position for each tile based on its solved coordinate.
 * This makes the game instant and lightweight.
2. The Scramble Algorithm
To ensure the puzzle is solvable, we do not place tiles randomly.
 * Start with the solved state.
 * Perform a Random Walk: Programmatically "slide" the empty tile X number of times.
 * Optimization: The algorithm is coded to never immediately reverse its last move (preventing A \to B \to A).
🔮 Future Roadmap
 * [ ] Cropping Tool: Allow users to crop rectangular images into squares before playing.
 * [ ] Leaderboard: Use a lightweight DB (SQLite/Turso) to save best times for specific grid sizes.
 * [ ] Share Challenge: Generate a URL containing the seed to challenge friends to solve the exact same shuffle.
🤝 Contributing
Contributions are welcome!
 * Fork the Project
 * Create your Feature Branch (git checkout -b feature/AmazingFeature)
 * Commit your Changes (git commit -m 'Add some AmazingFeature')
 * Push to the Branch (git push origin feature/AmazingFeature)
 * Open a Pull Request
📄 License
Distributed under the MIT License. See LICENSE for more information.
