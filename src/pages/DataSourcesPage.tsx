import { DATA_SOURCES } from '@/data/habitations';
import { Database, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  Connected: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', dot: 'bg-emerald-400', label: 'Connected' },
  Demo: { bg: 'bg-amber-500/15', text: 'text-amber-300', dot: 'bg-amber-400', label: 'Demo / Simulated' },
  Available: { bg: 'bg-sky-500/15', text: 'text-sky-300', dot: 'bg-sky-400', label: 'Available' },
  Offline: { bg: 'bg-red-500/15', text: 'text-red-300', dot: 'bg-red-400', label: 'Offline' },
};

const FREQ_STYLES: Record<string, string> = {
  'Real-time': 'text-red-400',
  Dynamic: 'text-orange-400',
  Baseline: 'text-sky-400',
  Static: 'text-slate-400',
};

export function DataSourcesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-sky-400" />
        <h1 className="text-lg font-bold text-slate-100">Data Sources</h1>
        <span className="text-xs text-slate-400">— Official and open data feeds powering the RiskRadar platform</span>
      </div>

      {/* Architecture Info */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-200">Data Architecture</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Dynamic / Real-Time Data</p>
            <p className="mt-1 text-xs text-slate-400">IMD rainfall, weather, warnings, flood/water-level feeds, landslide alerts, field reports. Updated continuously via ingestion pipeline.</p>
          </div>
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">Static / Baseline Data</p>
            <p className="mt-1 text-xs text-slate-400">Terrain/DEM, elevation, population, roads, infrastructure, land-use, administrative boundaries, historical hazard layers, susceptibility maps.</p>
          </div>
        </div>
      </div>

      {/* Data Sources Table */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700/50 text-left text-slate-400">
                <th className="pb-2 pr-3 font-medium">Source</th>
                <th className="pb-2 pr-3 font-medium">Full Name</th>
                <th className="pb-2 pr-3 font-medium">Data Type</th>
                <th className="pb-2 pr-3 font-medium">Update Frequency</th>
                <th className="pb-2 pr-3 font-medium">Status</th>
                <th className="pb-2 pr-3 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map(src => {
                const status = STATUS_STYLES[src.status];
                const lastUpd = new Date(src.lastUpdated);
                return (
                  <tr key={src.id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        <span className="font-medium text-slate-200">{src.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-400">{src.fullName}</td>
                    <td className="py-2.5 pr-3 text-slate-300">{src.dataType}</td>
                    <td className={`py-2.5 pr-3 font-medium ${FREQ_STYLES[src.updateFrequency]}`}>{src.updateFrequency}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                        {src.status === 'Connected' && <CheckCircle className="h-3 w-3" />}
                        {src.status === 'Demo' && <AlertCircle className="h-3 w-3" />}
                        {src.status === 'Available' && <Clock className="h-3 w-3" />}
                        {status.label}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-400">
                      {src.lastUpdated.startsWith('2011') ? 'Census 2011' : lastUpd.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source Descriptions */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {DATA_SOURCES.map(src => (
          <div key={src.id} className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-200">{src.name}</p>
              <span className="text-xs text-slate-500">{src.fullName}</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">{src.description}</p>
          </div>
        ))}
      </div>

      {/* Ingestion Pipeline */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-200 flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-sky-400" /> Real-Time Data Ingestion Pipeline
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['New Hazard Data', 'Data Ingestion', 'Validation & Cleaning', 'Feature Preparation', 'GIS Processing', 'AI Risk Inference', 'Updated Risk Score', 'Updated Red-Zone Map', 'Updated Habitation Priority', 'Updated Recommendations'].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`rounded-lg border px-3 py-2 ${i === 5 ? 'border-purple-500/30 bg-purple-500/10 text-purple-300' : 'border-slate-600/40 bg-slate-700/30 text-slate-300'}`}>
                {step}
              </div>
              {i < arr.length - 1 && <span className="text-slate-500">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          The trained ML model is NOT retrained on each new data arrival. Incoming hazard data updates input features, and the pre-trained model performs new inference — producing updated risk scores, classifications, and recommendations.
        </p>
      </div>
    </div>
  );
}
