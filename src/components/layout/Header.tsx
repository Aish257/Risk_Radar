import { Radar, Radio, Clock } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  liveFeedActive: boolean;
}

export function Header({ lastUpdated, liveFeedActive }: HeaderProps) {
  const time = new Date(lastUpdated).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

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
            <p className="text-xs text-slate-400">
              AI-Based Hazard Red-Zone &amp; Relocation Planning · Kerala Pilot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <Clock className="h-3.5 w-3.5" />
            <span>Last Updated: <span className="font-medium text-slate-300">{time}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full ${liveFeedActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs font-medium text-slate-300">
              {liveFeedActive ? 'SYSTEM ACTIVE' : 'STANDBY'}
            </span>
            <Radio className={`h-3.5 w-3.5 ${liveFeedActive ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
        </div>
      </div>
    </header>
  );
}
