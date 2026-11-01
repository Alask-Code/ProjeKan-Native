import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeSettings {
  primary: string;
  background: string;
  surface: string;
  raised: string;
  text: string;
  muted: string;
  border: string;
  danger: string;
  success: string;
  warning: string;
  info: string;
  borderRadius: number;
  borderWidth: number;
  font: string;
}

export const defaultTheme: ThemeSettings = {
  primary: '#a77ec3',
  background: '#17131d',
  surface: '#1e1826',
  raised: '#33263f',
  text: '#eadcf5',
  muted: '#b59bc9',
  border: '#76568f',
  danger: '#d26f83',
  success: '#61b58a',
  warning: '#d7ad58',
  info: '#7da5da',
  borderRadius: 0,
  borderWidth: 2,
  font: 'monospace'
};

export const themePresets: { id: string; name: string; settings: ThemeSettings }[] = [
  { id: 'mauve', name: 'Mauve clássico', settings: defaultTheme },
  {
    id: 'ocean',
    name: 'Oceano',
    settings: {
      ...defaultTheme,
      primary: '#66a8d1',
      background: '#101923',
      surface: '#172330',
      raised: '#223448',
      text: '#dcecf7',
      muted: '#9ab6ca',
      border: '#466b88',
      info: '#75bde0'
    }
  },
  {
    id: 'forest',
    name: 'Floresta',
    settings: {
      ...defaultTheme,
      primary: '#69b48e',
      background: '#111a17',
      surface: '#19251f',
      raised: '#26392f',
      text: '#e0f0e7',
      muted: '#a0c1ad',
      border: '#557866',
      success: '#81c69b'
    }
  },
  {
    id: 'sunset',
    name: 'Pôr do sol',
    settings: {
      ...defaultTheme,
      primary: '#db916b',
      background: '#201713',
      surface: '#2b1e19',
      raised: '#483027',
      text: '#f5e3d8',
      muted: '#d0a995',
      border: '#956449',
      warning: '#e5bb67'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    settings: {
      ...defaultTheme,
      primary: '#8b96a8',
      background: '#111318',
      surface: '#1a1d24',
      raised: '#292d36',
      text: '#e6e8ec',
      muted: '#a4a9b4',
      border: '#484e5b',
      danger: '#ed7278',
      success: '#62bd91',
      warning: '#dfb85d',
      info: '#66a8d6'
    }
  },
  {
    id: 'golden',
    name: 'Golden',
    settings: {
      ...defaultTheme,
      primary: '#d7ae45',
      background: '#17140d',
      surface: '#211d12',
      raised: '#342c18',
      text: '#f3e8c9',
      muted: '#c3b17e',
      border: '#78652e',
      danger: '#df7370',
      success: '#83b56b',
      warning: '#e4c35b',
      info: '#78adc1'
    }
  },
  {
    id: 'darkula',
    name: 'Darkula',
    settings: {
      ...defaultTheme,
      primary: '#bd93f9',
      background: '#282a36',
      surface: '#21222c',
      raised: '#44475a',
      text: '#f8f8f2',
      muted: '#bd93f9',
      border: '#6272a4',
      danger: '#ff5555',
      success: '#50fa7b',
      warning: '#f1fa8c',
      info: '#8be9fd'
    }
  },
  {
    id: 'omnidark',
    name: 'OmniDark',
    settings: {
      ...defaultTheme,
      primary: '#7ed6c2',
      background: '#080b0d',
      surface: '#101619',
      raised: '#1b2529',
      text: '#e2eeeb',
      muted: '#91aaa4',
      border: '#354d4a',
      danger: '#f07777',
      success: '#72d6a5',
      warning: '#e0bd70',
      info: '#7ab9dc'
    }
  },
  {
    id: 'visual-studio',
    name: 'Visual Studio',
    settings: {
      ...defaultTheme,
      primary: '#007acc',
      background: '#1e1e1e',
      surface: '#252526',
      raised: '#333333',
      text: '#d4d4d4',
      muted: '#a0a0a0',
      border: '#484848',
      danger: '#f48771',
      success: '#6a9955',
      warning: '#cca700',
      info: '#4fc1ff'
    }
  },
  {
    id: 'amoled',
    name: 'AMOLED',
    settings: {
      ...defaultTheme,
      primary: '#8ab4f8',
      background: '#000000',
      surface: '#050505',
      raised: '#111111',
      text: '#f5f5f5',
      muted: '#a1a1aa',
      border: '#303030',
      danger: '#ff6b6b',
      success: '#65d69a',
      warning: '#f2c66d',
      info: '#70c8ff'
    }
  },
  {
    id: 'material-light',
    name: 'Material Design claro',
    settings: {
      ...defaultTheme,
      primary: '#6750A4',
      background: '#FFFBFE',
      surface: '#F7F2FA',
      raised: '#EADDFF',
      text: '#1D1B20',
      muted: '#625B71',
      border: '#CAC4D0',
      danger: '#B3261E',
      success: '#386A20',
      warning: '#7D5700',
      info: '#0061A4'
    }
  },
  {
    id: 'lavender-light',
    name: 'Lavanda clara',
    settings: {
      ...defaultTheme,
      primary: '#7656A8',
      background: '#FAF8FC',
      surface: '#FFFFFF',
      raised: '#F0EAF7',
      text: '#27232D',
      muted: '#716B79',
      border: '#D8D0E1',
      danger: '#B5475A',
      success: '#397A59',
      warning: '#946500',
      info: '#3972A5'
    }
  },
  {
    id: 'sage-light',
    name: 'Sálvia clara',
    settings: {
      ...defaultTheme,
      primary: '#527A68',
      background: '#F6FAF7',
      surface: '#FFFFFF',
      raised: '#E5F0E9',
      text: '#1D2922',
      muted: '#64746A',
      border: '#C9D9CE',
      danger: '#B54747',
      success: '#397653',
      warning: '#8A6500',
      info: '#397293'
    }
  },
  {
    id: 'sky-light',
    name: 'Céu claro',
    settings: {
      ...defaultTheme,
      primary: '#176B87',
      background: '#F4FAFC',
      surface: '#FFFFFF',
      raised: '#DDEFF5',
      text: '#17262D',
      muted: '#5F7078',
      border: '#C4D8E0',
      danger: '#B54747',
      success: '#397653',
      warning: '#8A6500',
      info: '#176B87'
    }
  },
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    settings: {
      ...defaultTheme,
      primary: '#FCEE0A',
      background: '#0A0A0F',
      surface: '#12141C',
      raised: '#202432',
      text: '#F5F5F5',
      muted: '#9EA5B8',
      border: '#393E50',
      danger: '#FF2A6D',
      success: '#00F0A8',
      warning: '#FCEE0A',
      info: '#00F0FF',
      borderRadius: 2,
      borderWidth: 1,
      font: 'Rajdhani'
    }
  },
  {
    id: 'windows-7',
    name: 'Windows 7',
    settings: {
      ...defaultTheme,
      primary: '#2878B8',
      background: '#E8F2FA',
      surface: '#F8FBFE',
      raised: '#D5E7F5',
      text: '#1C2B39',
      muted: '#536B7D',
      border: '#9BBBD3',
      danger: '#C74646',
      success: '#3B8A58',
      warning: '#A87500',
      info: '#2878B8',
      borderRadius: 6,
      borderWidth: 1,
      font: 'system-ui, sans-serif'
    }
  },
  {
    id: 'macos',
    name: 'macOS',
    settings: {
      ...defaultTheme,
      primary: '#007AFF',
      background: '#F5F5F7',
      surface: '#FFFFFF',
      raised: '#ECECF0',
      text: '#1D1D1F',
      muted: '#6E6E73',
      border: '#D2D2D7',
      danger: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      info: '#5AC8FA',
      borderRadius: 12,
      borderWidth: 1,
      font: 'system-ui, sans-serif'
    }
  },
  {
    id: 'ms-dos',
    name: 'MS-DOS',
    settings: {
      ...defaultTheme,
      primary: '#ffff55',
      background: '#0000aa',
      surface: '#00008b',
      raised: '#0000c8',
      text: '#ffffff',
      muted: '#c0c0c0',
      border: '#aaaaaa',
      danger: '#ff5555',
      success: '#55ff55',
      warning: '#ffff55',
      info: '#55ffff',
      borderRadius: 0,
      borderWidth: 1,
      font: '"Courier New", monospace'
    }
  }
];

interface ThemeStore {
  settings: ThemeSettings;
  saveSettings: (settings: ThemeSettings) => void;
  resetSettings: () => void;
}
const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      settings: defaultTheme,
      saveSettings: (settings) => set({ settings }),
      resetSettings: () => set({ settings: defaultTheme })
    }),
    {
      name: 'projekan-theme',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      partialize: (state) => ({ settings: state.settings })
    }
  )
);
export default useThemeStore;
