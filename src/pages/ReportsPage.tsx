import { useState } from 'react';
import type { Habitation, SafeSite, HazardUpdate } from '@/types';
import { KERALA_DISTRICTS } from '@/data/districts';
import { RiskBadge, PriorityBadge, FeasibilityBadge, riskColor } from '@/components/ui/Badges';
import type { UserProfile } from '@/lib/supabaseClient';
import { FileText, Printer, CheckCircle, Download, FileSpreadsheet, Lock } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ReportsPageProps {
  habitations: Habitation[];
  safeSites: SafeSite[];
  hazardUpdate: HazardUpdate;
  lastUpdated: string;
  profile: UserProfile | null;
}

export function ReportsPage({ habitations, safeSites, hazardUpdate, lastUpdated, profile }: ReportsPageProps) {
  const [generated, setGenerated] = useState(false);
  const isAuthority = profile?.role === 'authority';

  const criticalZones = habitations.filter(h => h.riskLevel === 'CRITICAL');
  const highZones = habitations.filter(h => h.riskLevel === 'HIGH');
  const immediateRelocation = habitations.filter(h => h.relocationPriority === 'IMMEDIATE');
  const shortTermRelocation = habitations.filter(h => h.relocationPriority === 'SHORT_TERM');
  const feasibleSites = safeSites.filter(s => s.feasibility === 'FEASIBLE');
  const totalCapacity = safeSites.reduce((sum, s) => sum + s.availableCapacity, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Risk Status Summary
    const summaryData = [
      ['RiskRadar — Disaster Management Summary Report'],
      ['AI-Based Hazard Red-Zone & Relocation Planning — Kerala Pilot'],
      [],
      ['Generated', new Date().toLocaleString('en-IN')],
      ['Data Last Updated', new Date(lastUpdated).toLocaleString('en-IN')],
      ['Data Type', 'Demo / Simulated Data'],
      [],
      ['METRIC', 'VALUE'],
      ['Total Districts', KERALA_DISTRICTS.length],
      ['Critical (Red Zone)', criticalZones.length],
      ['High Risk Zones', highZones.length],
      ['Overall Risk Score', `${hazardUpdate.overallRisk}/100 (${hazardUpdate.overallRiskLevel})`],
      ['Immediate Relocation Required', immediateRelocation.length],
      ['Short-term Relocation', shortTermRelocation.length],
      ['Total Relocation Capacity', totalCapacity.toLocaleString()],
      ['Feasible Safe Sites', feasibleSites.length],
      ['People Needing Relocation', immediateRelocation.reduce((s, h) => s + h.population, 0).toLocaleString()],
      [],
      ['CURRENT HAZARD CONDITIONS'],
      ['Rainfall (24h)', `${hazardUpdate.rainfall_24h_mm} mm`],
      ['Rainfall (1h)', `${hazardUpdate.rainfall_1h_mm} mm`],
      ['Temperature', `${hazardUpdate.temperature_c} °C`],
      ['Humidity', `${hazardUpdate.humidity_pct}%`],
      ['Wind Speed', `${hazardUpdate.windSpeed_kmph} km/h`],
      ['Flood Risk', hazardUpdate.floodRisk],
      ['Landslide Risk', hazardUpdate.landslideRisk],
      ['Weather Warning', hazardUpdate.weatherWarning],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

    // Sheet 2: All Habitations Risk Data
    const habData = habitations.map(h => ({
      'Habitation': h.name,
      'District': h.districtName,
      'Risk Score': h.riskScore,
      'Risk Level': h.riskLevel,
      'Vulnerability Score': h.vulnerabilityScore,
      'Population': h.population,
      'Rainfall (mm)': Math.round(h.rainfall_mm),
      'Flood Susceptibility': h.floodSusceptibility,
      'Landslide Susceptibility': h.landslideSusceptibility,
      'Elevation (m)': h.elevation_m,
      'Slope (deg)': h.slope_deg,
      'Road Accessibility': h.roadAccessibility,
      'Infrastructure Score': h.infrastructureScore,
      'Relocation Priority': h.relocationPriority.replace('_', '-'),
      'Recommended Action': h.recommendedAction,
      'Historical Events': h.historicalEvents,
    }));
    const ws2 = XLSX.utils.json_to_sheet(habData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Habitations');

    // Sheet 3: Safe Sites
    const siteData = safeSites.map(s => ({
      'Site Name': s.name,
      'District': s.districtName,
      'Suitability Score': s.suitabilityScore,
      'Estimated Capacity': s.estimatedCapacity,
      'Existing Population': s.existingPopulation,
      'Available Capacity': s.availableCapacity,
      'Flood Risk': s.floodRisk,
      'Landslide Risk': s.landslideRisk,
      'Slope (deg)': s.slope_deg,
      'Elevation (m)': s.elevation_m,
      'Road Accessibility': s.roadAccessibility,
      'Hospital Distance (km)': s.hospitalDistance_km,
      'School Distance (km)': s.schoolDistance_km,
      'Water Availability': s.waterAvailability,
      'Hazard Exposure': s.hazardExposure,
      'Feasibility': s.feasibility.replace('_', ' '),
      'Usable Land (ha)': s.usableLand_ha,
    }));
    const ws3 = XLSX.utils.json_to_sheet(siteData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Safe Sites');

    // Sheet 4: Critical / Immediate Relocation
    const relocData = [...immediateRelocation, ...shortTermRelocation].map(h => ({
      'Habitation': h.name,
      'District': h.districtName,
      'Population': h.population,
      'Risk Score': h.riskScore,
      'Risk Level': h.riskLevel,
      'Priority': h.relocationPriority.replace('_', '-'),
      'Action': h.recommendedAction,
      'Vulnerability Score': h.vulnerabilityScore,
    }));
    const ws4 = XLSX.utils.json_to_sheet(relocData);
    XLSX.utils.book_append_sheet(wb, ws4, 'Relocation Needs');

    const fileName = `RiskRadar_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-sky-400" />
          <h1 className="text-lg font-bold text-slate-100">Reports</h1>
          <span className="text-xs text-slate-400">— Generate summary reports for authorities</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setGenerated(true)}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
          >
            <CheckCircle className="h-4 w-4" /> Generate Report
          </button>
          {generated && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg border border-slate-600/40 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/30"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
          )}
          {isAuthority ? (
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              <FileSpreadsheet className="h-4 w-4" /> Download Excel
            </button>
          ) : (
            <button
              disabled
              title="Only authorities can download Excel reports"
              className="flex items-center gap-2 rounded-lg border border-slate-700/40 px-4 py-2 text-sm text-slate-500"
            >
              <Lock className="h-4 w-4" /> Excel (Authority Only)
            </button>
          )}
        </div>
      </div>

      {!generated ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/40">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">Click "Generate Report" to create a comprehensive summary report.</p>
            <p className="mt-1 text-xs text-slate-500">The report can be printed or saved as PDF{isAuthority ? ', or downloaded as Excel.' : '.'}</p>
            {!isAuthority && <p className="mt-1 text-xs text-slate-600">Excel download is available for authority accounts only.</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-slate-700/50 bg-white p-6 text-slate-900 print:border-none print:p-0">
          {/* Report Header */}
          <div className="border-b-2 border-slate-300 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">RiskRadar — Disaster Management Summary Report</h1>
                <p className="mt-1 text-sm text-slate-600">AI-Based Hazard Red-Zone & Relocation Planning · Kerala Pilot</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>Generated: {new Date().toLocaleString('en-IN')}</p>
                <p>Data Last Updated: {new Date(lastUpdated).toLocaleString('en-IN')}</p>
                <p className="mt-1 font-medium text-amber-600">Demo / Simulated Data</p>
              </div>
            </div>
          </div>

          {/* 1. Current Risk Status */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-slate-800">1. Current Risk Status</h2>
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Total Districts</p>
                <p className="text-xl font-bold text-slate-800">{KERALA_DISTRICTS.length}</p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-xs text-slate-500">Critical (Red Zone)</p>
                <p className="text-xl font-bold text-red-600">{criticalZones.length}</p>
              </div>
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                <p className="text-xs text-slate-500">High Risk</p>
                <p className="text-xl font-bold text-orange-600">{highZones.length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Overall Risk Score</p>
                <p className="text-xl font-bold" style={{ color: riskColor(hazardUpdate.overallRiskLevel) }}>{hazardUpdate.overallRisk}/100</p>
              </div>
            </div>
          </section>

          {/* 2. Red-Zone Areas */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-slate-800">2. Red-Zone Areas (Critical)</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-left text-xs text-slate-500">
                  <th className="pb-1 pr-3">Habitation</th>
                  <th className="pb-1 pr-3">District</th>
                  <th className="pb-1 pr-3">Risk Score</th>
                  <th className="pb-1 pr-3">Population</th>
                  <th className="pb-1 pr-3">Priority</th>
                </tr>
              </thead>
              <tbody>
                {criticalZones.map(h => (
                  <tr key={h.id} className="border-b border-slate-100">
                    <td className="py-1.5 pr-3 font-medium">{h.name}</td>
                    <td className="py-1.5 pr-3 text-slate-600">{h.districtName}</td>
                    <td className="py-1.5 pr-3 font-bold text-red-600">{h.riskScore}</td>
                    <td className="py-1.5 pr-3">{h.population.toLocaleString()}</td>
                    <td className="py-1.5 pr-3">{h.relocationPriority.replace('_', '-')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 3. Immediate Relocation Requirements */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-slate-800">3. Immediate Relocation Requirements</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-left text-xs text-slate-500">
                  <th className="pb-1 pr-3">Habitation</th>
                  <th className="pb-1 pr-3">District</th>
                  <th className="pb-1 pr-3">Population</th>
                  <th className="pb-1 pr-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {immediateRelocation.map(h => (
                  <tr key={h.id} className="border-b border-slate-100">
                    <td className="py-1.5 pr-3 font-medium">{h.name}</td>
                    <td className="py-1.5 pr-3 text-slate-600">{h.districtName}</td>
                    <td className="py-1.5 pr-3">{h.population.toLocaleString()}</td>
                    <td className="py-1.5 pr-3 font-medium text-red-600">{h.recommendedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-slate-500">
              Total immediate relocation: {immediateRelocation.length} habitations, {immediateRelocation.reduce((s, h) => s + h.population, 0).toLocaleString()} people.
              Short-term: {shortTermRelocation.length} habitations.
            </p>
          </section>

          {/* 4. Recommended Safe Sites */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-slate-800">4. Recommended Safe Sites</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-left text-xs text-slate-500">
                  <th className="pb-1 pr-3">Site</th>
                  <th className="pb-1 pr-3">District</th>
                  <th className="pb-1 pr-3">Suitability</th>
                  <th className="pb-1 pr-3">Available Capacity</th>
                  <th className="pb-1 pr-3">Feasibility</th>
                </tr>
              </thead>
              <tbody>
                {feasibleSites.map(s => (
                  <tr key={s.id} className="border-b border-slate-100">
                    <td className="py-1.5 pr-3 font-medium">{s.name}</td>
                    <td className="py-1.5 pr-3 text-slate-600">{s.districtName}</td>
                    <td className="py-1.5 pr-3 font-bold text-emerald-600">{s.suitabilityScore}/100</td>
                    <td className="py-1.5 pr-3">{s.availableCapacity.toLocaleString()}</td>
                    <td className="py-1.5 pr-3 text-emerald-600">{s.feasibility.replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 5. Carrying Capacity Summary */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-slate-800">5. Carrying Capacity Summary</h2>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Total Relocation Capacity</p>
                <p className="text-xl font-bold text-slate-800">{totalCapacity.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Feasible Sites</p>
                <p className="text-xl font-bold text-emerald-600">{feasibleSites.length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">People Needing Relocation</p>
                <p className="text-xl font-bold text-red-600">{immediateRelocation.reduce((s, h) => s + h.population, 0).toLocaleString()}</p>
              </div>
            </div>
          </section>

          {/* 6. Current Hazard Conditions */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-slate-800">6. Current Hazard Conditions</h2>
            <div className="grid grid-cols-3 gap-3 text-sm sm:grid-cols-6">
              <div className="rounded border border-slate-200 bg-slate-50 p-2">
                <p className="text-xs text-slate-500">Rainfall (24h)</p>
                <p className="font-bold">{hazardUpdate.rainfall_24h_mm} mm</p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 p-2">
                <p className="text-xs text-slate-500">Temperature</p>
                <p className="font-bold">{hazardUpdate.temperature_c} °C</p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 p-2">
                <p className="text-xs text-slate-500">Humidity</p>
                <p className="font-bold">{hazardUpdate.humidity_pct}%</p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 p-2">
                <p className="text-xs text-slate-500">Flood Risk</p>
                <p className="font-bold">{hazardUpdate.floodRisk}</p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 p-2">
                <p className="text-xs text-slate-500">Landslide Risk</p>
                <p className="font-bold">{hazardUpdate.landslideRisk}</p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 p-2">
                <p className="text-xs text-slate-500">Warning</p>
                <p className="text-xs font-bold text-red-600">{hazardUpdate.weatherWarning.split(':')[0]}</p>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-200 pt-3 text-xs text-slate-400">
            RiskRadar — Smart India Hackathon 2026 · Problem Statement ID: 26191 · Disaster Management Theme
            <br />
            This report uses demo/simulated data. Not for operational use.
          </div>
        </div>
      )}
    </div>
  );
}
