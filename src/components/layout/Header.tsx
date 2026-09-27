import { Radar, Radio, Clock, MapPin, ChevronRight } from 'lucide-react';
import type { UserProfile, AppState } from '@/lib/supabaseClient';

interface HeaderProps {
  lastUpdated: string;
  liveFeedActive: boolean;
  profile: UserProfile | null;
  activeState: AppState;
  onStateChange: (state: AppState) => void;
}

const STATE_LABELS: Record<AppState, string> = {
  kerala: 'Kerala',
  uttarakhand: 'Uttarakhand',
  odisha: 'Odisha',
};

const STATE_OPTIONS: { value: AppState; label: string }[] = [
  { value: 'kerala', label: 'Kerala' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'odisha', label: 'Odisha' },
];

const DISTRICT_LABELS: Record<string, string> = {
  kasaragod: 'Kasaragod', kannur: 'Kannur', kozhikode: 'Kozhikode',
  wayanad: 'Wayanad', malappuram: 'Malappuram', palakkad: 'Palakkad',
  thrissur: 'Thrissur', ernakulam: 'Ernakulam', idukki: 'Idukki',
  kottayam: 'Kottayam', alappuzha: 'Alappuzha', pathanamthitta: 'Pathanamthitta',
  kollam: 'Kollam', thiruvananthapuram: 'Thiruvananthapuram',
};

export function Header({ lastUpdated, liveFeedActive, profile, activeState, onStateChange }: HeaderProps) {
  const time = new Date(lastUpdated).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const isAuthority = profile?.role === 'authority';
  const isFieldOfficer = profile?.role === 'field_officer';

  // Build jurisdiction display from profile
  const stateLabel = profile?.state ? STATE_LABELS[profile.state] : null;
  const districtLabel = profile?.jurisdiction_district ? DISTRICT_LABELS[profile.jurisdiction_district] ?? profile.jurisdiction_district : null;

  let jurisdictionText: string | null = null;
  if (isAuthority && profile?.jurisdiction_level === 'state') {
    jurisdictionText = stateLabel ? `${stateLabel} | State Authority` : null;
  } else if (isAuthority && profile?.jurisdiction_level === 'district') {
    jurisdictionText = stateLabel && districtLabel ? `${stateLabel} | ${districtLabel} | District Authority` : null;
  } else if (isFieldOfficer) {
    const areaLabel = profile?.assigned_area ?? '';
    jurisdictionText = stateLabel && districtLabel
      ? `${stateLabel} | ${districtLabel} | Field Officer${areaLabel ? ` · ${areaLabel}` : ''}`
      : stateLabel
        ? `${stateLabel} | Field Officer${areaLabel ? ` · ${areaLabel}` : ''}`
        : null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-2.5 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/20">
            <Radar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-100">
              RiskRadar
            </h1>
            <p className="hidden text-xs text-slate-400 sm:block">
              AI-Based Hazard Red-Zone &amp; Relocation Planning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Jurisdiction display — from profile, no manual selection */}
          {jurisdictionText && (
            <div className="hidden items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/50 px-2.5 py-1 sm:flex">
              <MapPin className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-xs font-medium text-slate-200">{jurisdictionText}</span>
            </div>
          )}

          {/* State-level authority can switch states to view cross-state data */}
          {isAuthority && profile?.jurisdiction_level === 'state' && (
            <div className="flex items-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/50 px-1.5 py-1">
              <ChevronRight className="h-3 w-3 text-slate-500" />
              <select
                value={activeState}
                onChange={e => onStateChange(e.target.value as AppState)}
                className="bg-transparent text-xs font-medium text-slate-300 focus:outline-none cursor-pointer"
                title="View data for another state"
              >
                {STATE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-slate-800">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="hidden items-center gap-2 text-xs text-slate-400 lg:flex">
            <Clock className="h-3.5 w-3.5" />
            <span>Last Updated: <span className="font-medium text-slate-300">{time}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full ${liveFeedActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="hidden text-xs font-medium text-slate-300 sm:inline">
              {liveFeedActive ? 'SYSTEM ACTIVE' : 'STANDBY'}
            </span>
            <Radio className={`h-3.5 w-3.5 ${liveFeedActive ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
        </div>
      </div>
    </header>
  );
}
