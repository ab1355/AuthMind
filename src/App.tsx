/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  Fingerprint, 
  Wallet, 
  Bot, 
  Shield, 
  Activity, 
  Link as LinkIcon, 
  Key, 
  Cpu,
  ArrowRightLeft,
  Lock,
  Unlock,
  Plus,
  Settings
} from 'lucide-react';

// --- Mock Data ---
const MASTER_WALLET = "0x7F5A...3B92";

const INITIAL_AGENTS = [
  {
    id: "ag_1",
    name: "Procurement Agent Alpha",
    type: "Financial",
    status: "Active",
    wallet: "0x2A1C...9F44",
    allowance: "5,000 USDC",
    spent: "1,240 USDC",
    permissions: ["DeFi Swaps", "Vendor Payments"],
    lastActive: "2 mins ago"
  },
  {
    id: "ag_2",
    name: "Data Sync Protocol",
    type: "Operational",
    status: "Paused",
    wallet: "0x9B3D...1E88",
    allowance: "0 ETH",
    spent: "0 ETH",
    permissions: ["Sign Data Payloads", "Read Encrypted State"],
    lastActive: "4 hours ago"
  }
];

const AUDIT_LOGS = [
  { id: 1, agent: "Procurement Agent Alpha", action: "Executed Payment", target: "AWS Billing", amount: "450 USDC", time: "10:42 AM", txHash: "0x88f...12a" },
  { id: 2, agent: "Master Wallet", action: "Delegated Authority", target: "Procurement Agent Alpha", amount: "5,000 USDC", time: "09:00 AM", txHash: "0x32c...99b" },
  { id: 3, agent: "Data Sync Protocol", action: "Signed State Update", target: "CRM Node", amount: "-", time: "Yesterday", txHash: "0x11a...44c" },
];

export default function App() {
  const { loginWithPopup, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [activeTab, setActiveTab] = useState('delegation');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-cyan-400 font-sans">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Cpu className="w-12 h-12" />
          <span className="text-sm font-mono tracking-widest uppercase">Initializing Enclave...</span>
        </div>
      </div>
    );
  }

  // Simulate Passwordless WebAuthn Login with Magic Link Fallback
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 mx-auto bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20">
            <Fingerprint className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-semibold mb-2 tracking-tight">AuthMind</h1>
          <p className="text-zinc-400 mb-8 text-sm">Authenticate via Auth0 to unlock your Master Wallet and Agent Matrix.</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => loginWithPopup()}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-5 h-5" />
              Authenticate with Auth0
            </button>
            <p className="text-[10px] text-zinc-500 mt-2">Powered by Auth0 Passwordless & Token Vault</p>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
            <Shield className="w-3 h-3" />
            <span>End-to-End Encrypted Enclave</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900/50 border-r border-zinc-800/50 flex flex-col">
        <div className="p-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Cpu className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="font-bold tracking-wider text-sm">AuthMind</span>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Master Wallet</div>
            <div className="font-mono text-sm text-cyan-400 flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4" />
              {MASTER_WALLET}
            </div>
            <div className="text-xs text-zinc-400 truncate mb-3">
              {user?.email || user?.name || "Anonymous Agent"}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-400/10 w-fit px-2 py-1 rounded-md">
                <Unlock className="w-3 h-3" /> Authenticated
              </div>
              <button 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Lock Enclave
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'delegation', icon: Bot, label: 'Agent Delegation' },
            { id: 'ecosystem', icon: LinkIcon, label: 'Ecosystem Passports' },
            { id: 'audit', icon: Activity, label: 'Audit Ledger' },
            { id: 'settings', icon: Settings, label: 'Security Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'delegation' && (
            <motion.div
              key="delegation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-5xl mx-auto"
            >
              <header className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight mb-2">Agent Delegation Matrix</h2>
                  <p className="text-zinc-400">Manage autonomous agents and their cryptographic allowances.</p>
                </div>
                <button className="bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Provision New Agent
                </button>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {INITIAL_AGENTS.map((agent) => (
                  <div key={agent.id} className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                    {/* Status Indicator */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${agent.status === 'Active' ? 'bg-cyan-500' : 'bg-zinc-600'}`} />
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${agent.status === 'Active' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{agent.name}</h3>
                          <span className="text-xs font-mono text-zinc-500">{agent.wallet}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${agent.status === 'Active' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                        {agent.status}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-400">Cryptographic Allowance</span>
                          <span className="font-mono text-zinc-200">{agent.spent} / {agent.allowance}</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-1.5">
                          <div 
                            className="bg-cyan-400 h-1.5 rounded-full" 
                            style={{ width: agent.allowance !== '0 ETH' ? '25%' : '0%' }}
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-zinc-800/50">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold block mb-2">Smart Contract Permissions</span>
                        <div className="flex flex-wrap gap-2">
                          {agent.permissions.map(p => (
                            <span key={p} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md border border-zinc-700">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium py-2 rounded-lg transition-colors">
                        Modify Rules
                      </button>
                      <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium py-2 rounded-lg transition-colors">
                        Revoke Keys
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-5xl mx-auto"
            >
              <header className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight mb-2">Immutable Audit Ledger</h2>
                <p className="text-zinc-400">Cryptographically verifiable log of all agent episodic memories and actions.</p>
              </header>

              <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Time</th>
                      <th className="px-6 py-4 font-medium">Actor</th>
                      <th className="px-6 py-4 font-medium">Action</th>
                      <th className="px-6 py-4 font-medium">Target / Amount</th>
                      <th className="px-6 py-4 font-medium">Tx Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {AUDIT_LOGS.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">{log.time}</td>
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          {log.agent.includes('Master') ? <Wallet className="w-4 h-4 text-emerald-400" /> : <Bot className="w-4 h-4 text-cyan-400" />}
                          {log.agent}
                        </td>
                        <td className="px-6 py-4 text-zinc-300">{log.action}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span>{log.target}</span>
                            <span className="text-xs text-zinc-500 font-mono">{log.amount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">
                            {log.txHash}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
          
          {(activeTab === 'ecosystem' || activeTab === 'settings') && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-5xl mx-auto flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Module Offline</h3>
              <p className="text-zinc-500 max-w-md">
                This module of the AuthMind Identity Matrix is currently being compiled by the CORTEX Amplifier.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
