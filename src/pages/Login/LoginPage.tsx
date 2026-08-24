import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [badgeId, setBadgeId] = useState('RAJ-4482');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeId.trim()) {
      setError('Please enter a valid Officer / Agent Badge ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(badgeId, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid security credentials or badge not authorized.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoQuickLogin = async (officerBadge: string) => {
    setBadgeId(officerBadge);
    setIsLoading(true);
    await login(officerBadge, 'demo123');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 selection:bg-secondary-container/20">
      {/* Background Grid Accent */}
      <svg className="absolute inset-0 pointer-events-none opacity-20" height="100%" width="100%">
        <defs>
          <pattern height="40" id="login-grid" patternUnits="userSpaceOnUse" width="40">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#73777c" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect fill="url(#login-grid)" height="100%" width="100%" />
      </svg>

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl p-8 z-10">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary-container rounded-t-xl" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-3 shadow-md border border-tertiary">
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-none">
              <rect width="100" height="100" rx="16" fill="#10232F" />
              <path d="M25 75V25L75 75V25" stroke="#FD974E" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-page-title text-2xl font-bold text-primary tracking-tight">NIRVIK</h1>
          <p className="font-metadata text-xs text-on-surface-variant uppercase tracking-widest mt-1 font-semibold">
            AI-Powered Criminal Network Intelligence
          </p>
          <span className="mt-2 font-label-caps text-[10px] bg-primary/5 text-primary border border-primary/15 px-2.5 py-0.5 rounded-full">
            Law Enforcement Authorized Access Only
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-error-container/40 border border-error/30 text-on-error-container text-xs p-3 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
              Officer / Badge ID
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                badge
              </span>
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                placeholder="e.g. RAJ-4482"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-3 py-2 text-sm text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
              Access Key / Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-3 py-2 text-sm text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-outline pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary" />
              <span>Remember station terminal</span>
            </label>
            <span className="text-secondary-container font-medium hover:underline cursor-pointer">Helpdesk</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-secondary-container text-on-primary font-bold text-sm rounded-lg hover:bg-secondary transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Authenticating Officer...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Secure Officer Login</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Mode Selectors */}
        <div className="mt-6 pt-5 border-t border-outline-variant/60 text-center">
          <span className="font-metadata text-[10px] text-outline uppercase tracking-wider block mb-2 font-bold">
            Judge / Evaluator Demo Fast-Access:
          </span>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleDemoQuickLogin('RAJ-4482')}
              className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded text-xs font-semibold text-primary transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px] text-secondary-container">shield</span>
              Rajiv Kumar (Lead)
            </button>
            <button
              onClick={() => handleDemoQuickLogin('LEE-8921')}
              className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded text-xs font-semibold text-primary transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px] text-primary">account_balance</span>
              S. Lee (Forensics)
            </button>
          </div>
        </div>
      </div>

      {/* Security Disclaimer */}
      <p className="font-metadata text-[11px] text-outline mt-6 text-center max-w-sm">
        Protected Criminal Network Intelligence Terminal. All access, queries, and dossiers are logged in the immutable audit trail.
      </p>
    </div>
  );
};
