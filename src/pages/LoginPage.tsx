import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Radar, Shield, Users, MapPin, Building2, AlertCircle, Loader2 } from 'lucide-react';
import { KERALA_DISTRICTS } from '@/data/districts';

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'authority' | 'citizen'>('citizen');
  const [jurisdictionLevel, setJurisdictionLevel] = useState<'state' | 'district'>('district');
  const [jurisdictionDistrict, setJurisdictionDistrict] = useState('wayanad');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(
        email,
        password,
        fullName,
        role,
        role === 'authority' ? jurisdictionLevel : undefined,
        role === 'authority' && jurisdictionLevel === 'district' ? jurisdictionDistrict : undefined,
      );
      if (error) {
        setError(error);
      } else {
        setError(null);
        setMode('signin');
        setEmail('');
        setPassword('');
        setFullName('');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/20">
            <Radar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">RiskRadar</h1>
          <p className="mt-1 text-sm text-slate-400">AI-Based Hazard Red-Zone &amp; Relocation Planning · Kerala Pilot</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-sm">
          {/* Mode Toggle */}
          <div className="mb-5 flex gap-2 rounded-lg bg-slate-900/50 p-1">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === 'signin' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                placeholder="••••••••"
              />
            </div>

            {mode === 'signup' && (
              <>
                {/* Role Selection */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">Account Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('citizen')}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-colors ${role === 'citizen' ? 'border-sky-500/40 bg-sky-500/10' : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'}`}
                    >
                      <Users className="h-4 w-4 text-sky-400" />
                      <div>
                        <p className="text-xs font-medium text-slate-200">Citizen</p>
                        <p className="text-[10px] text-slate-500">Report issues</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('authority')}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-colors ${role === 'authority' ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600'}`}
                    >
                      <Shield className="h-4 w-4 text-emerald-400" />
                      <div>
                        <p className="text-xs font-medium text-slate-200">Authority</p>
                        <p className="text-[10px] text-slate-500">Manage &amp; download</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Jurisdiction (for authorities) */}
                {role === 'authority' && (
                  <div className="space-y-3 rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">Jurisdiction Level</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setJurisdictionLevel('state')}
                          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-xs font-medium transition-colors ${jurisdictionLevel === 'state' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-700/50 text-slate-400'}`}
                        >
                          <Building2 className="h-3.5 w-3.5" /> State Level
                        </button>
                        <button
                          type="button"
                          onClick={() => setJurisdictionLevel('district')}
                          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-xs font-medium transition-colors ${jurisdictionLevel === 'district' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-slate-700/50 text-slate-400'}`}
                        >
                          <MapPin className="h-3.5 w-3.5" /> District Level
                        </button>
                      </div>
                    </div>
                    {jurisdictionLevel === 'district' && (
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-400">District</label>
                        <select
                          value={jurisdictionDistrict}
                          onChange={e => setJurisdictionDistrict(e.target.value)}
                          className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:border-sky-500/50 focus:outline-none"
                        >
                          {KERALA_DISTRICTS.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode === 'signup' && (
            <p className="mt-4 text-center text-xs text-slate-500">
              Citizens can report issues and generate reports. Authorities can additionally download Excel data and manage issue status.
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-600">
          RiskRadar · Smart India Hackathon 2026 · Kerala Pilot
        </p>
      </div>
    </div>
  );
}
