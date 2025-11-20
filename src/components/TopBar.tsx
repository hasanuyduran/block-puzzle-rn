import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {formatScore} from '../utils/formatScore';

type Props = {
  score: number;
  bestScore: number;
  onBack: () => void;
  onPause: () => void;
};

export const TopBar: React.FC<Props> = ({score, bestScore, onBack, onPause}) => (
  <View style={styles.container}>
    <Pressable onPress={onBack} style={styles.iconButton}>
      <Text style={styles.iconText}>←</Text>
    </Pressable>
    <View style={styles.center}>
      <Text style={styles.scoreLabel}>Score</Text>
      <Text style={styles.scoreValue}>{formatScore(score)}</Text>
    </View>
    <View style={styles.right}>
      <Text style={styles.bestLabel}>Best</Text>
      <Text style={styles.bestValue}>{formatScore(bestScore)}</Text>
      <Pressable onPress={onPause} style={[styles.iconButton, styles.pause]}>
        <Text style={styles.iconText}>II</Text>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  center: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  scoreValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  right: {
    alignItems: 'center',
  },
  bestLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  bestValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  pause: {
    marginTop: spacing.sm,
  },
});

