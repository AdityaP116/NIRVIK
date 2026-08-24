import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAlerts } from '../../mock/alerts';
import { IntelligenceAlert } from '../../types';
import { useCaseContext } from '../../context/CaseContext';
import { auditService } from '../../services';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>(mockAlerts);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const navigate = useNavigate();
  const { openEvidenceModal, setIsAiDrawerOpen } = useCaseContext();

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    return true;
  });

  const handleDismiss = async (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: 'dismissed' } : a)));
    await auditService.logAuditEvent('Dismissed Intelligence Alert', `Alert ID: ${alertId}`, '2026-0142');
  };

  const handleInvestigate = (alert: IntelligenceAlert) => {
    if (alert.entityId) {
      navigate(`/entities/${alert.entityId}`);
    } else {
      navigate('/network-analysis');
    }
  };

  return (
    <div className="p-margin-page flex flex-col gap-margin-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-page-title text-page-title text-primary">Intelligence Alerts &amp; Anomalies</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Automated anomaly detection across active communication, financial, and mobility graphs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="px-3.5 py-2 bg-primary text-on-primary rounded font-section-heading text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary-container">auto_awesome</span>
            <span>Ask AI Analysis</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded-lg border border-outline-variant shadow-sm overflow-x-auto">
        {(['all', 'critical', 'high', 'medium'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-4 py-1.5 rounded font-label-caps text-[10px] uppercase font-bold tracking-wider transition-colors ${
              severityFilter === sev
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {sev} ({sev === 'all' ? alerts.length : alerts.filter((a) => a.severity === sev).length})
          </button>
        ))}
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-surface-container-lowest border rounded-xl p-5 shadow-sm flex flex-col justify-between transition-all ${
              alert.status === 'dismissed'
                ? 'opacity-50 border-outline-variant'
                : alert.severity === 'critical'
                ? 'border-2 border-secondary-container'
                : 'border border-outline-variant hover:border-primary'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                      alert.severity === 'critical'
                        ? 'bg-secondary-container'
                        : 'bg-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {alert.category === 'financial'
                        ? 'payments'
                        : alert.category === 'geospatial'
                        ? 'location_on'
                        : alert.category === 'communication'
                        ? 'call'
                        : 'hub'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-section-heading text-sm font-bold text-primary">{alert.title}</h3>
                    <span className="font-metadata text-[10px] text-outline">
                      Case {alert.caseNumber} · {alert.timestamp}
                    </span>
                  </div>
                </div>

                <span
                  className={`font-label-caps text-[9px] uppercase px-2.5 py-0.5 rounded-full font-bold ${
                    alert.severity === 'critical'
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-secondary-container/10 text-secondary-container'
                  }`}
                >
                  {alert.severity}
                </span>
              </div>

              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                {alert.description}
              </p>

              {/* Anomaly Metrics */}
              {alert.metrics && alert.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-2 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/60">
                  {alert.metrics.map((m, idx) => (
                    <div key={idx}>
                      <span className="font-metadata text-[9px] text-outline uppercase block truncate">{m.label}</span>
                      <span className="font-body-sm text-xs font-bold text-primary truncate block">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-outline-variant/60 flex items-center justify-between">
              <span className="font-label-caps text-[10px] text-secondary font-bold">
                Confidence: {alert.confidence}%
              </span>
              <div className="flex gap-2">
                {alert.status !== 'dismissed' && (
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="px-3 py-1.5 border border-outline-variant rounded font-metadata text-xs text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                  >
                    Dismiss
                  </button>
                )}
                <button
                  onClick={() => handleInvestigate(alert)}
                  className="px-3.5 py-1.5 bg-secondary-container text-white font-bold text-xs rounded hover:bg-secondary transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>Investigate</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
