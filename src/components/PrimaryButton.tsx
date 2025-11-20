import React from 'react';
import {Pressable, StyleSheet, Text, ViewStyle} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
};

export const PrimaryButton: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 10},
    elevation: 4,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surfaceAlt,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  pressed: {
    transform: [{scale: 0.98}],
  },
  label: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 18,
  },
});

