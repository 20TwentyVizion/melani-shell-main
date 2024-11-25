import { create } from 'zustand';

interface Window {
  id: string;
  isOpen: boolean;
  title: string;
}

interface CalendarState {
  currentDate: Date;
  events: Array<{
    id: string;
    title: string;
    date: Date;
    isHoliday?: boolean;
  }>;
  holidays: Array<{
    id: string;
    title: string;
    date: Date;
    isHoliday: boolean;
  }>;
}

interface OSState {
  windows: {
    games: Window;
    settings: Window;
    profile: Window;
    melani: Window;
    music: Window;
    editor: Window;
    calendar: Window;
  };
  currentSong: {
    title: string;
    artist: string;
  } | null;
  isPlaying: boolean;
  calendarState: CalendarState;
  actions: {
    openWindow: (windowId: keyof OSState['windows']) => void;
    closeWindow: (windowId: keyof OSState['windows']) => void;
    minimizeWindow: (windowId: keyof OSState['windows']) => void;
    playSong: (title: string, artist: string) => void;
    pauseSong: () => void;
    resumeSong: () => void;
    updateCalendarState: (state: CalendarState) => void;
  };
}

export const useOSStore = create<OSState>((set) => ({
  windows: {
    games: { id: 'games', isOpen: false, title: 'Games' },
    settings: { id: 'settings', isOpen: false, title: 'Settings' },
    profile: { id: 'profile', isOpen: false, title: 'Profile' },
    melani: { id: 'melani', isOpen: false, title: 'Melani' },
    music: { id: 'music', isOpen: false, title: 'Music' },
    editor: { id: 'editor', isOpen: false, title: 'Text Editor' },
    calendar: { id: 'calendar', isOpen: false, title: 'Calendar' },
  },
  currentSong: null,
  isPlaying: false,
  calendarState: {
    currentDate: new Date(),
    events: [],
    holidays: [],
  },
  actions: {
    openWindow: (windowId) =>
      set((state) => ({
        windows: {
          ...state.windows,
          [windowId]: { ...state.windows[windowId], isOpen: true },
        },
      })),
    closeWindow: (windowId) =>
      set((state) => ({
        windows: {
          ...state.windows,
          [windowId]: { ...state.windows[windowId], isOpen: false },
        },
      })),
    minimizeWindow: (windowId) =>
      set((state) => ({
        windows: {
          ...state.windows,
          [windowId]: { ...state.windows[windowId], isOpen: false },
        },
      })),
    playSong: (title, artist) =>
      set(() => ({
        currentSong: { title, artist },
        isPlaying: true,
      })),
    pauseSong: () =>
      set(() => ({
        isPlaying: false,
      })),
    resumeSong: () =>
      set(() => ({
        isPlaying: true,
      })),
    updateCalendarState: (state) =>
      set(() => ({
        calendarState: state,
      })),
  },
}));
