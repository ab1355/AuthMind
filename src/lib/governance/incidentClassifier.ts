import { Incident, ClassificationResult } from './types';

/**
 * Classifies an incident based on severity and determines the response protocol.
 * Returns the severity level, authority impact (allowance reduction %), and if human intervention is needed.
 */
export function classifyIncident(incident: Omit<Incident, 'id' | 'timestamp' | 'severity'>): ClassificationResult {
  const { financialLoss, dataBreach } = incident;

  // Critical: Data breach or massive financial loss
  if (dataBreach || financialLoss >= 10000) {
    return { 
      severity: 'CRITICAL', 
      authorityImpact: 100, // Revoke all authority
      requiresHumanIntervention: true 
    };
  }
  
  // Severe: Significant financial loss
  if (financialLoss >= 1000) {
    return { 
      severity: 'SEVERE', 
      authorityImpact: 50, // Halve authority
      requiresHumanIntervention: true 
    };
  }
  
  // Moderate: Minor financial loss
  if (financialLoss >= 100) {
    return { 
      severity: 'MODERATE', 
      authorityImpact: 20, // Reduce authority by 20%
      requiresHumanIntervention: false 
    };
  }
  
  // Minor: Operational hiccups, no significant loss
  return { 
    severity: 'MINOR', 
    authorityImpact: 5, // Warning / 5% reduction
    requiresHumanIntervention: false 
  };
}
