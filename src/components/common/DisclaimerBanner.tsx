import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="w-full max-w-full bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] px-3 sm:px-5 lg:px-6 py-1.5 box-border">
      <div className="w-full flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded text-[9px] tracking-wider uppercase font-bold shrink-0">
            Demo / Pilot Data — Illustrative
          </span>
          <span className="text-slate-300 truncate text-[10px] sm:text-[11px]">
            VectorGuard AI predicts water retention & vector-breeding risk for proactive municipal prevention.
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-3 text-slate-400 text-[10px] shrink-0">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-sky-400 shrink-0" />
            Decision-support score only; not medical diagnosis.
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            CV detects environmental standing water & debris.
          </span>
        </div>
      </div>
    </div>
  );
};

