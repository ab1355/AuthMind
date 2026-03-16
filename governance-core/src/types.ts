export type AlignmentStatus = 'CERTIFIED_SUCCESS' | 'VIOLATED_REFUND' | 'AWAITING_VERIFICATION';
export type IncidentSeverity = 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

export interface TASMetrics {
  sovereignty: number;
  hardRule: number;
  compliance: number;
  recovery: number;
  novelty: number;
  audit: number;
  trace: number;
}

export interface AlignmentCheckParams {
  functionalSuccess: boolean;
  alignmentSuccess: boolean;
  constitutionalSuccess: boolean;
}

export interface Incident {
  id: string;
  description: string;
  severity: IncidentSeverity;
  financialLoss: number;
  dataBreach: boolean;
  timestamp: number;
}

export interface ClassificationResult {
  severity: IncidentSeverity;
  authorityImpact: number; // Percentage reduction in authority/allowance
  requiresHumanIntervention: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  agentId: string;
  previousHash: string;
  hash: string;
}
