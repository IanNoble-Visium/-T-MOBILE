# T-Mobile TruContext Demo – Roadmap

This roadmap separates polish we can apply before today’s demo from items that require production infrastructure or longer cycles. Each item lists: description, effort, dependencies, impact, and category. Checkboxes can be used for tracking.

Cross-references:
- README.md → Integration Roadmap
- DEMO_READY_CHECKLIST.md → Recommended demo flow and health checks
- IMMEDIATE_ACTION_REQUIRED.md, SECURITY_REMEDIATION_REPORT.md → Credential rotation & history cleanup
- BUG_FIX_AGENT_DETAIL_MODAL.md → Modal future enhancements
- docs/guides/AI_ANALYTICS_SETUP.md → AI Analytics next steps
- docs/guides/HEADER_ENHANCEMENTS.md → Header future enhancements
- docs/guides/NETWORK_TOPOLOGY_GUIDE.md → Topology future enhancements
- docs/technical/IMPLEMENTATION_SUMMARY.md → Platform next steps

---

## 1) Pre-Demo Enhancements (Can Be Done Now)
Quick wins that improve the demo experience without backend/integration changes.

### Priority Key
- High = Strong on-stage impact, visible to audience
- Medium = Noticeable polish
- Low = Nice-to-have

### Pre-Demo Checklist (target 2–8 hours total)

- [ ] Agent Detail Modal: Pause / Resume / Deactivate actions (with confirmation)
  - Description: Add action buttons to the modal using shadcn/ui AlertDialog; actions update local state/mock data.
  - Effort: 2–4 hours
  - Dependencies: None (frontend only)
  - Impact: High
  - Category: Feature Enhancement
  - Refs: BUG_FIX_AGENT_DETAIL_MODAL.md

- [ ] Agent Search + Filters + Keyboard Shortcut
  - Description: Add search input and filters (status/type/model/performance); map Ctrl/Cmd+K to focus search.
  - Effort: 4–6 hours
  - Dependencies: None (frontend only)
  - Impact: High
  - Category: Feature Enhancement / UX
  - Refs: QUICK_START_AI_AGENTS.md (future Ctrl+K), HEADER_ENHANCEMENTS.md

- [ ] Agent Performance Micro‑charts (sparklines) in Modal
  - Description: Show 24h trend sparkline for efficiency/accuracy using Recharts; mock data acceptable.
  - Effort: 2–3 hours
  - Dependencies: None
  - Impact: Medium
  - Category: Feature Enhancement / UX

- [ ] Activity Feed Polish
  - Description: Group by agent; consistent severity badges; subtle timestamps; maintain scroll position.
  - Effort: 1–2 hours
  - Dependencies: None
  - Impact: Medium
  - Category: UX Improvement

- [ ] Accessibility Quick Pass
  - Description: Add ARIA labels for buttons/tabs, ensure focus trap on Dialog, keyboard navigation cues.
  - Effort: 1–2 hours
  - Dependencies: None
  - Impact: Medium
  - Category: Technical Improvement / Accessibility

- [ ] High‑Contrast Toggle
  - Description: Add a quick UI toggle that bumps contrast variables; keep dark theme; no full theming needed.
  - Effort: 1–2 hours
  - Dependencies: None
  - Impact: Medium
  - Category: UX / Accessibility

- [ ] Skeleton Loaders + Error Boundaries
  - Description: Add skeletons for agent grid and KPIs; add a simple ErrorBoundary + toast notification.
  - Effort: 2 hours
  - Dependencies: None
  - Impact: Medium
  - Category: Technical Improvement / UX

- [ ] Demo Data Reset Utility
  - Description: Add a small "Reset Demo Data" button in settings to re-seed mock data for repeatable demos.
  - Effort: 1 hour
  - Dependencies: None
  - Impact: Medium
  - Category: Tooling / UX

### Security (Urgent – Do ASAP)

- [ ] Rotate Neo4j Credentials + Clean Git History
  - Description: Rotate exposed Neo4j password and remove from git history; update local .env; enable push protection.
  - Effort: 2–4 hours (depends on access)
  - Dependencies: GitHub admin access; ability to force-push; Aura console access
  - Impact: High (Security)
  - Category: Security / Process
  - Refs: IMMEDIATE_ACTION_REQUIRED.md, SECURITY_REMEDIATION_REPORT.md

---

## 2) Post-Demo / Production Roadmap
Items that require backend, integrations, or longer cycles. Organized by priority and timeline.

### Priority Legend
- High = Critical for production value or flagship demo capability
- Medium = Important for robustness and scale
- Low = Nice-to-have / future differentiator

### Timeline Legend
- Short-term: 1–2 weeks
- Medium-term: 1–2 months
- Long-term: 3+ months

### Short-term (1–2 weeks)

- [ ] Real-time Updates via WebSockets (alarms, agent activity, KPIs)
  - Description: Introduce Socket.IO on Node backend; subscribe from UI; keep polling as fallback.
  - Effort: 1 week
  - Dependencies: Backend server; deployment target
  - Impact: High
  - Category: Technical Improvement / Integration
  - Refs: README.md (Integration Roadmap)

- [ ] Persist Agents & Activities in Postgres
  - Description: Create tables + CRUD API (Prisma/Drizzle); migrate AI Agents off mock state.
  - Effort: 1 week
  - Dependencies: Backend + DB access
  - Impact: High
  - Category: Integration / Data

- [ ] AI Analytics – Query History / Favorites + Charts
  - Description: Save past queries; allow starring; render basic charts for common result types.
  - Effort: 1 week
  - Dependencies: Backend storage (Postgres)
  - Impact: High
  - Category: Feature Enhancement
  - Refs: docs/guides/AI_ANALYTICS_SETUP.md

- [ ] Agent Collaboration (MVP)
  - Description: Simple collaboration notes thread + linked agents; timestamped events.
  - Effort: 4–5 days
  - Dependencies: Persistence layer
  - Impact: Medium
  - Category: Feature Enhancement

- [ ] CI Pipeline + Tests
  - Description: GitHub Actions for lint/typecheck/test/build; unit tests for KPICard, AgentDetailModal; Playwright smoke.
  - Effort: 3–5 days
  - Dependencies: None
  - Impact: Medium
  - Category: Technical Improvement / QA

- [ ] Virtualize Large Lists (Agent Grid, Activity)
  - Description: Use react-virtual for smooth scrolling with 40–200 items.
  - Effort: 2–3 days
  - Dependencies: None
  - Impact: Medium
  - Category: Performance

- [ ] Observability (Sentry + basic logs)
  - Description: Frontend + backend error monitoring and tracing; minimal setup.
  - Effort: 2–3 days
  - Dependencies: Sentry account
  - Impact: Medium
  - Category: Technical Improvement

### Medium-term (1–2 months)

- [ ] SSO/OAuth + RBAC
  - Description: Enterprise auth integration (Auth0/Okta/Azure AD) with roles (Viewer/Analyst/Admin).
  - Effort: 2–4 weeks
  - Dependencies: IdP selection, callback URLs, user store
  - Impact: High
  - Category: Security / Integration
  - Refs: README.md (Integration Roadmap)

- [ ] Neo4j Graph Integration (Agents + Topology)
  - Description: Persist relationships (agent ↔ asset, alerts); enable path/impact analysis and saved layouts.
  - Effort: 3–5 weeks
  - Dependencies: Neo4j Aura, schema design, sync jobs
  - Impact: High
  - Category: Integration / Data
  - Refs: docs/technical/NEO4J_IMPLEMENTATION.md, IMPLEMENTATION_SUMMARY.md

- [ ] External APIs – SASE (Palo Alto), T‑Platform, IoT Hub (read-only start)
  - Description: Pull status/metrics to enrich dashboards; map to existing KPIs.
  - Effort: 2–4 weeks each
  - Dependencies: API credentials; connectivity; rate limits
  - Impact: High
  - Category: Integration
  - Refs: README.md (Integration Roadmap)

- [ ] Agent-to-Agent Communication (rules + messaging)
  - Description: Define contracts for agents to hand off tasks and escalate events.
  - Effort: 4–6 weeks
  - Dependencies: Persistence, messaging bus (optional), auth
  - Impact: High
  - Category: Feature Enhancement

- [ ] Advanced Alarm Rules & Analytics
  - Description: Thresholds, schedules, alert templates, history analytics.
  - Effort: 2–4 weeks
  - Dependencies: DB + background jobs
  - Impact: Medium
  - Category: Feature Enhancement

- [ ] Accessibility Compliance Pass (WCAG)
  - Description: Keyboard navigation, ARIA coverage, color contrast audit.
  - Effort: 2 weeks
  - Dependencies: None
  - Impact: Medium
  - Category: Technical Improvement

- [ ] Deployment Hardening (Docker, CI/CD, Environments)
  - Description: Dockerize FE/BE, compose for local, preview envs, promotion workflows.
  - Effort: 1–2 weeks
  - Dependencies: Cloud provider/project
  - Impact: Medium
  - Category: DevOps

### Long-term (3+ months)

- [ ] ML-driven Optimization & Predictive Recommendations
  - Description: Train models on incidents/activities to optimize routing and predict hotspots.
  - Effort: 2–3 months
  - Dependencies: Historical data, MLOps pipeline
  - Impact: High
  - Category: Feature Enhancement / Data Science

- [ ] Advanced Analytics & Reporting Suite
  - Description: Custom reports, scheduling, exports, executive summaries.
  - Effort: 2–3 months
  - Dependencies: Data warehouse, report service
  - Impact: Medium
  - Category: Feature Enhancement

- [ ] Mobile App (Field Ops)
  - Description: Mobile companion for alerts, approvals, quick triage.
  - Effort: 3+ months
  - Dependencies: Auth, APIs, push notifications
  - Impact: Medium
  - Category: Feature Enhancement

---

## Tracking & Governance
- Update checkboxes as items complete; link PRs/issues next to each.
- Keep security items prioritized; verify secret rotation and history cleanup completed.
- Review roadmap weekly; adjust priorities based on stakeholder feedback.

Last updated: Oct 17, 2025

