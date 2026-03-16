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
  Settings,
  X,
  Check,
  Terminal,
  Send,
  Loader2
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

const AVAILABLE_PERMISSIONS = [
  "DeFi Swaps", 
  "Vendor Payments", 
  "Read Encrypted State",
  "Token Vault: GitHub", 
  "Token Vault: Slack", 
  "Token Vault: Salesforce"
];

export default function App() {
  const { loginWithPopup, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [activeTab, setActiveTab] = useState('delegation');
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  
  // Terminal State
  const [prompt, setPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<{time: string, text: string, type: 'system' | 'auth0' | 'agent' | 'blockchain'}[]>([]);
  const [selectedAgent, setSelectedAgent] = useState(INITIAL_AGENTS[0].id);

  // New Agent Form State
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: 'Operational',
    allowance: '0',
    currency: 'USDC',
    permissions: [] as string[]
  });

  const handleProvisionAgent = () => {
    if (!newAgent.name) return;
    
    const generatedWallet = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase() + "..." + Math.random().toString(16).slice(2, 6).toUpperCase();
    
    const agentToAdd = {
      id: "ag_" + Date.now(),
      name: newAgent.name,
      type: newAgent.type,
      status: "Active",
      wallet: generatedWallet,
      allowance: `${newAgent.allowance} ${newAgent.currency}`,
      spent: `0 ${newAgent.currency}`,
      permissions: newAgent.permissions.length > 0 ? newAgent.permissions : ["Basic Execution"],
      lastActive: "Just now"
    };

    setAgents([agentToAdd, ...agents]);
    setIsProvisionModalOpen(false);
    setNewAgent({ name: '', type: 'Operational', allowance: '0', currency: 'USDC', permissions: [] });
  };

  const runSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || isExecuting) return;
    
    setIsExecuting(true);
    setTerminalLogs([]);
    
    const steps = [
      { t: 500, type: 'system', text: `Initiating execution sequence for agent: ${agents.find(a => a.id === selectedAgent)?.name}` },
      { t: 1500, type: 'blockchain', text: 'Verifying cryptographic allowance and smart contract permissions...' },
      { t: 2500, type: 'auth0', text: 'Requesting Token Vault access for GitHub (scope: repo:read)...' },
      { t: 3500, type: 'auth0', text: 'Token retrieved successfully from Auth0 Vault. (JWT: eyJhbG...)' },
      { t: 4500, type: 'agent', text: 'Calling GitHub API: GET /repos/authmind/core/issues' },
      { t: 5500, type: 'agent', text: 'Found 2 new critical issues.' },
      { t: 6500, type: 'auth0', text: 'Requesting Token Vault access for Slack (scope: chat:write)...' },
      { t: 7000, type: 'auth0', text: 'Token retrieved successfully from Auth0 Vault.' },
      { t: 8000, type: 'agent', text: 'Calling Slack API: POST /chat.postMessage' },
      { t: 9000, type: 'blockchain', text: 'Signing transaction payload... TxHash: 0x' + Math.random().toString(16).slice(2, 10).toUpperCase() },
      { t: 10000, type: 'system', text: 'Execution Complete. Audit log updated.' }
    ];

    steps.forEach(({ t, type, text }) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, {
          time: new Date().toLocaleTimeString([], { hour12: false }),
          type: type as any,
          text
        }]);
        if (t === 10000) {
          setIsExecuting(false);
          setPrompt('');
        }
      }, t);
    });
  };

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
            { id: 'terminal', icon: Terminal, label: 'Execution Terminal' },
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
                <button 
                  onClick={() => setIsProvisionModalOpen(true)}
                  className="bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Provision New Agent
                </button>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agents.map((agent) => (
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

          {activeTab === 'terminal' && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col"
            >
              <header className="mb-6">
                <h2 className="text-3xl font-semibold tracking-tight mb-2">Agent Execution Terminal</h2>
                <p className="text-zinc-400">Simulate autonomous agent tasks using Auth0 Token Vault for third-party API access.</p>
              </header>

              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
                {/* Terminal Header */}
                <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="text-xs font-mono text-zinc-500">bash - auth0-ai-agent</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Active Agent:</span>
                    <select 
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      disabled={isExecuting}
                      className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-cyan-400 font-mono focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer disabled:opacity-50"
                    >
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Terminal Output */}
                <div className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-3 bg-[#0a0a0a]">
                  <div className="text-zinc-500 mb-4">
                    371 OS Agent Terminal v1.0.0<br/>
                    Connected to Auth0 Token Vault.<br/>
                    Ready for input.
                  </div>
                  
                  {terminalLogs.map((log, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className="flex gap-4"
                    >
                      <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                      <span className={`
                        ${log.type === 'system' ? 'text-zinc-300' : ''}
                        ${log.type === 'auth0' ? 'text-orange-400' : ''}
                        ${log.type === 'agent' ? 'text-cyan-400' : ''}
                        ${log.type === 'blockchain' ? 'text-emerald-400' : ''}
                      `}>
                        {log.type === 'auth0' && '[AUTH0_VAULT] '}
                        {log.type === 'agent' && '[AGENT_EXEC] '}
                        {log.type === 'blockchain' && '[SMART_CONTRACT] '}
                        {log.text}
                      </span>
                    </motion.div>
                  ))}
                  
                  {isExecuting && (
                    <div className="flex items-center gap-2 text-zinc-500 mt-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  )}
                </div>

                {/* Terminal Input */}
                <form onSubmit={runSimulation} className="p-4 bg-zinc-900 border-t border-zinc-800">
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-cyan-500 font-mono text-lg">{'>'}</div>
                    <input 
                      type="text" 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isExecuting}
                      placeholder="e.g. Check GitHub for new issues and alert the team in Slack..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-14 py-4 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-zinc-600 font-mono disabled:opacity-50"
                    />
                    <button 
                      type="submit"
                      disabled={!prompt || isExecuting}
                      className="absolute right-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
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

        {/* Provisioning Modal */}
        <AnimatePresence>
          {isProvisionModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsProvisionModalOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
                      <Bot className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Provision Autonomous Agent</h3>
                      <p className="text-xs text-zinc-400">Deploy a new sub-wallet and define its cryptographic scope.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsProvisionModalOpen(false)}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-800/50 hover:bg-zinc-800 p-2 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                  {/* Agent Name */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Agent Designation</label>
                    <input 
                      type="text" 
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                      placeholder="e.g. GitHub Issue Triage Bot" 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-zinc-700"
                    />
                  </div>

                  {/* Agent Type */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Operational Class</label>
                    <div className="flex gap-3">
                      {['Financial', 'Operational', 'Security'].map(type => (
                        <button
                          key={type}
                          onClick={() => setNewAgent({...newAgent, type})}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                            newAgent.type === type 
                              ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cryptographic Allowance */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Cryptographic Allowance</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={newAgent.allowance}
                        onChange={(e) => setNewAgent({...newAgent, allowance: e.target.value})}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                      />
                      <select 
                        value={newAgent.currency}
                        onChange={(e) => setNewAgent({...newAgent, currency: e.target.value})}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none"
                      >
                        <option>USDC</option>
                        <option>ETH</option>
                        <option>CREDITS</option>
                      </select>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">Maximum spend limit enforced by the Master Wallet smart contract.</p>
                  </div>

                  {/* Permissions / Token Vault */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      Smart Contract & API Permissions
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/20">Auth0 Token Vault</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {AVAILABLE_PERMISSIONS.map(permission => {
                        const isSelected = newAgent.permissions.includes(permission);
                        const isTokenVault = permission.includes("Token Vault");
                        return (
                          <button
                            key={permission}
                            onClick={() => {
                              if (isSelected) {
                                setNewAgent({...newAgent, permissions: newAgent.permissions.filter(p => p !== permission)});
                              } else {
                                setNewAgent({...newAgent, permissions: [...newAgent.permissions, permission]});
                              }
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                              isSelected 
                                ? 'bg-cyan-500/5 border-cyan-500/30 text-cyan-100' 
                                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                              isSelected ? 'bg-cyan-500 border-cyan-400 text-zinc-950' : 'bg-zinc-900 border-zinc-700'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{permission.replace("Token Vault: ", "")}</span>
                              {isTokenVault && <span className="text-[10px] text-zinc-500">Requires Async Auth</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex gap-3">
                  <button 
                    onClick={() => setIsProvisionModalOpen(false)}
                    className="flex-1 py-3 rounded-xl font-medium text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleProvisionAgent}
                    disabled={!newAgent.name}
                    className="flex-[2] py-3 rounded-xl font-medium text-sm text-zinc-950 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Cpu className="w-4 h-4" />
                    Deploy Agent & Sign Transaction
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
