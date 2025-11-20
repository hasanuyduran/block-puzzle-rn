import React, {useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PrimaryButton} from '../components/PrimaryButton';
import {Card} from '../components/Card';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import {useHighScoresStore} from '../state/useHighScoresStore';
import {formatScore} from '../utils/formatScore';

type Props = NativeStackScreenProps<any>;

export const MainMenuScreen: React.FC<Props> = ({navigation}) => {
  const {bestScore, loadScoresFromStorage, hydrated} = useHighScoresStore();

  useEffect(() => {
    if (!hydrated) {
      loadScoresFromStorage();
    }
  }, [hydrated, loadScoresFromStorage]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Block Puzzle</Text>
      <Card style={styles.card}>
        <PrimaryButton label="Play" onPress={() => navigation.navigate('Game')} />
        <PrimaryButton
          label="High Scores"
          onPress={() => navigation.navigate('HighScores')}
          style={styles.buttonSpacing}
          variant="secondary"
        />
        <PrimaryButton
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
          variant="secondary"
        />
        <PrimaryButton
          label="How to Play"
          onPress={() => navigation.navigate('HowToPlay')}
          variant="secondary"
          style={styles.buttonSpacing}
        />
      </Card>
      <Text style={styles.bestScoreLabel}>
        Best Score:{' '}
        <Text style={styles.bestScoreValue}>{formatScore(bestScore ?? 0)}</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.title + 10,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  card: {
    width: '100%',
  },
  buttonSpacing: {
    marginVertical: spacing.sm,
  },
  bestScoreLabel: {
    marginTop: spacing.lg,
    color: colors.textMuted,
    fontSize: typography.body,
  },
  bestScoreValue: {
    color: colors.accent,
    fontWeight: '700',
  },
});

