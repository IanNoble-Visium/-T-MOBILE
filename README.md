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

## Documentation Index

### Guides

**Getting Started**
- [`docs/guides/QUICK_START.md`](docs/guides/QUICK_START.md) — Initial setup and first steps
- [`docs/guides/PRESENTATION_GUIDE.md`](docs/guides/PRESENTATION_GUIDE.md) — Tips for presenting the demo
- [`docs/guides/REACT_BEST_PRACTICES.md`](docs/guides/REACT_BEST_PRACTICES.md) — React patterns used in this project

**AI & Analytics**
- [`docs/guides/AI_ANALYTICS_SETUP.md`](docs/guides/AI_ANALYTICS_SETUP.md) — Configuring AI analytics features
- [`docs/guides/AI_AGENTS_TESTING_GUIDE.md`](docs/guides/AI_AGENTS_TESTING_GUIDE.md) — Testing AI agent functionality
- [`docs/guides/features/ai-agents/QUICK_START_AI_AGENTS.md`](docs/guides/features/ai-agents/QUICK_START_AI_AGENTS.md) — AI Agent Management quick start

**Network & Topology**
- [`docs/guides/NETWORK_TOPOLOGY_GUIDE.md`](docs/guides/NETWORK_TOPOLOGY_GUIDE.md) — 3D network topology visualization guide
- [`docs/guides/IMPLEMENTING_SEARCH_IN_DASHBOARDS.md`](docs/guides/IMPLEMENTING_SEARCH_IN_DASHBOARDS.md) — Adding search to dashboard components

**Header & UI Features**
- [`docs/guides/HEADER_ENHANCEMENTS.md`](docs/guides/HEADER_ENHANCEMENTS.md) — Header component enhancements
- [`docs/guides/HEADER_QUICK_REFERENCE.md`](docs/guides/HEADER_QUICK_REFERENCE.md) — Quick reference for header features
- [`docs/guides/TESTING_HEADER_FEATURES.md`](docs/guides/TESTING_HEADER_FEATURES.md) — Testing header functionality

**Voice Features**
- [`docs/guides/features/voice/VOICE_CONVERSATION_GUIDE.md`](docs/guides/features/voice/VOICE_CONVERSATION_GUIDE.md) — Voice conversation feature guide
- [`docs/guides/features/voice/VOICE_CONVERSATION_IMPLEMENTATION.md`](docs/guides/features/voice/VOICE_CONVERSATION_IMPLEMENTATION.md) — Voice implementation details
- [`docs/guides/features/voice/VOICE_FEATURE_COMPLETE.md`](docs/guides/features/voice/VOICE_FEATURE_COMPLETE.md) — Voice feature completion summary
- [`docs/guides/features/voice/VOICE_FEATURE_FIX_GUIDE.md`](docs/guides/features/voice/VOICE_FEATURE_FIX_GUIDE.md) — Voice feature troubleshooting
- [`docs/guides/features/voice/VOICE_FEATURE_README_UPDATE.md`](docs/guides/features/voice/VOICE_FEATURE_README_UPDATE.md) — Voice feature documentation updates
- [`docs/guides/features/voice/VOICE_FIX_DEPLOYMENT_SUMMARY.md`](docs/guides/features/voice/VOICE_FIX_DEPLOYMENT_SUMMARY.md) — Voice deployment fixes
- [`docs/guides/features/voice/MICROPHONE_TESTING_GUIDE.md`](docs/guides/features/voice/MICROPHONE_TESTING_GUIDE.md) — Microphone testing procedures

**Image Generation**
- [`docs/guides/features/image-generation/IMAGE_GENERATION_QUICK_REFERENCE.md`](docs/guides/features/image-generation/IMAGE_GENERATION_QUICK_REFERENCE.md) — Quick reference for image generation
- [`docs/guides/features/image-generation/IMAGE_GENERATION_DEBUG_GUIDE.md`](docs/guides/features/image-generation/IMAGE_GENERATION_DEBUG_GUIDE.md) — Debugging image generation issues
- [`docs/guides/features/image-generation/IMAGE_GENERATION_TEST_CASES.md`](docs/guides/features/image-generation/IMAGE_GENERATION_TEST_CASES.md) — Test cases for image generation
- [`docs/guides/features/image-generation/IMAGE_REGENERATION_GUIDE.md`](docs/guides/features/image-generation/IMAGE_REGENERATION_GUIDE.md) — Regenerating images guide
- [`docs/guides/features/image-generation/DEBUGGING_IMAGE_GENERATION.md`](docs/guides/features/image-generation/DEBUGGING_IMAGE_GENERATION.md) — Image generation debugging
- [`docs/guides/features/image-generation/INDIVIDUAL_NODE_REGENERATION.md`](docs/guides/features/image-generation/INDIVIDUAL_NODE_REGENERATION.md) — Per-node image regeneration
- [`docs/guides/features/image-generation/QUICK_START_REGENERATION.md`](docs/guides/features/image-generation/QUICK_START_REGENERATION.md) — Quick start for regeneration
- [`docs/guides/features/image-generation/REGENERATE_IMAGES_STEPS.md`](docs/guides/features/image-generation/REGENERATE_IMAGES_STEPS.md) — Step-by-step regeneration
- [`docs/guides/features/image-generation/REGENERATE_NOW.md`](docs/guides/features/image-generation/REGENERATE_NOW.md) — Immediate regeneration instructions

**Deployment**
- [`docs/guides/deployment/QUICK_START_DEPLOYMENT.md`](docs/guides/deployment/QUICK_START_DEPLOYMENT.md) — Quick deployment guide
- [`docs/guides/deployment/VERCEL_DEPLOYMENT_GUIDE.md`](docs/guides/deployment/VERCEL_DEPLOYMENT_GUIDE.md) — Vercel deployment instructions
- [`docs/guides/deployment/VERCEL_SERVERLESS_DEPLOYMENT_GUIDE.md`](docs/guides/deployment/VERCEL_SERVERLESS_DEPLOYMENT_GUIDE.md) — Serverless deployment on Vercel
- [`docs/guides/deployment/VERCEL_DEPLOYMENT_ISSUE_SUMMARY.md`](docs/guides/deployment/VERCEL_DEPLOYMENT_ISSUE_SUMMARY.md) — Known deployment issues
- [`docs/guides/deployment/VERCEL_CONSOLE_ERRORS_FIX.md`](docs/guides/deployment/VERCEL_CONSOLE_ERRORS_FIX.md) — Fixing Vercel console errors
- [`docs/guides/deployment/DEPLOYMENT_STATUS_SUMMARY.md`](docs/guides/deployment/DEPLOYMENT_STATUS_SUMMARY.md) — Deployment status overview
- [`docs/guides/deployment/SERVERLESS_API_ENDPOINTS_FIX.md`](docs/guides/deployment/SERVERLESS_API_ENDPOINTS_FIX.md) — Serverless API endpoint fixes
- [`docs/guides/deployment/SERVERLESS_REFACTORING_SUMMARY.md`](docs/guides/deployment/SERVERLESS_REFACTORING_SUMMARY.md) — Serverless refactoring notes

**Testing & Validation**
- [`docs/guides/testing/TESTING_GUIDE.md`](docs/guides/testing/TESTING_GUIDE.md) — Comprehensive testing guide
- [`docs/guides/testing/QUICK_TEST_GUIDE.md`](docs/guides/testing/QUICK_TEST_GUIDE.md) — Quick testing procedures
- [`docs/guides/testing/DEMO_READY_CHECKLIST.md`](docs/guides/testing/DEMO_READY_CHECKLIST.md) — Pre-demo validation checklist
- [`docs/guides/testing/VALIDATION_QUICK_REFERENCE.md`](docs/guides/testing/VALIDATION_QUICK_REFERENCE.md) — Validation quick reference
- [`docs/guides/testing/VALIDATION_TESTING_RESULTS.md`](docs/guides/testing/VALIDATION_TESTING_RESULTS.md) — Testing results summary

### Technical

**Architecture & Implementation**
- [`docs/technical/IMPLEMENTATION_SUMMARY.md`](docs/technical/IMPLEMENTATION_SUMMARY.md) — Overall implementation summary
- [`docs/technical/NETWORK_TOPOLOGY_IMPLEMENTATION.md`](docs/technical/NETWORK_TOPOLOGY_IMPLEMENTATION.md) — Network topology technical details
- [`docs/technical/DATA_VALIDATION_IMPLEMENTATION.md`](docs/technical/DATA_VALIDATION_IMPLEMENTATION.md) — Data validation implementation
- [`docs/technical/AI_CONFIDENCE_SCORES.md`](docs/technical/AI_CONFIDENCE_SCORES.md) — AI confidence scoring system

**Deployment & Configuration**
- [`docs/technical/deployment/DEPLOYMENT_ARCHITECTURE.md`](docs/technical/deployment/DEPLOYMENT_ARCHITECTURE.md) — System deployment architecture
- [`docs/technical/deployment/ENVIRONMENT_VARIABLES_REFERENCE.md`](docs/technical/deployment/ENVIRONMENT_VARIABLES_REFERENCE.md) — Environment variables reference

**APIs**
- [`docs/technical/api/DASHBOARD_API_GUIDE.md`](docs/technical/api/DASHBOARD_API_GUIDE.md) — Dashboard API documentation

**Dashboard**
- [`docs/technical/dashboard/DASHBOARD_IMPLEMENTATION_SUMMARY.md`](docs/technical/dashboard/DASHBOARD_IMPLEMENTATION_SUMMARY.md) — Dashboard implementation details
- [`docs/technical/dashboard/DASHBOARD_ENHANCEMENTS.md`](docs/technical/dashboard/DASHBOARD_ENHANCEMENTS.md) — Dashboard enhancement notes

**Neo4j Integration**
- [`docs/technical/NEO4J_INTEGRATION.md`](docs/technical/NEO4J_INTEGRATION.md) — Neo4j integration overview
- [`docs/technical/NEO4J_IMPLEMENTATION.md`](docs/technical/NEO4J_IMPLEMENTATION.md) — Neo4j implementation details
- [`docs/technical/NEO4J_INTEGRATION_VERIFICATION.md`](docs/technical/NEO4J_INTEGRATION_VERIFICATION.md) — Neo4j integration verification
- [`docs/technical/NEO4J_TESTING.md`](docs/technical/NEO4J_TESTING.md) — Neo4j testing procedures

**Logging**
- [`docs/technical/logging/README_LOGGING.md`](docs/technical/logging/README_LOGGING.md) — Logging system overview
- [`docs/technical/logging/DASHBOARD_LOGGING_GUIDE.md`](docs/technical/logging/DASHBOARD_LOGGING_GUIDE.md) — Dashboard logging guide
- [`docs/technical/logging/DASHBOARD_LOGGING_INDEX.md`](docs/technical/logging/DASHBOARD_LOGGING_INDEX.md) — Logging index reference

**External APIs**
- [`docs/technical/external-apis/cloudinary/CLOUDINARY_SIGNATURE_FIX.md`](docs/technical/external-apis/cloudinary/CLOUDINARY_SIGNATURE_FIX.md) — Cloudinary signature fixes
- [`docs/technical/external-apis/cloudinary/CLOUDINARY_UPLOAD_FIX.md`](docs/technical/external-apis/cloudinary/CLOUDINARY_UPLOAD_FIX.md) — Cloudinary upload fixes
- [`docs/technical/external-apis/cloudinary/CLOUDINARY_URL_FORMAT_FIX.md`](docs/technical/external-apis/cloudinary/CLOUDINARY_URL_FORMAT_FIX.md) — Cloudinary URL format fixes
- [`docs/technical/external-apis/cloudinary/SIGNATURE_FIX_FINAL.md`](docs/technical/external-apis/cloudinary/SIGNATURE_FIX_FINAL.md) — Final signature fix summary
- [`docs/technical/external-apis/recraft/RECRAFT_API_RATE_LIMITING.md`](docs/technical/external-apis/recraft/RECRAFT_API_RATE_LIMITING.md) — Recraft API rate limiting
- [`docs/technical/external-apis/recraft/RECRAFT_API_SIZE_FIX.md`](docs/technical/external-apis/recraft/RECRAFT_API_SIZE_FIX.md) — Recraft API size constraints
- [`docs/technical/external-apis/recraft/RATE_LIMITING_QUICK_FIX.md`](docs/technical/external-apis/recraft/RATE_LIMITING_QUICK_FIX.md) — Quick rate limiting fix

### Status & Planning

- [`docs/status/ROADMAP.md`](docs/status/ROADMAP.md) — Project roadmap and milestones
- [`docs/status/FINAL_STATUS_REPORT.md`](docs/status/FINAL_STATUS_REPORT.md) — Final project status report
- [`docs/status/FINAL_STATUS_REPORT_AI_AGENTS.md`](docs/status/FINAL_STATUS_REPORT_AI_AGENTS.md) — AI agents feature status
- [`docs/status/TASK_2_COMPLETION_SUMMARY.md`](docs/status/TASK_2_COMPLETION_SUMMARY.md) — Task 2 completion summary
- [`TODO.md`](TODO.md) — Current worklist and priorities

### Research & Background

- [`docs/research/T-Mobile + TruContext Demo Application Architecture.md`](docs/research/T-Mobile%20+%20TruContext%20Demo%20Application%20Architecture.md) — Application architecture research
- [`docs/research/T-Mobile Demo Application Requirements Summary.md`](docs/research/T-Mobile%20Demo%20Application%20Requirements%20Summary.md) — Requirements summary
- [`docs/research/T-Mobile Ecosystem Research Findings.md`](docs/research/T-Mobile%20Ecosystem%20Research%20Findings.md) — T-Mobile ecosystem research
- [`docs/research/T-Mobile TruContext Demo - Presentation Guide.md`](docs/research/T-Mobile%20TruContext%20Demo%20-%20Presentation%20Guide.md) — Research-based presentation guide
- [`docs/research/Veo 3.1 Video Generation Prompts for T-Mobile TruContext Demo.md`](docs/research/Veo%203.1%20Video%20Generation%20Prompts%20for%20T-Mobile%20TruContext%20Demo.md) — Video generation prompts

## License

Proprietary - Visium Technologies & T-Mobile.
