import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = {
  value: boolean;
  onToggle: () => void;
};

export const ToggleSwitch: React.FC<Props> = ({value, onToggle}) => (
  <Pressable
    onPress={onToggle}
    style={[styles.track, value ? styles.trackOn : styles.trackOff]}>
    <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
  </Pressable>
);

const styles = StyleSheet.create({
  track: {
    width: 54,
    height: 30,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  trackOn: {
    backgroundColor: colors.accent,
  },
  trackOff: {
    backgroundColor: colors.surfaceAlt,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  thumbOff: {
    alignSelf: 'flex-start',
  },
});

