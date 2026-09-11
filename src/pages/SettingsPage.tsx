import { Settings, Info, MapPin, Cpu, Database, AlertTriangle, Shield, User as UserIcon } from 'lucide-react';
import type { UserProfile } from '@/lib/supabaseClient';

interface SettingsPageProps {
  liveFeedActive: boolean;
  onToggleLiveFeed: () => void;
  profile: UserProfile | null;
}

export function SettingsPage({ liveFeedActive, onToggleLiveFeed, profile }: SettingsPageProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-slate-400" />
        <h1 className="text-lg font-bold text-slate-100">Settings</h1>
        <span className="text-xs text-slate-400">— System configuration and information</span>
      </div>

      {/* Account Info */}
      {profile && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-200 flex items-center gap-2">
            {profile.role === 'authority' ? <Shield className="h-4 w-4 text-emerald-400" /> : <UserIcon className="h-4 w-4 text-sky-400" />}
            Account Information
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
              <p className="text-xs text-slate-400">Name</p>
              <p className="mt-1 text-sm font-medium text-slate-200">{profile.full_name}</p>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
              <p className="text-xs text-slate-400">Email</p>
              <p className="mt-1 text-sm font-medium text-slate-200">{profile.email}</p>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
              <p className="text-xs text-slate-400">Role</p>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {profile.role === 'authority' ? 'Authority' : 'Citizen'}
                {profile.role === 'authority' && profile.jurisdiction_level && (
                  <span className="text-xs text-slate-400"> · {profile.jurisdiction_level === 'state' ? 'State Level' : profile.jurisdiction_district ?? 'District'}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Info className="h-4 w-4 text-sky-400" /> System Information
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
            <p className="text-xs text-slate-400">Application</p>
            <p className="mt-1 text-sm font-medium text-slate-200">RiskRadar v1.0.0 (MVP)</p>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
            <p className="text-xs text-slate-400">Pilot Region</p>
            <p className="mt-1 text-sm font-medium text-slate-200">Kerala, India (14 Districts)</p>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
            <p className="text-xs text-slate-400">Problem Statement</p>
            <p className="mt-1 text-sm font-medium text-slate-200">ID: 26191 · Disaster Management</p>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
            <p className="text-xs text-slate-400">Event</p>
            <p className="mt-1 text-sm font-medium text-slate-200">Smart India Hackathon 2026</p>
          </div>
        </div>
      </div>

      {/* Live Feed Toggle */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Real-Time Data Feed</h2>
        <div className="flex items-center justify-between rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
          <div>
            <p className="text-sm font-medium text-slate-200">Simulated Live Hazard Feed</p>
            <p className="mt-0.5 text-xs text-slate-400">
              When enabled, the system periodically fetches simulated hazard data and recalculates risk scores.
              In production, this connects to IMD / CWC / KSDMA APIs.
            </p>
          </div>
          <button
            onClick={onToggleLiveFeed}
            className={`relative h-6 w-11 rounded-full transition-colors ${liveFeedActive ? 'bg-emerald-500' : 'bg-slate-600'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${liveFeedActive ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Architecture Notes */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">Architecture & Technology Stack</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
              <Cpu className="h-3.5 w-3.5" /> AI Risk Engine
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Prototype weighted-feature scoring engine. Structured for replacement with XGBoost / Random Forest once labelled historical disaster data is available. Includes SHAP-style explainability layer.
            </p>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <MapPin className="h-3.5 w-3.5" /> GIS Processing
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Leaflet + OpenStreetMap basemap with GeoJSON layers. Architecture supports importing actual GIS GeoJSON/Shapefile layers. Production: GeoPandas, Rasterio, GDAL, PostGIS.
            </p>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Database className="h-3.5 w-3.5" /> Backend & Database
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Production architecture: FastAPI backend with PostgreSQL/PostGIS. Supabase for MVP data persistence. API endpoints designed for seamless backend integration.
            </p>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-purple-400">
              <AlertTriangle className="h-3.5 w-3.5" /> Data Disclaimer
            </p>
            <p className="mt-1 text-xs text-slate-400">
              All habitations, risk scores, and hazard data in this MVP are demo/simulated. Not for operational disaster management use. Official data integration requires connecting to IMD, KSDMA, GSI, and CWC APIs.
            </p>
          </div>
        </div>
      </div>

      {/* Scalability */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-200">Scalability</h2>
        <p className="text-xs text-slate-400">
          The MVP focuses on Kerala state with emphasis on Wayanad district. The data architecture is structured so additional Indian states and districts can be added by extending the district, habitation, and safe-site datasets — no frontend changes required.
        </p>
      </div>
    </div>
  );
}
