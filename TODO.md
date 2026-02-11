# TODO (Project Worklist)

This repo is demo-first. Items below are prioritized for security, demo stability, and maintainability.

Last updated: **February 11, 2026**

---

## Completed (February 2026 Sprint)

### AI Provider System
- [x] Implement dual AI provider support (OpenAI + ZAI) in `api/_lib/gemini.js` and `server/services/gemini.js`
- [x] Add `aiProvider` parameter to `/api/ai/query` endpoint
- [x] Default to OpenAI `gpt-4o` (fast, reliable for demos)
- [x] Add settings gear icon to AI Analytics Dashboard hero section
- [x] Build provider picker UI with OpenAI and ZAI cards
- [x] Persist provider selection to `localStorage`
- [x] Show active provider badge and provider used per response
- [x] Increase Vercel timeout from 30s to 60s in `vercel.json`
- [x] Add `AbortController` timeout (55s) to prevent unhandled gateway timeouts
- [x] Optimize AI prompts (shorter, focused) to reduce latency

### AI/LLM Model Updates
- [x] Update all legacy model references (GPT-4, Gemini Pro, Claude 3) to current models
- [x] Update `aiModels` array in `src/lib/aiAgentMockData.js` with GPT-5.2 Pro, Gemini 3 Pro, Claude Opus 4.6, Grok 4.1 Fast
- [x] Update cost estimates and provider names across the codebase
- [x] Fix voice chat `max_tokens` deprecation (use `max_completion_tokens` for newer models)
- [x] Add model fallback chain for voice chat endpoint

### 3D Network Topology
- [x] Replace custom `@react-three/fiber` implementation with `react-force-graph-3d`
- [x] Implement force-directed layout with automatic node positioning
- [x] Add color-coded nodes by type and alarm status with glow effects
- [x] Add directional edge arrows with utilization-based coloring
- [x] Implement click-to-focus camera animation on node selection
- [x] Add drag-and-drop node repositioning
- [x] Add camera presets (top, front, side, isometric)
- [x] Add fullscreen mode
- [x] Pass `onNodeClick`, `selectedNodeId`, `alarmedNodeIds` from dashboard

### Geographic Map Dashboard
- [x] Add edge/connection visualization with Polylines on Leaflet map
- [x] Color-code edges by alarm severity and utilization
- [x] Line thickness based on bandwidth, dashed lines for high latency
- [x] Interactive edge click handlers opening `NetworkNodeDetail` modal
- [x] Enhanced node clicks using `NetworkNodeDetail` modal
- [x] Right-click context menu for node image regeneration
- [x] Fix duplicate popup issue (remove Leaflet default popup)
- [x] Fix z-index for `NetworkNodeDetail` modal (z-9999)
- [x] Fix z-index for right-click `NodeImageRegenerator` dialog (z-9999)

### Bot Identity System (AI Agents)
- [x] Create `BotIdentityPanel` component (`src/components/agents/BotIdentityPanel.jsx`)
- [x] Add six identity components: IDENTITY, SOUL, HEARTBEAT, USER, TOOLS, MEMORY
- [x] Generate contextual markdown content for all 40 agents
- [x] Add clickable cards with icons and color coding
- [x] Add `IdentityViewModal` for full markdown content viewing
- [x] Integrate into `AgentDetailModal` under Configuration tab

### AI Backend (ZAI Migration)
- [x] Replace Google Gemini SDK with ZAI API (direct `fetch` calls)
- [x] Use correct ZAI endpoint: `https://api.z.ai/api/coding/paas/v4/chat/completions`
- [x] Add `stream: false` parameter for non-streaming responses
- [x] Update error handling for ZAI-specific errors
- [x] Update `.env.example` with `ZAI_API_KEY` documentation
- [x] Switch default back to OpenAI due to ZAI latency issues

### Build & Deployment Fixes
- [x] Fix `ERR_PNPM_OUTDATED_LOCKFILE` by regenerating `pnpm-lock.yaml`
- [x] Correct `react-force-graph-3d` version to `^1.29.1`
- [x] Update Shadcn UI `dialog.jsx` z-index for map overlay compatibility

---

## P0 — Critical (do ASAP)

- [ ] **Security: rotate leaked Neo4j credentials** (Aura console) and update local/prod env vars
- [ ] **Security: remove leaked credential from git history** (git-filter-repo / BFG) and force-push
- [ ] **Security: verify repo has no committed secrets** (scan history + current tree)

## P1 — Demo Stability (before demo)

- [ ] **Validate AI queries end-to-end** with OpenAI provider on production (Vercel)
- [ ] **Test suggested queries** — confirm all 8 suggested queries return results without timeout
- [ ] **Test voice chat** — confirm speech-to-text, GPT response, and text-to-speech pipeline
- [ ] **Test provider switching** — confirm switching to ZAI and back to OpenAI works
- [ ] **Validate 3D topology** — confirm `react-force-graph-3d` renders, nodes are clickable, camera presets work
- [ ] **Validate Geographic Map** — confirm edge visualization, node/edge click modals, right-click regeneration
- [ ] **Validate Bot Identity** — open several agents, confirm identity cards and markdown content render
- [ ] Confirm hosted environment health:
  - [ ] Frontend loads (Vercel)
  - [ ] Backend/API reachable (`/health`)
  - [ ] CORS configured correctly for frontend origin
- [ ] Ensure graceful fallback behavior when:
  - [ ] PostgreSQL is unavailable
  - [ ] Neo4j is unavailable
  - [ ] AI providers are unavailable
- [ ] Prepare/refresh offline demo assets (screenshots/video) for each dashboard

## P2 — Suggested Enhancements (post-demo)

### AI & Analytics
- [ ] Add streaming responses (SSE) for AI queries to show real-time typing effect
- [ ] Add conversation history/memory to text queries (currently only voice has history)
- [ ] Add model selection dropdown in settings (e.g., `gpt-4o-mini` for faster/cheaper, `gpt-4.1` for latest)
- [ ] Add response time tracking and display in the UI
- [ ] Add a "regenerate" button on AI responses to re-run with different provider
- [ ] Cache frequent queries to reduce API calls and latency

### Network Topology
- [ ] Add legend/key for node types and edge colors on 3D topology
- [ ] Add node search/filter in the 3D view
- [ ] Add edge click support in 3D view (currently only nodes are clickable)
- [ ] Add node grouping by region/type with expandable clusters
- [ ] Add real-time alarm animation overlay on 3D graph

### Geographic Map
- [ ] Add edge labels on hover (bandwidth, latency, utilization)
- [ ] Add map layer controls (satellite, terrain, dark mode)
- [ ] Add clustering for dense node areas at low zoom levels
- [ ] Add animated data flow along edges (directional particles)

### AI Agents
- [ ] Add editable bot identity components (currently read-only)
- [ ] Add identity export/import (JSON/YAML)
- [ ] Add identity version history and diff view
- [ ] Add identity templates for common agent types

### Infrastructure
- [ ] Decide primary deployment model (Express vs. Vercel serverless) and remove duplicates
- [ ] Add real authentication/authorization (SSO/OAuth placeholder, gated routes)
- [ ] Add observability (structured logs, request IDs, latency/error rate metrics)
- [ ] Add health check endpoint that validates all external service connections
- [ ] Add rate limiting on API endpoints

## P3 — Docs Hygiene (ongoing)

- [x] Keep `README.md` as the single entrypoint; keep deep-dives in `docs/`
- [ ] Update `DEMO.md` runbook to cover new features (provider switching, 3D topology, bot identity)
- [ ] Update `docs/guides/AI_ANALYTICS_SETUP.md` to document multi-provider configuration
- [ ] Update `docs/technical/deployment/ENVIRONMENT_VARIABLES_REFERENCE.md` with `ZAI_API_KEY`
- [ ] Keep security incident docs in repo root:
  - `IMMEDIATE_ACTION_REQUIRED.md`
  - `SECURITY_REMEDIATION_REPORT.md`
- [ ] Keep demo runbook in root for quick access:
  - `DEMO.md`
