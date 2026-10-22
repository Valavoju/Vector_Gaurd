import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckSquare,
  ChevronDown,
  ClipboardList,
  CornerDownLeft,
  Database,
  Layers,
  Menu,
  Search,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';
import { ADMIN_FOOTER_NAV, ADMIN_NAV, NavItem } from './navConfig';

/** Closes a popover when the user clicks outside `ref` or presses Escape. */
const useDismiss = (ref: React.RefObject<HTMLElement | null>, open: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, open, onClose]);
};

const useClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);
  return now;
};

const istFormatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

type SearchResult =
  | { kind: 'page'; key: string; title: string; subtitle: string; item: NavItem }
  | { kind: 'hotspot'; key: string; title: string; subtitle: string; id: string; level: string }
  | { kind: 'task'; key: string; title: string; subtitle: string; id: string };

const LEVEL_DOT: Record<string, string> = {
  CRITICAL: 'bg-purple-500',
  HIGH: 'bg-red-500',
  MODERATE: 'bg-amber-500',
  LOW: 'bg-emerald-500',
};

const GlobalSearch: React.FC = () => {
  const { hotspots, tasks, setActiveView, setSelectedHotspotId } = useApp();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useDismiss(wrapRef, open, () => setOpen(false));

  // Ctrl/Cmd + K focuses search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    const pages = [...ADMIN_NAV.flatMap(g => g.items), ...ADMIN_FOOTER_NAV]
      .filter(i => !q || `${i.label} ${i.description}`.toLowerCase().includes(q))
      .slice(0, q ? 4 : 6)
      .map<SearchResult>(item => ({ kind: 'page', key: item.id, title: item.label, subtitle: item.description, item }));
    if (!q) return pages;

    const hs = hotspots
      .filter(h => `${h.hotspot_id} ${h.location} ${h.city} ${h.state} ${h.ward}`.toLowerCase().includes(q))
      .slice(0, 6)
      .map<SearchResult>(h => ({
        kind: 'hotspot',
        key: h.hotspot_id,
        id: h.hotspot_id,
        title: `${h.hotspot_id} · ${h.location}`,
        subtitle: `${h.city}, ${h.state} · Score ${h.breeding_risk_score}`,
        level: h.risk_level,
      }));
    const ts = tasks
      .filter(t => `${t.task_id} ${t.hotspot_id} ${t.assigned_officer} ${t.location}`.toLowerCase().includes(q))
      .slice(0, 4)
      .map<SearchResult>(t => ({
        kind: 'task',
        key: t.task_id,
        id: t.task_id,
        title: `${t.task_id} · ${t.hotspot_id}`,
        subtitle: `${t.assigned_officer} · ${t.status.replace(/_/g, ' ').toLowerCase()}`,
      }));
    return [...pages, ...hs, ...ts];
  }, [query, hotspots, tasks]);

  useEffect(() => setCursor(0), [query]);

  const choose = (r: SearchResult) => {
    if (r.kind === 'page') setActiveView(r.item.view);
    if (r.kind === 'hotspot') setSelectedHotspotId(r.id);
    if (r.kind === 'task') setActiveView('TASKS');
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && results[cursor]) {
      e.preventDefault();
      choose(results[cursor]);
    }
  };

  const iconFor = (r: SearchResult) => {
    if (r.kind === 'page') {
      const Icon = r.item.icon;
      return <Icon className="w-4 h-4 text-blue-600" />;
    }
    if (r.kind === 'task') return <ClipboardList className="w-4 h-4 text-emerald-600" />;
    return <span className={`w-2.5 h-2.5 rounded-full ${LEVEL_DOT[r.level] ?? 'bg-slate-400'}`} />;
  };

  let lastKind: SearchResult['kind'] | null = null;
  const kindLabel = { page: 'Pages', hotspot: 'Hotspots', task: 'Tasks' };

  return (
    <div ref={wrapRef} className="relative w-full max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        ref={inputRef}
        id="header-global-search"
        type="search"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search hotspots, tasks, pages…"
        aria-label="Search"
        autoComplete="off"
        className="w-full h-10 pl-10 pr-14 rounded-xl bg-card border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition"
      />
      <kbd className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-[10px] font-mono text-slate-500 pointer-events-none">
        Ctrl K
      </kbd>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-surface border border-slate-200 rounded-2xl shadow-2xl p-1.5 z-50 max-h-[70vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-500">No matches for “{query}”.</div>
          ) : (
            results.map((r, i) => {
              const header = r.kind !== lastKind ? kindLabel[r.kind] : null;
              lastKind = r.kind;
              return (
                <React.Fragment key={`${r.kind}-${r.key}`}>
                  {header && (
                    <div className="px-2.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{header}</div>
                  )}
                  <button
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => choose(r)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition ${
                      i === cursor ? 'bg-blue-50' : ''
                    }`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-slate-100 grid place-items-center shrink-0">{iconFor(r)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-slate-900 truncate">{r.title}</span>
                      <span className="block text-[11px] text-slate-500 truncate">{r.subtitle}</span>
                    </span>
                    {i === cursor && <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  </button>
                </React.Fragment>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export const Header: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    demoMode,
    setDemoMode,
    setActiveView,
    tasks,
    hotspots,
    citizenSubmissions,
    isMobileNavOpen,
    setIsMobileNavOpen,
    databaseConnectionStatus,
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  useDismiss(roleRef, isRoleMenuOpen, () => setIsRoleMenuOpen(false));
  useDismiss(bellRef, showNotifications, () => setShowNotifications(false));

  const now = useClock();

  // Alerts derived from live state instead of a fixed list.
  const alerts = useMemo(() => {
    const items: { id: string; tone: string; title: string; detail: string; icon: React.ElementType; view: string }[] = [];
    const awaiting = tasks.filter(t => t.status === 'AWAITING_VERIFICATION');
    awaiting.slice(0, 3).forEach(t =>
      items.push({
        id: `verify-${t.task_id}`,
        tone: 'bg-violet-500',
        title: `${t.task_id} awaiting verification`,
        detail: `${t.hotspot_id} · ${t.location}`,
        icon: CheckSquare,
        view: 'VERIFICATION',
      }),
    );
    const pendingCitizen = citizenSubmissions.filter(s => s.status === 'PENDING_HUMAN_VERIFICATION').length;
    if (pendingCitizen > 0) {
      items.push({
        id: 'citizen',
        tone: 'bg-fuchsia-500',
        title: `${pendingCitizen} citizen submission${pendingCitizen > 1 ? 's' : ''} to review`,
        detail: 'Supporting evidence network',
        icon: UploadCloud,
        view: 'VERIFICATION',
      });
    }
    const criticalOpen = hotspots.filter(h => h.risk_level === 'CRITICAL' && h.status === 'OPEN').length;
    if (criticalOpen > 0) {
      items.push({
        id: 'critical',
        tone: 'bg-rose-500',
        title: `${criticalOpen} critical hotspots not yet dispatched`,
        detail: 'Score 81–100 · immediate action',
        icon: AlertTriangle,
        view: 'HOTSPOTS',
      });
    }
    return items;
  }, [tasks, hotspots, citizenSubmissions]);

  const handleRoleChange = (role: UserRole) => {
    setIsRoleMenuOpen(false);
    switchUserRole(role);
  };

  const roleMeta = {
    ADMIN: { initials: 'CR', title: 'Control Room', subtitle: 'Admin', tile: 'from-[#1452f0] to-[#22c8f5]' },
    FIELD_OFFICER: { initials: 'FO', title: 'Field Unit', subtitle: 'Field Officer', tile: 'from-emerald-500 to-teal-400' },
    CITIZEN: { initials: 'CZ', title: 'Citizen Sentinel', subtitle: 'Citizen', tile: 'from-violet-500 to-fuchsia-400' },
  }[currentUser.role];

  const roles: { role: UserRole; id: string; title: string; detail: string; tile: string; initials: string }[] = [
    { role: 'ADMIN', id: 'role-switch-admin', title: 'Control Room Admin', detail: 'GIS operations, dispatch & verification', tile: 'from-[#1452f0] to-[#22c8f5]', initials: 'CR' },
    { role: 'FIELD_OFFICER', id: 'role-switch-officer', title: 'Field Officer', detail: 'Mobile inspection, GPS photos & remediation', tile: 'from-emerald-500 to-teal-400', initials: 'FO' },
    { role: 'CITIZEN', id: 'role-switch-citizen', title: 'Citizen Sentinel', detail: 'Community evidence & verification', tile: 'from-violet-500 to-fuchsia-400', initials: 'CZ' },
  ];

  const dbOk = databaseConnectionStatus === 'CONNECTED';

  return (
    <header className="h-16 shrink-0 vg-glass rounded-2xl flex items-center justify-between gap-3 px-3 sm:px-4 relative z-40 select-none">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          id="mobile-nav-toggle-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={!!isMobileNavOpen}
          onClick={() => setIsMobileNavOpen?.(!isMobileNavOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <button
          className="md:hidden min-w-0"
          onClick={() => currentUser.role === 'ADMIN' && setActiveView('DASHBOARD')}
          aria-label="VectorGuard home"
        >
          <span className="sm:hidden">
            <BrandLogo compact />
          </span>
          <span className="hidden sm:block">
            <BrandLogo tagline={false} />
          </span>
        </button>

        {currentUser.role === 'ADMIN' ? (
          <div className="hidden md:block flex-1 min-w-0">
            <GlobalSearch />
          </div>
        ) : (
          <div className="hidden md:block min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">
              {currentUser.role === 'FIELD_OFFICER' ? 'Field Operations Terminal' : 'Citizen Evidence Portal'}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {currentUser.role === 'FIELD_OFFICER' ? 'GPS-verified remediation workflow' : 'Help your city prevent vector breeding'}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={() => currentUser.role === 'ADMIN' && setActiveView('DATA_ML')}
          className="hidden lg:flex items-center gap-2 h-9 px-3 rounded-xl bg-card border border-slate-200 hover:border-blue-300 text-xs transition"
          title="Persistent cloud database — open Data & ML"
        >
          <span className="relative flex w-2 h-2">
            {dbOk && <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />}
            <span className={`relative w-2 h-2 rounded-full ${dbOk ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </span>
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">{dbOk ? 'Connected' : 'Syncing'}</span>
        </button>

        <div className="hidden xl:flex flex-col items-end leading-tight px-2" title="Indian Standard Time">
          <span className="text-xs font-bold text-slate-800 tabular-nums">{istFormatter.format(now)}</span>
          <span className="text-[10px] text-slate-500 font-medium">IST · System operational</span>
        </div>

        <button
          id="header-demo-guide-toggle"
          onClick={() => setDemoMode?.(!demoMode)}
          className={`h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
            demoMode ? 'vg-btn-primary ring-2 ring-amber-300/70' : 'vg-btn-primary'
          }`}
          title="Toggle the 18-step interactive walkthrough"
          aria-pressed={!!demoMode}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span className="hidden sm:inline">Demo</span>
        </button>

        <ThemeToggle />

        <div ref={bellRef} className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(s => !s)}
            className="relative w-9 h-9 grid place-items-center rounded-xl bg-card border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-blue-300 transition"
            aria-label={`Notifications (${alerts.length})`}
            aria-expanded={showNotifications}
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center ring-2 ring-[var(--vg-bg)]">
                {alerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-24px)] bg-surface border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 origin-top-right animate-pop-in">
              <div className="flex items-center justify-between px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span>Live alerts</span>
                <span className="text-blue-600">{alerts.length} active</span>
              </div>
              {alerts.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-slate-500">All clear — nothing needs attention.</div>
              ) : (
                <div className="space-y-1">
                  {alerts.map(a => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.id}
                        onClick={() => {
                          if (currentUser.role === 'ADMIN') setActiveView(a.view);
                          setShowNotifications(false);
                        }}
                        className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-100 text-left transition"
                      >
                        <span className={`w-7 h-7 rounded-lg ${a.tone} text-white grid place-items-center shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-bold text-slate-900">{a.title}</span>
                          <span className="block text-[11px] text-slate-500 truncate">{a.detail}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div ref={roleRef} className="relative shrink-0">
          <button
            id="header-role-switcher-btn"
            onClick={() => setIsRoleMenuOpen(o => !o)}
            aria-expanded={isRoleMenuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 h-10 pl-1 pr-2 rounded-xl hover:bg-card border border-transparent hover:border-slate-200 transition"
          >
            <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${roleMeta.tile} text-white text-xs font-bold grid place-items-center shadow-md shrink-0`}>
              {roleMeta.initials}
            </span>
            <span className="text-left hidden sm:block">
              <span className="block font-bold text-xs text-slate-900 leading-tight">{roleMeta.title}</span>
              <span className="block text-[10px] text-slate-500 leading-tight font-medium">{roleMeta.subtitle}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isRoleMenuOpen && (
            <div role="menu" className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] bg-surface border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right animate-pop-in">
              <div className="px-3.5 py-2.5 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Switch role perspective
              </div>
              <div className="p-1.5 space-y-1">
                {roles.map(r => {
                  const active = currentUser.role === r.role;
                  return (
                    <button
                      key={r.role}
                      id={r.id}
                      role="menuitemradio"
                      aria-checked={active}
                      onClick={() => handleRoleChange(r.role)}
                      className={`w-full text-left p-2 rounded-xl text-xs transition flex items-start gap-2.5 ${
                        active ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.tile} text-white font-bold grid place-items-center shrink-0`}>
                        {r.initials}
                      </span>
                      <span>
                        <span className="block font-bold text-slate-900">{r.title}</span>
                        <span className="block text-[11px] text-slate-500">{r.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="px-3.5 py-2 border-t border-slate-200 flex items-center gap-1.5 text-[10px] text-slate-500">
                <Layers className="w-3 h-3" /> Demo personas share one dataset.
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
