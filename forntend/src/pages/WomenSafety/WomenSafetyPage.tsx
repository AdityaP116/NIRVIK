import React from 'react';
import { mockWomenSafetyInsights } from '../../mock/womenSafety';
import { auditService } from '../../services';

export const WomenSafetyPage: React.FC = () => {
  const handleExportDossier = async () => {
    await auditService.logAuditEvent('Exported Women Safety Intelligence Dossier', 'Privacy-Shielded Synthesis (3 Patterns)', '2026-0142');
    alert('Women Safety Intelligence Dossier exported. All victim identities strictly redacted.');
  };

  return (
    <div className="p-margin-page flex flex-col gap-gutter max-w-7xl mx-auto w-full pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-stack-tight">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="font-page-title text-page-title text-primary">Women Safety Intelligence</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
              Pattern analysis and cross-case linkage across authorized investigations with automated privacy shielding
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Filter by corridor, timeslot, and vehicle signature')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-lowest border border-outline-variant rounded text-primary font-metadata text-xs font-semibold hover:bg-surface-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              <span>Filter Criteria</span>
            </button>
            <button
              onClick={handleExportDossier}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary border border-primary rounded text-on-primary font-metadata text-xs font-bold shadow-sm hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Privacy Note Banner */}
        <div className="mt-3 flex items-center gap-3 bg-surface-container-lowest border-l-4 border-primary p-4 rounded-r-xl border border-y-outline-variant border-r-outline-variant shadow-sm">
          <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_person
            </span>
          </div>
          <div>
            <p className="font-body-sm text-xs text-on-surface font-bold">
              Privacy Note: Victim identities protected under Criminal Justice Code §228A.
            </p>
            <p className="font-metadata text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
              All outputs are anonymized and focus strictly on repeat offender MO, shared logistics vehicles, and intermediary telecommunications.
            </p>
          </div>
        </div>
      </div>

      {/* Intelligence Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
        {mockWomenSafetyInsights.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col bg-surface-container-lowest border rounded-xl overflow-hidden shadow-sm relative transition-all hover:shadow-md ${
              item.priority === 'CRITICAL' ? 'border-2 border-secondary-container' : 'border border-outline-variant'
            }`}
          >
            {/* Top Accent Line */}
            <div
              className={`absolute top-0 left-0 w-full h-1 ${
                item.priority === 'CRITICAL' ? 'bg-secondary-container' : 'bg-primary'
              }`}
            />

            {/* Card Header */}
            <div className="p-5 border-b border-outline-variant flex justify-between items-start bg-surface">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-[20px]">
                    {item.type === 'repeat_offender'
                      ? 'psychology'
                      : item.type === 'trafficking_network'
                      ? 'share'
                      : 'location_on'}
                  </span>
                  <h3 className="font-section-heading text-sm font-bold text-primary">{item.title}</h3>
                </div>
                <p className="font-metadata text-[10px] text-outline flex items-center gap-1 font-mono">
                  Confidence Index: <b className="text-primary">{item.confidence}%</b>
                  {item.escalationRecommended && (
                    <span className="text-secondary font-bold ml-2">⚠️ Escalation Recommended</span>
                  )}
                </p>
              </div>

              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[9px] font-bold tracking-wider ${
                  item.priority === 'CRITICAL'
                    ? 'bg-secondary-container text-white shadow-sm'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {item.priority}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col gap-4">
              {/* Stats Row */}
              <div className="flex items-center gap-8 pb-3 border-b border-outline-variant/60 text-xs">
                <div className="flex flex-col">
                  <span className="font-page-title text-2xl font-bold text-primary">{item.linkedCasesCount}</span>
                  <span className="font-metadata text-[10px] text-outline">Linked Investigations</span>
                </div>
                <div className="h-8 w-px bg-outline-variant" />
                <div className="flex flex-col">
                  <span className="font-page-title text-2xl font-bold text-secondary-container">
                    {item.sharedEntitiesCount}
                  </span>
                  <span className="font-metadata text-[10px] text-outline">Shared Intermediary Entities</span>
                </div>
              </div>

              {/* Description */}
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                {item.patternDescription}
              </p>

              {/* Key Anonymized Identifiers */}
              <div className="mt-auto pt-2">
                <span className="font-label-caps text-[9px] text-outline uppercase tracking-wider block mb-1.5 font-bold">
                  Key Identified Signatures:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.keyIdentifiers.map((idStr, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-surface-container border border-outline-variant rounded font-mono text-[10px] text-primary font-semibold"
                    >
                      {idStr}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-3 border-t border-outline-variant bg-surface-bright flex justify-between items-center text-xs">
              <span className="font-metadata text-[10px] text-outline">Human review required before field deployment</span>
              <button
                onClick={() => alert(`Escalated ${item.title} to Regional Special Task Force.`)}
                className="px-3 py-1 bg-primary text-on-primary rounded font-metadata text-[11px] font-bold hover:bg-primary-container transition-colors shadow-sm"
              >
                Escalate Finding
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
