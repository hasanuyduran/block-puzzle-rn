import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

export const HowToPlayScreen = () => (
  <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.title}>How to Play</Text>
    <Section title="Basics">
      <Text style={styles.body}>• Drag blocks onto the 10x10 board.</Text>
      <Text style={styles.body}>• Pieces must fit entirely in empty spaces.</Text>
      <Text style={styles.body}>• You always have 3 pieces available.</Text>
    </Section>
    <Section title="Scoring">
      <Text style={styles.body}>• Earn 1 point per tile placed.</Text>
      <Text style={styles.body}>• Clear rows or columns for bonus points.</Text>
      <Text style={styles.body}>• Consecutive clears increase your combo multiplier.</Text>
    </Section>
    <Section title="Game Over">
      <Text style={styles.body}>
        • If none of the available pieces can fit anywhere on the board, the game ends.
      </Text>
      <Text style={styles.body}>• Aim for a high score and build streaks!</Text>
    </Section>
  </ScrollView>
);

const Section: React.FC<{title: string}> = ({title, children}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
});

