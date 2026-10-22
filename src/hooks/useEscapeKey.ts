import { useEffect } from 'react';

/** Calls `onEscape` when Escape is pressed while `active` is true. */
export const useEscapeKey = (active: boolean, onEscape: () => void) => {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onEscape]);
};
