import React from 'react';
import {Modal, StyleSheet, View, Text, Pressable} from 'react-native';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

type Props = {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  primaryAction?: {label: string; onPress: () => void};
  secondaryAction?: {label: string; onPress: () => void};
};

export const ModalView: React.FC<Props> = ({
  visible,
  title,
  children,
  onClose,
  primaryAction,
  secondaryAction,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.content}>{children}</View>
        <View style={styles.actions}>
          {secondaryAction && (
            <Pressable style={[styles.button, styles.secondary]} onPress={secondaryAction.onPress}>
              <Text style={styles.buttonLabel}>{secondaryAction.label}</Text>
            </Pressable>
          )}
          {primaryAction && (
            <Pressable style={styles.button} onPress={primaryAction.onPress}>
              <Text style={styles.buttonLabel}>{primaryAction.label}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  content: {
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginLeft: spacing.sm,
  },
  secondary: {
    backgroundColor: colors.surfaceAlt,
  },
  buttonLabel: {
    color: colors.text,
    fontWeight: '700',
  },
});

