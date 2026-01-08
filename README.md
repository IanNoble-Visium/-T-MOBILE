# T-Mobile TruContext Intelligence Platform Demo

<p align="center">
  <img src="docs/images/TMOBILE-Overview.jfif" alt="T-Mobile TruContext Intelligence Platform - Unified security dashboard showing real-time threat detection, network topology, and AI-powered analytics" width="100%">
</p>
<p align="center"><em>Unified Security Intelligence: Real-time visibility across 5G networks, SASE enforcement, SOC operations, and AI-driven threat response</em></p>

---

## Executive Summary

### What It Is

The **T-Mobile TruContext Intelligence Platform** is a next-generation unified security intelligence solution that transforms how enterprises detect, investigate, and respond to cyber threats. Built on T-Mobile's 5G infrastructure and powered by advanced graph analytics and AI agents, TruContext delivers a single pane of glass for security operations, network visibility, and automated threat response.

### What It Does

TruContext integrates five critical security domains into one cohesive platform:

| Capability | Description |
|------------|-------------|
| **Network Visibility** | Real-time monitoring of 5G infrastructure, IoT devices, and enterprise endpoints with topology-aware context |
| **SASE Posture Management** | Zero Trust Network Access (ZTNA) enforcement, policy management, and compliance monitoring across distributed environments |
| **SOC Workflows** | Cyber Defense Center operations including incident triage, investigation, hunting, and forensic analysis |
| **Graph-Based Context** | Neo4j-powered relationship mapping that reveals attack paths, blast radius, and lateral movement patterns invisible to traditional tools |
| **AI Assistance** | Autonomous AI agents for threat detection, automated response, and natural language security queries |

### Why It's Useful

**For the Business:**
- **40% faster Mean Time to Detect (MTTD)** through AI-powered anomaly detection and graph correlation
- **60% faster Mean Time to Respond (MTTR)** via automated playbooks and AI agent orchestration
- **Reduced tool sprawl** — consolidates 5–10 point solutions into a single integrated platform
- **Lower operational costs** — AI agents scale security operations without proportional headcount growth

**Competitive Advantages over Verizon & AT&T:**
- **Native 5G + Security Integration** — TruContext is built on T-Mobile's network fabric, not bolted on
- **Graph-First Architecture** — relationship context that competitors' table-based systems cannot replicate
- **AI Agent Workforce** — deploy, manage, and scale autonomous security agents from a single marketplace
- **Real-Time Identity Context** — 5G subscriber and device identity flows directly into threat correlation

### Target Audience

| Stakeholder | Primary Value |
|-------------|---------------|
| **T-Mobile Executives** | Board-ready dashboards, risk posture, ROI metrics, competitive positioning |
| **Security Teams (SOC/CISO)** | Unified incident management, threat hunting, investigation workflows, evidence collection |
| **Network Operations** | Topology visibility, device health, 5G infrastructure monitoring, anomaly detection |
| **Sales & Partner Teams** | Demo-ready narratives, competitive differentiation, customer-facing presentations |
| **Engineering/DevOps** | API integrations, deployment architecture, extensibility patterns |

### Key Differentiators

1. **Graph-Powered Intelligence** — Neo4j relationship engine maps entities (users, devices, IPs, threats) to reveal attack chains and blast radius that flat data misses
2. **AI Agent Marketplace** — One-click deployment of specialized agents (Threat Hunter, Anomaly Detector, Compliance Monitor) with full lifecycle management
3. **5G-Native Telemetry** — Direct integration with T-Mobile's 5G core for subscriber/device context unavailable to over-the-top solutions
4. **Unified Command Center** — Executive, SASE, CDC, Graph, and AI Analytics dashboards in a single application with seamless navigation
5. **Voice-Enabled Queries** — Ask security questions in plain English; receive actionable insights with transparency into underlying data

---

## Demo Runbook

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
