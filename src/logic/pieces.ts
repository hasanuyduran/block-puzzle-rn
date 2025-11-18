import {Piece, PieceShape} from '../types/types';

const BASE_SHAPES: PieceShape[] = [
  // tek blok
  [[1]],
  // yatay 2, 3, 4
  [[1, 1]],
  [[1, 1, 1]],
  [[1, 1, 1, 1]],
  // dikey 3
  [[1], [1], [1]],
  // 2x2 kare
  [
    [1, 1],
    [1, 1],
  ],
  // L küçük
  [
    [1, 0],
    [1, 1],
  ],
  // L büyük
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  // T
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  // artı
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
];

const COLORS = [
  '#22c55e',
  '#3b82f6',
  '#f97316',
  '#eab308',
  '#6366f1',
  '#ec4899',
  '#14b8a6',
];

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function randomColor(): string {
  return COLORS[randomInt(COLORS.length)];
}

let pieceCounter = 0;

export function createRandomPiece(): Piece {
  const shape = BASE_SHAPES[randomInt(BASE_SHAPES.length)];
  const color = randomColor();
  const id = `piece-${pieceCounter++}`;
  return {id, shape, color};
}

export function createRandomHand(count: number = 3): Piece[] {
  const hand: Piece[] = [];
  for (let i = 0; i < count; i++) {
    hand.push(createRandomPiece());
  }
  return hand;
}
