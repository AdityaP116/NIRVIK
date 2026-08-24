import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LeafletMap } from '../../components/map/LeafletMap';
import { mockPriorityNetworks } from '../../mock/analytics';
import { mockAlerts } from '../../mock/alerts';

export const CommandOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-margin-page flex flex-col gap-gutter max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-page-title text-page-title text-primary">Command Intelligence Overview</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Senior leadership strategic view of syndicate activity, cross-jurisdiction clusters, and priority networks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-metadata text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold">
            Live Stream Active · Maharashtra Command HQ
          </span>
        </div>
      </div>

      {/* Row 1: Executive Metrics (Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-panel-padding flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
              Active Investigations
            </span>
            <span className="material-symbols-outlined text-outline">folder_open</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-page-title text-3xl font-bold text-primary">142</span>
            <span className="font-metadata text-[10px] text-secondary-container bg-secondary-container/10 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              +12% this month
            </span>
          </div>
        </div>

        {/* Metric 2 (High Priority) */}
        <div className="bg-surface-container-lowest rounded-xl border-2 border-secondary-container p-panel-padding flex flex-col justify-between shadow-[0_4px_12px_rgba(38,56,69,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-secondary-container/10 rounded-bl-full -mr-4 -mt-4" />
          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className="font-label-caps text-[10px] text-secondary-container uppercase tracking-wider font-bold">
              Priority Networks
            </span>
            <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
          </div>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="font-page-title text-3xl font-bold text-secondary-container">8</span>
            <span className="font-body-sm text-xs text-outline font-semibold">Flagged by AI Engine</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-panel-padding flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
              Emerging Signals
            </span>
            <span className="material-symbols-outlined text-outline">radar</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-page-title text-3xl font-bold text-primary">84</span>
            <span className="font-body-sm text-xs text-outline">Last 24 Hours</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-panel-padding flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
              Cross-Case Links
            </span>
            <span className="material-symbols-outlined text-outline">schema</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-page-title text-3xl font-bold text-primary">29</span>
            <span className="font-metadata text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
              Intermediary Bridges
            </span>
          </div>
        </div>
      </div>

      {/* Row 2 & 3: Main Layout Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left Column (Maps & Ranked Lists) - Span 8 */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-gutter">
          {/* Regional Geospatial Intelligence Map */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col h-[420px] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">map</span>
                <span>Regional Geospatial Intelligence Telemetry</span>
              </h3>
              <div className="flex gap-2">
                <button className="font-metadata text-[11px] px-3 py-1 rounded bg-primary text-on-primary font-bold shadow-sm">
                  Live View
                </button>
                <button className="font-metadata text-[11px] px-3 py-1 rounded border border-outline-variant text-on-surface hover:bg-surface-container transition-colors">
                  Past 7 Days
                </button>
              </div>
            </div>

            {/* Interactive Leaflet Map Mount Area */}
            <div className="flex-1 relative overflow-hidden">
              <LeafletMap />
            </div>
          </div>

          {/* Priority Networks Ranked List Table */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-outline-variant bg-surface flex justify-between items-center">
              <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">military_tech</span>
                <span>Priority Criminal Networks</span>
              </h3>
              <button
                onClick={() => navigate('/network-analysis')}
                className="text-xs font-bold text-secondary-container hover:underline"
              >
                Analyze in Graph &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">
                    <th className="p-3.5 font-bold">Rank</th>
                    <th className="p-3.5 font-bold">Network Alias</th>
                    <th className="p-3.5 font-bold">Primary Threat Category</th>
                    <th className="p-3.5 font-bold">Activity Index</th>
                    <th className="p-3.5 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60 font-body-sm text-xs">
                  {mockPriorityNetworks.map((net) => (
                    <tr
                      key={net.rank}
                      onClick={() => navigate('/network-analysis')}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                    >
                      <td className="p-3.5 font-bold text-secondary-container">#{net.rank}</td>
                      <td className="p-3.5 font-bold text-primary flex items-center gap-2 group-hover:text-secondary-container transition-colors">
                        <span className="material-symbols-outlined text-outline text-[16px]">group</span>
                        <span>{net.alias}</span>
                      </td>
                      <td className="p-3.5 text-on-surface-variant">{net.primaryThreat}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div
                              className="h-full bg-secondary-container rounded-full"
                              style={{ width: `${net.activityScore}%` }}
                            />
                          </div>
                          <span className="font-metadata font-bold text-[11px] text-primary">{net.activityScore}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <span
                          className={`inline-block font-label-caps text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            net.status === 'Critical'
                              ? 'bg-secondary-container text-white shadow-sm'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {net.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Emerging Signals Stream (Span 4) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-gutter">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="px-5 py-3.5 border-b border-outline-variant bg-surface flex justify-between items-center">
              <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">radar</span>
                <span>Critical Incident Signals</span>
              </h3>
              <span className="font-label-caps text-[9px] bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold">
                Action Required
              </span>
            </div>

            <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[700px] custom-scrollbar">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => navigate('/alerts')}
                  className="p-3.5 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/60 rounded-lg transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-primary">{alert.title}</span>
                    <span className="font-metadata text-[10px] text-outline font-mono">{alert.timestamp}</span>
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="font-mono text-outline">Case: <b>{alert.caseNumber}</b></span>
                    <span className="text-secondary font-bold hover:underline">Inspect &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
