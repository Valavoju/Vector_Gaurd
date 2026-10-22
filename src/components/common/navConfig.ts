import {
  BarChart3,
  CheckSquare,
  ClipboardList,
  Cpu,
  Globe2,
  History,
  Layers,
  LayoutDashboard,
  Leaf,
  LucideIcon,
  MapPin,
  Settings,
  Smartphone,
  UploadCloud,
  Users,
} from 'lucide-react';

export type NavBadge = 'hotspots' | 'tasks' | 'verification' | 'myTasks';

export interface NavItem {
  /** DOM id; the demo guide and tests rely on these staying stable. */
  id: string;
  view: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Extra views that should highlight this item. */
  aliases?: string[];
  badge?: NavBadge;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const ADMIN_NAV: NavGroup[] = [
  {
    label: 'Operations',
    items: [
      { id: 'nav-dashboard-btn', view: 'DASHBOARD', label: 'Dashboard', description: 'Control room overview', icon: LayoutDashboard },
      { id: 'nav-gis-map-btn', view: 'RISK_MAP', label: 'Risk Map', description: 'GIS breeding-risk map', icon: MapPin },
      { id: 'nav-hotspots-btn', view: 'HOTSPOTS', label: 'Hotspots', description: 'Surveillance directory', icon: Layers, badge: 'hotspots' },
      { id: 'nav-tasks-btn', view: 'TASKS', label: 'Tasks', description: 'Dispatch & field teams', icon: ClipboardList, badge: 'tasks' },
      { id: 'nav-verification-btn', view: 'VERIFICATION', label: 'Verification', description: 'Audit field evidence', icon: CheckSquare, badge: 'verification' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'nav-analytics-btn', view: 'ANALYTICS', label: 'Analytics', description: 'KPIs & distribution', icon: BarChart3 },
      { id: 'nav-learning-btn', view: 'LEARNING', label: 'Learning', description: 'Model calibration loop', icon: History },
      { id: 'nav-data-ml-btn', view: 'DATA_ML', label: 'Data & ML', description: 'Database & pipeline', icon: Cpu, aliases: ['ARCHITECTURE'] },
    ],
  },
  {
    label: 'Administration',
    items: [
      { id: 'nav-users-btn', view: 'USERS', label: 'Users', description: 'Roles & personas', icon: Users },
      { id: 'nav-settings-btn', view: 'RESPONSIBLE_AI', label: 'Responsible AI', description: 'Privacy & boundaries', icon: Settings, aliases: ['SETTINGS'] },
    ],
  },
];

export const ADMIN_FOOTER_NAV: NavItem[] = [
  { id: 'nav-global-view-btn', view: 'GLOBAL_VIEW', label: 'Global View', description: 'India & worldwide GIS', icon: Globe2 },
  { id: 'nav-sdgs-btn', view: 'SDGS', label: 'Deployment & SDGs', description: 'SDG 3 · 11 · 13 economics', icon: Leaf, aliases: ['DEPLOYMENT'] },
];

export const FIELD_NAV: NavGroup[] = [
  {
    label: 'Field Operations',
    items: [
      { id: 'field-nav-my-tasks', view: 'MY_TASKS', label: 'My Assigned Tasks', description: 'Remediation queue', icon: ClipboardList, badge: 'myTasks', aliases: ['FIELD_OFFICER_PORTAL'] },
      { id: 'field-nav-active-inspection', view: 'ACTIVE_INSPECTION', label: 'Active Inspection', description: 'GPS camera & evidence', icon: Smartphone },
      { id: 'field-nav-history', view: 'HISTORY', label: 'Intervention History', description: 'Completed work', icon: History },
    ],
  },
];

export const CITIZEN_NAV: NavGroup[] = [
  {
    label: 'Citizen Portal',
    items: [
      { id: 'citizen-nav-submit', view: 'CITIZEN_PORTAL', label: 'Evidence Portal', description: 'Submit & track evidence', icon: UploadCloud, aliases: ['CITIZEN_SUBMIT'] },
    ],
  },
];

export const isNavItemActive = (item: NavItem, activeView: string) =>
  item.view === activeView || (item.aliases?.includes(activeView) ?? false);
