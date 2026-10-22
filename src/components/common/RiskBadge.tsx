import React from 'react';
import { riskStyle } from '../../utils/riskStyles';

interface RiskBadgeProps {
  level: string;
  /** Appended after the level name, e.g. "RISK" or "(Score: 94)". */
  suffix?: React.ReactNode;
  className?: string;
}

/** Severity chip: coloured dot + ink label, so meaning never rests on colour alone. */
export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, suffix, className = '' }) => {
  const style = riskStyle(level);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide text-slate-800 ${style.tint} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.fill}`} aria-hidden="true" />
      {style.label}
      {suffix && <span className="font-semibold normal-case text-slate-600">{suffix}</span>}
    </span>
  );
};

/** Square score tile filled with the severity colour. */
export const RiskScoreTile: React.FC<{ level: string; score: number; className?: string }> = ({
  level,
  score,
  className = 'w-9 h-9 text-xs',
}) => {
  const style = riskStyle(level);
  return (
    <span
      className={`grid place-items-center rounded-lg font-extrabold shrink-0 tabular-nums ${style.fill} ${style.onFill} ${className}`}
      title={`${style.label} risk (${style.range})`}
    >
      {score}
    </span>
  );
};
