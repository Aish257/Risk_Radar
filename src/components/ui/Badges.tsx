import type { RiskLevel, RelocationPriority, FeasibilityStatus, RecommendedAction } from '@/types';

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; border: string; dot: string; label: string }> = {
  LOW: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-500', label: 'Low / Safe' },
  MODERATE: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-500', label: 'Moderate' },
  HIGH: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', dot: 'bg-orange-500', label: 'High' },
  CRITICAL: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-500', label: 'Critical / Red Zone' },
};

const PRIORITY_STYLES: Record<RelocationPriority, { bg: string; text: string; border: string; label: string }> = {
  IMMEDIATE: { bg: 'bg-red-500/15', text: 'text-red-300', border: 'border-red-500/40', label: 'Immediate' },
  SHORT_TERM: { bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/40', label: 'Short-term' },
  MEDIUM_TERM: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/40', label: 'Medium-term' },
  NONE: { bg: 'bg-slate-600/15', text: 'text-slate-400', border: 'border-slate-600/30', label: 'None' },
};

const FEASIBILITY_STYLES: Record<FeasibilityStatus, { bg: string; text: string; border: string; label: string }> = {
  FEASIBLE: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40', label: 'Feasible' },
  PARTIALLY_FEASIBLE: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/40', label: 'Partially Feasible' },
  NOT_FEASIBLE: { bg: 'bg-red-500/15', text: 'text-red-300', border: 'border-red-500/40', label: 'Not Feasible' },
};

const ACTION_STYLES: Record<RecommendedAction, { bg: string; text: string; border: string; label: string }> = {
  MONITOR: { bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/40', label: 'Monitor' },
  PREPARE: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/40', label: 'Prepare' },
  EVACUATE: { bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/40', label: 'Evacuate' },
  RELOCATE: { bg: 'bg-red-500/15', text: 'text-red-300', border: 'border-red-500/40', label: 'Relocate' },
};

export function RiskBadge({ level, size = 'sm' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
  const s = RISK_STYLES[level];
  const sizeClass = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${s.bg} ${s.text} ${s.border} ${sizeClass} font-medium`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: RelocationPriority }) {
  const s = PRIORITY_STYLES[priority];
  return (
    <span className={`inline-flex items-center rounded-md border ${s.bg} ${s.text} ${s.border} px-2 py-0.5 text-xs font-medium`}>
      {s.label}
    </span>
  );
}

export function FeasibilityBadge({ status }: { status: FeasibilityStatus }) {
  const s = FEASIBILITY_STYLES[status];
  return (
    <span className={`inline-flex items-center rounded-md border ${s.bg} ${s.text} ${s.border} px-2 py-0.5 text-xs font-medium`}>
      {s.label}
    </span>
  );
}

export function ActionBadge({ action }: { action: RecommendedAction }) {
  const s = ACTION_STYLES[action];
  return (
    <span className={`inline-flex items-center rounded-md border ${s.bg} ${s.text} ${s.border} px-2 py-0.5 text-xs font-medium`}>
      {s.label}
    </span>
  );
}

export function RiskScoreBar({ score }: { score: number }) {
  const color = score <= 30 ? 'bg-emerald-500' : score <= 50 ? 'bg-amber-500' : score <= 70 ? 'bg-orange-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
      <span className="w-8 text-right text-xs font-semibold text-slate-300">{score}</span>
    </div>
  );
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return '#10b981';
    case 'MODERATE': return '#f59e0b';
    case 'HIGH': return '#f97316';
    case 'CRITICAL': return '#ef4444';
  }
}

export function riskFillColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'rgba(16, 185, 129, 0.3)';
    case 'MODERATE': return 'rgba(245, 158, 11, 0.3)';
    case 'HIGH': return 'rgba(249, 115, 22, 0.35)';
    case 'CRITICAL': return 'rgba(239, 68, 68, 0.4)';
  }
}
