import { atom, computed } from 'nanostores';

// Game difficulty settings
export type Difficulty = 3 | 4 | 5 | 6;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  3: 'Easy (3×3)',
  4: 'Classic (4×4)',
  5: 'Hard (5×5)',
  6: 'Expert (6×6)',
};

// Core game state
export const $difficulty = atom<Difficulty>(4);
export const $imageUrl = atom<string | null>(null);
export const $isPlaying = atom<boolean>(false);
export const $isWon = atom<boolean>(false);
export const $moves = atom<number>(0);
export const $elapsedTime = atom<number>(0);

// Tile positions: array index = tile number, value = current position
// Position 0-15 for a 4x4 grid, etc.
// The "empty" tile is represented by null in the visual array
export const $tiles = atom<number[]>([]);
export const $emptyPosition = atom<number>(0);

// Computed: total tiles for current difficulty
export const $totalTiles = computed($difficulty, (d) => d * d);

// Actions
export function setDifficulty(d: Difficulty) {
  if (!$isPlaying.get()) {
    $difficulty.set(d);
  }
}

export function setImageUrl(url: string | null) {
  $imageUrl.set(url);
}

export function startGame(tiles: number[], emptyPos: number) {
  $tiles.set(tiles);
  $emptyPosition.set(emptyPos);
  $moves.set(0);
  $elapsedTime.set(0);
  $isWon.set(false);
  $isPlaying.set(true);
}

export function moveTile(tilePosition: number) {
  if (!$isPlaying.get() || $isWon.get()) return false;

  const emptyPos = $emptyPosition.get();
  const difficulty = $difficulty.get();

  // Check if the tile can move (is adjacent to empty space)
  if (!isAdjacent(tilePosition, emptyPos, difficulty)) return false;

  // Swap tiles
  const tiles = [...$tiles.get()];
  const tileIndex = tiles.findIndex((_, idx) => {
    // Find which tile is at tilePosition
    return tiles[idx] !== -1 && getTilePosition(tiles, idx) === tilePosition;
  });

  // Actually perform the swap
  const currentTiles = [...$tiles.get()];
  // Find which tile value is at tilePosition
  let tileValue = -1;
  for (let i = 0; i < currentTiles.length; i++) {
    if (currentTiles[i] === tilePosition) {
      tileValue = i;
      break;
    }
  }

  if (tileValue === -1) return false;

  // Move the tile to the empty position
  currentTiles[tileValue] = emptyPos;
  $tiles.set(currentTiles);
  $emptyPosition.set(tilePosition);
  $moves.set($moves.get() + 1);

  // Check for win
  checkWin();

  return true;
}

function getTilePosition(tiles: number[], index: number): number {
  return tiles[index];
}

function isAdjacent(pos1: number, pos2: number, gridSize: number): boolean {
  const row1 = Math.floor(pos1 / gridSize);
  const col1 = pos1 % gridSize;
  const row2 = Math.floor(pos2 / gridSize);
  const col2 = pos2 % gridSize;

  // Must be exactly 1 step away horizontally or vertically (not diagonally)
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function checkWin() {
  const tiles = $tiles.get();
  const difficulty = $difficulty.get();
  const totalTiles = difficulty * difficulty;

  // Check if all tiles are in their correct positions
  // Tile i should be at position i (except the last tile which is empty)
  for (let i = 0; i < totalTiles - 1; i++) {
    if (tiles[i] !== i) return;
  }

  // All tiles in place - player wins!
  $isWon.set(true);
  $isPlaying.set(false);
}

export function incrementTime() {
  if ($isPlaying.get() && !$isWon.get()) {
    $elapsedTime.set($elapsedTime.get() + 1);
  }
}

export function resetGame() {
  $isPlaying.set(false);
  $isWon.set(false);
  $moves.set(0);
  $elapsedTime.set(0);
  $tiles.set([]);
  $emptyPosition.set(0);
}

// Get adjacent positions for scrambling
export function getAdjacentPositions(pos: number, gridSize: number): number[] {
  const row = Math.floor(pos / gridSize);
  const col = pos % gridSize;
  const adjacent: number[] = [];

  if (row > 0) adjacent.push(pos - gridSize); // Up
  if (row < gridSize - 1) adjacent.push(pos + gridSize); // Down
  if (col > 0) adjacent.push(pos - 1); // Left
  if (col < gridSize - 1) adjacent.push(pos + 1); // Right

  return adjacent;
}
