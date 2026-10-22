import React, { useEffect, useState } from 'react';
import { ChevronsLeft, ChevronsRight, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo, BrandTile } from './BrandLogo';
import {
  ADMIN_FOOTER_NAV,
  ADMIN_NAV,
  CITIZEN_NAV,
  FIELD_NAV,
  NavBadge,
  NavGroup,
  NavItem,
  isNavItemActive,
} from './navConfig';

const COLLAPSE_KEY = 'vg-sidebar-collapsed';

const ROLE_ACCENT = {
  ADMIN: { initials: 'CR', tile: 'from-[#1452f0] to-[#22c8f5]', label: 'Control Room' },
  FIELD_OFFICER: { initials: 'FO', tile: 'from-emerald-500 to-teal-400', label: 'Field Unit' },
  CITIZEN: { initials: 'CZ', tile: 'from-violet-500 to-fuchsia-400', label: 'Citizen Sentinel' },
} as const;

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    activeView,
    setActiveView,
    tasks,
    hotspots,
    registeredCitizen,
    isMobileNavOpen,
    setIsMobileNavOpen,
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, isCollapsed ? '1' : '0');
    } catch {
      // ignore
    }
  }, [isCollapsed]);

  // Close the mobile drawer with Escape.
  useEffect(() => {
    if (!isMobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMobileNavOpen?.(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileNavOpen, setIsMobileNavOpen]);

  const badgeCounts: Record<NavBadge, number> = {
    hotspots: hotspots.length,
    tasks: tasks.filter(t => t.status !== 'RESOLVED').length,
    verification: tasks.filter(t => t.status === 'AWAITING_VERIFICATION').length,
    myTasks: tasks.filter(t => t.assigned_officer_id === currentUser.id && t.status !== 'RESOLVED').length,
  };

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setIsMobileNavOpen?.(false);
  };

  const groups: NavGroup[] =
    currentUser.role === 'CITIZEN' ? CITIZEN_NAV : currentUser.role === 'FIELD_OFFICER' ? FIELD_NAV : ADMIN_NAV;
  const accent = ROLE_ACCENT[currentUser.role] ?? ROLE_ACCENT.ADMIN;

  const renderItem = (item: NavItem, collapsed: boolean) => {
    const active = isNavItemActive(item, activeView);
    const count = item.badge ? badgeCounts[item.badge] : 0;
    const Icon = item.icon;
    const urgent = item.badge === 'verification' && count > 0;

    return (
      <button
        key={item.id}
        id={item.id}
        onClick={() => handleNavClick(item.view)}
        title={collapsed ? item.label : undefined}
        aria-current={active ? 'page' : undefined}
        className={`group relative w-full flex items-center gap-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
          collapsed ? 'justify-center p-2' : 'px-2.5 py-1.5'
        } ${
          active
            ? 'bg-card text-blue-700 shadow-[0_6px_20px_-10px_rgba(20,82,240,0.55)] ring-1 ring-blue-200'
            : 'text-slate-600 hover:text-slate-900 hover:bg-card/70'
        }`}
      >
        {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full vg-brand-gradient" />}
        <span
          className={`grid place-items-center w-7 h-7 rounded-lg shrink-0 transition ${
            active ? 'vg-brand-gradient text-white shadow-md shadow-blue-500/30' : 'bg-slate-100 text-slate-500 group-hover:text-blue-600'
          }`}
        >
          <Icon className="w-[15px] h-[15px]" />
        </span>
        {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
        {count > 0 &&
          (collapsed ? (
            <span
              className={`absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full text-[9px] font-bold grid place-items-center text-white ${
                urgent ? 'bg-rose-500' : 'bg-blue-600'
              }`}
            >
              {count}
            </span>
          ) : (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums ${
                urgent ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/40' : active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {count}
            </span>
          ))}
      </button>
    );
  };

  const renderPersona = (collapsed: boolean) => {
    if (currentUser.role === 'ADMIN') return null;
    const subtitle =
      currentUser.role === 'CITIZEN'
        ? registeredCitizen
          ? `${registeredCitizen.city}, ${registeredCitizen.state}`
          : 'Supporting Evidence Network'
        : currentUser.team;
    const name = currentUser.role === 'CITIZEN' && registeredCitizen ? registeredCitizen.fullName : currentUser.name;

    if (collapsed) {
      return (
        <div
          title={`${name} — ${subtitle}`}
          className={`mx-auto w-10 h-10 rounded-xl bg-gradient-to-br ${accent.tile} text-white text-xs font-bold grid place-items-center shadow-md`}
        >
          {accent.initials}
        </div>
      );
    }

    return (
      <div className="rounded-2xl p-3 bg-card border border-slate-200 flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accent.tile} text-white text-xs font-bold grid place-items-center shadow-md shrink-0`}>
          {accent.initials}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-slate-900 truncate">{name}</div>
          <div className="text-[10px] text-slate-500 font-medium truncate">{subtitle}</div>
        </div>
      </div>
    );
  };

  const renderFooter = (collapsed: boolean) => {
    if (currentUser.role !== 'ADMIN') {
      return (
        !collapsed && (
          <div className="rounded-2xl p-3 bg-card border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {currentUser.role === 'CITIZEN'
                ? 'Your identity is masked in all audit records.'
                : 'Evidence is EXIF geo-verified against the site geofence.'}
            </span>
          </div>
        )
      );
    }

    return (
      <div className="space-y-0.5">
        {ADMIN_FOOTER_NAV.map(item => renderItem(item, collapsed))}
        {!collapsed && (
          <div className="mt-2 rounded-2xl p-3 text-white relative overflow-hidden vg-hero !shadow-none">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">UN SDG Impact</div>
            <div className="mt-1 flex gap-1.5">
              {['3', '11', '13'].map(n => (
                <span key={n} className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-bold">
                  SDG {n}
                </span>
              ))}
            </div>
            <div className="mt-1.5 text-[10px] text-slate-300 leading-snug">Good health · Sustainable cities · Climate action</div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = (collapsed: boolean, inDrawer: boolean) => (
    <div className="flex flex-col h-full min-h-0">
      {/* Brand */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} pt-4 pb-3`}>
        {collapsed ? <BrandTile /> : <BrandLogo />}
        {inDrawer && (
          <button
            onClick={() => setIsMobileNavOpen?.(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className={`${collapsed ? 'px-2' : 'px-3'} pb-2`}>{renderPersona(collapsed)}</div>

      <nav className={`flex-1 min-h-0 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'} py-1 space-y-3`} aria-label="Primary">
        {groups.map(group => (
          <div key={group.label} className="space-y-0.5">
            {collapsed ? (
              <div className="mx-auto w-6 border-t border-slate-200 my-2" />
            ) : (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{group.label}</div>
            )}
            {group.items.map(item => renderItem(item, collapsed))}
          </div>
        ))}
      </nav>

      <div className={`${collapsed ? 'px-2' : 'px-3'} pt-2 pb-3 border-t border-slate-200/70`}>{renderFooter(collapsed)}</div>

      {!inDrawer && (
        <button
          onClick={() => setIsCollapsed(c => !c)}
          className="mx-auto mb-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-500 hover:text-slate-900 hover:bg-card transition"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: floating glass rail */}
      <aside
        className={`hidden md:flex flex-col shrink-0 vg-glass rounded-3xl overflow-hidden select-none transition-[width] duration-300 ease-out ${
          isCollapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        {renderContent(isCollapsed, false)}
      </aside>

      {/* Mobile drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 vg-scrim animate-in fade-in" onClick={() => setIsMobileNavOpen?.(false)} />
          <div className="relative w-72 max-w-[85vw] h-full bg-surface border-r border-slate-200 shadow-2xl animate-in slide-in-from-left">
            {renderContent(false, true)}
          </div>
        </div>
      )}
    </>
  );
};
