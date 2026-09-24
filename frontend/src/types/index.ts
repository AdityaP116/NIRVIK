export type User = {
  id: string;
  badgeId: string;
  name: string;
  rank: string;
  station: string;
  jurisdiction: string;
  role: string;
  avatarUrl?: string;
};

export type CaseStatus = 'active' | 'closed' | 'review' | 'pending';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type Case = {
  id: string;
  caseNumber: string;
  title: string;
  type: string;
  status: CaseStatus;
  priority: PriorityLevel;
  jurisdiction: string;
  leadInvestigator: string;
  assignedTeam: string[];
  createdDate: string;
  lastUpdated: string;
  description: string;
  totalEntities: number;
  totalSignals: number;
  totalEvidence: number;
  tags: string[];
  summary: string;
};

export type EntityType = 
  | 'person'
  | 'organization'
  | 'phone'
  | 'account'
  | 'vehicle'
  | 'location'
  | 'device'
  | 'event'
  | 'document'
  | 'case';

export type VerificationStatus = 'confirmed' | 'inferred' | 'review';

export type Entity = {
  id: string;
  name: string;
  type: EntityType;
  aliases?: string[];
  nationalId?: string;
  phoneNumbers?: string[];
  addresses?: string[];
  roleDescription?: string;
  photoUrl?: string;
  primaryRisk?: string;
  isFlagged?: boolean;
  betweennessCentrality: number;
  degreeCentrality: number;
  directConnections: number;
  totalCasesLinked: number;
  activeCasesLinked: number;
  evidenceSourcesCount: number;
  aiConfidence: number;
  verificationStatus: VerificationStatus;
  tags: string[];
  synopsis: string;
  flaggedReasons?: {
    title: string;
    description: string;
    count: string;
    icon: string;
  }[];
  explainabilityFindings?: {
    title: string;
    description: string;
    verified: boolean;
  }[];
};

export type GraphNode = {
  id: string;
  label: string;
  type: EntityType;
  importance?: number;
  betweenness?: number;
  confidence?: number;
  verificationStatus?: VerificationStatus;
  isFlagged?: boolean;
  isSelected?: boolean;
  metadata?: Record<string, unknown>;
  icon?: string;
  cluster?: string;
  subtitle?: string;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  relationship: string;
  confidence?: number;
  verificationStatus?: VerificationStatus;
  timestamp?: string;
  amount?: string;
  sourceId?: string;
  type?: 'financial' | 'communication' | 'association' | 'location';
};

export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export type IntelligenceAlert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: 'financial' | 'communication' | 'network' | 'geospatial' | 'trafficking';
  timestamp: string;
  caseId: string;
  caseNumber: string;
  entityId?: string;
  entityName?: string;
  confidence: number;
  status: 'active' | 'investigating' | 'dismissed' | 'resolved';
  requiresReview: boolean;
  metrics?: { label: string; value: string }[];
};

export type TimelineEventType = 
  | 'ai_finding'
  | 'call'
  | 'transaction'
  | 'location'
  | 'report'
  | 'meeting'
  | 'surveillance';

export type TimelineEvent = {
  id: string;
  timestamp: string;
  dateStr: string;
  timeStr: string;
  type: TimelineEventType;
  title: string;
  description: string;
  caseId: string;
  caseNumber: string;
  entityId?: string;
  entityName?: string;
  badgeLabel: string;
  isAiInsight?: boolean;
  confidence?: number;
  details?: Record<string, string>;
  evidenceId?: string;
  locationName?: string;
};

export type EvidenceItem = {
  id: string;
  referenceId: string;
  caseId: string;
  caseNumber: string;
  title: string;
  sourceType: 'FIR Document' | 'CDR Analysis' | 'Bank Statement' | 'CCTV Footage' | 'Audio Intercept' | 'Field Report';
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  timestamp: string;
  sha256: string;
  integrityVerified: boolean;
  relevanceScore: number;
  tags: string[];
  extractedEntitiesCount?: number;
  previewUrl?: string;
};

export type AuditEvent = {
  id: string;
  timestamp: string;
  officer: string;
  officerRole: string;
  action: string;
  resource: string;
  caseId: string;
  caseNumber: string;
  integrity: 'Verified' | 'Pending';
  hash: string;
  ipAddress?: string;
};

export type DataSourceIntegration = {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'cctns' | 'cdr' | 'fiu' | 'manual';
  status: 'connected' | 'syncing' | 'error' | 'manual_upload';
  lastSync: string;
  recordsCount: string;
};

export type DocumentIntelligenceItem = {
  id: string;
  documentId: string;
  caseId: string;
  caseNumber: string;
  title: string;
  scannedDate: string;
  status: 'AI PROCESSED' | 'PENDING' | 'MANUAL_REVIEW';
  rawText: string;
  extractedEntities: {
    id: string;
    name: string;
    type: EntityType;
    role: string;
    confidence: number;
    matchText: string;
  }[];
  extractedRelationships: {
    source: string;
    target: string;
    relationship: string;
    confidence: number;
  }[];
};

export type AIQueryResponse = {
  id: string;
  query: string;
  answer: string;
  confidence: number;
  summary: string;
  relatedEntities: { id: string; name: string; type: EntityType }[];
  relatedCases: { id: string; caseNumber: string; title: string }[];
  evidenceCitations: { id: string; referenceId: string; title: string }[];
  graphFocusNodeId?: string;
};

export type PriorityNetworkItem = {
  rank: number;
  alias: string;
  primaryThreat: string;
  activityScore: number;
  status: 'Critical' | 'High' | 'Monitoring';
  linkedCasesCount: number;
  primaryEntitiesCount: number;
  lastActivity: string;
};

export type WomenSafetyInsight = {
  id: string;
  title: string;
  type: 'repeat_offender' | 'trafficking_network' | 'location_hotspot';
  confidence: number;
  linkedCasesCount: number;
  sharedEntitiesCount: number;
  escalationRecommended: boolean;
  priority: 'HIGH PRIORITY' | 'CRITICAL' | 'MONITORING';
  keyIdentifiers: string[];
  anonymizedVictimContext: string;
  patternDescription: string;
};
