import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {Grid, Piece} from './src/types/types';
import {createRandomHand} from './src/logic/pieces';
import {
  GRID_SIZE,
  createEmptyGrid,
  canPlacePiece,
  placePiece,
  countFilledCells,
  clearFullLines,
} from './src/logic/grid';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// Çerçeve & grid boyutları
const HORIZONTAL_MARGIN = 24;
const FRAME_SIZE = SCREEN_WIDTH - HORIZONTAL_MARGIN * 2;
const FRAME_BORDER = 4; // border inceliği

const GRID_PIXEL_SIZE = FRAME_SIZE - FRAME_BORDER * 2;
const CELL_SIZE = Math.floor(GRID_PIXEL_SIZE / GRID_SIZE);

const HIGH_SCORE_KEY = 'BLOCK_PUZZLE_HIGH_SCORE';

// Animated LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(
  LinearGradient as any,
);

function hasAnyValidMove(grid: Grid, pieces: Piece[]): boolean {
  for (const p of pieces) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (canPlacePiece(grid, p, r, c)) {
          return true;
        }
      }
    }
  }
  return false;
}

const App = () => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [pieces, setPieces] = useState<Piece[]>(() => createRandomHand());
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isInMainMenu, setIsInMainMenu] = useState(true);

  const selectedPiece = pieces.find(p => p.id === selectedPieceId) ?? null;

  // High score yükle
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(HIGH_SCORE_KEY);
        if (stored != null) {
          const v = Number(stored);
          if (!isNaN(v)) setHighScore(v);
        }
      } catch {}
    })();
  }, []);

  const saveHighScore = async (v: number) => {
    try {
      await AsyncStorage.setItem(HIGH_SCORE_KEY, String(v));
    } catch {}
  };

  const restartGame = () => {
    setGrid(createEmptyGrid());
    setPieces(createRandomHand());
    setSelectedPieceId(null);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsInMainMenu(false);
  };

  const goToMainMenu = () => {
    setGrid(createEmptyGrid());
    setPieces(createRandomHand());
    setSelectedPieceId(null);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsInMainMenu(true);
  };

  const placePieceWithScore = (piece: Piece, row: number, col: number) => {
    if (isPaused || isGameOver || isInMainMenu) return;
    if (!canPlacePiece(grid, piece, row, col)) return;

    let g = placePiece(grid, piece, row, col);

    const {newGrid, clearedRows, clearedCols} = clearFullLines(g);
    g = newGrid;

    const placedCells = countFilledCells(piece);
    const bonus = (clearedRows + clearedCols) * 100;
    const newScore = score + placedCells * 10 + bonus;

    let newPieces = pieces.filter(x => x.id !== piece.id);
    if (newPieces.length === 0) {
      newPieces = createRandomHand();
    }

    setGrid(g);
    setPieces(newPieces);
    setScore(newScore);
    setSelectedPieceId(null);

    if (newScore > highScore) {
      setHighScore(newScore);
      saveHighScore(newScore);
    }

    if (!hasAnyValidMove(g, newPieces)) {
      setIsGameOver(true);
    }
  };

  const handleCellPress = (r: number, c: number) => {
    if (!selectedPiece) return;
    placePieceWithScore(selectedPiece, r, c);
  };

  // === HAREKETLİ GRADIENT BORDER ===
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(gradientAnim, {
        toValue: 1,
        duration: 9000, // yavaş akış
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();
  }, [gradientAnim]);

  const animatedStartX = gradientAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });
  const animatedEndX = gradientAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 1],
  });

  const animatedStart = {x: animatedStartX as any, y: 0};
  const animatedEnd = {x: animatedEndX as any, y: 1};

  // ANA MENÜ
  if (isInMainMenu) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainMenuContainer}>
          <Text style={styles.mainMenuTitle}>Block Puzzle</Text>
          <Text style={styles.mainMenuHighScore}>High Score: {highScore}</Text>

          <TouchableOpacity style={styles.mainMenuButton} onPress={restartGame}>
            <View style={styles.mainMenuButtonInner}>
              <View style={[styles.iconCircle, styles.iconGreen]}>
                <Text style={styles.iconGlyph}>▶</Text>
              </View>
              <Text style={styles.mainMenuButtonText}>Play</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Block Puzzle</Text>

      {/* Score + High Score + Pause */}
      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.scoreText}>High Score: {highScore}</Text>

        {!isGameOver && (
          <TouchableOpacity onPress={() => setIsPaused(true)}>
            <View style={[styles.iconCircleSmall, styles.iconGreen]}>
              <Text style={styles.iconGlyphSmall}>II</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* HAREKETLİ GRADIENT BORDER + GRID */}
      <View style={styles.frameWrapper}>
        <AnimatedLinearGradient
          colors={['#22d3ee', '#a855f7', '#ec4899', '#22d3ee']}
          start={animatedStart}
          end={animatedEnd}
          style={styles.frameGradient}>
          <View style={styles.frameInner}>
            <View style={styles.grid}>
              {grid.map((row, r) => (
                <View key={r} style={styles.row}>
                  {row.map((cell, c) => (
                    <TouchableOpacity
                      key={c}
                      style={styles.cell}
                      onPress={() => handleCellPress(r, c)}
                      disabled={isPaused || isGameOver}>
                      {cell.filled && (
                        <View
                          style={[
                            styles.filledBlock,
                            {backgroundColor: cell.color ?? '#22d3ee'},
                          ]}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </AnimatedLinearGradient>
      </View>

      {/* PARÇALAR */}
      <View style={styles.pieceRow}>
        {pieces.map(piece => {
          const selected = piece.id === selectedPieceId;
          return (
            <TouchableOpacity
              key={piece.id}
              onPress={() =>
                setSelectedPieceId(prev => (prev === piece.id ? null : piece.id))
              }
              style={[styles.pieceContainer, selected && styles.selectedPiece]}>
              {piece.shape.map((r, rIdx) => (
                <View key={rIdx} style={{flexDirection: 'row'}}>
                  {r.map((v, cIdx) => (
                    <View
                      key={cIdx}
                      style={[
                        styles.previewCell,
                        v === 1 && {backgroundColor: piece.color},
                      ]}
                    />
                  ))}
                </View>
              ))}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* GAME OVER */}
      {isGameOver && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>Game Over</Text>
            <Text style={styles.overlayScore}>Score: {score}</Text>
            <Text style={styles.overlayHighScore}>High Score: {highScore}</Text>

            <TouchableOpacity style={styles.overlayButton} onPress={restartGame}>
              <View style={styles.overlayButtonInner}>
                <View style={[styles.iconCircle, styles.iconOrange]}>
                  <Text style={styles.iconGlyph}>↻</Text>
                </View>
                <Text style={styles.overlayButtonText}>Restart</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.overlayButton} onPress={goToMainMenu}>
              <View style={styles.overlayButtonInner}>
                <View style={[styles.iconCircle, styles.iconBlue]}>
                  <Text style={styles.iconGlyph}>⌂</Text>
                </View>
                <Text style={styles.overlayButtonText}>Home</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* PAUSE */}
      {isPaused && !isGameOver && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>Paused</Text>

            <TouchableOpacity
              style={styles.overlayButton}
              onPress={() => setIsPaused(false)}>
              <View style={styles.overlayButtonInner}>
                <View style={[styles.iconCircle, styles.iconGreen]}>
                  <Text style={styles.iconGlyph}>▶</Text>
                </View>
                <Text style={styles.overlayButtonText}>Continue</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.overlayButton} onPress={restartGame}>
              <View style={styles.overlayButtonInner}>
                <View style={[styles.iconCircle, styles.iconOrange]}>
                  <Text style={styles.iconGlyph}>↻</Text>
                </View>
                <Text style={styles.overlayButtonText}>Restart</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.overlayButton} onPress={goToMainMenu}>
              <View style={styles.overlayButtonInner}>
                <View style={[styles.iconCircle, styles.iconBlue]}>
                  <Text style={styles.iconGlyph}>⌂</Text>
                </View>
                <Text style={styles.overlayButtonText}>Home</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    paddingTop: 16,
  },

  title: {
    fontSize: 24,
    color: '#f9fafb',
  },

  scoreRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  scoreText: {
    color: '#e5e7eb',
    fontSize: 16,
  },

  // Hareketli gradient frame
  frameWrapper: {
    marginTop: 8,
    marginBottom: 20,
  },
  frameGradient: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: 20,
    padding: FRAME_BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 0},
    elevation: 8,
  },
  frameInner: {
    width: GRID_PIXEL_SIZE,
    height: GRID_PIXEL_SIZE,
    borderRadius: 16,
    backgroundColor: '#020617',
  },

  // Grid
  grid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#111827',
    padding: 2,
  },
  filledBlock: {
    flex: 1,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: {width: 0, height: 1},
    elevation: 2,
  },

  // Pieces
  pieceRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  pieceContainer: {
    marginHorizontal: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
  },
  selectedPiece: {
    borderColor: '#22c55e',
  },
  previewCell: {
    width: 14,
    height: 14,
    margin: 1,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },

  // Pause button (ikon)
  iconCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22c55e',
  },
  iconGlyphSmall: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },

  // Genel ikon stilleri
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  iconGlyph: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  iconGreen: {backgroundColor: '#22c55e'},
  iconOrange: {backgroundColor: '#f97316'},
  iconBlue: {backgroundColor: '#3b82f6'},

  // Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayCard: {
    width: '75%',
    padding: 22,
    backgroundColor: '#020617',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  overlayTitle: {
    color: '#f9fafb',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  overlayScore: {
    fontSize: 18,
    color: '#e5e7eb',
    textAlign: 'center',
  },
  overlayHighScore: {
    fontSize: 16,
    color: '#a5b4fc',
    textAlign: 'center',
    marginBottom: 20,
  },
  overlayButton: {
    width: '100%',
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
  },
  overlayButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayButtonText: {
    fontSize: 16,
    color: '#e5e7eb',
    fontWeight: '600',
  },

  // Main Menu
  mainMenuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainMenuTitle: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 16,
  },
  mainMenuHighScore: {
    fontSize: 18,
    color: '#a5b4fc',
    marginBottom: 25,
  },
  mainMenuButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mainMenuButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainMenuButtonText: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default App;
