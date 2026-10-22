import React, { useId } from 'react';

const ARM_PATH = 'M3 17h13.5l17.2 29.6-4.6 10.4z';
const SHIELD_PATH =
  'M29.1 57C45 49.5 55 36 60.5 17.5L43 8.5 24.5 18.5l5.6 11.2 4.6-9.2 4.8-2.6 10.4 3.8C46 33 39.5 45 29.1 57z';

interface BrandMarkProps {
  className?: string;
  /** Crop the viewBox to the glyph so it can sit on a text baseline as the letter V. */
  tight?: boolean;
}

/** The Vector Guard "V-shield" mark. */
export const BrandMark: React.FC<BrandMarkProps> = ({ className = 'w-8 h-8', tight = false }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={tight ? '3 7 58 51' : '0 0 64 64'} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-a`} x1="6" y1="14" x2="34" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1a4dff" />
          <stop offset=".55" stopColor="#1463ff" />
          <stop offset="1" stopColor="#0a1f8f" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="58" y1="10" x2="30" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22e0f0" />
          <stop offset=".5" stopColor="#1a8cff" />
          <stop offset="1" stopColor="#0b3be0" />
        </linearGradient>
      </defs>
      <path d={ARM_PATH} fill={`url(#${id}-a)`} />
      <path d={SHIELD_PATH} fill={`url(#${id}-b)`} />
    </svg>
  );
};

/** Icon tile for tight spaces (collapsed rail). Follows the active theme. */
export const BrandTile: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div
    className={`${className} rounded-xl grid place-items-center shrink-0 bg-white ring-1 ring-blue-200 shadow-[0_6px_18px_-8px_rgba(31,111,255,0.55)] dark:bg-[#1b1c20] dark:ring-white/10 dark:shadow-none`}
  >
    <BrandMark className="w-[72%] h-[72%]" />
  </div>
);

/** "VECTOR GUARD" where the mark itself is the V. */
export const BrandWordmark: React.FC<{ className?: string }> = ({ className = 'text-[17px]' }) => (
  <span
    className={`${className} inline-flex items-end font-display font-extrabold tracking-[0.1em] leading-none whitespace-nowrap text-slate-900`}
    aria-label="Vector Guard"
    role="img"
  >
    <BrandMark tight className="h-[1.32em] w-auto -mr-[0.05em] -mb-[0.02em] shrink-0" />
    <span aria-hidden="true">ECTOR</span>
    <span aria-hidden="true" className="ml-[0.32em] vg-brand-text">
      GUARD
    </span>
  </span>
);

interface BrandLogoProps {
  compact?: boolean;
  tagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, tagline = true }) =>
  compact ? (
    <BrandTile />
  ) : (
    <div className="min-w-0 leading-none">
      <BrandWordmark />
      {tagline && (
        <div className="mt-1.5 text-[10px] font-semibold tracking-wide text-slate-500 whitespace-nowrap hidden sm:block">
          Predict · Verify · Prevent · Learn
        </div>
      )}
    </div>
  );
