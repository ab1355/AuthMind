import React, { useEffect, useState } from 'react';

export function AuditLedger() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to SSE events (simulated via CustomEvent)
    const handleAuditLog = (event: Event) => {
      const customEvent = event as CustomEvent;
      setEntries(prev => [customEvent.detail, ...prev]);
    };

    window.addEventListener('audit-log-entry', handleAuditLog);

    return () => {
      window.removeEventListener('audit-log-entry', handleAuditLog);
    };
  }, []);

  return (
    <div className="p-6 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 border-b border-zinc-800/50 pb-4 text-zinc-100">Live Audit Stream (ClickHouse Titan)</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {entries.length === 0 ? (
          <p className="text-zinc-500 italic text-sm">No audit entries yet. Run an execution in the Terminal to see live events.</p>
        ) : (
          entries.map((entry, idx) => (
            <div key={idx} className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-cyan-400 font-medium">{entry.action}</span>
                <span className="text-zinc-500 text-xs">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="text-zinc-300 mb-2 text-xs">Agent ID: <span className="font-mono text-zinc-400">{entry.agentId}</span></div>
              <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800/50 mb-3">
                <span className="text-xs text-zinc-500">SHA-256:</span>
                <span className="font-mono text-xs text-emerald-400 truncate flex-1" title={entry.hash}>
                  {entry.hash}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-zinc-500">Alignment:</span>
                <span className={`px-2 py-1 rounded-md border ${
                  entry.alignmentStatus === 'CERTIFIED_SUCCESS' 
                    ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' 
                    : entry.alignmentStatus === 'AWAITING_VERIFICATION'
                    ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                    : 'text-red-400 bg-red-400/10 border-red-400/20'
                }`}>
                  {entry.alignmentStatus}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
