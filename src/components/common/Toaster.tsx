import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TONES = {
  success: { icon: CheckCircle2, accent: 'text-emerald-600', bar: 'bg-emerald-500' },
  info: { icon: Info, accent: 'text-blue-600', bar: 'bg-blue-500' },
  warning: { icon: AlertTriangle, accent: 'text-amber-600', bar: 'bg-amber-500' },
  error: { icon: XCircle, accent: 'text-rose-600', bar: 'bg-rose-500' },
} as const;

/** Renders the toasts queued through AppContext.addNotification. */
export const Toaster: React.FC = () => {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div
      className="fixed top-[124px] right-3 sm:right-5 z-[60] flex flex-col gap-2 w-[min(360px,calc(100vw-24px))] pointer-events-none"
      aria-live="polite"
    >
      {notifications.slice(0, 3).map(toast => {
        const tone = TONES[toast.type] ?? TONES.info;
        const Icon = tone.icon;
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto relative overflow-hidden bg-surface border border-slate-200 rounded-xl shadow-xl p-3 pl-4 flex items-start gap-2.5 animate-pop-in"
          >
            <span className={`absolute left-0 top-0 bottom-0 w-1 ${tone.bar}`} />
            <Icon className={`w-4.5 h-4.5 shrink-0 mt-0.5 ${tone.accent}`} />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900">{toast.title}</div>
              <div className="text-[11px] text-slate-600 leading-snug mt-0.5">{toast.message}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">{toast.timestamp}</div>
            </div>
            <button
              onClick={() => dismissNotification(toast.id)}
              className="p-1 -m-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
