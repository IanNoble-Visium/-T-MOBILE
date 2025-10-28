# T-Mobile Dashboard - Deployment Architecture

## 🏗️ CURRENT PROBLEM

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                                                              │
│  Trying to access:                                          │
│  • /api/network-topology/nodes                              │
│  • /api/ai/dashboard-context                                │
│  • /api/ai/suggested-queries                                │
│  • /api/ai/query                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend Only)                    │
│                                                              │
│  ✅ Static Files: HTML, CSS, JS, Images                     │
│  ❌ NO Backend Server                                       │
│  ❌ NO API Routes                                           │
│  ❌ NO Database Connections                                 │
│                                                              │
│  Result: ERR_BLOCKED_BY_CLIENT, Failed to fetch            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ❌ API CALLS FAIL ❌
```

---

## ✅ CORRECT ARCHITECTURE (After Fix)

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                                                              │
│  • Loads React app from Vercel                             │
│  • Makes API calls to Render backend                       │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│   VERCEL (Frontend)      │   │   RENDER (Backend)       │
│                          │   │                          │
│  • Vite/React App        │   │  • Express Server        │
│  • Static Assets         │   │  • API Routes            │
│  • Environment Vars:     │   │  • Database Clients      │
│    - VITE_API_BASE_URL ──┼───┼─→ Points here           │
│    - VITE_API_URL ───────┼───┼─→ Points here           │
│    - VITE_CLOUDINARY_*   │   │  • Environment Vars:     │
│    - VITE_RECRAFT_*      │   │    - POSTGRES_URL        │
│                          │   │    - NEO4J_*             │
│  ✅ Serves UI            │   │    - GOOGLE_API_KEY      │
│                          │   │    - OPENAI_API_KEY      │
│                          │   │                          │
│                          │   │  ✅ Handles API Requests │
└──────────────────────────┘   └──────────────────────────┘
                                            │
                          ┌─────────────────┼─────────────────┐
                          ▼                 ▼                 ▼
                   ┌──────────┐      ┌──────────┐      ┌──────────┐
                   │   NEON   │      │  NEO4J   │      │  GOOGLE  │
                   │PostgreSQL│      │   AURA   │      │  GEMINI  │
                   │          │      │          │      │          │
                   │ Security │      │ Network  │      │    AI    │
                   │   Data   │      │Topology  │      │ Service  │
                   └──────────┘      └──────────┘      └──────────┘
```

---

## 📊 DATA FLOW DIAGRAM

### Example: Loading Network Topology

```
1. USER OPENS NETWORK TOPOLOGY PAGE
   │
   ├─→ Browser loads React app from Vercel
   │   └─→ https://your-app.vercel.app
   │
2. REACT APP MAKES API CALL
   │
   ├─→ Reads VITE_API_BASE_URL from environment
   │   └─→ https://your-backend.onrender.com/api
   │
   ├─→ Calls: GET /api/network-topology/nodes
   │
3. RENDER BACKEND RECEIVES REQUEST
   │
   ├─→ Express server handles request
   │   └─→ Route: server/routes/network-topology.js
   │
   ├─→ Connects to Neo4j Aura
   │   └─→ Uses NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD
   │
   ├─→ Executes Cypher query
   │   └─→ MATCH (n) RETURN n
   │
4. NEO4J RETURNS DATA
   │
   ├─→ Backend formats response
   │   └─→ { success: true, data: [...nodes], count: 50 }
   │
5. BACKEND SENDS RESPONSE TO FRONTEND
   │
   ├─→ JSON response over HTTPS
   │
6. REACT APP RECEIVES DATA
   │
   ├─→ Updates state
   │   └─→ setNodes(data)
   │
   ├─→ Renders visualization
   │   └─→ Network topology graph appears
   │
7. USER SEES NETWORK TOPOLOGY ✅
```

---

## 🔄 API ENDPOINT MAPPING

### Frontend → Backend Mapping

| Frontend Call | Backend Route | Database | Purpose |
|--------------|---------------|----------|---------|
| `GET /api/network-topology/nodes` | `server/routes/network-topology.js` | Neo4j | Get all network nodes |
| `GET /api/network-topology/edges` | `server/routes/network-topology.js` | Neo4j | Get all connections |
| `GET /api/data/kpi-metrics/latest` | `server/routes/data.js` | PostgreSQL | Get latest KPIs |
| `GET /api/data/threat-events` | `server/routes/data.js` | PostgreSQL | Get threat events |
| `POST /api/ai/query` | `server/routes/ai.js` | PostgreSQL + Gemini | Natural language query |
| `POST /api/ai/voice-chat` | `server/routes/ai.js` | OpenAI | Voice conversation |
| `GET /api/ai/dashboard-context` | `server/routes/ai.js` | PostgreSQL + Neo4j | Dashboard context |
| `POST /api/dashboards/generate` | `server/routes/dashboards.js` | PostgreSQL + Neo4j + Gemini | Generate AI dashboard |

---

## 🌐 ENVIRONMENT VARIABLE FLOW

### Backend Environment Variables (Render)

```
┌─────────────────────────────────────────────────────────────┐
│                    RENDER ENVIRONMENT                        │
│                                                              │
│  NODE_ENV=production                                        │
│  PORT=3001                                                  │
│  POSTGRES_URL=postgresql://...                             │
│  NEO4J_URI=neo4j+s://...                                   │
│  NEO4J_USERNAME=neo4j                                       │
│  NEO4J_PASSWORD=...                                        │
│  NEO4J_DATABASE=neo4j                                       │
│  GOOGLE_API_KEY=AIza...                                    │
│  OPENAI_API_KEY=sk-...                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                            │
│                                                              │
│  server/index.js                                            │
│  ├─→ Loads dotenv                                          │
│  ├─→ Reads process.env.POSTGRES_URL                       │
│  ├─→ Reads process.env.NEO4J_*                            │
│  └─→ Initializes database connections                      │
│                                                              │
│  server/routes/ai.js                                        │
│  ├─→ Reads process.env.GOOGLE_API_KEY                     │
│  ├─→ Reads process.env.OPENAI_API_KEY                     │
│  └─→ Initializes AI clients                                │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Environment Variables (Vercel)

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL ENVIRONMENT                        │
│                                                              │
│  VITE_API_BASE_URL=https://your-backend.onrender.com/api   │
│  VITE_API_URL=https://your-backend.onrender.com/api        │
│  VITE_CLOUDINARY_CLOUD_NAME=dod8ajzjd                      │
│  VITE_CLOUDINARY_API_KEY=841983555962286                   │
│  VITE_CLOUDINARY_API_SECRET=...                            │
│  VITE_RECRAFT_API_URL=https://external.api.recraft.ai/v1   │
│  VITE_RECRAFT_API_KEY=...                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VITE BUILD PROCESS                        │
│                                                              │
│  • Reads VITE_* environment variables                       │
│  • Replaces import.meta.env.VITE_* in code                 │
│  • Bundles into static JavaScript                           │
│  • Deploys to Vercel CDN                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER RUNTIME                           │
│                                                              │
│  src/lib/neo4jClient.js                                     │
│  ├─→ const API_BASE_URL = import.meta.env.VITE_API_BASE_URL│
│  └─→ fetch(`${API_BASE_URL}/network-topology/nodes`)       │
│                                                              │
│  src/components/dashboards/ThreatProtectDashboard.jsx      │
│  ├─→ const API_BASE_URL = import.meta.env.VITE_API_URL     │
│  └─→ axios.get(`${API_BASE_URL}/data/kpi-metrics/latest`)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔒 SECURITY ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    HTTPS/TLS ENCRYPTION                      │
│                                                              │
│  • All traffic encrypted                                    │
│  • Vercel provides SSL certificate                          │
│  • Render provides SSL certificate                          │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│   VERCEL (Frontend)      │   │   RENDER (Backend)       │
│                          │   │                          │
│  • No sensitive data     │   │  • Environment vars      │
│  • Public API keys only  │   │    stored securely       │
│  • CORS enabled          │   │  • CORS configured       │
│                          │   │  • Rate limiting         │
└──────────────────────────┘   └──────────────────────────┘
                                            │
                          ┌─────────────────┼─────────────────┐
                          ▼                 ▼                 ▼
                   ┌──────────┐      ┌──────────┐      ┌──────────┐
                   │   NEON   │      │  NEO4J   │      │  GOOGLE  │
                   │          │      │          │      │          │
                   │ • SSL    │      │ • SSL    │      │ • API    │
                   │ • Auth   │      │ • Auth   │      │   Key    │
                   └──────────┘      └──────────┘      └──────────┘
```

---

## 📈 SCALABILITY CONSIDERATIONS

### Current Setup (Free Tier)

```
VERCEL (Free Tier)
├─→ Bandwidth: 100 GB/month
├─→ Builds: Unlimited
├─→ Deployments: Unlimited
└─→ Edge Network: Global CDN

RENDER (Free Tier)
├─→ 750 hours/month (enough for 1 service)
├─→ Spins down after 15 min inactivity
├─→ Cold start: ~30 seconds
└─→ 512 MB RAM, 0.1 CPU

NEON (Free Tier)
├─→ 1 project
├─→ 10 branches
├─→ 3 GB storage
└─→ Compute: 191.9 hours/month

NEO4J AURA (Free Tier)
├─→ 1 instance
├─→ 200k nodes + relationships
├─→ 50 MB storage
└─→ Always on
```

### Upgrade Path (If Needed)

```
VERCEL PRO ($20/month)
├─→ Bandwidth: 1 TB/month
├─→ Better performance
└─→ Team collaboration

RENDER STARTER ($7/month)
├─→ Always on (no cold starts)
├─→ 512 MB RAM
└─→ Better for production

NEON SCALE ($19/month)
├─→ Unlimited projects
├─→ 10 GB storage
└─→ Better performance

NEO4J AURA PROFESSIONAL ($65/month)
├─→ 8 GB RAM
├─→ Unlimited nodes
└─→ Production-ready
```

---

## 🚀 DEPLOYMENT WORKFLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT (Local)                       │
│                                                              │
│  1. Code changes in VS Code                                 │
│  2. Test locally:                                           │
│     • Frontend: http://localhost:5173                       │
│     • Backend: http://localhost:3001                        │
│  3. Commit to Git                                           │
│  4. Push to GitHub                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                         │
│                                                              │
│  • Source code stored                                       │
│  • Triggers automatic deployments                           │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│   VERCEL DEPLOYMENT      │   │   RENDER DEPLOYMENT      │
│                          │   │                          │
│  1. Detects push         │   │  1. Detects push         │
│  2. Runs: pnpm build     │   │  2. Runs: pnpm install   │
│  3. Injects env vars     │   │  3. Injects env vars     │
│  4. Deploys to CDN       │   │  4. Starts server        │
│  5. Updates DNS          │   │  5. Health check         │
│                          │   │                          │
│  ✅ Frontend live        │   │  ✅ Backend live         │
└──────────────────────────┘   └──────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION (Live)                         │
│                                                              │
│  • Users access: https://your-app.vercel.app               │
│  • Frontend calls: https://your-backend.onrender.com/api   │
│  • Everything works! 🎉                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 SUMMARY

### What You Have Now (Broken)
- ❌ Frontend deployed to Vercel
- ❌ Backend NOT deployed
- ❌ API calls fail

### What You Need (Working)
- ✅ Frontend deployed to Vercel
- ✅ Backend deployed to Render
- ✅ Environment variables configured
- ✅ API calls succeed

### Next Steps
1. Deploy backend to Render (see VERCEL_DEPLOYMENT_GUIDE.md)
2. Configure environment variables (see ENVIRONMENT_VARIABLES_REFERENCE.md)
3. Update Vercel with backend URL
4. Test and verify

---

## 📚 RELATED DOCUMENTATION

- **VERCEL_DEPLOYMENT_GUIDE.md** - Complete step-by-step deployment guide
- **ENVIRONMENT_VARIABLES_REFERENCE.md** - All environment variables explained
- **.env.example** - Template for local development

---

## ✅ SUCCESS CRITERIA

Your deployment is successful when:

1. ✅ Backend health check returns 200 OK
2. ✅ Frontend loads without errors
3. ✅ Network topology displays nodes and edges
4. ✅ AI Analytics dashboard works
5. ✅ No CORS errors in console
6. ✅ No `ERR_BLOCKED_BY_CLIENT` errors
7. ✅ All API calls return 200 status
8. ✅ Database connections established
9. ✅ Voice features work (if configured)
10. ✅ Image generation works (if configured)

