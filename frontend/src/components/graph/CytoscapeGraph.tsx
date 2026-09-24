import React, { useEffect, useRef, useState, useCallback } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { GraphData, GraphNode, GraphEdge } from '../../types';

interface CytoscapeGraphProps {
  data: GraphData;
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string, nodeData?: GraphNode) => void;
  onSelectEdge?: (edgeId: string, edgeData?: GraphEdge) => void;
  confidenceThreshold?: number;
  selectedEntityTypes?: string[];
}

export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  data,
  selectedNodeId = 'entity-ramesh-kumar',
  onSelectNode,
  onSelectEdge,
  confidenceThreshold = 0,
  selectedEntityTypes,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [activeLayout, setActiveLayout] = useState<'cose' | 'concentric' | 'circle'>('cose');
  const [searchTerm, setSearchTerm] = useState('');

  const initCytoscape = useCallback(() => {
    if (!containerRef.current) return;

    // Filter nodes and edges by entity types and confidence
    const filteredNodes = data.nodes.filter((node) => {
      if (selectedEntityTypes && selectedEntityTypes.length > 0) {
        if (!selectedEntityTypes.includes(node.type)) return false;
      }
      return true;
    });

    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

    const filteredEdges = data.edges.filter((edge) => {
      if (!filteredNodeIds.has(edge.source) || !filteredNodeIds.has(edge.target)) return false;
      if (confidenceThreshold > 0 && (edge.confidence || 100) < confidenceThreshold) return false;
      return true;
    });

    const elements = [
      ...filteredNodes.map((node) => ({
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          isFlagged: node.isFlagged,
          importance: node.importance || 0.5,
          betweenness: node.betweenness || 0,
          confidence: node.confidence || 90,
          verificationStatus: node.verificationStatus || 'confirmed',
          raw: node,
        },
      })),
      ...filteredEdges.map((edge) => ({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label || edge.relationship,
          relationship: edge.relationship,
          confidence: edge.confidence || 90,
          verificationStatus: edge.verificationStatus || 'confirmed',
          type: edge.type || 'association',
          raw: edge,
        },
      })),
    ];

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        // Standard Node Style
        {
          selector: 'node',
          style: {
            'background-color': '#10232f',
            'border-width': 2,
            'border-color': '#ffffff',
            'label': 'data(label)',
            'color': '#10232f',
            'font-family': 'Inter, sans-serif',
            'font-size': '11px',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'width': 'mapData(importance, 0.2, 1, 32, 54)',
            'height': 'mapData(importance, 0.2, 1, 32, 54)',
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.85,
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
          },
        },
        // Flagged / High Risk Node
        {
          selector: 'node[?isFlagged]',
          style: {
            'border-color': '#fd974e',
            'border-width': 3,
            'border-opacity': 1,
            'underlay-color': '#fd974e',
            'underlay-padding': 4,
            'underlay-opacity': 0.4,
            'underlay-shape': 'round-rectangle',
          },
        },
        // Selected Node Style (e.g. Ramesh Kumar)
        {
          selector: 'node:selected, node[id = "entity-ramesh-kumar"]',
          style: {
            'border-color': '#fd974e',
            'border-width': 4,
            'background-color': '#10232f',
            'underlay-color': '#fd974e',
            'underlay-padding': 6,
            'underlay-opacity': 0.5,
          },
        },
        // Entity Type Colors & Shapes
        {
          selector: 'node[type = "organization"]',
          style: {
            'shape': 'round-rectangle',
          },
        },
        {
          selector: 'node[type = "case"]',
          style: {
            'shape': 'diamond',
            'background-color': '#263845',
          },
        },
        {
          selector: 'node[type = "account"]',
          style: {
            'shape': 'hexagon',
          },
        },
        // Edge Styles
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#c3c7cc',
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#c3c7cc',
            'arrow-scale': 0.8,
            'label': 'data(label)',
            'font-family': 'Inter, sans-serif',
            'font-size': '9px',
            'color': '#73777c',
            'text-background-color': '#f5fafa',
            'text-background-opacity': 0.9,
            'text-background-padding': '2px',
            'text-rotation': 'autorotate',
          },
        },
        // Inferred Relationships (Dashed)
        {
          selector: 'edge[verificationStatus = "inferred"]',
          style: {
            'line-style': 'dashed',
            'line-dash-pattern': [6, 4],
            'line-color': '#c3c7cc',
            'target-arrow-color': '#c3c7cc',
          },
        },
        // Financial Transactions Highlight
        {
          selector: 'edge[type = "financial"]',
          style: {
            'line-color': '#fd974e',
            'target-arrow-color': '#fd974e',
            'width': 2,
            'color': '#964900',
            'font-weight': 600,
          },
        },
      ],
      layout: {
        name: activeLayout,
        animate: true,
        animationDuration: 500,
        padding: 50,
      },
    });

    // Event listeners
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const nodeData = node.data('raw') as GraphNode;
      if (onSelectNode) {
        onSelectNode(node.id(), nodeData);
      }
    });

    cy.on('tap', 'edge', (evt: EventObject) => {
      const edge = evt.target;
      const edgeData = edge.data('raw') as GraphEdge;
      if (onSelectEdge) {
        onSelectEdge(edge.id(), edgeData);
      }
    });

    // Highlight selected node
    if (selectedNodeId) {
      const targetNode = cy.getElementById(selectedNodeId);
      if (targetNode.length > 0) {
        targetNode.select();
      }
    }

    cyRef.current = cy;
  }, [data, selectedNodeId, onSelectNode, onSelectEdge, confidenceThreshold, selectedEntityTypes, activeLayout]);

  useEffect(() => {
    initCytoscape();
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [initCytoscape]);

  // Controls
  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.25);
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 0.8);
    }
  };

  const handleFit = () => {
    if (cyRef.current) {
      cyRef.current.fit(undefined, 40);
    }
  };

  const handleSearchNode = (term: string) => {
    setSearchTerm(term);
    if (!cyRef.current || !term.trim()) return;

    const matched = cyRef.current.nodes().filter((n) => {
      const label = n.data('label') as string;
      return label.toLowerCase().includes(term.toLowerCase());
    });

    if (matched.length > 0) {
      cyRef.current.elements().unselect();
      matched.select();
      cyRef.current.center(matched);
      cyRef.current.zoom(1.2);
      if (onSelectNode) {
        onSelectNode(matched[0].id(), matched[0].data('raw'));
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-surface-container overflow-hidden">
      {/* Background Technical Grid Pattern */}
      <svg className="absolute inset-0 pointer-events-none opacity-25" height="100%" width="100%">
        <defs>
          <pattern height="40" id="network-grid" patternUnits="userSpaceOnUse" width="40">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#73777c" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect fill="url(#network-grid)" height="100%" width="100%" />
      </svg>

      {/* Floating Graph Stats & Search Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        {/* Metric Chip */}
        <div className="bg-white/95 backdrop-blur-sm border border-outline-variant rounded-lg p-2.5 shadow-sm flex items-center gap-3">
          <div className="text-center px-1">
            <div className="font-section-heading text-sm font-bold text-primary">{data.nodes.length}</div>
            <div className="font-label-caps text-[9px] text-outline uppercase">Total Nodes</div>
          </div>
          <div className="w-px h-6 bg-outline-variant" />
          <div className="text-center px-1">
            <div className="font-section-heading text-sm font-bold text-primary">{data.edges.length}</div>
            <div className="font-label-caps text-[9px] text-outline uppercase">Links</div>
          </div>
          <div className="w-px h-6 bg-outline-variant" />
          <div className="text-center px-1">
            <div className="font-section-heading text-sm font-bold text-secondary-container">
              {data.nodes.filter((n) => n.isFlagged).length}
            </div>
            <div className="font-label-caps text-[9px] text-secondary-container uppercase">Flagged</div>
          </div>
        </div>

        {/* In-Graph Node Search */}
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchNode(e.target.value)}
            placeholder="Focus node..."
            className="w-44 pl-8 pr-2.5 py-1.5 bg-white/95 border border-outline-variant rounded-md text-xs text-primary focus:border-primary focus:ring-0 shadow-sm"
          />
        </div>
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
        {/* Zoom & Fit Toolbar */}
        <div className="bg-white border border-outline-variant rounded-md shadow-sm flex flex-col overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors border-b border-outline-variant"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors border-b border-outline-variant"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <button
            onClick={handleFit}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
            title="Fit to Screen"
          >
            <span className="material-symbols-outlined text-[18px]">fit_screen</span>
          </button>
        </div>

        {/* Layout Switcher */}
        <div className="bg-white border border-outline-variant rounded-md p-1 shadow-sm flex gap-1 text-[11px] font-medium">
          <button
            onClick={() => setActiveLayout('cose')}
            className={`px-2 py-1 rounded transition-colors ${
              activeLayout === 'cose' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Force
          </button>
          <button
            onClick={() => setActiveLayout('concentric')}
            className={`px-2 py-1 rounded transition-colors ${
              activeLayout === 'concentric' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Hierarchy
          </button>
          <button
            onClick={() => setActiveLayout('circle')}
            className={`px-2 py-1 rounded transition-colors ${
              activeLayout === 'circle' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Radial
          </button>
        </div>

        {/* Visual Graph Legend */}
        <div className="bg-white/95 backdrop-blur-sm border border-outline-variant rounded-lg p-3 shadow-sm w-44">
          <h4 className="font-label-caps text-[9px] text-primary uppercase mb-2 border-b border-outline-variant pb-1 font-bold">
            Graph Legend
          </h4>
          <div className="space-y-1.5 text-[11px] text-on-surface-variant">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span>Standard Entity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-secondary-container bg-primary" />
              <span className="text-secondary-container font-semibold">Flagged / High Risk</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-4 h-0.5 bg-outline-variant" />
              <span>Confirmed Link</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 border-t border-dashed border-outline-variant" />
              <span>Inferred Link</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cytoscape Mount Container */}
      <div ref={containerRef} className="cytoscape-container" />
    </div>
  );
};
