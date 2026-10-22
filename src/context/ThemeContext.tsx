import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  /** Toggle the theme. `origin` is the viewport point the liquid reveal grows from. */
  toggleTheme: (origin?: { x: number; y: number }) => void;
}

const STORAGE_KEY = 'vg-theme';
const LIQUID_DURATION_MS = 950;
// The mask blob is inset inside its box, so it must be scaled past the
// farthest corner for the reveal to cover the whole viewport.
const BLOB_COVER_FACTOR = 2.5;

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
      window.setTimeout(() => root.classList.remove('vg-theme-fade'), 500);
      return;
    }

    const x = origin?.x ?? window.innerWidth - 40;
    const y = origin?.y ?? 40;
    const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const size = reach * BLOB_COVER_FACTOR;

    root.classList.add('vg-liquid');
    const transition = document.startViewTransition(commit);

    transition.ready
      .then(() => {
        const keyframes: PropertyIndexedKeyframes = {
          maskSize: ['0px 0px', `${size * 0.18}px ${size * 0.18}px`, `${size}px ${size}px`],
          maskPosition: [`${x}px ${y}px`, `${x - size * 0.09}px ${y - size * 0.09}px`, `${x - size / 2}px ${y - size / 2}px`],
          webkitMaskSize: ['0px 0px', `${size * 0.18}px ${size * 0.18}px`, `${size}px ${size}px`],
          webkitMaskPosition: [`${x}px ${y}px`, `${x - size * 0.09}px ${y - size * 0.09}px`, `${x - size / 2}px ${y - size / 2}px`],
          // A short "drip" hold at the start, then the flood fills the screen.
          offset: [0, 0.22, 1],
        };
        root.animate(keyframes, {
          duration: LIQUID_DURATION_MS,
          easing: 'cubic-bezier(0.7, 0, 0.25, 1)',
          pseudoElement: '::view-transition-new(root)',
          fill: 'both',
        });
      })
      .catch(() => {
        // Transition was skipped (e.g. tab hidden); the theme is already committed.
      });

    transition.finished.finally(() => root.classList.remove('vg-liquid'));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
