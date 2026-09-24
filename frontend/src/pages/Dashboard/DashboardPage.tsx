import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseContext } from '../../context/CaseContext';
import { caseService, alertService, dashboardService } from '../../services';
import { Case, IntelligenceAlert } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentCase, setIsAiDrawerOpen, openEvidenceModal } = useCaseContext();

  const [cases, setCases] = useState<Case[]>([]);
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    activeInvestigations: 14,
    intelligenceSignals: 38,
    highPriorityAlerts: 17,
    connectedEntities: 4286,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [casesRes, alertsRes, dashRes] = await Promise.all([
          caseService.getCases(),
          alertService.getAlerts(),
          dashboardService.getDashboardData(),
        ]);
        if (isMounted) {
          if (casesRes && casesRes.length > 0) setCases(casesRes);
          if (alertsRes && alertsRes.length > 0) setAlerts(alertsRes);
          if (dashRes && dashRes.stats) {
            setDashboardStats(dashRes.stats);
          }
        }
      } catch (err) {
        console.warn('Dashboard load warning:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const kpis = [
    {
      label: 'Active Investigations',
      value: dashboardStats.activeInvestigations.toString(),
      icon: 'work',
      change: '+4 this month',
      color: 'text-primary',
      borderColor: 'border-outline-variant',
    },
    {
      label: 'Intelligence Signals',
      value: dashboardStats.intelligenceSignals.toString(),
      icon: 'radar',
      change: '12 requiring review',
      color: 'text-primary',
      borderColor: 'border-outline-variant',
    },
    {
      label: 'High-Priority Alerts',
      value: dashboardStats.highPriorityAlerts.toString(),
      icon: 'warning',
      change: 'Critical anomalies',
      color: 'text-secondary-container',
      borderColor: 'border-b-2 border-b-secondary-container',
    },
    {
      label: 'Connected Entities',
      value: dashboardStats.connectedEntities.toLocaleString(),
      icon: 'group_work',
      change: 'Indexed across network',
      color: 'text-primary',
      borderColor: 'border-outline-variant',
    },
  ];

  return (
    <div className="p-margin-page flex flex-col gap-margin-page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-page-title text-page-title text-primary">Intelligence Dashboard</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Real-time network intelligence across active criminal investigations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="px-3.5 py-2 bg-primary text-on-primary rounded font-section-heading text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span>Ask NIRVIK AI</span>
          </button>
          <button
            onClick={() => navigate('/network-analysis')}
            className="px-4 py-2 bg-secondary-container text-on-primary rounded font-section-heading text-xs font-bold hover:bg-secondary transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Explore Active Graph</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className={`bg-surface-container-lowest border rounded p-panel-padding flex flex-col justify-between hover:shadow-md transition-shadow ${kpi.borderColor}`}
          >
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
              {kpi.label}
            </span>
            <div className="mt-3 flex items-end justify-between">
              <span className={`font-page-title text-[32px] font-bold leading-none ${kpi.color}`}>
                {isLoading ? '...' : kpi.value}
              </span>
              <span className="material-symbols-outlined text-outline-variant text-[24px]">
                {kpi.icon}
              </span>
            </div>
            <span className="font-metadata text-[10px] text-outline mt-2">{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
        {/* Left: Attention Required (Alerts Feed) */}
        <div className="xl:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-outline-variant bg-surface-container-low/60 flex items-center justify-between">
            <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                error
              </span>
              <span>Attention Required</span>
            </h3>
            <span className="font-label-caps text-[10px] bg-secondary-container/10 text-secondary-container px-2 py-0.5 rounded-full font-bold">
              {alerts.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/60 max-h-[560px] custom-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-outline flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                <span>Loading intelligence alerts...</span>
              </div>
            ) : alerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-outline">No pending alerts.</div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-surface-container-low transition-colors space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          alert.severity === 'critical' ? 'bg-error animate-ping' : 'bg-secondary-container'
                        }`}
                      />
                      <h4 className="font-body-sm text-xs font-bold text-primary">{alert.title}</h4>
                    </div>
                    <span className="font-metadata text-[10px] text-outline whitespace-nowrap">{alert.timestamp}</span>
                  </div>

                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-metadata text-[10px] text-outline font-mono">
                      Case: <b className="text-primary">{alert.caseNumber}</b>
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/network-analysis')}
                        className="text-secondary-container font-metadata text-[11px] font-bold hover:underline flex items-center gap-0.5"
                      >
                        <span>View Graph</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-outline-variant bg-surface-bright text-center">
            <button
              onClick={() => navigate('/alerts')}
              className="text-xs font-bold text-primary hover:text-secondary-container transition-colors"
            >
              View All Alerts &rarr;
            </button>
          </div>
        </div>

        {/* Right: Active Investigations & Recent Signals (Span 2) */}
        <div className="xl:col-span-2 flex flex-col gap-gutter">
          {/* Active Cases Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 border-b border-outline-variant bg-surface-container-low/60 flex justify-between items-center">
              <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">folder_shared</span>
                <span>Active Investigations</span>
              </h3>
              <button
                onClick={() => navigate('/investigations')}
                className="text-secondary-container font-metadata text-xs font-bold hover:underline"
              >
                View All Cases &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-outline-variant font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
                    <th className="p-3.5 font-bold">Case Reference</th>
                    <th className="p-3.5 font-bold">Lead Investigator</th>
                    <th className="p-3.5 font-bold">Network Entities</th>
                    <th className="p-3.5 font-bold">Signals</th>
                    <th className="p-3.5 font-bold">Status</th>
                    <th className="p-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 font-body-sm text-xs">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-outline">
                        <span className="material-symbols-outlined animate-spin text-base mr-2 align-middle">progress_activity</span>
                        <span>Loading active investigations...</span>
                      </td>
                    </tr>
                  ) : (
                    cases.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => {
                          setCurrentCase(c);
                          navigate(`/investigations/${c.id}`);
                        }}
                        className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                      >
                        <td className="p-3.5">
                          <div className="font-bold text-primary group-hover:text-secondary-container transition-colors">
                            Case {c.caseNumber}
                          </div>
                          <div className="font-metadata text-[10px] text-outline truncate max-w-xs">{c.title}</div>
                        </td>
                        <td className="p-3.5 text-on-surface">{c.leadInvestigator}</td>
                        <td className="p-3.5 font-bold text-primary">{c.totalEntities} Nodes</td>
                        <td className="p-3.5">
                          <span className="font-label-caps text-[10px] bg-secondary-container/10 text-secondary-container px-2 py-0.5 rounded font-bold">
                            {c.totalSignals} Signals
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-label-caps text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                              c.priority === 'critical'
                                ? 'bg-error-container text-on-error-container'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {c.priority}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[18px]">
                            chevron_right
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Intelligence Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Cross-Case Bridge Highlight Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary-container" />
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-label-caps text-[9px] text-secondary-container uppercase tracking-wider font-bold">
                    Primary Bridge Node
                  </span>
                  <span className="material-symbols-outlined text-secondary-container text-[18px]">hub</span>
                </div>
                <h4 className="font-section-heading text-sm font-bold text-primary">Ramesh Kumar (UID-8842-A)</h4>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Identified as critical structural bridge connecting Case 2026-0142 with Hawala Case 2025-0891.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/60 flex justify-between items-center">
                <span className="font-metadata text-[10px] text-outline">Centrality Score: <b>0.84</b></span>
                <button
                  onClick={() => navigate('/entities/entity-ramesh-kumar')}
                  className="text-xs text-secondary-container font-bold hover:underline flex items-center gap-1"
                >
                  <span>Open Dossier</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Evidence Verification Status Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-label-caps text-[9px] text-outline uppercase tracking-wider font-bold">
                    Evidence Integrity Status
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px]">enhanced_encryption</span>
                </div>
                <h4 className="font-section-heading text-sm font-bold text-primary">47 Verified Evidence Files</h4>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  FIRs, CDR logs, and financial transaction records verified with 100% cryptographic SHA-256 integrity.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/60 flex justify-between items-center">
                <span className="font-metadata text-[10px] text-secondary-container font-bold">Tamper-Evident Ledger</span>
                <button
                  onClick={() => openEvidenceModal()}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <span>Verify Hash</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
