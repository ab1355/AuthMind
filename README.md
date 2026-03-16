# AuthMind / 371 OS

AuthMind is a revolutionary autonomous business operating system that combines hierarchical agent intelligence with decentralized infrastructure. It enables episodic memory business intelligence, allowing AI agents to maintain context across sessions, learn from business operations, and autonomously coordinate complex multi-stakeholder decisions.

## Core Capabilities

* **Agent Delegation Matrix**: Provision and manage autonomous agents with specific operational classes (Financial, Operational, Security) and cryptographic allowances (USDC, ETH).
* **Execution Terminal**: Simulate and monitor autonomous agent tasks in real-time.
* **Auth0 Token Vault Integration**: Securely manage third-party API access (GitHub, Slack, Salesforce) without exposing credentials directly to the agents.
* **Immutable Audit Ledger**: A cryptographically verifiable log of all agent episodic memories and actions, backed by ClickHouse.
* **Trust & Alignment Score (TAS)**: Dynamic governance scoring based on successful tasks, alignment checks, and constitutional adherence.

## 📦 @371minds/governance-core NPM Package

The core governance logic—including TAS calculation, 3-way alignment checks, incident classification, and audit logging—has been extracted into a standalone npm package: `@371minds/governance-core`.

### Publishing the Package

To publish the `@371minds/governance-core` package to the public npm registry, follow these steps from your local terminal:

```bash
# Navigate to the package directory
cd governance-core

# Authenticate with your npm account
npm login

# Publish the package
npm publish --access public
```

Once published, you can install it in other projects using `npm install @371minds/governance-core`.

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Authenticate via Auth0 to unlock the Master Wallet and Agent Matrix.
