import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockEntities } from '../../mock/entities';
import { useCaseContext } from '../../context/CaseContext';
import { auditService } from '../../services';

export const EntityProfilePage: React.FC = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const { openEvidenceModal, setIsAiDrawerOpen } = useCaseContext();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'relationships' | 'timeline' | 'evidence' | 'cases' | 'ai_analysis'
  >('ai_analysis');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const entity =
    mockEntities.find((e) => e.id === entityId || e.nationalId === entityId) ||
    mockEntities[0];

  const handleConfirmFinding = async () => {
    setIsConfirmed(true);
    await auditService.logAuditEvent('Investigator Confirmed AI Finding', `Entity: ${entity.name} (${entity.nationalId}) - Structural Influence Confirmed`, '2026-0142');
  };

  return (
    <div className="p-margin-page flex flex-col gap-gutter bg-surface-container-low min-h-full">
      {/* Entity Header Section */}
      <div className="flex flex-col sm:flex-row items-start gap-5 bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
        <div className="relative">
          <div className="w-20 h-20 rounded-lg bg-primary flex items-center justify-center text-white border-2 border-outline-variant shadow-sm text-2xl font-bold">
            {entity.photoUrl ? (
              <img src={entity.photoUrl} alt={entity.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              'RK'
            )}
          </div>
          <div
            className="absolute -bottom-2 -right-2 bg-secondary-container text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
            title="High Priority Target"
          >
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-page-title text-2xl font-bold text-primary m-0 leading-none">{entity.name}</h2>
            <span className="font-mono text-xs text-outline font-bold">({entity.nationalId || 'E-982-X4'})</span>
          </div>

          <p className="font-body-sm text-xs text-on-surface-variant max-w-2xl">{entity.roleDescription}</p>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-[9px] uppercase rounded tracking-wider border border-tertiary-fixed-dim font-bold">
              {entity.type.toUpperCase()}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 bg-secondary-fixed/30 text-secondary-container font-label-caps text-[9px] uppercase rounded tracking-wider border border-secondary-container/30 font-bold">
              <span className="material-symbols-outlined text-[12px] mr-1">flag</span>
              UNDER INVESTIGATION
            </span>
            <span className="inline-flex items-center px-2 py-0.5 bg-error-container/40 text-on-error-container font-label-caps text-[9px] uppercase rounded tracking-wider border border-error/20 font-bold">
              {entity.primaryRisk || 'High Flight Risk'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center gap-1.5 border border-primary text-primary px-3.5 py-2 rounded text-xs font-bold hover:bg-surface-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary-container">auto_awesome</span>
            <span>Query AI</span>
          </button>
          <button
            onClick={() => alert(`Exporting complete dossier for ${entity.name}...`)}
            className="flex items-center gap-1.5 bg-secondary-container text-white px-3.5 py-2 rounded text-xs font-bold hover:bg-secondary transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Bar (Bento Grid Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        <div className="bg-white border border-outline-variant p-4 rounded-lg flex flex-col gap-1 shadow-sm">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px]">hub</span>
            Network Centrality
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-page-title text-2xl font-bold text-primary">{entity.betweennessCentrality}</span>
            <span className="font-body-sm text-[11px] text-secondary-container font-bold">+0.12 this month</span>
          </div>
        </div>

        <div className="bg-white border border-outline-variant p-4 rounded-lg flex flex-col gap-1 shadow-sm">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px]">group</span>
            Direct Connections
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-page-title text-2xl font-bold text-primary">{entity.directConnections}</span>
            <span className="font-body-sm text-[11px] text-outline">Network Links</span>
          </div>
        </div>

        <div className="bg-white border border-outline-variant p-4 rounded-lg flex flex-col gap-1 shadow-sm">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px]">work</span>
            Cases Linked
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-page-title text-2xl font-bold text-primary">{entity.totalCasesLinked}</span>
            <span className="font-body-sm text-[11px] text-error font-bold">{entity.activeCasesLinked} Active</span>
          </div>
        </div>

        <div className="bg-white border border-outline-variant p-4 rounded-lg flex flex-col gap-1 shadow-sm">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[14px]">source</span>
            Evidence Sources
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-page-title text-2xl font-bold text-primary">{entity.evidenceSourcesCount}</span>
            <span className="font-body-sm text-[11px] text-outline">Verified Files</span>
          </div>
        </div>
      </div>

      {/* In-Page Tabs */}
      <div className="flex gap-6 border-b border-outline-variant px-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ai_analysis')}
          className={`pb-3 font-metadata text-xs uppercase tracking-wide transition-colors flex items-center gap-1.5 ${
            activeTab === 'ai_analysis'
              ? 'border-b-2 border-secondary-container text-primary font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-secondary-container">psychology</span>
          <span>AI Analysis</span>
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-metadata text-xs uppercase tracking-wide transition-colors ${
            activeTab === 'overview'
              ? 'border-b-2 border-secondary-container text-primary font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('relationships')}
          className={`pb-3 font-metadata text-xs uppercase tracking-wide transition-colors ${
            activeTab === 'relationships'
              ? 'border-b-2 border-secondary-container text-primary font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Relationships ({entity.directConnections})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 font-metadata text-xs uppercase tracking-wide transition-colors ${
            activeTab === 'timeline'
              ? 'border-b-2 border-secondary-container text-primary font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`pb-3 font-metadata text-xs uppercase tracking-wide transition-colors ${
            activeTab === 'evidence'
              ? 'border-b-2 border-secondary-container text-primary font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Evidence ({entity.evidenceSourcesCount})
        </button>
        <button
          onClick={() => setActiveTab('cases')}
          className={`pb-3 font-metadata text-xs uppercase tracking-wide transition-colors ${
            activeTab === 'cases'
              ? 'border-b-2 border-secondary-container text-primary font-bold'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Cases ({entity.totalCasesLinked})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'ai_analysis' && (
        <div className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col gap-6 shadow-sm">
          {/* Section Header */}
          <div className="flex justify-between items-start border-b border-outline-variant/50 pb-4">
            <div>
              <h3 className="font-section-heading text-base font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">memory</span>
                <span>Synthesized Intelligence Report</span>
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                Automated behavioral and structural graph analysis generated on 2026-10-24 14:32 IST.
              </p>
            </div>
            <span className="font-label-caps text-[10px] bg-secondary-container/10 text-secondary-container px-2.5 py-1 rounded-full font-bold">
              High Reliability
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Key Finding & Explainability */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-surface-container-low p-4 rounded-lg border-l-4 border-secondary-container">
                <span className="font-label-caps text-[10px] text-secondary-container uppercase tracking-wider mb-1 block font-bold">
                  Primary AI Deduction
                </span>
                <h4 className="font-page-title text-base font-bold text-primary mb-2">
                  High Network Influence &amp; Structural Bridge Detected
                </h4>
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                  Graph analysis algorithms indicate this entity acts as a critical structural bridge between isolated
                  operational clusters. Removal or monitoring of this node significantly degrades communication pathways
                  within the suspected network infrastructure.
                </p>
              </div>

              <div>
                <h5 className="font-metadata text-xs text-primary uppercase tracking-wide border-b border-outline-variant/30 pb-2 mb-3 font-bold">
                  Explainability Matrix
                </h5>
                <ul className="flex flex-col gap-3">
                  {entity.explainabilityFindings?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-surface p-3 rounded-lg border border-outline-variant/50">
                      <span className="material-symbols-outlined text-[20px] text-secondary-container mt-0.5">
                        check_circle
                      </span>
                      <div>
                        <span className="font-body-sm text-xs font-bold text-primary block">{item.title}</span>
                        <span className="font-body-sm text-xs text-on-surface-variant mt-0.5 block leading-relaxed">
                          {item.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Metrics & Verification */}
            <div className="flex flex-col gap-4">
              {/* Confidence Score Card */}
              <div className="border border-outline-variant rounded-lg p-5 bg-surface flex flex-col items-center text-center shadow-sm">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mb-3 font-bold">
                  AI Confidence Level
                </span>
                <div className="relative w-24 h-24 rounded-full border-4 border-surface-container-highest flex items-center justify-center mb-2">
                  <div className="absolute inset-0 rounded-full border-4 border-secondary-container" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0)', transform: 'rotate(-45deg)' }} />
                  <span className="font-page-title text-2xl font-bold text-primary z-10">
                    {entity.aiConfidence}
                    <span className="text-sm text-outline">%</span>
                  </span>
                </div>
                <span className="font-metadata text-xs text-primary bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-bold">
                  High Reliability (Cross-Verified)
                </span>
              </div>

              {/* Supporting Evidence Link Card */}
              <div
                onClick={() => openEvidenceModal()}
                className="border border-outline-variant rounded-lg p-4 bg-surface hover:border-secondary-container transition-colors cursor-pointer group flex justify-between items-center shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                    Supporting Evidence
                  </span>
                  <span className="font-section-heading text-sm text-primary group-hover:text-secondary-container transition-colors">
                    {entity.evidenceSourcesCount} Records Linked
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-secondary-container transition-colors text-[20px]">
                  open_in_new
                </span>
              </div>
            </div>
          </div>

          {/* Analyst Verification Action Block */}
          <div className="mt-auto pt-4 border-t border-outline-variant/60">
            <div className="bg-[#fff9f5] border border-secondary-fixed/50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-container text-[24px]">verified</span>
                <div>
                  <span className="font-body-md text-xs font-bold text-on-secondary-fixed block">
                    {isConfirmed
                      ? 'Finding Confirmed by Lead Investigator'
                      : 'AI-derived finding. Human verification required.'}
                  </span>
                  <span className="font-body-sm text-[11px] text-on-secondary-fixed/70">
                    {isConfirmed
                      ? 'Logged to immutable audit trail under Case 2026-0142.'
                      : 'Review the supporting evidence to validate structural influence hypothesis.'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert('Marked for supervisor review.')}
                  className="bg-white border border-outline-variant text-primary hover:bg-surface-container transition-colors px-3.5 py-2 rounded text-xs font-bold"
                >
                  Mark for Review
                </button>
                <button
                  onClick={handleConfirmFinding}
                  disabled={isConfirmed}
                  className="bg-secondary-container text-white hover:bg-secondary transition-all px-4 py-2 rounded text-xs font-bold shadow-sm disabled:opacity-60"
                >
                  {isConfirmed ? 'Finding Confirmed ✓' : 'Confirm Finding'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback overview / relationships tabs */}
      {activeTab !== 'ai_analysis' && (
        <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-section-heading text-base font-bold text-primary capitalize">
            {activeTab.replace('_', ' ')}
          </h3>
          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            Detailed information for {entity.name} within {activeTab} view.
          </p>
          <div className="pt-4 flex gap-3">
            <button
              onClick={() => navigate('/network-analysis')}
              className="px-4 py-2 bg-primary text-on-primary rounded text-xs font-bold hover:bg-primary-container"
            >
              View in Network Graph
            </button>
            <button
              onClick={() => openEvidenceModal()}
              className="px-4 py-2 border border-outline-variant text-primary rounded text-xs font-bold hover:bg-surface-container"
            >
              View Evidence Vault
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
