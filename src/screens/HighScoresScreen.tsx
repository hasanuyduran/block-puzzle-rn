import React, {useEffect} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useHighScoresStore} from '../state/useHighScoresStore';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {Card} from '../components/Card';
import {formatScore} from '../utils/formatScore';

type Props = NativeStackScreenProps<any>;

export const HighScoresScreen: React.FC<Props> = () => {
  const {recentScores, bestScore, hydrated, loadScoresFromStorage} = useHighScoresStore();

  useEffect(() => {
    if (!hydrated) {
      loadScoresFromStorage();
    }
  }, [hydrated, loadScoresFromStorage]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>
      <Card style={styles.card}>
        <Text style={styles.bestLabel}>Best Score</Text>
        <Text style={styles.bestValue}>{formatScore(bestScore)}</Text>
      </Card>
      {recentScores.length === 0 ? (
        <Text style={styles.empty}>No games played yet. Start a game!</Text>
      ) : (
        <FlatList
          data={recentScores}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          renderItem={({item, index}) => (
            <View style={styles.row}>
              <Text style={styles.index}>{index + 1}.</Text>
              <Text style={styles.score}>{formatScore(item.score)}</Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}{' '}
                {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  bestLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  bestValue: {
    color: colors.accent,
    fontSize: 40,
    fontWeight: '900',
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceAlt,
  },
  index: {
    width: 32,
    color: colors.textMuted,
  },
  score: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
  },
});

