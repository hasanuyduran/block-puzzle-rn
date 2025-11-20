export type Cell = {
  filled: boolean;
  color: string | null;
};

export type Board = Cell[][];

export type PieceMatrix = number[][];

export interface PieceDefinition {
  id: string;
  matrix: PieceMatrix;
  color: string;
}

export interface ActivePiece extends PieceDefinition {
  uid: string;
}

export type Position = {
  row: number;
  col: number;
};

export type ClearedLines = {
  rows: number[];
  cols: number[];
};

export type ScorePayload = {
  cellsPlaced: number;
  clearedCount: number;
  combo: number;
};

