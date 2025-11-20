import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ActivePiece, Board} from '../game/types';
import {BlockPiece} from './BlockPiece';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {canPlacePiece} from '../game/logic';

type Props = {
  pieces: ActivePiece[];
  board: Board;
  onDropPiece: (piece: ActivePiece, position: {x: number; y: number}) => void;
  onDragPiece?: (piece: ActivePiece, position: {x: number; y: number}) => void;
  onDragStart?: (piece: ActivePiece) => void;
};

export const NextPiecesPanel: React.FC<Props> = ({
  pieces,
  board,
  onDropPiece,
  onDragPiece,
  onDragStart,
}) => {
  const playable = pieces.reduce<Record<string, boolean>>((acc, piece) => {
    acc[piece.uid] = canPlaceAnywhere(board, piece);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {pieces.map(piece => (
        <View
          key={piece.uid}
          style={[styles.card, !playable[piece.uid] && styles.disabledCard]}>
          {!playable[piece.uid] && <Text style={styles.disabledText}>No space</Text>}
          <BlockPiece
            piece={piece}
            disabled={!playable[piece.uid]}
            onDragStart={onDragStart}
            onDrag={onDragPiece}
            onDrop={(p, position) => onDropPiece(p, position)}
          />
        </View>
      ))}
    </View>
  );
};

const canPlaceAnywhere = (board: Board, piece: ActivePiece) => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      if (canPlacePiece(board, piece, r, c)) {
        return true;
      }
    }
  }
  return false;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  card: {
    flex: 1,
    marginHorizontal: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  disabledCard: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.sm,
  },
});

