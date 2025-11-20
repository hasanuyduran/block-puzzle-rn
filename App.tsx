import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {RootNavigator} from './src/navigation/RootNavigator';
import {useSettingsStore} from './src/state/useSettingsStore';
import {useHighScoresStore} from './src/state/useHighScoresStore';
import {colors} from './src/theme/colors';

const App = () => {
  const {
    hydrated: settingsHydrated,
    loadSettingsFromStorage,
  } = useSettingsStore();
  const {hydrated: scoresHydrated, loadScoresFromStorage} = useHighScoresStore();

  useEffect(() => {
    if (!settingsHydrated) {
      loadSettingsFromStorage();
    }
  }, [loadSettingsFromStorage, settingsHydrated]);

  useEffect(() => {
    if (!scoresHydrated) {
      loadScoresFromStorage();
    }
  }, [loadScoresFromStorage, scoresHydrated]);

  if (!settingsHydrated || !scoresHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
