import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Light/dark switch with a "liquid" knob: the leading edge moves first and the
 * trailing edge catches up, so the knob stretches like a droplet as it slides.
 * The page itself is re-coloured by the circular reveal in ThemeContext.
 */
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  // Slight overshoot gives the droplet a soft landing; the trailing edge lags 70ms.
  const ease = 'cubic-bezier(0.34, 1.3, 0.64, 1)';
  const knobStyle: React.CSSProperties = {
    left: isDark ? 31 : 3,
    right: isDark ? 3 : 31,
    transition: isDark
      ? `right 240ms ${ease}, left 240ms ${ease} 70ms`
      : `left 240ms ${ease}, right 240ms ${ease} 70ms`,
  };

  return (
    <button
      id="header-theme-toggle"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={handleClick}
      className={`relative h-[30px] w-[58px] shrink-0 rounded-full overflow-hidden ring-1 duration-300 active:scale-[0.96] transition-[background-color,box-shadow,transform] ${
        isDark
          ? 'bg-gradient-to-r from-[#1c1d22] to-[#2a2b31] ring-white/10'
          : 'bg-gradient-to-r from-[#bfe3ff] to-[#e6f4ff] ring-sky-300/70'
      }`}
    >
      {/* Track decoration: stars in dark, a cloud puff in light. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="absolute left-[9px] top-[8px] w-[3px] h-[3px] rounded-full bg-white/90" />
        <span className="absolute left-[17px] top-[17px] w-[2px] h-[2px] rounded-full bg-white/70" />
        <span className="absolute left-[12px] top-[21px] w-[2px] h-[2px] rounded-full bg-[#a5f3fc]" />
      </span>
      <span
        aria-hidden="true"
        className={`absolute right-[7px] top-[11px] w-[14px] h-[6px] rounded-full bg-white transition-opacity duration-300 ${
          isDark ? 'opacity-0' : 'opacity-90'
        }`}
      />

      <span
        aria-hidden="true"
        style={knobStyle}
        className={`absolute top-[3px] bottom-[3px] rounded-full grid place-items-center shadow-md ${
          isDark
            ? 'bg-gradient-to-br from-[#e8efff] to-[#9fb8ff] shadow-[#1f6fff]/50'
            : 'bg-gradient-to-br from-[#ffd75e] to-[#ff9d2e] shadow-orange-400/50'
        }`}
      >
        <Sun
          className={`absolute w-3.5 h-3.5 text-white transition-[opacity,transform] duration-300 ease-out ${
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`absolute w-3.5 h-3.5 text-[#1236a6] fill-[#1236a6]/20 transition-[opacity,transform] duration-300 ease-out ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
          }`}
        />
      </span>
    </button>
  );
};
