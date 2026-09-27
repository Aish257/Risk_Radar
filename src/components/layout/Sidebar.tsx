import {
  LayoutDashboard, Map, BarChart3, ShieldCheck,
  Truck, Database, FileText, Radar,
  LogOut, User as UserIcon, Shield, ClipboardCheck,
} from 'lucide-react';
import type { UserProfile } from '@/lib/supabaseClient';

export type PageKey =
  | 'dashboard'
  | 'risk-map'
  | 'habitation-ranking'
  | 'safe-sites'
  | 'relocation-planning'
  | 'scenario-analysis'
  | 'field-validation'
  | 'data-sources'
  | 'reports';

interface SidebarProps {
  active: PageKey;
  onNavigate: (page: PageKey) => void;
  collapsed: boolean;
  profile: UserProfile | null;
  onSignOut: () => void;
}

interface NavItem {
  key: PageKey;
  label: string;
  icon: React.ReactNode;
  roles?: UserProfile['role'][];
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" />, roles: ['authority'] },
  { key: 'risk-map', label: 'Risk Map', icon: <Map className="h-4.5 w-4.5" /> },
  { key: 'habitation-ranking', label: 'Habitation Ranking', icon: <BarChart3 className="h-4.5 w-4.5" />, roles: ['authority'] },
  { key: 'safe-sites', label: 'Safe Sites', icon: <ShieldCheck className="h-4.5 w-4.5" /> },
  { key: 'relocation-planning', label: 'Relocation Planning', icon: <Truck className="h-4.5 w-4.5" />, roles: ['authority'] },
  { key: 'scenario-analysis', label: 'Scenario Analysis', icon: <Radar className="h-4.5 w-4.5" />, roles: ['authority'] },
  { key: 'field-validation', label: 'Field Validation', icon: <ClipboardCheck className="h-4.5 w-4.5" /> },
  { key: 'data-sources', label: 'Data Sources', icon: <Database className="h-4.5 w-4.5" />, roles: ['authority'] },
  { key: 'reports', label: 'Reports', icon: <FileText className="h-4.5 w-4.5" /> },
];

const STATE_LABELS: Record<string, string> = {
  kerala: 'Kerala',
  uttarakhand: 'Uttarakhand',
  odisha: 'Odisha',
};

export function Sidebar({ active, onNavigate, collapsed, profile, onSignOut }: SidebarProps) {
  const role = profile?.role ?? 'citizen';
  const isAuthority = role === 'authority';
  const isFieldOfficer = role === 'field_officer';

  const visibleItems = NAV_ITEMS.filter(item =>
    !item.roles || item.roles.includes(role)
  );

  const roleIcon = isAuthority
    ? <Shield className="h-3.5 w-3.5 text-emerald-400" />
    : isFieldOfficer
    ? <ClipboardCheck className="h-3.5 w-3.5 text-amber-400" />
    : <UserIcon className="h-3.5 w-3.5 text-sky-400" />;

  const roleIconBg = isAuthority
    ? 'bg-emerald-500/15'
    : isFieldOfficer
    ? 'bg-amber-500/15'
    : 'bg-sky-500/15';

  const roleLabel = isAuthority
    ? `Authority${profile?.jurisdiction_level === 'state' ? ' · State' : profile?.jurisdiction_district ? ` · ${profile.jurisdiction_district}` : ''}`
    : isFieldOfficer
    ? `Field Officer${profile?.assigned_area ? ` · ${profile.assigned_area}` : ''}`
    : 'Citizen';

  const stateLabel = profile?.state ? STATE_LABELS[profile.state] : null;

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} flex shrink-0 flex-col border-r border-slate-700/50 bg-slate-900/50 transition-all duration-200`}>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {visibleItems.map(item => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active === item.key
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/20'
                : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 border border-transparent'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Info & Sign Out */}
      <div className="border-t border-slate-700/50 p-3">
        {!collapsed && profile && (
          <div className="mb-2 rounded-lg bg-slate-800/50 p-2.5">
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full ${roleIconBg}`}>
                {roleIcon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-200">{profile.full_name}</p>
                <p className="truncate text-[10px] text-slate-500">{roleLabel}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        {!collapsed && (
          <div className="mt-2 rounded-lg bg-slate-800/30 p-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Region</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">{stateLabel ?? 'Kerala, India'}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
