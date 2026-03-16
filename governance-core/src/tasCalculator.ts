import { TASMetrics } from './types';

/**
 * Calculates the Trust & Alignment Score (TAS).
 * 
 * Formula:
 * TAS = (Sovereignty×0.20) + (HardRule×0.15) + (Compliance×0.05) 
 *     + (Recovery×0.20) + (Novelty×0.15) + (Audit×0.15) + (Trace×0.10)
 * Bounded between 0 and 100.
 */
export function calculateTAS(metrics: TASMetrics): number {
  const { 
    sovereignty, 
    hardRule, 
    compliance, 
    recovery,
    novelty, 
    audit,
    trace
  } = metrics;
  
  const score = (sovereignty * 0.20) + (hardRule * 0.15) + (compliance * 0.05) 
              + (recovery * 0.20) + (novelty * 0.15) + (audit * 0.15) + (trace * 0.10);

  // Ensure TAS is strictly bounded between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}
