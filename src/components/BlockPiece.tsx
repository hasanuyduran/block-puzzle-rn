import React, {useMemo, useRef, useState} from 'react';
import {Animated, PanResponder, StyleSheet, View} from 'react-native';
import {ActivePiece} from '../game/types';
import {spacing} from '../theme/spacing';

type Props = {
  piece: ActivePiece;
  cellSize?: number;
  onDragStart?: (piece: ActivePiece) => void;
  onDrag?: (piece: ActivePiece, absolute: {x: number; y: number}) => void;
  onDrop?: (piece: ActivePiece, absolute: {x: number; y: number}) => void;
  disabled?: boolean;
};

export const BlockPiece: React.FC<Props> = ({
  piece,
  cellSize = 26,
  onDragStart,
  onDrag,
  onDrop,
  disabled = false,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: () => {
          setDragging(true);
          onDragStart?.(piece);
        },
        onPanResponderMove: (_, gesture) => {
          pan.setValue({x: gesture.dx, y: gesture.dy});
          onDrag?.(piece, {x: gesture.moveX, y: gesture.moveY});
        },
        onPanResponderRelease: (_, gesture) => {
          setDragging(false);
          pan.flattenOffset();
          pan.setValue({x: 0, y: 0});
          onDrop?.(piece, {x: gesture.moveX, y: gesture.moveY});
        },
        onPanResponderTerminate: () => {
          setDragging(false);
          pan.setValue({x: 0, y: 0});
        },
      }),
    [disabled, onDragStart, onDrag, onDrop, pan, piece],
  );

  return (
    <Animated.View
      style={[
        styles.wrapper,
        dragging && styles.dragging,
        {
          transform: [
            ...pan.getTranslateTransform(),
            dragging ? {scale: 1.05} : {scale: 1},
          ],
        },
      ]}
      pointerEvents="box-none"
      {...responder.panHandlers}>
      {piece.matrix.map((row, rIdx) => (
        <View key={`row-${piece.uid}-${rIdx}`} style={styles.row}>
          {row.map((cell, cIdx) => (
            <View
              key={`cell-${piece.uid}-${rIdx}-${cIdx}`}
              style={[
                styles.cell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: cell ? piece.color : 'transparent',
                },
              ]}
            />
          ))}
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    margin: 2,
    borderRadius: 6,
  },
  dragging: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 8},
    elevation: 6,
  },
});

