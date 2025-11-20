import {PIECE_COLORS} from './constants';
import {PieceDefinition} from './types';

export const PIECES: PieceDefinition[] = [
  {id: 'single', matrix: [[1]], color: PIECE_COLORS[0]},
  {id: 'line-2', matrix: [[1, 1]], color: PIECE_COLORS[1]},
  {id: 'line-3', matrix: [[1, 1, 1]], color: PIECE_COLORS[2]},
  {id: 'line-4', matrix: [[1, 1, 1, 1]], color: PIECE_COLORS[3]},
  {id: 'line-5', matrix: [[1, 1, 1, 1, 1]], color: PIECE_COLORS[4]},
  {
    id: 'square-2',
    matrix: [
      [1, 1],
      [1, 1],
    ],
    color: PIECE_COLORS[5],
  },
  {
    id: 'square-3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: PIECE_COLORS[0],
  },
  {
    id: 'l-shape',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: PIECE_COLORS[1],
  },
  {
    id: 'reverse-l',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: PIECE_COLORS[2],
  },
  {
    id: 't-shape',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: PIECE_COLORS[3],
  },
  {
    id: 'plus',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: PIECE_COLORS[4],
  },
  {
    id: 'zig',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: PIECE_COLORS[5],
  },
  {
    id: 'zag',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: PIECE_COLORS[0],
  },
];

export const pickRandomPiece = () => {
  const index = Math.floor(Math.random() * PIECES.length);
  return PIECES[index];
};

