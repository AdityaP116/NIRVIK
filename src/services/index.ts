import { Case, Entity, GraphData, IntelligenceAlert, TimelineEvent, EvidenceItem, AuditEvent, DocumentIntelligenceItem, AIQueryResponse, DataSourceIntegration, PriorityNetworkItem, WomenSafetyInsight, User } from '../types';
import { mockCases } from '../mock/cases';
import { mockEntities } from '../mock/entities';
import { initialGraphData, expandedGraphNodes, expandedGraphEdges } from '../mock/graph';
import { mockAlerts } from '../mock/alerts';
import { mockTimelineEvents } from '../mock/timeline';
import { mockEvidence } from '../mock/evidence';
import { mockAuditEvents } from '../mock/audit';
import { mockDocuments } from '../mock/documents';
import { mockDataSources, mockPriorityNetworks } from '../mock/analytics';
import { mockWomenSafetyInsights } from '../mock/womenSafety';
import { mockUsers, currentOfficer } from '../mock/users';

// Case Service
export const caseService = {
  async getCases(): Promise<Case[]> {
    return Promise.resolve([...mockCases]);
  },
  async getCaseById(caseId: string): Promise<Case | undefined> {
    return Promise.resolve(mockCases.find(c => c.id === caseId || c.caseNumber === caseId));
  },
};

// Entity Service
export const entityService = {
  async getEntities(): Promise<Entity[]> {
    return Promise.resolve([...mockEntities]);
  },
  async getEntityById(entityId: string): Promise<Entity | undefined> {
    return Promise.resolve(mockEntities.find(e => e.id === entityId || e.nationalId === entityId));
  },
  async searchEntities(query: string): Promise<Entity[]> {
    const q = query.toLowerCase();
    return Promise.resolve(
      mockEntities.filter(
        e =>
          e.name.toLowerCase().includes(q) ||
          e.aliases?.some(a => a.toLowerCase().includes(q)) ||
          e.nationalId?.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q)
      )
    );
  },
};

// Graph Service
export const graphService = {
  async getGraphData(caseId?: string): Promise<GraphData> {
    return Promise.resolve(JSON.parse(JSON.stringify(initialGraphData)));
  },
  async getExpandedGraph(currentData: GraphData): Promise<GraphData> {
    const newNodes = [...currentData.nodes];
    const newEdges = [...currentData.edges];

    expandedGraphNodes.forEach(node => {
      if (!newNodes.some(n => n.id === node.id)) {
        newNodes.push(node);
      }
    });

    expandedGraphEdges.forEach(edge => {
      if (!newEdges.some(e => e.id === edge.id)) {
        newEdges.push(edge);
      }
    });

    return Promise.resolve({ nodes: newNodes, edges: newEdges });
  },
};

// Alert Service
export const alertService = {
  async getAlerts(): Promise<IntelligenceAlert[]> {
    return Promise.resolve([...mockAlerts]);
  },
  async getAlertById(alertId: string): Promise<IntelligenceAlert | undefined> {
    return Promise.resolve(mockAlerts.find(a => a.id === alertId));
  },
};

// Timeline Service
export const timelineService = {
  async getEvents(caseId?: string): Promise<TimelineEvent[]> {
    return Promise.resolve([...mockTimelineEvents]);
  },
};

// Evidence Service
export const evidenceService = {
  async getEvidence(caseId?: string): Promise<EvidenceItem[]> {
    return Promise.resolve([...mockEvidence]);
  },
  async getEvidenceById(evidenceId: string): Promise<EvidenceItem | undefined> {
    return Promise.resolve(mockEvidence.find(e => e.id === evidenceId || e.referenceId === evidenceId));
  },
  async verifyIntegrity(evidenceId: string): Promise<{ verified: boolean; sha256: string; timestamp: string }> {
    const item = mockEvidence.find(e => e.id === evidenceId || e.referenceId === evidenceId);
    return Promise.resolve({
      verified: true,
      sha256: item?.sha256 || '8f72a491dcb0e493b890f91ac891340982dfb1029cbaef990142e0192837bcde',
      timestamp: new Date().toISOString(),
    });
  },
};

// Audit Service
export const auditService = {
  async getAuditEvents(): Promise<AuditEvent[]> {
    return Promise.resolve([...mockAuditEvents]);
  },
  async logAuditEvent(action: string, resource: string, caseNumber: string = '2026-0142'): Promise<AuditEvent> {
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      officer: currentOfficer.name,
      officerRole: currentOfficer.rank,
      action,
      resource,
      caseId: 'case-2026-0142',
      caseNumber,
      integrity: 'Verified',
      hash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      ipAddress: '10.14.88.21',
    };
    mockAuditEvents.unshift(newEvent);
    return Promise.resolve(newEvent);
  },
};

// Document Intelligence Service
export const documentService = {
  async getDocuments(): Promise<DocumentIntelligenceItem[]> {
    return Promise.resolve([...mockDocuments]);
  },
  async getDocumentById(id: string): Promise<DocumentIntelligenceItem | undefined> {
    return Promise.resolve(mockDocuments.find(d => d.id === id || d.documentId === id));
  },
};

// Analytics Service
export const analyticsService = {
  async getDataSources(): Promise<DataSourceIntegration[]> {
    return Promise.resolve([...mockDataSources]);
  },
  async getPriorityNetworks(): Promise<PriorityNetworkItem[]> {
    return Promise.resolve([...mockPriorityNetworks]);
  },
  async getWomenSafetyInsights(): Promise<WomenSafetyInsight[]> {
    return Promise.resolve([...mockWomenSafetyInsights]);
  },
};

// AI Investigation Assistant Service
export const aiService = {
  async queryAssistant(query: string, caseId?: string): Promise<AIQueryResponse> {
    const q = query.toLowerCase();

    if (q.includes('ramesh') && (q.includes('0891') || q.includes('case'))) {
      return Promise.resolve({
        id: `ai-res-${Date.now()}`,
        query,
        answer: 'Ramesh Kumar acts as a structural bridge between active Case 2026-0142 and closed Hawala Case 2025-0891. Communication logs confirm high-frequency burst messaging with secondary broker Vikram R. and corporate financial transfers through Front Corp Ltd. to offshore account #8843.',
        confidence: 94,
        summary: 'Cross-case intermediary link verified with 94% pattern correlation.',
        relatedEntities: [
          { id: 'entity-ramesh-kumar', name: 'Ramesh Kumar', type: 'person' },
          { id: 'entity-front-corp', name: 'Front Corp Ltd.', type: 'organization' },
          { id: 'entity-offshore-acc', name: 'Offshore Acc #8843', type: 'account' },
        ],
        relatedCases: [
          { id: 'case-2026-0142', caseNumber: '2026-0142', title: 'Organized Financial Network' },
          { id: 'case-2025-0891', caseNumber: '2025-0891', title: 'Operation Golden Gateway' },
        ],
        evidenceCitations: [
          { id: 'ev-fir-01', referenceId: 'FIR-MH-24-091', title: 'FIR Document XYZ Market' },
          { id: 'ev-stmt-01', referenceId: 'STMT-HDFC-889', title: 'Bank Statement Front Corp' },
          { id: 'ev-cdr-01', referenceId: 'CDR-98-Q3', title: 'CDR Analysis' },
        ],
        graphFocusNodeId: 'entity-ramesh-kumar',
      });
    }

    if (q.includes('community') || q.includes('bridge') || q.includes('central')) {
      return Promise.resolve({
        id: `ai-res-${Date.now()}`,
        query,
        answer: 'Graph betweenness centrality algorithm identifies Ramesh Kumar (score: 0.84) as the sole active bridge connecting Cluster Alpha (Mumbai corporate front) to Cluster Beta (Pune logistics hub). Removal or surveillance of this node severely disrupts syndicate operational cadence.',
        confidence: 96,
        summary: 'Structural network bottleneck confirmed with betweenness centrality of 0.84.',
        relatedEntities: [
          { id: 'entity-ramesh-kumar', name: 'Ramesh Kumar', type: 'person' },
          { id: 'entity-a-sharma', name: 'A. Sharma', type: 'person' },
          { id: 'entity-suresh-patil', name: 'Suresh Patil', type: 'person' },
        ],
        relatedCases: [
          { id: 'case-2026-0142', caseNumber: '2026-0142', title: 'Organized Financial Network' },
        ],
        evidenceCitations: [
          { id: 'ev-cdr-01', referenceId: 'CDR-98-Q3', title: 'CDR Analysis' },
        ],
        graphFocusNodeId: 'entity-ramesh-kumar',
      });
    }

    // Default intelligent response
    return Promise.resolve({
      id: `ai-res-${Date.now()}`,
      query,
      answer: `Analytical inquiry executed across 4,286 connected entities and 142 active cases. Analysis indicates correlated operational signatures linking Case 2026-0142 with shared shell accounts and co-located communication nodes in Maharashtra.`,
      confidence: 89,
      summary: 'Automated synthesis across active intelligence graphs.',
      relatedEntities: [
        { id: 'entity-ramesh-kumar', name: 'Ramesh Kumar', type: 'person' },
        { id: 'entity-front-corp', name: 'Front Corp Ltd.', type: 'organization' },
      ],
      relatedCases: [
        { id: 'case-2026-0142', caseNumber: '2026-0142', title: 'Organized Financial Network' },
      ],
      evidenceCitations: [
        { id: 'ev-fir-01', referenceId: 'FIR-MH-24-091', title: 'FIR Document' },
      ],
    });
  },
};

// Auth Service
export const authService = {
  async login(officerId: string, _password: string): Promise<User> {
    const officer = mockUsers.find(u => u.badgeId.toLowerCase() === officerId.toLowerCase()) || currentOfficer;
    localStorage.setItem('nirvik_token', 'mock-auth-jwt-nirvik-2026');
    localStorage.setItem('nirvik_user', JSON.stringify(officer));
    return Promise.resolve(officer);
  },
  async logout(): Promise<void> {
    localStorage.removeItem('nirvik_token');
    localStorage.removeItem('nirvik_user');
    return Promise.resolve();
  },
  getCurrentUser(): User {
    const saved = localStorage.getItem('nirvik_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return currentOfficer;
      }
    }
    return currentOfficer;
  },
};
