import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainMenuScreen} from '../screens/MainMenuScreen';
import {GameScreen} from '../screens/GameScreen';
import {HighScoresScreen} from '../screens/HighScoresScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {HowToPlayScreen} from '../screens/HowToPlayScreen';
import {colors} from '../theme/colors';

export type RootStackParamList = {
  MainMenu: undefined;
  Game: undefined;
  HighScores: undefined;
  Settings: undefined;
  HowToPlay: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="MainMenu"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="MainMenu" component={MainMenuScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="HighScores" component={HighScoresScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

