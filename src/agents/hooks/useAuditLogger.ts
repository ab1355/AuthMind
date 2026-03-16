import { useEffect, useCallback } from 'react';
import { auditLogger } from '@371minds/governance-core';
import { performThreeWayCheck } from '@371minds/governance-core';
import { storeAuditEntry } from '../../lib/governance/storage';

export function useAuditLogger(agentId: string) {
  const logAction = useCallback(async (actionType: string, payload: any) => {
    const timestamp = Date.now();
    // Simple hash for demonstration
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify({ agentId, actionType, timestamp, payload })))
      .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

    const entry = await auditLogger.log({
      agentId,
      actionType,
      timestamp,
      payload,
      hash
    });

    // Run Two-Way Alignment Check (Functional + Constitutional)
    // For demonstration, assuming success unless payload specifies otherwise
    const alignmentStatus = performThreeWayCheck({
      functionalSuccess: payload?.functionalSuccess !== false,
      alignmentSuccess: payload?.alignmentSuccess !== false,
      constitutionalSuccess: payload?.constitutionalSuccess !== false
    });

    // Store to ClickHouse
    await storeAuditEntry({
      ...entry,
      alignmentStatus,
      payload: JSON.stringify(payload)
    });

    // Emit event via SSE (simulated via CustomEvent for local UI updates)
    const event = new CustomEvent('audit-log-entry', { detail: { ...entry, alignmentStatus } });
    window.dispatchEvent(event);

    return { entry, alignmentStatus };
  }, [agentId]);

  return { logAction };
}
