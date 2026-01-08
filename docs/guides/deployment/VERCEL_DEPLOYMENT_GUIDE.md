# T-Mobile Dashboard - Vercel Deployment Guide

## 🚨 CRITICAL ISSUE IDENTIFIED

Your application has a **separate Express backend server** that is **NOT being deployed to Vercel**. Vercel is only deploying the static frontend, which is why all API calls are failing with `ERR_BLOCKED_BY_CLIENT` and `Failed to fetch` errors.

### The Problem

Your application architecture:
- **Frontend**: Vite/React app → Currently deployed to Vercel ✅
- **Backend**: Express server (`server/index.js`) → NOT deployed ❌

The frontend makes API calls to:
- `/api/network-topology/nodes`
- `/api/ai/dashboard-context`
- `/api/ai/suggested-queries`
- `/api/ai/query`
- `/api/data/*`
- `/api/dashboards/*`

These endpoints are defined in your Express server, which is not running on Vercel.

---

## 🎯 RECOMMENDED SOLUTION

**Deploy the backend separately to Render.com (free tier) and configure Vercel to point to it.**

---

## 📋 COMPLETE DEPLOYMENT STEPS

### STEP 1: Deploy Backend to Render.com

#### 1.1 Create Render Account
1. Go to https://render.com
2. Sign up with your GitHub account
3. Authorize Render to access your repository

#### 1.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `IanNoble-Visium/-T-MOBILE`
3. Configure the service:
   - **Name**: `tmobile-backend` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave blank (uses repo root)
   - **Runtime**: `Node`
   - **Build Command**: `pnpm install`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: `Free`

#### 1.3 Add Environment Variables on Render

Click "Advanced" → "Add Environment Variable" and add ALL of these:

```bash
# Node Environment
NODE_ENV=production

# Server Configuration
PORT=3001

# PostgreSQL Database (Neon)
POSTGRES_URL=your_postgresql_connection_string_here

# Neo4j Aura Database
NEO4J_URI=neo4j+s://a52f4a1a.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_neo4j_password_here
NEO4J_DATABASE=neo4j

# Google Gemini AI
GOOGLE_API_KEY=your_google_gemini_api_key_here

# OpenAI (for voice features)
OPENAI_API_KEY=your_openai_api_key_here
```

#### 1.4 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Copy your backend URL (e.g., `https://tmobile-backend.onrender.com`)

---

### STEP 2: Configure Vercel Frontend

#### 2.1 Add Environment Variables to Vercel

Go to your Vercel project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

```bash
# Backend API URL (use your Render backend URL)
VITE_API_BASE_URL=https://tmobile-backend.onrender.com/api
VITE_API_URL=https://tmobile-backend.onrender.com/api

# Cloudinary (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=dod8ajzjd
VITE_CLOUDINARY_API_KEY=841983555962286
VITE_CLOUDINARY_API_SECRET=W1gSyjhw17u1vT5UQObDrDMmrl0

# Recraft AI (for image generation)
VITE_RECRAFT_API_URL=https://external.api.recraft.ai/v1
VITE_RECRAFT_API_KEY=your_recraft_api_key_here
```

**IMPORTANT**: Replace `https://tmobile-backend.onrender.com` with your actual Render backend URL.

#### 2.2 Redeploy Vercel
1. Go to Deployments tab
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache" (optional)
5. Click "Redeploy"

---

## 🔑 ENVIRONMENT VARIABLES REFERENCE

### Backend Environment Variables (Render)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Node environment | `production` |
| `PORT` | Yes | Server port | `3001` |
| `POSTGRES_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `NEO4J_URI` | Yes | Neo4j Aura URI | `neo4j+s://a52f4a1a.databases.neo4j.io` |
| `NEO4J_USERNAME` | Yes | Neo4j username | `neo4j` |
| `NEO4J_PASSWORD` | Yes | Neo4j password | Your password |
| `NEO4J_DATABASE` | Yes | Neo4j database name | `neo4j` |
| `GOOGLE_API_KEY` | Yes | Google Gemini API key | `AIza...` |
| `OPENAI_API_KEY` | Yes | OpenAI API key (for voice) | `sk-...` |

### Frontend Environment Variables (Vercel)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_BASE_URL` | Yes | Backend API base URL | `https://your-backend.onrender.com/api` |
| `VITE_API_URL` | Yes | Backend API URL (same as above) | `https://your-backend.onrender.com/api` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary cloud name | `dod8ajzjd` |
| `VITE_CLOUDINARY_API_KEY` | Optional | Cloudinary API key | `841983555962286` |
| `VITE_CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret | Your secret |
| `VITE_RECRAFT_API_URL` | Optional | Recraft API URL | `https://external.api.recraft.ai/v1` |
| `VITE_RECRAFT_API_KEY` | Optional | Recraft API key | Your key |

---

## 🔍 WHERE TO GET API KEYS

### PostgreSQL (Neon)
1. Go to https://neon.tech
2. Sign in to your account
3. Select your project
4. Go to "Connection Details"
5. Copy the connection string

### Neo4j Aura
1. Go to https://console.neo4j.io
2. Sign in to your account
3. Select your instance: `TMOBILE` (a52f4a1a)
4. Go to "Connect" tab
5. Copy URI, username, and password
   - **URI**: `neo4j+s://a52f4a1a.databases.neo4j.io`
   - **Username**: `neo4j`
   - **Password**: Your password (if forgotten, reset it)

### Google Gemini API
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (starts with `AIza`)

### OpenAI API
1. Go to https://platform.openai.com/api-keys
2. Sign in to your account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-`)

### Cloudinary (Optional - for image generation)
1. Go to https://cloudinary.com
2. Sign in to your account
3. Go to Dashboard
4. Copy Cloud Name, API Key, and API Secret

### Recraft AI (Optional - for image generation)
1. Go to https://www.recraft.ai
2. Sign up for an account
3. Go to API settings
4. Generate an API key

---

## ✅ VERIFICATION STEPS

### 1. Verify Backend Deployment
```bash
# Test health endpoint
curl https://your-backend.onrender.com/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-10-28T...",
  "service": "T-Mobile TruContext Demo API"
}
```

### 2. Verify Backend API Endpoints
```bash
# Test network topology endpoint
curl https://your-backend.onrender.com/api/network-topology/nodes

# Test AI endpoint
curl https://your-backend.onrender.com/api/ai/suggested-queries
```

### 3. Verify Frontend Connection
1. Open your Vercel deployment URL
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for API calls - they should now succeed
5. Check Network tab - API calls should return 200 status

---

## 🐛 TROUBLESHOOTING

### Backend Issues

**Problem**: Backend fails to start on Render
- **Check**: Render logs for error messages
- **Solution**: Verify all environment variables are set correctly

**Problem**: Database connection errors
- **Check**: PostgreSQL and Neo4j credentials
- **Solution**: Test credentials locally first

**Problem**: "Module not found" errors
- **Check**: Build command is `pnpm install`
- **Solution**: Ensure all dependencies are in `package.json`

### Frontend Issues

**Problem**: API calls still failing
- **Check**: `VITE_API_BASE_URL` is set correctly in Vercel
- **Solution**: Redeploy Vercel after adding environment variables

**Problem**: CORS errors
- **Check**: Backend has CORS enabled (already configured in `server/index.js`)
- **Solution**: Verify backend is running and accessible

**Problem**: Environment variables not working
- **Check**: Variables are prefixed with `VITE_`
- **Solution**: Redeploy Vercel after adding variables

---

## 📊 DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                         │
│  - Vite/React Static Site                                   │
│  - Environment Variables:                                    │
│    • VITE_API_BASE_URL → Points to Render backend          │
│    • VITE_CLOUDINARY_* → Image upload                      │
│    • VITE_RECRAFT_* → Image generation                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   RENDER (Backend API)                       │
│  - Express Server (Node.js)                                 │
│  - API Routes: /api/*                                       │
│  - Environment Variables:                                    │
│    • POSTGRES_URL → Neon PostgreSQL                        │
│    • NEO4J_* → Neo4j Aura                                  │
│    • GOOGLE_API_KEY → Gemini AI                            │
│    • OPENAI_API_KEY → Voice features                       │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │   Neon   │  │  Neo4j   │  │  Google  │
         │PostgreSQL│  │   Aura   │  │  Gemini  │
         └──────────┘  └──────────┘  └──────────┘
```

---

## 🎉 SUCCESS CHECKLIST

- [ ] Backend deployed to Render
- [ ] All backend environment variables configured
- [ ] Backend health check returns 200 OK
- [ ] Backend API endpoints accessible
- [ ] Frontend environment variables configured in Vercel
- [ ] Frontend redeployed with new variables
- [ ] Frontend can connect to backend
- [ ] No CORS errors in browser console
- [ ] Network topology loads successfully
- [ ] AI features work correctly
- [ ] No `ERR_BLOCKED_BY_CLIENT` errors

---

## 📞 NEED HELP?

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Deployments → Click deployment → View Function Logs
3. Check browser console for errors
4. Verify all environment variables are set correctly
5. Test backend endpoints directly with curl/Postman

---

## 🔐 SECURITY NOTES

1. **Never commit `.env` files** to Git
2. **Rotate credentials** if they were exposed in Git history
3. **Use environment variables** for all sensitive data
4. **Enable secret scanning** in GitHub repository settings
5. **Regularly rotate API keys** (every 90 days recommended)

---

## 📝 NEXT STEPS AFTER DEPLOYMENT

1. Test all features thoroughly
2. Monitor backend performance on Render
3. Set up monitoring/alerts for backend downtime
4. Consider upgrading to paid tier if free tier has limitations
5. Implement proper error handling for API failures
6. Add loading states for better UX during API calls

