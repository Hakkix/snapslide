import { getAdjacentPositions } from '@/stores/gameStore';

export const DEFAULT_IMAGE = '/art/snapslide.svg';

// Scramble algorithm using "Reverse Walk" - guaranteed solvable.
// tiles[i] = current position of tile i; the empty slot starts bottom-right.
export function scramblePuzzle(gridSize: number, moves = 100): { tiles: number[]; emptyPos: number } {
  const totalTiles = gridSize * gridSize;
  const tiles = Array.from({ length: totalTiles }, (_, i) => i);

  let emptyPos = totalTiles - 1;
  let lastPos = -1; // Track last position to avoid immediate reversal (A -> B -> A)

  for (let i = 0; i < moves; i++) {
    const validMoves = getAdjacentPositions(emptyPos, gridSize).filter((pos) => pos !== lastPos);
    const newEmptyPos = validMoves[Math.floor(Math.random() * validMoves.length)];

    const tileAtNewPos = tiles.findIndex((pos) => pos === newEmptyPos);
    if (tileAtNewPos !== -1) tiles[tileAtNewPos] = emptyPos;

    lastPos = emptyPos;
    emptyPos = newEmptyPos;
  }

  return { tiles, emptyPos };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
