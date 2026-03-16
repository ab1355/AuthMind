import { TASMetrics } from './types';

/**
 * Calculates the Trust & Alignment Score (TAS).
 * Follows the standard 371 Minds GOVERNANCE_OPERATIONS.md formula.
 * 
 * Formula:
 * TAS = Base + (Success * 2) + (Alignment * 0.5) - (Failures * 5) - (Violations * 50) + (Uptime * 0.1)
 * Bounded between 0 and 100.
 */
export function calculateTAS(metrics: TASMetrics): number {
  const { 
    baseScore, 
    successfulTasks, 
    failedTasks, 
    alignmentScore,
    constitutionalViolations, 
    uptimeDays 
  } = metrics;
  
  const successWeight = successfulTasks * 2;
  const alignmentWeight = alignmentScore * 0.5;
  const failurePenalty = failedTasks * 5;
  const violationPenalty = constitutionalViolations * 50;
  const uptimeBonus = uptimeDays * 0.1;

  let score = baseScore + successWeight + alignmentWeight - failurePenalty - violationPenalty + uptimeBonus;

  // Ensure TAS is strictly bounded between 0 and 100
  return Math.max(0, Math.min(100, Number(score.toFixed(2))));
}
