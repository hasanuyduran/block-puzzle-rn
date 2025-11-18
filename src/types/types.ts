export interface Cell {
  filled: boolean;
  color?: string | null;
}

export type Grid = Cell[][]; // 10x10

export type PieceShape = number[][];

export interface Piece {
  id: string;
  shape: PieceShape;
  color: string;
}
