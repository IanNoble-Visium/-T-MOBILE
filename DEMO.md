# T-Mobile TruContext Intelligence Platform — DEMO RUNBOOK (Tomorrow)

> Purpose: high-stakes, end-to-end story that TruContext + T-Mobile 5G + SASE + CDC + IoT delivers **faster detection, faster response, and lower operational cost** with graph + AI.

## 0) Pre-presentation checklist (15–30 min before)

### Device / browser
- [ ] Use Chrome (preferred). Disable aggressive ad blockers for the demo site.
- [ ] Open DevTools Console once; confirm **no red errors**.
- [ ] Set display scaling to 100% and enable “Do Not Disturb”.

### Demo environment
- [ ] Confirm frontend URL (local: `http://localhost:5173`) or hosted Vercel URL.
- [ ] If hosted: confirm backend is reachable: `GET <backend>/health`.
- [ ] Login works:
  - Email: `admin@tmobile.com`
  - Password: `TruContext2025!`

### Content prep
- [ ] Have a **PDF/screenshot pack** of each dashboard (offline fallback).
- [ ] Keep these docs open in a separate tab for Q&A:
  - `docs/guides/PRESENTATION_GUIDE.md`
  - `docs/guides/testing/DEMO_READY_CHECKLIST.md`
  - `docs/guides/features/ai-agents/QUICK_START_AI_AGENTS.md`
  - `docs/technical/deployment/DEPLOYMENT_ARCHITECTURE.md`

## 1) Recommended presentation flow (30 minutes + 10 Q&A)

### Default “Deal-winning” flow (30 min)
1) **Executive Dashboard** (`/dashboard`) — 4 min
2) **SASE Platform** (`/sase`) — 4 min
3) **Cyber Defense Center** (`/cyber-defense`) — 4 min
4) **AI Agent Management** (`/ai-agents`) — 8 min (PRIMARY WOW)
5) **Graph Analytics** (`/graph-analytics`) — 3 min
6) **Network Topology (3D)** (`/network-topology`) — 3 min (VISUAL WOW)
7) **AI Analytics** (`/ai-analytics`) — 3 min
8) Close back on **Executive Dashboard** — 1 min

### Compressed “15-minute” flow
- Exec (3) → AI Agents (6) → Topology (3) → AI Analytics (2) → Close (1)

## 2) Navigation map (routes / sidebar labels)
- Executive (`/dashboard`), AI Analytics (`/ai-analytics`), AI Dashboards (`/ai-dashboards`)
- SASE (`/sase`), Cyber Defense (`/cyber-defense`), T-Platform (`/t-platform`)
- IoT Hub (`/iot`), Threat Protect (`/threat-protect`)
- Graph Analytics (`/graph-analytics`), Network Topology (`/network-topology`)
- Geographic Map (`/geographic-map`), Threat Intelligence (`/threat-intelligence`)
- AI Agents (`/ai-agents`)

## 3) Choose your talk track (tailored to the room)

### A) Executive track (strategic value)
- Lead with: **risk reduction + resilience + speed** (MTTD/MTTR) and board-level outcomes.
- Keep technical depth to “how it integrates”, not “how it’s built”.
- Close with: phased rollout + success metrics + next-step POC.

### B) Sales track (ROI + competitive)
- Lead with: **ROI**, consolidation (tool sprawl), and “why T-Mobile wins” packaging.
- Use competitive points: integrated 5G + graph context + AI operations.
- Close with: timeline, pricing model options, and procurement-ready next steps.

### C) Engineering track (architecture + integrations)
- Lead with: data plane + control plane, APIs, integrations, and deployment model.
- Be ready to discuss: Neo4j + PostgreSQL roles; `/api/*` endpoints; CORS/env vars.

### D) Security/SOC track (detections + ops)
- Lead with: threat detection, triage workflow, playbooks, evidence/forensics.
- Emphasize: graph-based relationships (blast radius, attack paths) + AI assist.

## 4) Dashboard-by-dashboard talking points (with timing cues)

### Executive Dashboard (4 min)
**Key message:** one screen for posture + outcomes + competitive advantage.
- Point to: Threats detected/blocked, Active incidents, Network health, Savings.
- Competitive radar: “T-Mobile + TruContext” vs **Verizon/AT&T** on speed/coverage/integration.
- Transition line: “Now let’s open the layers beneath the KPIs: SASE + CDC + AI agents.”

### SASE Platform (4 min)
**Key message:** SASE visibility + enforcement across users/devices with Precision AI.
- Highlight: protected devices, ZTNA enforcements, blocked threats trend.
- Competitive angle: “policy + telemetry + 5G identity context in one motion.”

### Cyber Defense Center (4 min)
**Key message:** operational command center for incidents + hunting + forensics.
- Highlight: NEW badge (Oct 15, 2025), incidents, monitoring, investigations.
- Security angle: “from alert → investigation → response with full context.”

### AI Agent Management Dashboard (8 min) — launched Oct 17, 2025
**Key message:** AI agents turn security into an **always-on, scalable workforce**.
- Show KPI cards (active agents, threats detected, response time, efficiency).
- Demo steps:
  1) Open **Agent Marketplace** → filter templates → “one-click deploy” narrative.
  2) Open an agent **View Details** → show tabs (Overview/Performance/Config/Activity).
  3) Show controls: Pause/Resume/Deactivate (safe actions, confirmations, toasts).
  4) Use **Ctrl/Cmd+K** to focus search; apply AND filters (Status/Type/Model/Perf).
- Sales close: “40 agents today; scales to hundreds without hiring curve.”

### Graph Analytics (3 min)
**Key message:** graph reveals hidden relationships and attack paths that tables miss.
- Talk about: blast radius, lateral movement, correlated signals across domains.

### Network Topology (3 min)
**Key message:** immersive topology + regional clustering + real-time overlays.
- Do: hover tooltips; point at node status; call out “attack path identification”.

### AI Analytics (3 min)
**Key message:** ask security questions in plain English; get actionable answers.
- Demo: ask one query tied to current posture; mention transparency (SQL visibility).

## 5) Competitive differentiation vs Verizon + AT&T (sound bites)
- “We don’t just show alerts — we show **context** (graph) and **action** (agents).”
- “T-Mobile’s 5G + SASE + CDC + IoT become one intelligence fabric, not siloed portals.”
- “Faster MTTD/MTTR via AI triage; fewer tools; fewer swivel-chair handoffs.”

## 6) Technical Q&A crib notes (keep ready)
- Frontend: React + Vite; routing via React Router.
- Backend: Express API (`/api/*`), health: `/health`.
- Data: Neo4j (topology/relationships), PostgreSQL (metrics/events/incidents).
- AI: Gemini-powered analytics; voice endpoints exist (`/api/ai/voice-chat`, `/api/ai/text-to-speech`).
- Deployment: Vercel hosts **frontend**; backend should run on Render (or equivalent).

## 7) Backup plans (when things go wrong)
- If backend unreachable: pivot to Exec → AI Agents → Topology (all still show value visually); use screenshot pack for AI queries.
- If browser slows: close extra tabs, reduce window size, refresh once, continue.
- If a chart fails: narrate the workflow and jump to the next dashboard (don’t debug live).

## 8) Post-demo follow-up (same-day)
- Send: 1-page recap (outcomes + differentiators) + screenshots + proposed rollout plan.
- Offer: workshop with Security + Engineering; POC using a sanitized subset of T-Mobile telemetry.
- Define success metrics for POC: MTTD/MTTR delta, false-positive reduction, analyst time saved.

