import {Grid, Piece} from '../types/types';

export const GRID_SIZE = 10;

export const createEmptyGrid = (): Grid =>
  Array.from({length: GRID_SIZE}, () =>
    Array.from(
      {length: GRID_SIZE},
      () => ({filled: false, color: null}) as const,
    ),
  );

export function canPlacePiece(
  grid: Grid,
  piece: Piece,
  baseRow: number,
  baseCol: number,
): boolean {
  const rows = piece.shape.length;
  const cols = piece.shape[0].length;

  // sınır
  if (baseRow + rows > GRID_SIZE || baseCol + cols > GRID_SIZE) {
    return false;
  }

  // çakışma
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (
        piece.shape[r][c] === 1 &&
        grid[baseRow + r][baseCol + c].filled
      ) {
        return false;
      }
    }
  }

  return true;
}

export function placePiece(
  grid: Grid,
  piece: Piece,
  baseRow: number,
  baseCol: number,
): Grid {
  const newGrid: Grid = grid.map(row => row.map(cell => ({...cell})));

  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[0].length; c++) {
      if (piece.shape[r][c] === 1) {
        newGrid[baseRow + r][baseCol + c] = {
          filled: true,
          color: piece.color,
        };
      }
    }
  }

  return newGrid;
}

// Parçadaki dolu hücre sayısı (skor için)
export function countFilledCells(piece: Piece): number {
  let count = 0;
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[0].length; c++) {
      if (piece.shape[r][c] === 1) {
        count++;
      }
    }
  }
  return count;
}

// Dolu satır ve sütunları temizle
export function clearFullLines(grid: Grid): {
  newGrid: Grid;
  clearedRows: number;
  clearedCols: number;
} {
  const size = GRID_SIZE;

  const rowFull: boolean[] = Array(size).fill(false);
  const colFull: boolean[] = Array(size).fill(false);

  // satırları kontrol et
  for (let r = 0; r < size; r++) {
    let full = true;
    for (let c = 0; c < size; c++) {
      if (!grid[r][c].filled) {
        full = false;
        break;
      }
    }
    rowFull[r] = full;
  }

  // sütunları kontrol et
  for (let c = 0; c < size; c++) {
    let full = true;
    for (let r = 0; r < size; r++) {
      if (!grid[r][c].filled) {
        full = false;
        break;
      }
    }
    colFull[c] = full;
  }

  const clearedRows = rowFull.filter(x => x).length;
  const clearedCols = colFull.filter(x => x).length;

  // hiç satır/sütun yoksa aynı grid'i döndürelim
  if (clearedRows === 0 && clearedCols === 0) {
    return {
      newGrid: grid,
      clearedRows: 0,
      clearedCols: 0,
    };
  }

  // yeni grid: dolu satır/sütunlar boşaltılır (aşağı kayma yok)
  const newGrid: Grid = grid.map((row, r) =>
    row.map((cell, c) =>
      rowFull[r] || colFull[c]
        ? {filled: false, color: null}
        : {...cell},
    ),
  );

  return {newGrid, clearedRows, clearedCols};
}
