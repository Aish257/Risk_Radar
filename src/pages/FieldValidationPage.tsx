import { useState, useEffect, useCallback } from 'react';
import { supabase, type FieldValidation, type AppState } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import type { SafeSite } from '@/types';
import { RiskBadge, FeasibilityBadge } from '@/components/ui/Badges';
import {
  ClipboardCheck, Loader2, MapPin, CheckCircle, Clock, Eye,
  X, AlertCircle, Upload, Image as ImageIcon, FileWarning,
} from 'lucide-react';

interface FieldValidationPageProps {
  activeState: AppState;
  safeSites: SafeSite[];
  onSafeSiteClick: (siteId: string) => void;
}

const SOIL_TYPES = [
  { value: 'rocky', label: 'Rocky' },
  { value: 'sandy', label: 'Sandy' },
  { value: 'clay', label: 'Clay' },
  { value: 'loam', label: 'Loam' },
  { value: 'mixed', label: 'Mixed' },
];

const WATER_SOURCES = [
  { value: 'municipal', label: 'Municipal Supply' },
  { value: 'borewell', label: 'Borewell / Tube Well' },
  { value: 'river', label: 'River / Stream' },
  { value: 'lake', label: 'Lake / Pond' },
  { value: 'rainwater', label: 'Rainwater Harvesting' },
  { value: 'none', label: 'None Available' },
];

const ROAD_CONDITIONS = [
  { value: 'good', label: 'Good (Paved, All Weather)' },
  { value: 'moderate', label: 'Moderate (Seasonal Access)' },
  { value: 'poor', label: 'Poor (Difficult Access)' },
  { value: 'none', label: 'No Road Access' },
];

const RISK_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const FEASIBILITY_LEVELS = [
  { value: 'feasible', label: 'Feasible' },
  { value: 'partially_feasible', label: 'Partially Feasible' },
  { value: 'not_feasible', label: 'Not Feasible' },
];

const HAZARD_SIGNS = [
  'Soil Erosion', 'Cracks in Ground', 'Water Logging', 'Landslide Scars',
  'Flood Marks', 'Unstable Slope', 'Poor Drainage', 'Encroachment',
];

const STATUS_STYLES: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-amber-400', icon: <Clock className="h-3 w-3" /> },
  reviewed: { label: 'Reviewed', color: 'text-sky-400', icon: <Eye className="h-3 w-3" /> },
  approved: { label: 'Approved', color: 'text-emerald-400', icon: <CheckCircle className="h-3 w-3" /> },
  rejected: { label: 'Rejected', color: 'text-red-400', icon: <FileWarning className="h-3 w-3" /> },
};

export function FieldValidationPage({ activeState, safeSites, onSafeSiteClick }: FieldValidationPageProps) {
  const { user, profile } = useAuth();
  const [validations, setValidations] = useState<FieldValidation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);

  // Form state
  const [soilType, setSoilType] = useState<string>('');
  const [waterSource, setWaterSource] = useState<string>('');
  const [roadCondition, setRoadCondition] = useState<string>('');
  const [electricity, setElectricity] = useState(false);
  const [mobileConnectivity, setMobileConnectivity] = useState(false);
  const [hazardSigns, setHazardSigns] = useState<string[]>([]);
  const [hazardNotes, setHazardNotes] = useState('');
  const [reassessedRisk, setReassessedRisk] = useState<string>('');
  const [reassessedFeasibility, setReassessedFeasibility] = useState<string>('');
  const [officerNotes, setOfficerNotes] = useState('');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const stateSites = safeSites;

  const loadValidations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('field_validations')
      .select('*')
      .eq('state', activeState)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading validations:', error);
    } else if (data) {
      setValidations(data as FieldValidation[]);
    }
    setLoading(false);
  }, [activeState]);

  useEffect(() => {
    loadValidations();
  }, [loadValidations]);

  const selectedSite = stateSites.find(s => s.id === selectedSiteId);

  const resetForm = () => {
    setSoilType('');
    setWaterSource('');
    setRoadCondition('');
    setElectricity(false);
    setMobileConnectivity(false);
    setHazardSigns([]);
    setHazardNotes('');
    setReassessedRisk('');
    setReassessedFeasibility('');
    setOfficerNotes('');
    setPhotoFiles([]);
    setPhotoPreviews([]);
    setFormError(null);
  };

  const handleSiteSelect = (siteId: string) => {
    setSelectedSiteId(siteId);
    setShowForm(true);
    resetForm();
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length + photoFiles.length > 5) {
      setFormError('Maximum 5 photos allowed.');
      return;
    }
    setPhotoFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setPhotoPreviews(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const toggleHazardSign = (sign: string) => {
    setHazardSigns(prev =>
      prev.includes(sign) ? prev.filter(s => s !== sign) : [...prev, sign]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!user || !profile) {
      setFormError('You must be signed in to submit a validation.');
      return;
    }
    if (!selectedSite) {
      setFormError('Please select a site to validate.');
      return;
    }

    setSubmitting(true);

    const photoUrls: string[] = [];
    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      const fileName = `${user.id}/${selectedSite.id}_${Date.now()}_${i}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('issue-images')
        .upload(fileName, file);

      if (uploadError) {
        setFormError(`Photo upload failed: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('issue-images')
        .getPublicUrl(fileName);
      photoUrls.push(urlData.publicUrl);
    }

    const { error: insertError } = await supabase.from('field_validations').insert({
      site_id: selectedSite.id,
      site_name: selectedSite.name,
      state: activeState,
      district: selectedSite.districtName,
      officer_id: user.id,
      officer_name: profile.full_name,
      soil_type: soilType || null,
      water_source: waterSource || null,
      access_road_condition: roadCondition || null,
      electricity_available: electricity,
      mobile_connectivity: mobileConnectivity,
      hazard_signs_observed: hazardSigns,
      hazard_signs_notes: hazardNotes || null,
      reassessed_risk: reassessedRisk || null,
      reassessed_feasibility: reassessedFeasibility || null,
      photo_urls: photoUrls,
      officer_notes: officerNotes || null,
      status: 'pending',
    });

    if (insertError) {
      setFormError(`Failed to submit validation: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    setSuccessMsg('Field validation submitted successfully!');
    setShowForm(false);
    setSelectedSiteId(null);
    resetForm();
    loadValidations();
    setSubmitting(false);
  };

  const handleStatusUpdate = async (validationId: string, newStatus: string) => {
    const { error } = await supabase
      .from('field_validations')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', validationId);

    if (error) {
      console.error('Error updating validation status:', error);
    } else {
      loadValidations();
    }
  };

  const isAuthority = profile?.role === 'authority';
  const isFieldOfficer = profile?.role === 'field_officer';
  const canSubmit = isFieldOfficer || isAuthority;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-amber-400" />
          <h1 className="text-lg font-bold text-slate-100">Field Validation</h1>
          <span className="text-xs text-slate-400">— Ground verification of AI-identified safe sites</span>
        </div>
        {canSubmit && (
          <button
            onClick={() => { setShowForm(!showForm); if (showForm) { setSelectedSiteId(null); resetForm(); } }}
            className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500"
          >
            {showForm ? <X className="h-4 w-4" /> : <ClipboardCheck className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'New Validation'}
          </button>
        )}
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle className="h-4 w-4" />
          {successMsg}
        </div>
      )}

      {/* Validation Form */}
      {showForm && canSubmit && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <h2 className="text-sm font-semibold text-slate-200">Submit Ground Verification Report</h2>

          {/* Site Selection */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Select Safe Site to Validate *</label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {stateSites.map(site => (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => handleSiteSelect(site.id)}
                  className={`rounded-lg border p-3 text-left transition-all ${selectedSiteId === site.id ? 'border-amber-500/40 bg-amber-500/10' : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'}`}
                >
                  <p className="text-sm font-medium text-slate-200">{site.name}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" /> {site.districtName}
                  </p>
                  <p className="mt-1 text-xs text-emerald-400">Suitability: {site.suitabilityScore}/100</p>
                </button>
              ))}
            </div>
          </div>

          {selectedSite && (
            <>
              {/* Selected site info */}
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Validating: {selectedSite.name}</p>
                <p className="mt-1 text-xs text-slate-400">AI Suitability Score: {selectedSite.suitabilityScore}/100 · Estimated Capacity: {selectedSite.estimatedCapacity.toLocaleString()}</p>
              </div>

              {/* Ground conditions */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">Soil Type</label>
                  <select
                    value={soilType}
                    onChange={e => setSoilType(e.target.value)}
                    className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none"
                  >
                    <option value="">Select soil type</option>
                    {SOIL_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">Water Source</label>
                  <select
                    value={waterSource}
                    onChange={e => setWaterSource(e.target.value)}
                    className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none"
                  >
                    <option value="">Select water source</option>
                    {WATER_SOURCES.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">Access Road Condition</label>
                  <select
                    value={roadCondition}
                    onChange={e => setRoadCondition(e.target.value)}
                    className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none"
                  >
                    <option value="">Select road condition</option>
                    {ROAD_CONDITIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-6 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={electricity}
                      onChange={e => setElectricity(e.target.checked)}
                      className="h-4 w-4 rounded accent-amber-500"
                    />
                    <span className="text-xs text-slate-300">Electricity Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mobileConnectivity}
                      onChange={e => setMobileConnectivity(e.target.checked)}
                      className="h-4 w-4 rounded accent-amber-500"
                    />
                    <span className="text-xs text-slate-300">Mobile Connectivity</span>
                  </label>
                </div>
              </div>

              {/* Hazard signs */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Hazard Signs Observed</label>
                <div className="flex flex-wrap gap-2">
                  {HAZARD_SIGNS.map(sign => (
                    <button
                      key={sign}
                      type="button"
                      onClick={() => toggleHazardSign(sign)}
                      className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${hazardSigns.includes(sign) ? 'border-red-500/40 bg-red-500/10 text-red-300' : 'border-slate-700/50 text-slate-400 hover:text-slate-300'}`}
                    >
                      {sign}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={hazardNotes}
                  onChange={e => setHazardNotes(e.target.value)}
                  placeholder="Additional hazard notes..."
                  className="mt-2 w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none"
                />
              </div>

              {/* Reassessment */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">Reassessed Risk Level</label>
                  <div className="flex gap-1.5">
                    {RISK_LEVELS.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setReassessedRisk(r.value)}
                        className={`flex-1 rounded-md border px-2 py-2 text-xs font-medium transition-colors ${reassessedRisk === r.value ? 'border-red-500/40 bg-red-500/10 text-red-300' : 'border-slate-700/50 text-slate-500 hover:text-slate-300'}`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">Reassessed Feasibility</label>
                  <select
                    value={reassessedFeasibility}
                    onChange={e => setReassessedFeasibility(e.target.value)}
                    className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 focus:border-amber-500/50 focus:outline-none"
                  >
                    <option value="">Select feasibility</option>
                    {FEASIBILITY_LEVELS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Upload Photos (max 5)</label>
                <div className="flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700/30">
                    <Upload className="h-4 w-4" />
                    Choose Photos
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotosChange}
                      className="hidden"
                    />
                  </label>
                  {photoPreviews.length > 0 && (
                    <div className="flex gap-2">
                      {photoPreviews.map((preview, i) => (
                        <div key={i} className="relative">
                          <img src={preview} alt={`Preview ${i + 1}`} className="h-16 w-16 rounded-lg border border-slate-700 object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i));
                              setPhotoFiles(prev => prev.filter((_, idx) => idx !== i));
                            }}
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Officer notes */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Officer Notes</label>
                <textarea
                  value={officerNotes}
                  onChange={e => setOfficerNotes(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  placeholder="Detailed observations from the ground visit..."
                  className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
                Submit Validation
              </button>
            </>
          )}
        </form>
      )}

      {/* Pending Validations (for authorities) */}
      {isAuthority && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">Review Validations ({validations.length})</h2>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : validations.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <ClipboardCheck className="h-8 w-8 text-slate-600" />
              <p className="mt-2 text-sm text-slate-500">No field validations submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {validations.map(v => {
                const status = STATUS_STYLES[v.status] ?? STATUS_STYLES.pending;
                return (
                  <div key={v.id} className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-100">{v.site_name}</h3>
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${status.color}`}>
                            {status.icon} {status.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {v.district} · by {v.officer_name} · {new Date(v.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                          {v.soil_type && <div><span className="text-slate-500">Soil:</span> <span className="text-slate-300 capitalize">{v.soil_type}</span></div>}
                          {v.water_source && <div><span className="text-slate-500">Water:</span> <span className="text-slate-300 capitalize">{v.water_source.replace('_', ' ')}</span></div>}
                          {v.access_road_condition && <div><span className="text-slate-500">Road:</span> <span className="text-slate-300 capitalize">{v.access_road_condition}</span></div>}
                          <div><span className="text-slate-500">Electricity:</span> <span className={v.electricity_available ? 'text-emerald-400' : 'text-red-400'}>{v.electricity_available ? 'Yes' : 'No'}</span></div>
                          <div><span className="text-slate-500">Mobile:</span> <span className={v.mobile_connectivity ? 'text-emerald-400' : 'text-red-400'}>{v.mobile_connectivity ? 'Yes' : 'No'}</span></div>
                          {v.reassessed_risk && <div><span className="text-slate-500">Reassessed Risk:</span> <span className="text-slate-300 capitalize">{v.reassessed_risk}</span></div>}
                          {v.reassessed_feasibility && <div><span className="text-slate-500">Feasibility:</span> <span className="text-slate-300 capitalize">{v.reassessed_feasibility.replace('_', ' ')}</span></div>}
                        </div>

                        {v.hazard_signs_observed.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {v.hazard_signs_observed.map(sign => (
                              <span key={sign} className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs text-red-300">{sign}</span>
                            ))}
                          </div>
                        )}

                        {v.officer_notes && (
                          <p className="mt-2 text-xs text-slate-400">{v.officer_notes}</p>
                        )}

                        {v.photo_urls.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {v.photo_urls.map((url, i) => (
                              <button key={i} onClick={() => setViewImage(url)}>
                                <img src={url} alt={`Photo ${i + 1}`} className="h-16 w-16 rounded-lg border border-slate-700 object-cover hover:opacity-80" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Authority actions */}
                    <div className="mt-3 flex items-center gap-2 border-t border-slate-700/40 pt-3">
                      <select
                        value={v.status}
                        onChange={e => handleStatusUpdate(v.id, e.target.value)}
                        className="rounded-md border border-slate-700/50 bg-slate-900/50 px-2 py-1 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Field officer's own submissions */}
      {isFieldOfficer && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">My Submissions ({validations.filter(v => v.officer_id === user?.id).length})</h2>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : validations.filter(v => v.officer_id === user?.id).length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <ClipboardCheck className="h-8 w-8 text-slate-600" />
              <p className="mt-2 text-sm text-slate-500">You haven't submitted any validations yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {validations.filter(v => v.officer_id === user?.id).map(v => {
                const status = STATUS_STYLES[v.status] ?? STATUS_STYLES.pending;
                return (
                  <div key={v.id} className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-100">{v.site_name}</h3>
                        <p className="text-xs text-slate-500">{v.district} · {new Date(v.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                    {v.officer_notes && <p className="mt-2 text-xs text-slate-400">{v.officer_notes}</p>}
                    {v.photo_urls.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {v.photo_urls.map((url, i) => (
                          <button key={i} onClick={() => setViewImage(url)}>
                            <img src={url} alt={`Photo ${i + 1}`} className="h-16 w-16 rounded-lg border border-slate-700 object-cover hover:opacity-80" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Image modal */}
      {viewImage && (
        <div
          onClick={() => setViewImage(null)}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 p-4"
        >
          <div className="relative max-h-[90vh] max-w-2xl">
            <button
              onClick={() => setViewImage(null)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
            <img src={viewImage} alt="Field photo" className="max-h-[90vh] rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
