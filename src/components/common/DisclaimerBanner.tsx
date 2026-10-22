import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="w-full shrink-0 bg-card/60 text-slate-600 border-b border-slate-200 text-[11px] px-3 sm:px-5 py-1.5 backdrop-blur-md">
      <div className="w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="bg-amber-100 text-amber-800 border border-amber-300/70 px-1.5 py-0.5 rounded-md text-[9px] tracking-wider uppercase font-bold shrink-0">
            Demo / Pilot Data — Illustrative
          </span>
          <span className="truncate text-[10px] sm:text-[11px] text-slate-500">
            VectorGuard AI predicts water retention &amp; vector-breeding risk for proactive municipal prevention.
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-3 text-slate-500 text-[10px] shrink-0">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-sky-600 shrink-0" />
            Decision-support score only; not medical diagnosis.
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            CV detects environmental standing water &amp; debris.
          </span>
        </div>
      </div>
    </div>
  );
};
