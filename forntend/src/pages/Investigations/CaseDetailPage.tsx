import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCaseContext } from '../../context/CaseContext';
import { caseService, evidenceService } from '../../services';
import { Case, EvidenceItem } from '../../types';

export const CaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { currentCase, setCurrentCase, openEvidenceModal } = useCaseContext();
  const [activeCase, setActiveCase] = useState<Case>(currentCase);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCaseDetail() {
      if (caseId) {
        setIsLoading(true);
        try {
          const res = await caseService.getCaseById(caseId);
          if (isMounted && res) {
            setActiveCase(res);
            setCurrentCase(res);
          }
        } catch (err) {
          console.warn('Error loading case detail:', err);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }
    }
    loadCaseDetail();
    return () => {
      isMounted = false;
    };
  }, [caseId]);

  useEffect(() => {
    let isMounted = true;
    async function loadEvidence() {
      try {
        const ev = await evidenceService.getEvidence(activeCase?.id);
        if (isMounted && ev) setEvidenceList(ev);
      } catch (err) {
        console.warn('Error loading evidence:', err);
      }
    }
    loadEvidence();
    return () => {
      isMounted = false;
    };
  }, [activeCase]);

  return (
    <div className="p-margin-page pb-24 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Case Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-page-title text-2xl font-bold text-on-surface">Case Intelligence</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-white font-label-caps text-[10px] uppercase tracking-wider font-bold shadow-sm">
              {activeCase.status || 'Active'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant font-label-caps text-[10px] uppercase tracking-wider font-bold">
              {activeCase.priority || 'High Priority'}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl font-medium">
            {activeCase.title}
          </p>
        </div>

        {/* Metadata Panel */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-3.5 rounded-lg border border-outline-variant shadow-sm">
          <div className="flex flex-col">
            <span className="font-metadata text-[10px] text-on-surface-variant uppercase mb-0.5">Case ID</span>
            <span className="font-body-sm text-xs text-on-surface font-bold">{activeCase.caseNumber}</span>
          </div>
          <div className="w-px h-8 bg-outline-variant" />
          <div className="flex flex-col">
            <span className="font-metadata text-[10px] text-on-surface-variant uppercase mb-0.5">Jurisdiction</span>
            <span className="font-body-sm text-xs text-on-surface font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {activeCase.jurisdiction}
            </span>
          </div>
          <div className="w-px h-8 bg-outline-variant" />
          <div className="flex flex-col">
            <span className="font-metadata text-[10px] text-on-surface-variant uppercase mb-0.5">Lead Investigator</span>
            <span className="font-body-sm text-xs text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">account_circle</span>
              {activeCase.leadInvestigator}
            </span>
          </div>
          <div className="w-px h-8 bg-outline-variant" />
          <button
            onClick={() => navigate('/reports')}
            className="bg-secondary-container text-white px-4 py-1.5 rounded-md font-body-sm text-xs font-bold hover:bg-secondary transition-colors shadow-sm ml-auto"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Cross-Case Linkage Visualization */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col relative min-h-[480px]">
          <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center z-10">
            <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container">hub</span>
              <span>Intelligence Linkage Graph</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-metadata text-[11px] text-on-surface-variant hidden sm:inline">
                Cross-case connection topology
              </span>
              <button
                onClick={() => navigate(`/network-analysis/${activeCase.id}`)}
                className="px-2.5 py-1 bg-primary text-on-primary rounded text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1"
              >
                <span>Full Graph</span>
                <span className="material-symbols-outlined text-[14px]">open_in_full</span>
              </button>
            </div>
          </div>

          {/* Graph Canvas Area */}
          <div className="flex-1 bg-surface-container-low relative p-6 overflow-hidden flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(#10232f 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Connecting Flow Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <path d="M 120 180 C 220 180, 220 220, 320 220" fill="none" stroke="#c3c7cc" strokeDasharray="4,4" strokeWidth="2" />
              <path d="M 320 220 C 420 220, 420 180, 520 180" fill="none" stroke="#fd974e" strokeWidth="2.5" className="animate-pulse" />
              <path d="M 520 180 C 620 180, 620 220, 720 220" fill="none" stroke="#c3c7cc" strokeDasharray="4,4" strokeWidth="2" />
            </svg>

            {/* Interactive Linkage Nodes */}
            <div className="relative w-full max-w-2xl h-64 flex items-center justify-between z-10 px-4">
              {/* Node 1: Current Case */}
              <div
                onClick={() => navigate(`/network-analysis/${activeCase.id}`)}
                className="w-40 bg-white p-3 rounded-lg border-2 border-primary shadow-sm cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded bg-primary-container text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">work</span>
                  </div>
                  <div>
                    <div className="font-label-caps text-[9px] text-on-surface-variant uppercase">Active Case</div>
                    <div className="font-body-sm text-xs text-primary font-bold">{activeCase.caseNumber}</div>
                  </div>
                </div>
                <div className="font-metadata text-[10px] text-outline truncate">{activeCase.title}</div>
              </div>

              {/* Node 2: Shared Telecom Device */}
              <div
                onClick={() => navigate('/entities/entity-phone-primary')}
                className="w-40 bg-white p-3 rounded-lg border border-outline-variant shadow-sm cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-surface-variant text-on-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">smartphone</span>
                  </div>
                  <div>
                    <div className="font-label-caps text-[9px] text-on-surface-variant uppercase">Shared Device</div>
                    <div className="font-body-sm text-xs text-on-surface font-bold">+91 98*** **341</div>
                  </div>
                </div>
                <div className="font-metadata text-[10px] text-secondary font-medium truncate">IMEI Intermediary</div>
              </div>

              {/* Node 3: Flagged Target Person */}
              <div
                onClick={() => navigate('/entities/entity-ramesh-kumar')}
                className="w-44 bg-white p-3 rounded-lg border-2 border-secondary-container shadow-[0_0_16px_rgba(253,151,78,0.3)] cursor-pointer hover:scale-105 transition-transform relative"
              >
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-error text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  !
                </span>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    RK
                  </div>
                  <div>
                    <div className="font-label-caps text-[9px] text-secondary-container uppercase font-bold">
                      Key Influencer
                    </div>
                    <div className="font-body-sm text-xs text-primary font-bold">Ramesh Kumar</div>
                  </div>
                </div>
                <div className="text-[9px] bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-bold inline-block">
                  High Flight Risk
                </div>
              </div>

              {/* Node 4: Linked Closed Case */}
              <div
                onClick={() => navigate('/investigations/case-2025-0891')}
                className="w-40 bg-white p-3 rounded-lg border border-outline-variant shadow-sm opacity-90 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded bg-surface-variant text-on-surface flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">account_balance</span>
                  </div>
                  <div>
                    <div className="font-label-caps text-[9px] text-on-surface-variant uppercase">Linked Case</div>
                    <div className="font-body-sm text-xs text-on-surface font-bold">2025-0891</div>
                  </div>
                </div>
                <div className="font-metadata text-[10px] text-on-surface-variant truncate">Hawala Channel (Closed)</div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex gap-1.5 bg-white/90 backdrop-blur p-1 rounded-md border border-outline-variant shadow-sm z-20">
              <button
                onClick={() => navigate(`/network-analysis/${activeCase.id}`)}
                className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface rounded transition"
                title="Full Screen Graph"
              >
                <span className="material-symbols-outlined text-[18px]">fit_screen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Signals & Case Summary */}
        <div className="flex flex-col gap-gutter">
          {/* Intelligence Signals */}
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex-1">
            <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
              <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">radar</span>
                <span>AI Intelligence Signals</span>
              </h3>
              <span className="font-label-caps text-[9px] bg-secondary-container/10 text-secondary-container px-2 py-0.5 rounded font-bold">
                Live
              </span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="bg-error-container/20 border border-error/20 p-3 rounded-lg">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-error text-[20px] mt-0.5">warning</span>
                  <div>
                    <h4 className="font-body-sm text-xs font-bold text-primary">Financial Anomaly Detected</h4>
                    <p className="font-metadata text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      High volume transfers moved across shell accounts linking target to Case 2025-0891.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low border border-outline-variant p-3 rounded-lg">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary-container text-[20px] mt-0.5">
                    location_searching
                  </span>
                  <div>
                    <h4 className="font-body-sm text-xs font-bold text-primary">Geospatial Overlap</h4>
                    <p className="font-metadata text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      Target device pinged same tower as known associate 12 times this week.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Summary */}
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-4 flex-1">
            <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">subject</span>
              <span>Case Synopsis</span>
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              {activeCase.description}
            </p>
          </div>
        </div>

        {/* Bottom Row: Evidence Sources Table */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
            <h3 className="font-section-heading text-sm font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">folder_open</span>
              <span>Evidence &amp; Verified Sources</span>
            </h3>
            <button
              onClick={() => openEvidenceModal()}
              className="text-secondary-container font-body-sm text-xs font-bold hover:text-secondary flex items-center gap-1"
            >
              <span>View All ({evidenceList.length})</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-outline-variant font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4 font-bold">Source Type</th>
                  <th className="p-4 font-bold">Reference ID</th>
                  <th className="p-4 font-bold">Date Added</th>
                  <th className="p-4 font-bold">Relevance Score</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-xs text-on-surface divide-y divide-outline-variant/60">
                {evidenceList.slice(0, 4).map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined text-outline text-[18px]">
                        {item.sourceType === 'FIR Document'
                          ? 'description'
                          : item.sourceType === 'CDR Analysis'
                          ? 'call'
                          : 'account_balance'}
                      </span>
                      <span>{item.sourceType}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-primary">{item.referenceId}</td>
                    <td className="p-4 text-on-surface-variant">{item.timestamp}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                          <div
                            className="bg-secondary-container h-full"
                            style={{ width: `${item.relevanceScore}%` }}
                          />
                        </div>
                        <span className="font-metadata text-[10px] font-bold">{item.relevanceScore}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEvidenceModal(item)}
                        className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container transition-colors"
                        title="View & Verify Evidence"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
