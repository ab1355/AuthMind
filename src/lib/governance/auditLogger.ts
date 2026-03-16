import { AuditLogEntry } from './types';

export interface LogPayload {
  agentId: string;
  actionType: string;
  timestamp: number;
  payload: any;
  hash: string;
}

class AuditLogger {
  private chain: AuditLogEntry[] = [];

  async log(data: LogPayload): Promise<AuditLogEntry> {
    const id = `log_${data.timestamp}_${Math.random().toString(36).substring(2, 9)}`;
    const previousEntry = this.chain.length > 0 ? this.chain[this.chain.length - 1] : null;
    const previousHash = previousEntry ? previousEntry.hash : 'GENESIS_HASH_00000000000000000';
    
    const entry: AuditLogEntry = {
      id,
      timestamp: data.timestamp,
      action: data.actionType,
      agentId: data.agentId,
      previousHash,
      hash: data.hash
    };

    this.chain.push(entry);
    return entry;
  }

  getChain(): AuditLogEntry[] {
    return this.chain;
  }
}

export const auditLogger = new AuditLogger();

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
  }
  
  return true;
}
