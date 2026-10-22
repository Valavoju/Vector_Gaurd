import { RiskLevel } from '../types';

export interface RiskStyle {
  label: string;
  range: string;
  /** Fixed hex for non-Tailwind consumers (Leaflet pins, canvas, PDF). */
  hex: string;
  /** Solid fill for marks (score tiles, bars, dots). */
  fill: string;
  /** Text colour to use on top of `fill`, chosen by the fill's luminance. */
  onFill: string;
  /** Tinted chip background; chip text stays in ink tokens, never the hue. */
  tint: string;
}

/**
 * One severity scale for the whole app (map, tables, charts, modals).
 * Colours follow the risk level everywhere so "red" always means Critical.
 */
export const RISK_STYLES: Record<RiskLevel, RiskStyle> = {
  CRITICAL: {
    label: 'Critical',
    range: '81–100',
    hex: '#d03b3b',
    fill: 'bg-risk-critical',
    onFill: 'text-white',
    tint: 'bg-risk-critical/12 ring-1 ring-risk-critical/35',
  },
  HIGH: {
    label: 'High',
    range: '61–80',
    hex: '#ec835a',
    fill: 'bg-risk-high',
    onFill: 'text-[#2a1206]',
    tint: 'bg-risk-high/14 ring-1 ring-risk-high/40',
  },
  MODERATE: {
    label: 'Moderate',
    range: '31–60',
    hex: '#fab219',
    fill: 'bg-risk-moderate',
    onFill: 'text-[#2a1d00]',
    tint: 'bg-risk-moderate/16 ring-1 ring-risk-moderate/45',
  },
  LOW: {
    label: 'Low',
    range: '0–30',
    hex: '#0ca30c',
    fill: 'bg-risk-low',
    onFill: 'text-white',
    tint: 'bg-risk-low/12 ring-1 ring-risk-low/35',
  },
};

export const RISK_ORDER: RiskLevel[] = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];

export const riskStyle = (level: string): RiskStyle => RISK_STYLES[level as RiskLevel] ?? RISK_STYLES.MODERATE;
