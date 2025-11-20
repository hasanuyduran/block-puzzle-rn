import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TopBar} from '../components/TopBar';
import {GameBoard} from '../components/GameBoard';
import {NextPiecesPanel} from '../components/NextPiecesPanel';
import {
  ActivePiece,
  Board,
  Position,
} from '../game/types';
import {
  calculateScoreForMove,
  canPlacePiece,
  clearLines,
  createEmptyBoard,
  createHand,
  getClearedLines,
  placePiece,
  countFilledCells,
  hasAnyValidMove,
} from '../game/logic';
import {BOARD_SIZE} from '../game/constants';
import {useHighScoresStore} from '../state/useHighScoresStore';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {ModalView} from '../components/ModalView';

type Props = NativeStackScreenProps<any>;

const {width} = Dimensions.get('window');
const GRID_MARGIN = 32;

export const GameScreen: React.FC<Props> = ({navigation}) => {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [hand, setHand] = useState<ActivePiece[]>(() => createHand());
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pause, setPause] = useState(false);
  const [highlightCells, setHighlightCells] = useState<Position[]>([]);
  const [gridLayout, setGridLayout] = useState<{x: number; y: number; size: number} | null>(null);
  const boardRef = useRef<View | null>(null);

  const {bestScore, addScore} = useHighScoresStore();

  const cellSize = useMemo(
    () => Math.floor((width - GRID_MARGIN * 2) / BOARD_SIZE),
    [],
  );

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setHand(createHand());
    setScore(0);
    setCombo(0);
    setGameOver(false);
    setPause(false);
    setHighlightCells([]);
  }, []);

  const processPlacement = useCallback(
    (piece: ActivePiece, row: number, col: number) => {
      if (!canPlacePiece(board, piece, row, col)) {
        return false;
      }
      const placedBoard = placePiece(board, piece, row, col);
      const cleared = getClearedLines(placedBoard);
      const clearedCount = cleared.rows.length + cleared.cols.length;
      const cleanedBoard = clearLines(placedBoard, cleared);
      const cellsPlaced = countFilledCells(piece);
      const {scoreGained, newCombo} = calculateScoreForMove({
        cellsPlaced,
        clearedCount,
        combo,
      });

      const nextHand = hand.filter(p => p.uid !== piece.uid);
      const refreshedHand = nextHand.length === 0 ? createHand() : nextHand;

      setBoard(cleanedBoard);
      setHand(refreshedHand);
      setScore(prev => prev + scoreGained);
      setCombo(newCombo);
      setHighlightCells([]);

      const stillPlayable = hasAnyValidMove(cleanedBoard, refreshedHand);
      if (!stillPlayable) {
        setGameOver(true);
        addScore(score + scoreGained);
      }
      return true;
    },
    [addScore, board, combo, hand, score],
  );

  const deriveDropCoordinates = useCallback(
    (absolute: {x: number; y: number}) => {
      if (!gridLayout) {
        return null;
      }
      const relX = absolute.x - gridLayout.x;
      const relY = absolute.y - gridLayout.y;
      const dynamicSize = gridLayout.size / BOARD_SIZE;
      const row = Math.floor(relY / dynamicSize);
      const col = Math.floor(relX / dynamicSize);
      if (row < 0 || col < 0 || row >= BOARD_SIZE || col >= BOARD_SIZE) {
        return null;
      }
      return {row, col};
    },
    [gridLayout],
  );

  const handleDrag = useCallback(
    (piece: ActivePiece, absolute: {x: number; y: number}) => {
      const coords = deriveDropCoordinates(absolute);
      if (!coords) {
        setHighlightCells([]);
        return;
      }
      if (!canPlacePiece(board, piece, coords.row, coords.col)) {
        setHighlightCells([]);
        return;
      }
      const highlights: Position[] = [];
      piece.matrix.forEach((row, rIdx) =>
        row.forEach((cell, cIdx) => {
          if (cell) {
            highlights.push({row: coords.row + rIdx, col: coords.col + cIdx});
          }
        }),
      );
      setHighlightCells(highlights);
    },
    [board, deriveDropCoordinates],
  );

  const handleDrop = useCallback(
    (piece: ActivePiece, absolute: {x: number; y: number}) => {
      const coords = deriveDropCoordinates(absolute);
      if (!coords) {
        setHighlightCells([]);
        return;
      }
      processPlacement(piece, coords.row, coords.col);
    },
    [deriveDropCoordinates, processPlacement],
  );

  useEffect(() => {
    setHighlightCells([]);
  }, [pause]);

  return (
    <View style={styles.container}>
      <TopBar
        score={score}
        bestScore={bestScore}
        onBack={() => navigation.goBack()}
        onPause={() => setPause(true)}
      />
      <View style={styles.boardWrapper}>
        <GameBoard
          ref={boardRef}
          board={board}
          highlights={highlightCells}
          onLayout={() => {
            boardRef.current?.measureInWindow((x, y, width, height) => {
              setGridLayout({x, y, size: Math.min(width, height)});
            });
          }}
        />
      </View>
      <NextPiecesPanel
        pieces={hand}
        board={board}
        onDragPiece={handleDrag}
        onDropPiece={handleDrop}
        onDragStart={() => setPause(false)}
      />

      <ModalView
        visible={pause}
        title="Paused"
        onClose={() => setPause(false)}
        primaryAction={{label: 'Resume', onPress: () => setPause(false)}}
        secondaryAction={{label: 'Quit', onPress: () => navigation.goBack()}}>
        <Text style={styles.modalText}>Take a breath and continue when ready.</Text>
      </ModalView>

      <ModalView
        visible={gameOver}
        title="Game Over"
        primaryAction={{label: 'Play Again', onPress: resetGame}}
        secondaryAction={{label: 'Menu', onPress: () => navigation.goBack()}}>
        <Text style={styles.modalText}>Final Score: {score.toLocaleString()}</Text>
        {score > bestScore && <Text style={styles.newHighScore}>New High Score!</Text>}
      </ModalView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: spacing.xl,
  },
  boardWrapper: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  modalText: {
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
  },
  newHighScore: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.success,
    fontWeight: '800',
  },
});

