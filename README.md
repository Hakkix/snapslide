SnapSlide 🧩 https://snapslide.vercel.app 

SnapSlide is a modern, web-based sliding tile puzzle game. Unlike traditional puzzles, SnapSlide allows users to upload their own images, which are instantly converted into interactive puzzles.
The game is built with performance in mind, utilizing Astro's island architecture for zero-JS static content and Tailwind CSS for rapid, responsive grid styling.
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
 * Core Framework: Astro (Static Site Generation with partial hydration).
 * Styling: Tailwind CSS (Grid layouts and utility classes).
 * Runtime: Node.js.
 * State Management: Nano Stores (For sharing timer/move state between UI islands).
 * Logic: Vanilla TypeScript/JavaScript (Interactive islands).
🚀 Getting Started
Prerequisites
 * Node.js v18.14.1 or higher.
 * npm, pnpm, or yarn.
Installation
 * Clone the repository
   git clone https://github.com/your-username/snapslide.git
cd snapslide

 * Install dependencies
   npm install

 * Start the development server
   npm run dev

   The game will be available at http://localhost:4321.
📂 Project Structure
/
├── public/              # Static assets (favicons, default puzzle images)
├── src/
│   ├── components/
│   │   ├── Board.jsx    # The main game logic (React/Preact/Svelte Island)
│   │   ├── Upload.astro # File input component
│   │   ├── Timer.jsx    # Timer display (Subscribes to game state)
│   │   └── UI/          # Buttons, Modals (Tailwind components)
│   ├── layouts/
│   │   └── Layout.astro # Main HTML wrapper
│   ├── pages/
│   │   └── index.astro  # The Game Entry Point
│   └── stores/
│       └── gameStore.js # Nano Store for global state (time, moves, isPlaying)
└── astro.config.mjs     # Configuration

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
