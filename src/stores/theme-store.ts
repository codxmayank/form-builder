import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem('formcraft-theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', isDark);
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getStoredTheme(),
  setTheme: (theme) => {
    localStorage.setItem('formcraft-theme', theme);
    applyTheme(theme);
    set({ theme });
  }
}));

// Apply on load
applyTheme(getStoredTheme());

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const current = useThemeStore.getState().theme;
  if (current === 'system') applyTheme('system');
});
