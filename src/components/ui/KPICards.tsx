import type { KPISummary } from '@/types';
import { AlertTriangle, Building2, Home, MapPin, ShieldCheck, Users } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
  sublabel?: string;
}

function KPICard({ label, value, icon, accent, sublabel }: KPICardProps) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 backdrop-blur-sm transition-all hover:border-slate-600/60 hover:bg-slate-800/60">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-100">{value}</p>
          {sublabel && <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function KPICards({ kpi }: { kpi: KPISummary }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <KPICard
        label="Districts"
        value={kpi.totalDistricts}
        icon={<MapPin className="h-5 w-5 text-sky-400" />}
        accent="bg-sky-500/10"
        sublabel="Kerala State"
      />
      <KPICard
        label="High/Critical Zones"
        value={kpi.highCriticalZones}
        icon={<AlertTriangle className="h-5 w-5 text-orange-400" />}
        accent="bg-orange-500/10"
        sublabel="Require action"
      />
      <KPICard
        label="Vulnerable Habitations"
        value={kpi.vulnerableHabitations}
        icon={<Home className="h-5 w-5 text-amber-400" />}
        accent="bg-amber-500/10"
        sublabel="At-risk settlements"
      />
      <KPICard
        label="Immediate Relocation"
        value={kpi.immediateRelocation}
        icon={<Users className="h-5 w-5 text-red-400" />}
        accent="bg-red-500/10"
        sublabel="Urgent priority"
      />
      <KPICard
        label="Safe Sites"
        value={kpi.availableSafeSites}
        icon={<ShieldCheck className="h-5 w-5 text-emerald-400" />}
        accent="bg-emerald-500/10"
        sublabel="Identified"
      />
      <KPICard
        label="Relocation Capacity"
        value={kpi.totalRelocationCapacity.toLocaleString()}
        icon={<Building2 className="h-5 w-5 text-teal-400" />}
        accent="bg-teal-500/10"
        sublabel="Total persons"
      />
    </div>
  );
}
