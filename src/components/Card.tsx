import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

export const Card: React.FC<ViewProps> = ({style, children, ...rest}) => (
  <View style={[styles.card, style]} {...rest}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 5,
  },
});

