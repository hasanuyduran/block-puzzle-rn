import {create} from 'zustand';
import {getObject, setObject, removeItem} from '../utils/storage';

const STORAGE_KEY = 'HIGH_SCORES';
const RECENT_LIMIT = 10;

export type ScoreEntry = {score: number; date: string};

type HighScoreState = {
  bestScore: number;
  recentScores: ScoreEntry[];
  hydrated: boolean;
  loadScoresFromStorage: () => Promise<void>;
  addScore: (score: number) => Promise<void>;
  resetScores: () => Promise<void>;
};

export const useHighScoresStore = create<HighScoreState>((set, get) => ({
  bestScore: 0,
  recentScores: [],
  hydrated: false,
  loadScoresFromStorage: async () => {
    const stored = await getObject<HighScoreState>(STORAGE_KEY);
    if (stored) {
      set({...stored, hydrated: true});
    } else {
      set({bestScore: 0, recentScores: [], hydrated: true});
    }
  },
  addScore: async score => {
    const date = new Date().toISOString();
    const state = get();
    const recentScores = [{score, date}, ...state.recentScores].slice(0, RECENT_LIMIT);
    const bestScore = Math.max(state.bestScore, score);
    const snapshot = {bestScore, recentScores, hydrated: true};
    set(snapshot);
    await setObject(STORAGE_KEY, snapshot);
  },
  resetScores: async () => {
    await removeItem(STORAGE_KEY);
    set({bestScore: 0, recentScores: [], hydrated: true});
  },
}));

