/**
 * @format
 */

jest.mock('react-native-gesture-handler', () => ({}));
jest.mock('../src/navigation/RootNavigator', () => ({
  RootNavigator: () => null,
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
