import React, {useMemo, forwardRef} from 'react';
import {Dimensions, StyleSheet, View, LayoutChangeEvent} from 'react-native';
import {Board, Position} from '../game/types';
import {BOARD_SIZE} from '../game/constants';
import {colors} from '../theme/colors';

const {width} = Dimensions.get('window');
const GRID_MARGIN = 32;

type Props = {
  board: Board;
  highlights?: Position[];
  onLayout?: (event: LayoutChangeEvent) => void;
};

export const GameBoard = forwardRef<View, Props>(({board, highlights = [], onLayout}, ref) => {
  const cellSize = useMemo(
    () => Math.floor((width - GRID_MARGIN * 2) / BOARD_SIZE),
    [],
  );

  const highlightSet = useMemo(
    () => new Set(highlights.map(pos => `${pos.row}-${pos.col}`)),
    [highlights],
  );

  return (
    <View
      ref={ref}
      onLayout={onLayout}
      style={[styles.board, {width: cellSize * BOARD_SIZE, height: cellSize * BOARD_SIZE}]}>
      {board.map((row, rowIdx) => (
        <View key={`row-${rowIdx}`} style={styles.row}>
          {row.map((cell, colIdx) => {
            const key = `${rowIdx}-${colIdx}`;
            const highlighted = highlightSet.has(key);
            return (
              <View
                key={key}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: cell.filled
                      ? cell.color ?? colors.accentSecondary
                      : colors.emptyCell,
                  },
                  highlighted && styles.highlight,
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  board: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.gridLine,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: colors.gridLine,
  },
  highlight: {
    opacity: 0.7,
    borderColor: colors.success,
    borderWidth: 2,
  },
});

