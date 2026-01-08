# TODO (Project Worklist)

This repo is demo-first. Items below are prioritized for security, demo stability, and maintainability.

## P0 - Critical (do ASAP)

- [ ] **Security: rotate leaked Neo4j credentials** (Aura console) and update local/prod env vars.
- [ ] **Security: remove leaked credential from git history** (git-filter-repo / BFG) and force-push.
- [ ] **Security: verify repo has no committed secrets** (scan history + current tree).

## P1 - Demo stability (this week)

- [ ] Confirm hosted environment health:
  - [ ] Frontend loads (Vercel)
  - [ ] Backend/API reachable (`/health`)
  - [ ] CORS configured correctly for frontend origin
- [ ] Ensure graceful fallback behavior is consistent when:
  - [ ] PostgreSQL is unavailable
  - [ ] Neo4j is unavailable
  - [ ] AI providers are unavailable (Gemini/OpenAI)
- [ ] Prepare/refresh offline demo assets (screenshots/video) for each dashboard.

## P2 - Productization (next)

- [ ] Decide primary deployment model:
  - [ ] Express backend (`server/`) on Render **OR**
  - [ ] Vercel serverless functions (`/api`) (and remove/align duplicates)
- [ ] Add real authentication/authorization (SSO/OAuth placeholder  at least gated routes).
- [ ] Add observability:
  - [ ] structured server logs
  - [ ] request IDs
  - [ ] basic metrics (latency/error rate)

## P3 - Docs hygiene (ongoing)

- [ ] Keep `README.md` as the single entrypoint; keep deep-dives in `docs/`.
- [ ] Keep security incident docs in repo root:
  - `IMMEDIATE_ACTION_REQUIRED.md`
  - `SECURITY_REMEDIATION_REPORT.md`
- [ ] Keep demo runbook in root for quick access:
  - `DEMO.md`

