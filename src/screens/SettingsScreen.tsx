import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSettingsStore} from '../state/useSettingsStore';
import {useHighScoresStore} from '../state/useHighScoresStore';
import {ToggleSwitch} from '../components/ToggleSwitch';
import {PrimaryButton} from '../components/PrimaryButton';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {ModalView} from '../components/ModalView';

type Props = NativeStackScreenProps<any>;

export const SettingsScreen: React.FC<Props> = () => {
  const {
    soundEnabled,
    hapticsEnabled,
    theme,
    toggleSound,
    toggleHaptics,
    setTheme,
    resetSettings,
  } = useSettingsStore();
  const {resetScores} = useHighScoresStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    await resetSettings();
    await resetScores();
    setConfirmReset(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Sound Effects</Text>
        <ToggleSwitch value={soundEnabled} onToggle={toggleSound} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Haptics</Text>
        <ToggleSwitch value={hapticsEnabled} onToggle={toggleHaptics} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Theme</Text>
        <PrimaryButton
          label={theme === 'dark' ? 'Dark' : 'Light'}
          onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          variant="secondary"
          style={styles.themeButton}
        />
      </View>
      <PrimaryButton
        label="Reset Data"
        variant="danger"
        onPress={() => setConfirmReset(true)}
        style={styles.reset}
      />

      <ModalView
        visible={confirmReset}
        title="Reset Data"
        primaryAction={{label: 'Reset', onPress: handleReset}}
        secondaryAction={{label: 'Cancel', onPress: () => setConfirmReset(false)}}>
        <Text style={styles.modalText}>
          This will clear high scores and settings. This action cannot be undone.
        </Text>
      </ModalView>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceAlt,
  },
  label: {
    color: colors.text,
    fontSize: 18,
  },
  themeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  reset: {
    marginTop: spacing.xl,
  },
  modalText: {
    color: colors.text,
    textAlign: 'center',
  },
});

