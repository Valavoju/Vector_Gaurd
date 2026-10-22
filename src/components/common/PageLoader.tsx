import React from 'react';
import { BrandMark } from './BrandLogo';

/** In-app loader shown while a lazily loaded view is fetched. */
export const PageLoader: React.FC<{ label?: string }> = ({ label = 'Loading workspace' }) => (
  <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-page-in" role="status" aria-live="polite">
    <div className="flex items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute -inset-3 rounded-full bg-brand-500/25 blur-xl animate-pulse" />
        <BrandMark className="relative w-12 h-12 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-bold text-slate-800">{label}…</div>
        <div className="w-40 h-1.5 rounded-full overflow-hidden bg-brand-100">
          <div className="h-full w-2/5 rounded-full vg-brand-gradient animate-[vg-slide_1.1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>

    <div className="vg-skeleton h-28 rounded-2xl" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="vg-skeleton h-24 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="vg-skeleton h-72 rounded-2xl lg:col-span-2" />
      <div className="vg-skeleton h-72 rounded-2xl" />
    </div>
  </div>
);
