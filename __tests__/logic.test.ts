import {
  calculateScoreForMove,
  canPlacePiece,
  clearLines,
  createEmptyBoard,
  getClearedLines,
  hasAnyValidMove,
  placePiece,
} from '../src/game/logic';
import {PieceDefinition} from '../src/game/types';

const single: PieceDefinition = {id: 'single', matrix: [[1]], color: '#fff'};
const line: PieceDefinition = {id: 'line', matrix: [[1, 1, 1]], color: '#fff'};

describe('game logic', () => {
  it('validates basic placement', () => {
    const board = createEmptyBoard();
    expect(canPlacePiece(board, single, 0, 0)).toBe(true);
    expect(canPlacePiece(board, single, 9, 9)).toBe(true);
    expect(canPlacePiece(board, single, 10, 10)).toBe(false);
  });

  it('clears full lines', () => {
    let board = createEmptyBoard();
    for (let col = 0; col < 10; col++) {
      board = placePiece(board, single, 0, col);
    }
    const cleared = getClearedLines(board);
    expect(cleared.rows).toContain(0);
    const cleaned = clearLines(board, cleared);
    expect(cleaned[0].every(cell => !cell.filled)).toBe(true);
  });

  it('awards combo points', () => {
    const first = calculateScoreForMove({cellsPlaced: 3, clearedCount: 1, combo: 0});
    expect(first.scoreGained).toBeGreaterThan(10);
    expect(first.newCombo).toBe(1);
    const second = calculateScoreForMove({
      cellsPlaced: 3,
      clearedCount: 0,
      combo: first.newCombo,
    });
    expect(second.newCombo).toBe(0);
  });

  it('detects when moves remain', () => {
    const board = createEmptyBoard();
    expect(hasAnyValidMove(board, [line])).toBe(true);
  });
});

