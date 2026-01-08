# T-Mobile TruContext Intelligence Platform Demo

Demo application showcasing a unified security intelligence platform that combines network visibility, SASE posture, SOC workflows, graph context, and AI assistance.

## Demo runbook

- Primary runbook for presentations: **`DEMO.md`**
- Presentation tips (shorter): `docs/guides/PRESENTATION_GUIDE.md`
- Pre-flight validation: `docs/guides/testing/DEMO_READY_CHECKLIST.md`

## What's included

Core dashboards/routes:

- Executive Dashboard (`/dashboard`)
- SASE Platform (`/sase`)
- Cyber Defense Center (`/cyber-defense`)
- AI Agent Management (`/ai-agents`)
- AI Analytics (`/ai-analytics`)
- Graph Analytics (`/graph-analytics`)
- Network Topology (`/network-topology`)

## Quick start (local)

Prereqs: Node.js 18+

1. Install
   - `pnpm install`

2. Run (frontend + backend)
   - `pnpm start`

3. Open
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Configuration

- Copy `.env.example` to `.env` and fill in values as needed.
- The app supports optional integrations:
  - PostgreSQL (Neon) for real metrics/events
  - Neo4j (Aura) for topology/relationships
  - Gemini/OpenAI for AI features

Reference:
- `docs/technical/deployment/ENVIRONMENT_VARIABLES_REFERENCE.md`

## Useful scripts

- `pnpm dev` - frontend (Vite)
- `pnpm server` - backend (Express)
- `pnpm server:dev` - backend with watch
- `pnpm start` - run both concurrently
- `pnpm lint` - eslint
- `pnpm build` / `pnpm preview` - production build

## Documentation index

### Guides

- `docs/guides/QUICK_START.md`
- `docs/guides/AI_ANALYTICS_SETUP.md`
- `docs/guides/NETWORK_TOPOLOGY_GUIDE.md`
- AI Agents: `docs/guides/features/ai-agents/QUICK_START_AI_AGENTS.md`

### Technical

- Deployment architecture: `docs/technical/deployment/DEPLOYMENT_ARCHITECTURE.md`
- Dashboard API guide: `docs/technical/api/DASHBOARD_API_GUIDE.md`
- Neo4j integration: `docs/technical/NEO4J_INTEGRATION.md`

### Status / planning

- Roadmap: `docs/status/ROADMAP.md`
- Worklist: `TODO.md`

## Security

Security incident documentation is intentionally kept in repo root for visibility:

- `IMMEDIATE_ACTION_REQUIRED.md`
- `SECURITY_REMEDIATION_REPORT.md`

## License

Proprietary - Visium Technologies & T-Mobile.
