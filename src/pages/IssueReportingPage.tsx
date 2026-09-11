import { useState, useEffect, useCallback } from 'react';
import { supabase, type IssueReport } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { KERALA_DISTRICTS } from '@/data/districts';
import { RiskBadge } from '@/components/ui/Badges';
import {
  AlertCircle, Upload, Image as ImageIcon, Loader2, MapPin,
  CheckCircle, Clock, Eye, Trash2, X, FileWarning,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'flood', label: 'Flood', icon: '🌊' },
  { value: 'landslide', label: 'Landslide', icon: '⛰️' },
  { value: 'infrastructure', label: 'Infrastructure Damage', icon: '🏗️' },
  { value: 'other', label: 'Other', icon: '📋' },
];

const SEVERITIES = [
  { value: 'low', label: 'Low', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { value: 'moderate', label: 'Moderate', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { value: 'high', label: 'High', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  { value: 'critical', label: 'Critical', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
];

const STATUS_STYLES: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-amber-400', icon: <Clock className="h-3 w-3" /> },
  reviewing: { label: 'Reviewing', color: 'text-sky-400', icon: <Eye className="h-3 w-3" /> },
  resolved: { label: 'Resolved', color: 'text-emerald-400', icon: <CheckCircle className="h-3 w-3" /> },
};

export function IssueReportingPage() {
  const { user, profile } = useAuth();
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('wayanad');
  const [category, setCategory] = useState('flood');
  const [severity, setSeverity] = useState('moderate');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('issue_reports')
      .select('*, profiles!issue_reports_user_id_fkey(full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading reports:', error);
    } else if (data) {
      const mapped: IssueReport[] = data.map((r: Record<string, unknown> & { profiles?: { full_name?: string } }) => ({
        id: r.id as string,
        user_id: r.user_id as string,
        title: r.title as string,
        description: r.description as string,
        district: r.district as string,
        category: r.category as IssueReport['category'],
        severity: r.severity as IssueReport['severity'],
        image_url: r.image_url as string | null,
        status: r.status as IssueReport['status'],
        latitude: r.latitude as number | null,
        longitude: r.longitude as number | null,
        created_at: r.created_at as string,
        reporter_name: r.profiles?.full_name,
      }));
      setReports(mapped);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image must be less than 5 MB.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    if (!user) {
      setFormError('You must be signed in to submit a report.');
      setSubmitting(false);
      return;
    }

    let imageUrl: string | null = null;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('issue-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        setFormError(`Image upload failed: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('issue-images')
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('issue_reports').insert({
      title,
      description,
      district: KERALA_DISTRICTS.find(d => d.id === district)?.name ?? district,
      category,
      severity,
      image_url: imageUrl,
      user_id: user.id,
    });

    if (insertError) {
      setFormError(`Failed to submit report: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    setSuccessMsg('Issue report submitted successfully!');
    setTitle('');
    setDescription('');
    setCategory('flood');
    setSeverity('moderate');
    setImageFile(null);
    setImagePreview(null);
    setSubmitting(false);
    setShowForm(false);
    loadReports();
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    const { error } = await supabase
      .from('issue_reports')
      .update({ status: newStatus })
      .eq('id', reportId);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      loadReports();
    }
  };

  const handleDelete = async (reportId: string) => {
    const { error } = await supabase
      .from('issue_reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      console.error('Error deleting report:', error);
    } else {
      loadReports();
    }
  };

  const isAuthority = profile?.role === 'authority';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileWarning className="h-5 w-5 text-orange-400" />
          <h1 className="text-lg font-bold text-slate-100">Issue Reporting</h1>
          <span className="text-xs text-slate-400">— Report hazards, infrastructure damage, and community issues</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500"
        >
          {showForm ? <X className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Report an Issue'}
        </button>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle className="h-4 w-4" />
          {successMsg}
        </div>
      )}

      {/* Report Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
          <h2 className="text-sm font-semibold text-slate-200">Submit a New Issue Report</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                maxLength={120}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500/50 focus:outline-none"
                placeholder="Brief title for the issue"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">District *</label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 focus:border-sky-500/50 focus:outline-none"
              >
                {KERALA_DISTRICTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Description *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={3}
              maxLength={1000}
              className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500/50 focus:outline-none"
              placeholder="Describe the issue in detail — what happened, when, and the impact on the community."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 focus:border-sky-500/50 focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Severity</label>
              <div className="flex gap-1.5">
                {SEVERITIES.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSeverity(s.value)}
                    className={`flex-1 rounded-md border px-2 py-2 text-xs font-medium transition-colors ${severity === s.value ? s.color : 'border-slate-700/50 text-slate-500 hover:text-slate-300'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Upload Image (optional, max 5 MB)</label>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700/30">
                <Upload className="h-4 w-4" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-lg border border-slate-700 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
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
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4" />}
            Submit Report
          </button>
        </form>
      )}

      {/* Reports List */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-200">
          Community Issue Reports ({reports.length})
        </h2>

        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        ) : reports.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center">
            <AlertCircle className="h-8 w-8 text-slate-600" />
            <p className="mt-2 text-sm text-slate-500">No issue reports yet. Be the first to report!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(report => {
              const status = STATUS_STYLES[report.status] ?? STATUS_STYLES.pending;
              const sev = SEVERITIES.find(s => s.value === report.severity);
              const cat = CATEGORIES.find(c => c.value === report.category);
              const isOwner = user?.id === report.user_id;

              return (
                <div key={report.id} className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-100">{report.title}</h3>
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${sev?.color}`}>
                          {report.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{report.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {report.district}
                        </span>
                        <span>{cat?.label}</span>
                        <span>by {report.reporter_name ?? 'Unknown'}</span>
                        <span>{new Date(report.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Image thumbnail */}
                    {report.image_url && (
                      <button
                        onClick={() => setViewImage(report.image_url)}
                        className="shrink-0"
                      >
                        <img src={report.image_url} alt="Report" className="h-16 w-16 rounded-lg border border-slate-700 object-cover transition-opacity hover:opacity-80" />
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-700/40 pt-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                    <div className="flex gap-2">
                      {/* Authority can change status */}
                      {isAuthority && (
                        <select
                          value={report.status}
                          onChange={e => handleStatusUpdate(report.id, e.target.value)}
                          className="rounded-md border border-slate-700/50 bg-slate-900/50 px-2 py-1 text-xs text-slate-200 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      )}
                      {/* Owner can delete */}
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="flex items-center gap-1 rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
            <img src={viewImage} alt="Report" className="max-h-[90vh] rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
