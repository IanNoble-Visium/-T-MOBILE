# Serverless API Endpoints Fix - Complete Guide

## 🎯 ISSUE SUMMARY

Your T-Mobile Dashboard is deployed on Vercel using **serverless functions**, but some API endpoints were missing, causing errors:

### ❌ Errors You Were Seeing:

1. **Error: HTML instead of JSON for `/api/network-topology/edges`**
   ```
   SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
   Neo4j unavailable, falling back to localStorage
   ```
   **Cause**: Missing `api/network-topology/edges.js` serverless function

2. **Error: 405 Method Not Allowed for `/api/dashboards/generate`**
   ```
   POST https://tmobile.visiumtechnologies.com/api/dashboards/generate 405 (Method Not Allowed)
   ```
   **Cause**: Missing `api/dashboards/generate.js` serverless function

3. **Error: evmAsk.js (Browser Extension)**
   ```
   evmAsk.js:5 Uncaught TypeError: Cannot redefine property: ethereum
   ```
   **Cause**: Cryptocurrency wallet browser extension conflict (NOT your app's fault)

---

## ✅ SOLUTION IMPLEMENTED

I've created the missing serverless API functions:

### 1. **Created: `api/network-topology/edges.js`**

**Purpose**: Handle GET and POST requests for network edges/connections

**Endpoints**:
- `GET /api/network-topology/edges` - Fetch all edges from Neo4j
- `POST /api/network-topology/edges` - Create new edge between nodes

**Features**:
- ✅ CORS headers configured
- ✅ Proper error handling
- ✅ Neo4j query execution
- ✅ JSON response format
- ✅ Logging for debugging

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "type": "fiber",
      "bandwidth": 10000,
      "latency": 5,
      "utilization": 65,
      "status": "active"
    }
  ],
  "count": 1
}
```

---

### 2. **Created: `api/dashboards/generate.js`**

**Purpose**: Generate AI-powered dashboards from natural language prompts

**Endpoint**:
- `POST /api/dashboards/generate` - Generate dashboard with charts

**Features**:
- ✅ Natural language processing
- ✅ Intelligent chart selection based on prompt keywords
- ✅ Fetches data from Neo4j and PostgreSQL
- ✅ Returns multiple chart configurations
- ✅ Supports network topology, threats, devices, KPIs

**Example Request**:
```json
{
  "prompt": "Show me network topology and threat overview",
  "context": {}
}
```

**Example Response**:
```json
{
  "prompt": "Show me network topology and threat overview",
  "charts": [
    {
      "type": "network-topology",
      "title": "Network Topology",
      "description": "Interactive network topology visualization",
      "data": { "nodes": [...], "edges": [...] },
      "dataSource": "neo4j"
    },
    {
      "type": "pie",
      "title": "Threats by Severity",
      "description": "Distribution of threats by severity level",
      "data": { "items": [...] },
      "dataSource": "postgresql"
    }
  ],
  "generatedAt": "2025-10-28T..."
}
```

---

## 📊 COMPLETE SERVERLESS API ENDPOINT MAP

### ✅ **Implemented Endpoints**

| Endpoint | Method | File | Status |
|----------|--------|------|--------|
| `/api/network-topology/nodes` | GET, POST | `api/network-topology/nodes.js` | ✅ Working |
| `/api/network-topology/edges` | GET, POST | `api/network-topology/edges.js` | ✅ **NEW** |
| `/api/ai/query` | POST | `api/ai/query.js` | ✅ Working |
| `/api/ai/dashboard-context` | GET | `api/ai/dashboard-context.js` | ✅ Working |
| `/api/ai/suggested-queries` | GET | `api/ai/suggested-queries.js` | ✅ Working |
| `/api/dashboards/generate` | POST | `api/dashboards/generate.js` | ✅ **NEW** |

---

### ⚠️ **Potentially Missing Endpoints** (from Express routes)

These endpoints exist in your Express server (`server/routes/`) but may not have serverless equivalents yet. Add them if needed:

**Network Topology:**
- `GET /api/network-topology/nodes/:id` - Get node by ID
- `PUT /api/network-topology/nodes/:id` - Update node
- `DELETE /api/network-topology/nodes/:id` - Delete node
- `GET /api/network-topology/edges/:id` - Get edge by ID
- `PUT /api/network-topology/edges/:id` - Update edge
- `DELETE /api/network-topology/edges/:id` - Delete edge
- `GET /api/network-topology/nodes/:nodeId/edges` - Get edges for node
- `POST /api/network-topology/seed` - Seed database with sample data
- `GET /api/network-topology/export` - Export all data
- `GET /api/network-topology/stats` - Get statistics
- `DELETE /api/network-topology/clear` - Clear all data

**Data Endpoints:**
- `GET /api/data/kpi-metrics` - Get KPI metrics
- `GET /api/data/kpi-metrics/latest` - Get latest KPI metrics
- `GET /api/data/threat-events` - Get threat events
- `GET /api/data/devices` - Get devices
- `GET /api/data/incidents` - Get incidents
- `GET /api/data/event-stream` - Get event stream
- `GET /api/data/dashboard-summary` - Get dashboard summary
- `GET /api/data/time-series` - Get time series data

**AI Endpoints:**
- `POST /api/ai/voice-chat` - Voice chat with AI
- `POST /api/ai/text-to-speech` - Convert text to speech

**Dashboard Endpoints:**
- `POST /api/dashboards/enhance-prompt` - Enhance dashboard prompt
- `GET /api/dashboards/data/:type` - Get chart data by type

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Commit and Push Changes

```bash
git add api/network-topology/edges.js
git add api/dashboards/generate.js
git commit -m "Add missing serverless API endpoints for edges and dashboard generation"
git push origin main
```

### Step 2: Vercel Auto-Deploy

Vercel will automatically detect the push and redeploy your application.

**Monitor deployment**:
1. Go to https://vercel.com
2. Click on your project
3. Go to "Deployments" tab
4. Watch the latest deployment

### Step 3: Verify Deployment

Once deployed, test the endpoints:

**Test 1: Edges Endpoint**
```bash
curl https://tmobile.visiumtechnologies.com/api/network-topology/edges
```

**Expected**: JSON response with edges data (not HTML!)

**Test 2: Dashboard Generate Endpoint**
```bash
curl -X POST https://tmobile.visiumtechnologies.com/api/dashboards/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Show me network overview"}'
```

**Expected**: JSON response with charts array

---

## 🔍 VERIFICATION CHECKLIST

After deployment, verify in your browser:

### ✅ Network Topology Page
1. Open your app: `https://tmobile.visiumtechnologies.com`
2. Navigate to "Network Topology"
3. Open DevTools (F12) → Console tab
4. **Check for errors**:
   - ❌ Should NOT see: "Unexpected token '<'"
   - ❌ Should NOT see: "Neo4j unavailable, falling back to localStorage"
   - ✅ Should see: Network topology loads successfully

### ✅ AI Dashboards Page
1. Navigate to "AI Dashboards"
2. Click "Create with AI"
3. Enter prompt: "Show me network and threats"
4. Click "Generate"
5. **Check for errors**:
   - ❌ Should NOT see: "405 Method Not Allowed"
   - ❌ Should NOT see: "Error creating dashboard"
   - ✅ Should see: Dashboard generates successfully with charts

### ✅ Browser Console
1. Open DevTools (F12) → Console tab
2. **Ignore**: `evmAsk.js` error (browser extension, not your app)
3. **Check for**:
   - ✅ No "Failed to fetch" errors
   - ✅ No "405 Method Not Allowed" errors
   - ✅ No "Unexpected token '<'" errors
   - ✅ API calls return 200 status

---

## 🐛 TROUBLESHOOTING

### Issue: Still seeing HTML instead of JSON

**Possible causes**:
- Vercel hasn't deployed the new files yet
- Browser cache showing old errors

**Fix**:
1. Wait for Vercel deployment to complete
2. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Test in incognito window
4. Check Vercel deployment logs for errors

---

### Issue: 405 Method Not Allowed persists

**Possible causes**:
- File not deployed
- Vercel routing issue

**Fix**:
1. Verify file exists in GitHub: `api/dashboards/generate.js`
2. Check Vercel deployment logs
3. Verify `vercel.json` has correct function configuration:
   ```json
   {
     "functions": {
       "api/**/*.js": {
         "memory": 1024,
         "maxDuration": 30
       }
     }
   }
   ```

---

### Issue: Database connection errors

**Possible causes**:
- Environment variables not set in Vercel
- Database credentials expired

**Fix**:
1. Go to Vercel → Settings → Environment Variables
2. Verify these are set:
   - `NEO4J_URI`
   - `NEO4J_USERNAME`
   - `NEO4J_PASSWORD`
   - `NEO4J_DATABASE`
   - `POSTGRES_URL`
   - `GOOGLE_API_KEY`
3. Redeploy if you added/changed variables

---

### Issue: evmAsk.js error still showing

**This is NORMAL and can be ignored!**

**Explanation**:
- This is a browser extension (cryptocurrency wallet)
- It's trying to inject code into your page
- It's NOT your application's fault
- It does NOT affect your app's functionality

**To remove the error** (optional):
1. Disable the browser extension
2. OR use a different browser profile
3. OR ignore it (it's harmless)

---

## 📝 ENVIRONMENT VARIABLES CHECKLIST

Ensure these are set in Vercel → Settings → Environment Variables:

### Required for Neo4j (Network Topology)
- [ ] `NEO4J_URI` = `neo4j+s://a52f4a1a.databases.neo4j.io`
- [ ] `NEO4J_USERNAME` = `neo4j`
- [ ] `NEO4J_PASSWORD` = Your Neo4j password
- [ ] `NEO4J_DATABASE` = `neo4j`

### Required for PostgreSQL (Data)
- [ ] `POSTGRES_URL` = Your Neon PostgreSQL connection string

### Required for AI Features
- [ ] `GOOGLE_API_KEY` = Your Google Gemini API key

### Optional (for Voice Features)
- [ ] `OPENAI_API_KEY` = Your OpenAI API key

### Frontend Variables
- [ ] `VITE_API_BASE_URL` = `https://tmobile.visiumtechnologies.com/api`
- [ ] `VITE_API_URL` = `https://tmobile.visiumtechnologies.com/api`

---

## 🎯 NEXT STEPS

### 1. **Immediate** (Required)
- [x] Create `api/network-topology/edges.js` ✅ Done
- [x] Create `api/dashboards/generate.js` ✅ Done
- [ ] Commit and push to GitHub
- [ ] Wait for Vercel deployment
- [ ] Test endpoints

### 2. **Short-term** (If needed)
- [ ] Add other missing endpoints (nodes/:id, edges/:id, etc.)
- [ ] Add data endpoints (kpi-metrics, threat-events, etc.)
- [ ] Add voice chat endpoints (if using voice features)

### 3. **Long-term** (Optional)
- [ ] Add comprehensive error handling
- [ ] Add request validation
- [ ] Add rate limiting
- [ ] Add caching for frequently accessed data
- [ ] Add monitoring and logging

---

## 📚 ADDITIONAL RESOURCES

**Vercel Serverless Functions Documentation**:
- https://vercel.com/docs/functions/serverless-functions

**Neo4j Driver Documentation**:
- https://neo4j.com/docs/javascript-manual/current/

**PostgreSQL Node.js Documentation**:
- https://node-postgres.com/

---

## ✅ SUCCESS CRITERIA

Your deployment is successful when:

1. ✅ `GET /api/network-topology/edges` returns JSON (not HTML)
2. ✅ `POST /api/dashboards/generate` returns 200 (not 405)
3. ✅ Network Topology page loads without errors
4. ✅ AI Dashboards page can generate dashboards
5. ✅ No "Failed to fetch" errors in console
6. ✅ No "Unexpected token '<'" errors in console
7. ✅ All API calls return proper JSON responses

---

**Created**: 2025-10-28
**Status**: Ready to Deploy ✅
**Files Created**: 2
- `api/network-topology/edges.js`
- `api/dashboards/generate.js`

