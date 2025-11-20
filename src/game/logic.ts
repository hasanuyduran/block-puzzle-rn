import {BOARD_SIZE, HAND_SIZE, BASE_LINE_POINTS} from './constants';
import {PIECES} from './pieces';
import {
  ActivePiece,
  Board,
  ClearedLines,
  PieceDefinition,
  Position,
  ScorePayload,
} from './types';

const randomId = () => Math.random().toString(36).slice(2, 9);

export const createEmptyBoard = (size: number = BOARD_SIZE): Board =>
  Array.from({length: size}, () =>
    Array.from({length: size}, () => ({filled: false, color: null})),
  );

const cloneBoard = (board: Board): Board => board.map(row => row.map(cell => ({...cell})));

export const createHand = (): ActivePiece[] =>
  Array.from({length: HAND_SIZE}, () => {
    const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {...piece, uid: `${piece.id}-${randomId()}`};
  });

export const canPlacePiece = (board: Board, piece: PieceDefinition, row: number, col: number) => {
  const {matrix} = piece;
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (!matrix[r][c]) continue;
      const targetRow = row + r;
      const targetCol = col + c;
      if (
        targetRow < 0 ||
        targetCol < 0 ||
        targetRow >= board.length ||
        targetCol >= board[0].length
      ) {
        return false;
      }
      if (board[targetRow][targetCol].filled) {
        return false;
      }
    }
  }
  return true;
};

export const placePiece = (board: Board, piece: PieceDefinition, row: number, col: number) => {
  const next = cloneBoard(board);
  piece.matrix.forEach((matrixRow, rIdx) => {
    matrixRow.forEach((value, cIdx) => {
      if (!value) {
        return;
        // continue
      }
      const targetRow = row + rIdx;
      const targetCol = col + cIdx;
      next[targetRow][targetCol] = {filled: true, color: piece.color};
    });
  });
  return next;
};

export const getClearedLines = (board: Board): ClearedLines => {
  const rows: number[] = [];
  const cols: number[] = [];

  for (let r = 0; r < board.length; r++) {
    if (board[r].every(cell => cell.filled)) {
      rows.push(r);
    }
  }

  for (let c = 0; c < board[0].length; c++) {
    let full = true;
    for (let r = 0; r < board.length; r++) {
      if (!board[r][c].filled) {
        full = false;
        break;
      }
    }
    if (full) {
      cols.push(c);
    }
  }

  return {rows, cols};
};

export const clearLines = (board: Board, cleared: ClearedLines) => {
  if (!cleared.rows.length && !cleared.cols.length) {
    return board;
  }
  const next = cloneBoard(board);
  cleared.rows.forEach(row => {
    for (let c = 0; c < next[row].length; c++) {
      next[row][c] = {filled: false, color: null};
    }
  });
  cleared.cols.forEach(col => {
    for (let r = 0; r < next.length; r++) {
      next[r][col] = {filled: false, color: null};
    }
  });
  return next;
};

const comboMultiplier = (combo: number) => 1 + Math.min(combo, 5) * 0.1;

const lineClearBonus = (count: number) => {
  if (count <= 0) {
    return 0;
  }
  if (count < BASE_LINE_POINTS.length) {
    return BASE_LINE_POINTS[count];
  }
  return BASE_LINE_POINTS[BASE_LINE_POINTS.length - 1] + (count - 3) * 30;
};

export const calculateScoreForMove = ({
  cellsPlaced,
  clearedCount,
  combo,
}: ScorePayload) => {
  const placementPoints = cellsPlaced;
  const linePoints = lineClearBonus(clearedCount);
  const total = Math.round((placementPoints + linePoints) * comboMultiplier(combo));
  const newCombo = clearedCount > 0 ? combo + 1 : 0;
  return {scoreGained: total, newCombo};
};

export const hasAnyValidMove = (board: Board, pieces: PieceDefinition[]) => {
  for (const piece of pieces) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (canPlacePiece(board, piece, row, col)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const countFilledCells = (piece: PieceDefinition) =>
  piece.matrix.reduce(
    (acc, row) => acc + row.reduce((rowSum, value) => rowSum + (value ? 1 : 0), 0),
    0,
  );

export const findDropPosition = (
  board: Board,
  piece: PieceDefinition,
  position: Position,
) => (canPlacePiece(board, piece, position.row, position.col) ? position : null);

