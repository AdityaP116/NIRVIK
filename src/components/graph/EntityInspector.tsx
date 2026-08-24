import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Entity } from '../../types';
import { useCaseContext } from '../../context/CaseContext';

interface EntityInspectorProps {
  entity: Entity;
  onExpandNetwork?: () => void;
  isExpanded?: boolean;
}

export const EntityInspector: React.FC<EntityInspectorProps> = ({
  entity,
  onExpandNetwork,
  isExpanded = false,
}) => {
  const navigate = useNavigate();
  const { openEvidenceModal, setIsAiDrawerOpen } = useCaseContext();

  return (
    <aside className="w-[340px] bg-white border-l border-outline-variant flex flex-col h-full z-10 shrink-0 shadow-[-4px_0_12px_rgba(38,56,69,0.05)]">
      {/* Entity Header Banner */}
      <div className="p-5 border-b border-outline-variant bg-surface-bright relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary-container" />
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0 border border-tertiary shadow-sm text-on-primary">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {entity.type === 'person'
                  ? 'person'
                  : entity.type === 'organization'
                  ? 'account_balance'
                  : entity.type === 'phone'
                  ? 'phone_iphone'
                  : 'directions_car'}
              </span>
            </div>
            <div>
              <h2 className="font-section-heading text-base font-bold text-primary leading-tight">{entity.name}</h2>
              <p className="font-metadata text-metadata text-on-surface-variant flex items-center gap-1 mt-0.5">
                ID: <span className="font-mono text-xs text-primary font-semibold">{entity.nationalId || entity.id}</span>
                <span className="material-symbols-outlined text-[14px] text-secondary-container" title="Identity Verified">
                  verified
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="text-outline hover:text-secondary-container transition-colors"
            title="Ask AI about this entity"
          >
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </button>
        </div>

        {/* Intelligence Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {entity.tags.map((tag, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-full font-label-caps text-[9px] uppercase tracking-wider font-bold ${
                tag.includes('Flight') || tag.includes('Risk')
                  ? 'bg-error-container/40 text-on-error-container border border-error/20'
                  : tag.includes('Key') || tag.includes('Bridge')
                  ? 'bg-secondary-container/10 text-secondary-container border border-secondary-container/30'
                  : 'bg-surface-variant text-on-surface-variant'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* Network Expansion Hero Action Button */}
        {onExpandNetwork && (
          <button
            onClick={onExpandNetwork}
            className={`w-full py-2.5 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
              isExpanded
                ? 'bg-surface-container text-primary border-outline-variant'
                : 'bg-secondary-container/10 text-secondary border-secondary-container/40 hover:bg-secondary-container hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExpanded ? 'device_hub' : 'hub'}
            </span>
            <span>{isExpanded ? 'Network Expanded (+4 Linked Nodes)' : 'Expand Intermediary Network'}</span>
          </button>
        )}

        {/* AI Synopsis */}
        <div className="space-y-1.5">
          <h3 className="font-metadata text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-secondary-container">auto_awesome</span>
            AI Synopsis
          </h3>
          <p className="font-body-sm text-xs text-primary leading-relaxed bg-surface-container-low p-3 rounded border border-outline-variant/60">
            {entity.synopsis}
          </p>
        </div>

        {/* Flagged Logic / Explainability */}
        {entity.flaggedReasons && entity.flaggedReasons.length > 0 && (
          <div className="border border-secondary-container/30 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-secondary-container/10 px-3 py-2 border-b border-secondary-container/30 flex justify-between items-center">
              <h3 className="font-metadata text-[10px] text-secondary font-bold uppercase tracking-wide flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                Flagged Logic &amp; Anomaly
              </h3>
              <span className="font-label-caps text-[9px] text-secondary bg-white px-2 py-0.5 rounded border border-secondary/20 font-bold">
                Confidence: {entity.aiConfidence}%
              </span>
            </div>
            <div className="p-3 space-y-2.5 bg-white divide-y divide-outline-variant/30">
              {entity.flaggedReasons.map((reason, idx) => (
                <div key={idx} className={`flex justify-between items-start ${idx > 0 ? 'pt-2.5' : ''}`}>
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-secondary-container text-sm mt-0.5">
                      {reason.icon}
                    </span>
                    <div>
                      <p className="font-body-sm text-xs text-primary font-bold leading-tight">{reason.title}</p>
                      <p className="font-metadata text-[10px] text-outline mt-0.5">{reason.description}</p>
                    </div>
                  </div>
                  <span className="font-metadata font-bold text-primary text-[11px] whitespace-nowrap ml-2">
                    {reason.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Centrality Metrics Grid */}
        <div>
          <h3 className="font-metadata text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mb-2">
            Centrality Metrics
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="border border-outline-variant p-2.5 rounded bg-surface-bright">
              <div className="font-label-caps text-outline uppercase text-[9px] mb-0.5">Degree Centrality</div>
              <div className="font-section-heading text-base text-primary font-bold">
                {entity.degreeCentrality}{' '}
                <span className="text-xs font-normal text-outline">links</span>
              </div>
            </div>
            <div className="border border-outline-variant p-2.5 rounded bg-surface-bright">
              <div className="font-label-caps text-outline uppercase text-[9px] mb-0.5">Betweenness Score</div>
              <div className="font-section-heading text-base text-primary font-bold">
                {entity.betweennessCentrality}{' '}
                <span className="text-xs font-normal text-secondary-container font-bold">High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Links Preview */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-metadata text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
              Direct Relationships ({entity.directConnections})
            </h3>
          </div>
          <div className="space-y-1.5">
            <div
              onClick={() => navigate('/entities/entity-front-corp')}
              className="flex items-center gap-3 p-2 border border-outline-variant rounded hover:bg-surface-container-low transition-colors cursor-pointer group"
            >
              <div className="w-7 h-7 rounded bg-surface flex items-center justify-center border border-outline-variant">
                <span className="material-symbols-outlined text-on-surface-variant text-[14px]">account_balance</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-sm text-xs text-primary font-medium truncate group-hover:text-secondary-container">
                  Front Corp Ltd.
                </p>
                <p className="font-metadata text-[9px] text-outline truncate">Director / Signatory</p>
              </div>
              <span className="material-symbols-outlined text-outline text-[14px]">chevron_right</span>
            </div>

            <div
              onClick={() => navigate('/entities/entity-a-sharma')}
              className="flex items-center gap-3 p-2 border border-outline-variant rounded hover:bg-surface-container-low transition-colors cursor-pointer group"
            >
              <div className="w-7 h-7 rounded bg-error-container/40 flex items-center justify-center border border-error/20">
                <span className="material-symbols-outlined text-on-error-container text-[14px]">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-sm text-xs text-primary font-medium truncate group-hover:text-secondary-container">
                  A. Sharma
                </p>
                <p className="font-metadata text-[9px] text-outline truncate">Financial Link (Confirmed)</p>
              </div>
              <span className="material-symbols-outlined text-outline text-[14px]">chevron_right</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-outline-variant bg-surface-bright space-y-2">
        <button
          onClick={() => navigate(`/entities/${entity.id}`)}
          className="w-full py-2 bg-secondary-container text-on-primary font-section-heading text-xs font-bold rounded hover:bg-secondary transition-colors flex justify-center items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">manage_search</span>
          Investigate Full Dossier
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => openEvidenceModal()}
            className="py-1.5 border border-primary text-primary font-body-sm text-xs font-medium rounded hover:bg-surface-container-low transition-colors flex justify-center items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">source</span>
            Evidence ({entity.evidenceSourcesCount})
          </button>
          <button
            onClick={() => alert(`Added ${entity.name} to active workspace pinboard.`)}
            className="py-1.5 border border-outline-variant text-on-surface-variant font-body-sm text-xs font-medium rounded hover:text-primary hover:border-primary transition-colors flex justify-center items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">add_box</span>
            Pin Entity
          </button>
        </div>
      </div>
    </aside>
  );
};
