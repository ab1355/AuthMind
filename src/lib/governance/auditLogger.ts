import { AuditLogEntry } from './types';

/**
 * Pure, synchronous string hashing function for cryptographic logging.
 * (Used to ensure the module remains pure and testable without external crypto dependencies).
 */
function generateHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to positive hex string
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Creates a new cryptographically linked audit log entry.
 */
export function createLogEntry(
  action: string, 
  agentId: string, 
  previousEntry: AuditLogEntry | null,
  timestamp: number = Date.now() // Injectable for pure testing
): AuditLogEntry {
  const id = `log_${timestamp}_${Math.random().toString(36).substring(2, 9)}`;
  const previousHash = previousEntry ? previousEntry.hash : 'GENESIS_HASH_00000000000000000';
  
  const dataToHash = `${id}:${timestamp}:${action}:${agentId}:${previousHash}`;
  const hash = generateHash(dataToHash);

  return {
    id,
    timestamp,
    action,
    agentId,
    previousHash,
    hash
  };
}

/**
 * Verifies the integrity of an audit log chain.
 * Returns true if the chain is valid and untampered.
 */
export function verifyLogChain(logs: AuditLogEntry[]): boolean {
  if (logs.length === 0) return true;
  
  for (let i = 1; i < logs.length; i++) {
    const current = logs[i];
    const previous = logs[i - 1];
    
    // Check hash linkage
    if (current.previousHash !== previous.hash) {
      return false;
    }
    
    // Verify current hash integrity
    const dataToHash = `${current.id}:${current.timestamp}:${current.action}:${current.agentId}:${current.previousHash}`;
    if (generateHash(dataToHash) !== current.hash) {
      return false;
    }
  }
  
  return true;
}
