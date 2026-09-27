import { useState } from 'react';
import type { Habitation } from '@/types';
import { RiskBadge, PriorityBadge, ActionBadge, RiskScoreBar, riskColor } from '@/components/ui/Badges';
import { BarChart3, ArrowUpDown } from 'lucide-react';

interface HabitationRankingPageProps {
  habitations: Habitation[];
  onHabitationClick: (h: Habitation) => void;
}

type SortKey = 'riskScore' | 'population' | 'relocationPriority' | 'districtName' | 'vulnerabilityScore';

const PRIORITY_ORDER: Record<string, number> = { IMMEDIATE: 0, SHORT_TERM: 1, MEDIUM_TERM: 2, NONE: 3 };

export function HabitationRankingPage({ habitations, onHabitationClick }: HabitationRankingPageProps) {
  const [sortKey, setSortKey] = useState<SortKey>('riskScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  const sorted = [...habitations]
    .filter(h => !filterPriority || h.relocationPriority === filterPriority)
    .sort((a, b) => {
      let cmp: number;
      if (sortKey === 'relocationPriority') {
        cmp = PRIORITY_ORDER[a.relocationPriority] - PRIORITY_ORDER[b.relocationPriority];
      } else if (sortKey === 'population') {
        cmp = a.population - b.population;
      } else {
        cmp = (a[sortKey] as string | number).toString().localeCompare((b[sortKey] as string | number).toString());
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      onClick={() => handleSort(k)}
      className="cursor-pointer select-none pb-2 pr-3 font-medium hover:text-slate-200"
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === k ? 'text-sky-400' : 'text-slate-600'}`} />
      </span>
    </th>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-amber-400" />
        <h1 className="text-lg font-bold text-slate-100">Habitation Ranking</h1>
        <span className="text-xs text-slate-400">— Vulnerability & relocation priority assessment</span>
      </div>

      {/* Priority Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterPriority(null)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${!filterPriority ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:bg-slate-700/30'}`}
        >
          All Priorities
        </button>
        {['IMMEDIATE', 'SHORT_TERM', 'MEDIUM_TERM', 'NONE'].map(p => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filterPriority === p ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-slate-800/40 text-slate-400 border border-slate-700/40 hover:bg-slate-700/30'}`}
          >
            {p === 'IMMEDIATE' ? 'Immediate' : p === 'SHORT_TERM' ? 'Short-term' : p === 'MEDIUM_TERM' ? 'Medium-term' : 'None'}
          </button>
        ))}
      </div>

      {/* Ranking Table */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700/50 text-left text-slate-400">
                <th className="pb-2 pr-3 font-medium">#</th>
                <SortHeader label="Habitation" k="districtName" />
                <SortHeader label="District" k="districtName" />
                <SortHeader label="Risk Score" k="riskScore" />
                <th className="pb-2 pr-3 font-medium">Risk Level</th>
                <SortHeader label="Population" k="population" />
                <SortHeader label="Vulnerability" k="vulnerabilityScore" />
                <SortHeader label="Priority" k="relocationPriority" />
                <th className="pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((h, i) => (
                <tr
                  key={h.id}
                  onClick={() => onHabitationClick(h)}
                  className="cursor-pointer border-b border-slate-700/30 transition-colors hover:bg-slate-700/20"
                >
                  <td className="py-2 pr-3 text-slate-500">{i + 1}</td>
                  <td className="py-2 pr-3 font-medium text-slate-200">{h.name}</td>
                  <td className="py-2 pr-3 text-slate-400">{h.districtName}</td>
                  <td className="py-2 pr-3">
                    <div className="w-24">
                      <RiskScoreBar score={h.riskScore} />
                    </div>
                  </td>
                  <td className="py-2 pr-3"><RiskBadge level={h.riskLevel} /></td>
                  <td className="py-2 pr-3 text-slate-300">{h.population.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-slate-300">{h.vulnerabilityScore}</td>
                  <td className="py-2 pr-3"><PriorityBadge priority={h.relocationPriority} /></td>
                  <td className="py-2"><ActionBadge action={h.recommendedAction} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Immediate Relocation', count: habitations.filter(h => h.relocationPriority === 'IMMEDIATE').length, color: 'text-red-400' },
          { label: 'Short-term Relocation', count: habitations.filter(h => h.relocationPriority === 'SHORT_TERM').length, color: 'text-orange-400' },
          { label: 'Medium-term Relocation', count: habitations.filter(h => h.relocationPriority === 'MEDIUM_TERM').length, color: 'text-amber-400' },
          { label: 'No Relocation Needed', count: habitations.filter(h => h.relocationPriority === 'NONE').length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className={`mt-1.5 text-2xl font-bold ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
