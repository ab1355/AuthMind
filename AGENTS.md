# Autonomous Agents Architecture

AuthMind (371 OS) utilizes a decentralized, hierarchical agent intelligence system. Agents are autonomous entities provisioned with specific operational classes, cryptographic allowances, and smart contract permissions.

## Agent Types

The system categorizes agents into three primary operational classes:

1. **Financial Agents (e.g., Procurement Agent Alpha)**
   * **Purpose**: Manage financial transactions, vendor payments, and DeFi swaps.
   * **Capabilities**: Execute smart contract transactions, manage cryptographic allowances (USDC, ETH), and interact with financial APIs.
   * **Example Permissions**: `DeFi Swaps`, `Vendor Payments`.

2. **Operational Agents (e.g., Data Sync Protocol)**
   * **Purpose**: Handle data payloads, state synchronization, and operational workflows.
   * **Capabilities**: Read encrypted state, sign data payloads, and interact with operational APIs (GitHub, Slack, Salesforce).
   * **Example Permissions**: `Read Encrypted State`, `Sign Data Payloads`, `Token Vault: GitHub`, `Token Vault: Slack`.

3. **Security Agents**
   * **Purpose**: Manage ecosystem passports, security settings, and audit logging.
   * **Capabilities**: Monitor agent alignment, classify incidents, and enforce constitutional rules.

## Cryptographic Allowances

Each agent is provisioned with a specific cryptographic allowance (e.g., `5,000 USDC`, `10 ETH`). This allowance acts as a maximum spend limit enforced by the Master Wallet smart contract. Agents cannot exceed this limit without explicit delegation from the Master Wallet.

## Smart Contract & API Permissions (Auth0 Token Vault)

Agents require explicit permissions to interact with external systems. AuthMind integrates with the **Auth0 Token Vault** to securely manage third-party API access.

* **Token Vault Integration**: Instead of hardcoding API keys, agents request short-lived access tokens from the Auth0 Token Vault for specific scopes (e.g., `repo:read` for GitHub, `chat:write` for Slack).
* **Smart Contract Permissions**: Agents must be granted specific smart contract permissions to execute on-chain transactions (e.g., `DeFi Swaps`).

## Trust & Alignment Score (TAS)

The **Trust & Alignment Score (TAS)** is a dynamic governance metric that evaluates an agent's performance, alignment, and constitutional adherence.

* **Base Score**: The initial score assigned to an agent upon provisioning.
* **Successful Tasks**: Increases the TAS score.
* **Failed Tasks**: Decreases the TAS score.
* **Alignment Score**: Evaluates how well the agent's actions align with the user's intent and the system's constitution.
* **Constitutional Violations**: Severe penalties for actions that violate the system's core rules.

The TAS score is calculated using the `@371minds/governance-core` package.

## Execution Flow

1. **Input**: The user provides a prompt or task via the Execution Terminal.
2. **Verification**: The system verifies the agent's cryptographic allowance and smart contract permissions.
3. **Token Retrieval**: The agent requests access tokens from the Auth0 Token Vault for required external APIs.
4. **Execution**: The agent interacts with external APIs (e.g., GitHub, Slack) and signs transaction payloads.
5. **Governance Check**: The system performs a 3-way alignment check (Intent vs. Action vs. Constitution) using `@371minds/governance-core`.
6. **Audit Logging**: The execution result, alignment status, and transaction hash are recorded in the immutable Audit Ledger (backed by ClickHouse).
7. **TAS Update**: The agent's TAS score is updated based on the execution outcome.
