import type { MapLayerKey, MapLayerConfig } from '@/types';
import { CloudRain, Waves, Mountain, Home, ShieldCheck, Route, Hospital, School, Droplets, Layers } from 'lucide-react';
import { riskColor } from '@/components/ui/Badges';

const LAYER_CONFIGS: MapLayerConfig[] = [
  { key: 'riskZones', label: 'Risk Zones', icon: 'alert', enabled: true },
  { key: 'rainfall', label: 'Rainfall', icon: 'rain', enabled: true },
  { key: 'flood', label: 'Flood Hazard', icon: 'flood', enabled: false },
  { key: 'landslide', label: 'Landslide Susceptibility', icon: 'mountain', enabled: false },
  { key: 'habitations', label: 'Vulnerable Habitations', icon: 'home', enabled: true },
  { key: 'safeSites', label: 'Safe Sites', icon: 'shield', enabled: true },
  { key: 'roads', label: 'Roads', icon: 'road', enabled: false },
  { key: 'hospitals', label: 'Hospitals', icon: 'hospital', enabled: false },
  { key: 'schools', label: 'Schools', icon: 'school', enabled: false },
  { key: 'waterBodies', label: 'Water Bodies', icon: 'water', enabled: false },
];

const ICONS: Record<string, React.ReactNode> = {
  alert: <Layers className="h-4 w-4" />,
  rain: <CloudRain className="h-4 w-4" />,
  flood: <Waves className="h-4 w-4" />,
  mountain: <Mountain className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  shield: <ShieldCheck className="h-4 w-4" />,
  road: <Route className="h-4 w-4" />,
  hospital: <Hospital className="h-4 w-4" />,
  school: <School className="h-4 w-4" />,
  water: <Droplets className="h-4 w-4" />,
};

export function MapLegend() {
  const levels: { level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'; label: string }[] = [
    { level: 'LOW', label: 'Low / Safe' },
    { level: 'MODERATE', label: 'Moderate' },
    { level: 'HIGH', label: 'High' },
    { level: 'CRITICAL', label: 'Critical / Red Zone' },
  ];
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Map Legend</p>
      <div className="space-y-1.5">
        {levels.map(l => (
          <div key={l.level} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: riskColor(l.level), opacity: 0.7 }} />
            <span className="text-xs text-slate-300">{l.label}</span>
          </div>
        ))}
        <div className="my-1 border-t border-slate-700" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
          <span className="text-xs text-slate-300">Safe Relocation Site</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#f43f5e' }} />
          <span className="text-xs text-slate-300">Hospital</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#fbbf24' }} />
          <span className="text-xs text-slate-300">School</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: '#0ea5e9' }} />
          <span className="text-xs text-slate-300">Water Body</span>
        </div>
      </div>
    </div>
  );
}

interface LayerControlsProps {
  layers: Record<MapLayerKey, boolean>;
  onToggle: (key: MapLayerKey) => void;
}

export function LayerControls({ layers, onToggle }: LayerControlsProps) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/60 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Map Layers</p>
      <div className="space-y-1">
        {LAYER_CONFIGS.map(config => (
          <label
            key={config.key}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-300 transition-colors hover:bg-slate-700/40"
          >
            <input
              type="checkbox"
              checked={layers[config.key]}
              onChange={() => onToggle(config.key)}
              className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-700 text-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <span className="text-slate-400">{ICONS[config.icon]}</span>
            <span>{config.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function getDefaultLayers(): Record<MapLayerKey, boolean> {
  return LAYER_CONFIGS.reduce((acc, c) => {
    acc[c.key] = c.enabled;
    return acc;
  }, {} as Record<MapLayerKey, boolean>);
}
