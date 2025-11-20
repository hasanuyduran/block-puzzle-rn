import {create} from 'zustand';
import {getObject, setObject, removeItem} from '../utils/storage';

const STORAGE_KEY = 'SETTINGS';

type Theme = 'dark' | 'light';

type PersistedSettings = {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: Theme;
};

type SettingsState = PersistedSettings & {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: Theme;
  hydrated: boolean;
  toggleSound: () => void;
  toggleHaptics: () => void;
  setTheme: (theme: Theme) => void;
  loadSettingsFromStorage: () => Promise<void>;
  resetSettings: () => Promise<void>;
};

const persist = (state: PersistedSettings) =>
  setObject(STORAGE_KEY, {
    soundEnabled: state.soundEnabled,
    hapticsEnabled: state.hapticsEnabled,
    theme: state.theme,
  });

export const useSettingsStore = create<SettingsState>((set, get) => ({
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'dark',
  hydrated: false,
  toggleSound: () => {
    set(state => {
      const next = {...state, soundEnabled: !state.soundEnabled};
      persist(next);
      return next;
    });
  },
  toggleHaptics: () => {
    set(state => {
      const next = {...state, hapticsEnabled: !state.hapticsEnabled};
      persist(next);
      return next;
    });
  },
  setTheme: (theme: Theme) => {
    set(state => {
      const next = {...state, theme};
      persist(next);
      return next;
    });
  },
  loadSettingsFromStorage: async () => {
    const stored = await getObject<PersistedSettings>(STORAGE_KEY);
    if (stored) {
      set({...stored, hydrated: true});
    } else {
      set(state => ({...state, hydrated: true}));
    }
  },
  resetSettings: async () => {
    await removeItem(STORAGE_KEY);
    set({
      soundEnabled: true,
      hapticsEnabled: true,
      theme: 'dark',
      hydrated: true,
    });
  },
}));

