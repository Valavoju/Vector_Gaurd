import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  /** Toggle the theme. `origin` is the viewport point the circular reveal grows from. */
  toggleTheme: (origin?: { x: number; y: number }) => void;
}

const STORAGE_KEY = 'vg-theme';
const REVEAL_DURATION_MS = 560;
// iOS-like curve: starts fast so the click feels answered, settles softly.
const REVEAL_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const readInitialTheme = (): ThemeMode =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light';

const applyThemeClass = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage may be unavailable (private mode); the class still applies.
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);

  // Follow OS changes until the user picks a theme explicitly.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      if (saved) return;
      const next: ThemeMode = e.matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      setTheme(next);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    const next: ThemeMode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    const commit = () => {
      applyThemeClass(next);
      flushSync(() => setTheme(next));
    };

    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      commit();
      return;
    }

    if (typeof document.startViewTransition !== 'function') {
      root.classList.add('vg-theme-fade');
      commit();
      window.setTimeout(() => root.classList.remove('vg-theme-fade'), 260);
      return;
    }

    const x = origin?.x ?? window.innerWidth - 40;
    const y = origin?.y ?? 40;
    // Radius to the farthest viewport corner, so the circle covers everything.
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    root.classList.add('vg-theme-reveal');
    const transition = document.startViewTransition(commit);

    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: REVEAL_DURATION_MS,
            easing: REVEAL_EASING,
            pseudoElement: '::view-transition-new(root)',
            fill: 'both',
          },
        );
      })
      .catch(() => {
        // Transition was skipped (e.g. tab hidden); the theme is already committed.
      });

    transition.finished.finally(() => root.classList.remove('vg-theme-reveal'));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
