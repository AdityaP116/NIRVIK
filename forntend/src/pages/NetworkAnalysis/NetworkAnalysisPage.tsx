import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CytoscapeGraph } from '../../components/graph/CytoscapeGraph';
import { EntityInspector } from '../../components/graph/EntityInspector';
import { initialGraphData } from '../../mock/graph';
import { mockEntities } from '../../mock/entities';
import { graphService, entityService } from '../../services';
import { GraphData, Entity } from '../../types';

export const NetworkAnalysisPage: React.FC = () => {
  const { caseId } = useParams();
  const [graphData, setGraphData] = useState<GraphData>(initialGraphData);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('entity-ramesh-kumar');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'person',
    'organization',
    'phone',
    'account',
    'vehicle',
    'location',
    'case',
  ]);

  const [entities, setEntities] = useState<Entity[]>(mockEntities);

  useEffect(() => {
    let isMounted = true;
    async function loadNetworkGraph() {
      setIsLoading(true);
      try {
        const [gData, eList] = await Promise.all([
          graphService.getGraphData(caseId),
          entityService.getEntities(),
        ]);
        if (isMounted) {
          if (gData && gData.nodes && gData.nodes.length > 0) {
            setGraphData(gData);
          }
          if (eList && eList.length > 0) {
            setEntities(eList);
          }
        }
      } catch (err) {
        console.warn('Network graph load error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadNetworkGraph();
    return () => {
      isMounted = false;
    };
  }, [caseId]);

  // Current selected entity for inspector
  const currentEntity: Entity =
    entities.find((e) => e.id === selectedEntityId || e.nationalId === selectedEntityId) || entities[0] || mockEntities[0];

  const handleSelectNode = (nodeId: string) => {
    setSelectedEntityId(nodeId);
  };

  const handleExpandNetwork = async () => {
    if (!isExpanded) {
      const expanded = await graphService.getExpandedGraph(graphData, caseId);
      setGraphData(expanded);
      setIsExpanded(true);
    } else {
      const reset = await graphService.getGraphData(caseId);
      setGraphData(reset);
      setIsExpanded(false);
    }
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* LEFT COLUMN: Filter & Configuration Panel (280px) */}
      <aside className="w-[280px] bg-white border-r border-outline-variant flex flex-col h-full z-10 shrink-0 select-none">
        {/* Panel Header */}
        <div className="p-panel-padding border-b border-outline-variant bg-surface-bright">
          <h2 className="font-section-heading text-sm font-bold text-primary mb-0.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Graph Parameters</span>
          </h2>
          <p className="font-body-sm text-[11px] text-on-surface-variant">
            Configure visual intelligence filters
          </p>
        </div>

        {/* Filters Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-panel-padding space-y-5 custom-scrollbar">
          {/* Entity Types Filter */}
          <div>
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mb-2 font-bold">
              Entity Types
            </h3>
            <div className="space-y-1 text-xs">
              <label className="flex items-center gap-2.5 p-1.5 hover:bg-surface-container-low rounded cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes('person')}
                  onChange={() => toggleType('person')}
                  className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container"
                />
                <span className="material-symbols-outlined text-primary text-[16px]">person</span>
                <span className="font-body-sm text-primary flex-1 font-medium">Person</span>
                <span className="font-metadata text-[10px] text-outline">124</span>
              </label>

              <label className="flex items-center gap-2.5 p-1.5 hover:bg-surface-container-low rounded cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes('organization')}
                  onChange={() => toggleType('organization')}
                  className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container"
                />
                <span className="material-symbols-outlined text-primary text-[16px]">account_balance</span>
                <span className="font-body-sm text-primary flex-1 font-medium">Corporate Entity</span>
                <span className="font-metadata text-[10px] text-outline">42</span>
              </label>

              <label className="flex items-center gap-2.5 p-1.5 hover:bg-surface-container-low rounded cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes('phone')}
                  onChange={() => toggleType('phone')}
                  className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container"
                />
                <span className="material-symbols-outlined text-primary text-[16px]">phone_iphone</span>
                <span className="font-body-sm text-primary flex-1 font-medium">Phone / IMSI</span>
                <span className="font-metadata text-[10px] text-outline">89</span>
              </label>

              <label className="flex items-center gap-2.5 p-1.5 hover:bg-surface-container-low rounded cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes('account')}
                  onChange={() => toggleType('account')}
                  className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container"
                />
                <span className="material-symbols-outlined text-primary text-[16px]">account_balance_wallet</span>
                <span className="font-body-sm text-primary flex-1 font-medium">Bank Account</span>
                <span className="font-metadata text-[10px] text-outline">211</span>
              </label>

              <label className="flex items-center gap-2.5 p-1.5 hover:bg-surface-container-low rounded cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes('vehicle')}
                  onChange={() => toggleType('vehicle')}
                  className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container"
                />
                <span className="material-symbols-outlined text-primary text-[16px]">directions_car</span>
                <span className="font-body-sm text-primary flex-1 font-medium">Vehicle / Asset</span>
                <span className="font-metadata text-[10px] text-outline">18</span>
              </label>
            </div>
          </div>

          <hr className="border-outline-variant/60" />

          {/* Relationship Links */}
          <div>
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mb-2 font-bold">
              Relationship Links
            </h3>
            <div className="space-y-1 text-xs">
              <label className="flex items-center gap-2.5 p-1.5 hover:bg-surface-container-low rounded cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container"
                />
                <div className="w-3.5 h-0.5 bg-secondary-container" />
                <span className="font-body-sm text-primary flex-1 font-medium">Financial Flow</span>
              </label>
              <label className="flex items-center gap-2.5 p-1.5 hover:bg-surface-container-low rounded cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container"
                />
                <div className="w-3.5 h-0.5 border-t border-dashed border-outline-variant" />
                <span className="font-body-sm text-primary flex-1 font-medium">Communication Log</span>
              </label>
              <label className="flex items-center gap-2.5 p-1.5 hover:bg-surface-container-low rounded cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container"
                />
                <div className="w-3.5 h-0.5 bg-outline-variant" />
                <span className="font-body-sm text-primary flex-1 font-medium">Corporate Association</span>
              </label>
            </div>
          </div>

          <hr className="border-outline-variant/60" />

          {/* Confidence Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                AI Confidence Threshold
              </h3>
              <span className="font-metadata text-xs text-secondary-container font-bold">
                {confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-secondary-container"
            />
            <div className="flex justify-between text-[10px] text-outline mt-1 font-metadata">
              <span>0% (All Links)</span>
              <span>100% (Confirmed)</span>
            </div>
          </div>

          <hr className="border-outline-variant/60" />

          {/* Temporal Range */}
          <div>
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mb-2 font-bold">
              Temporal Range
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="font-metadata text-[9px] text-outline mb-0.5 block">Start</label>
                <input
                  type="date"
                  defaultValue="2025-01-01"
                  className="w-full text-[11px] border border-outline-variant rounded p-1 text-primary"
                />
              </div>
              <div>
                <label className="font-metadata text-[9px] text-outline mb-0.5 block">End</label>
                <input
                  type="date"
                  defaultValue="2026-10-31"
                  className="w-full text-[11px] border border-outline-variant rounded p-1 text-primary"
                />
              </div>
            </div>
            <button
              onClick={() => alert('Applied temporal filter across network relationships.')}
              className="w-full mt-2.5 py-1.5 border border-outline-variant rounded font-metadata text-xs text-primary hover:bg-surface-container transition-colors font-semibold"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </aside>

      {/* CENTER COLUMN: Interactive Cytoscape Graph Canvas */}
      <section className="flex-1 relative bg-surface-container flex flex-col overflow-hidden min-w-0">
        {isLoading && (
          <div className="absolute top-4 left-4 z-20 bg-surface-container-lowest/90 border border-outline-variant px-3 py-1.5 rounded-full text-xs font-bold text-primary flex items-center gap-2 shadow">
            <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
            <span>Fetching intelligence graph...</span>
          </div>
        )}
        <CytoscapeGraph
          data={graphData}
          selectedNodeId={selectedEntityId}
          onSelectNode={handleSelectNode}
          confidenceThreshold={confidenceThreshold}
          selectedEntityTypes={selectedTypes}
        />
      </section>

      {/* RIGHT COLUMN: Entity Intelligence Inspector */}
      <EntityInspector
        entity={currentEntity}
        onExpandNetwork={handleExpandNetwork}
        isExpanded={isExpanded}
      />
    </div>
  );
};
