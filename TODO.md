# AuthMind: Hackathon Development Tracker

## Project Overview
**Hackathon:** Authorized to Act (Auth0 / Okta)
**Goal:** Build a revolutionary AI agent delegation and identity system combining Auth0's Token Vault and AI SDKs with blockchain-based wallet identity.
**Core Concept:** A system where users authenticate seamlessly (biometrics/magic links) and delegate scoped authority to autonomous AI agents. Agents use Auth0 Token Vault to securely hold credentials and interact with third-party APIs (Slack, GitHub, etc.) on the user's behalf, while their actions are immutably logged.

## Phase 1: Core Authentication & User Identity
- [x] Design initial UI prototype for Master Wallet and Agent Delegation Matrix.
- [x] Implement Auth0 React SDK (`@auth0/auth0-react`) for primary user authentication (adapted from Next.js for Vite SPA).
- [x] **Fallback Auth Mechanism:** Implement Auth0 Passwordless (Magic Links via Email/SMS) for devices without biometric capabilities (e.g., older laptops).
- [ ] Map Auth0 User ID (sub) to a generated Master Wallet address (Account Abstraction).

## Phase 2: Agent Provisioning & Auth0 Token Vault
- [ ] Integrate Auth0 AI SDK (`@auth0/auth0-ai-js`).
- [x] Implement Agent Provisioning UI: Allow users to create an agent and define its scope.
- [ ] **Token Vault Integration:** Set up Auth0 Token Vault to securely store third-party API tokens (e.g., GitHub, Slack) for the agents.
- [ ] Implement Async Authorization: When an agent needs access to a new service, trigger an async authorization flow to the user's device (e.g., "Agent Alpha is requesting access to your GitHub. Approve?").

## Phase 3: Agent Execution & Third-Party Tool Calling
- [x] Build a mock AI Agent execution loop (simulating LangGraph/LlamaIndex behavior).
- [x] Implement Third-Party Tool Calling: The agent retrieves the necessary token from the Auth0 Token Vault and executes an API call (e.g., creating a GitHub issue or sending a Slack message).
- [x] Ensure the agent's actions are strictly scoped by the permissions granted during the async authorization phase.

## Phase 4: Audit Ledger & Immutable Logging
- [ ] Connect the agent's actions to the UI's Audit Ledger.
- [ ] (Optional/Stretch) Cryptographically sign the logs to simulate blockchain immutability, proving the agent acted within its authorized scope.

## Phase 5: Polish & Hackathon Submission
- [ ] Refine UI/UX (CORTEX Amplifier theme).
- [ ] Record demo video highlighting the "Authorized to Act" flow (User -> Auth0 -> Token Vault -> Agent -> Third-Party API).
- [ ] Write Devpost submission detailing the architecture and use of Auth0 features.

## Resources & Documentation
- [Auth0 AI Intro](https://auth0.com/ai/docs/intro/overview)
- [Auth0 Token Vault](https://auth0.com/features/token-vault)
- [Auth0 AI SDKs](https://auth0.com/ai/docs/sdks/overview)
- [Auth0 AI JS Examples](https://github.com/auth0/auth0-ai-js/tree/main/examples/calling-apis)
- [Async Authorization Example](https://github.com/auth0/auth0-ai-js/tree/main/examples/async-authorization)
- [Auth0 Flows](https://flows.auth0.com/)
- [JWT Explorer](https://jwt.io/)
