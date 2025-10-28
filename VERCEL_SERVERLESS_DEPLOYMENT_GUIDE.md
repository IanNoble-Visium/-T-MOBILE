# Vercel Serverless Deployment Guide

## Overview

This guide explains how to deploy the T-Mobile TruContext Dashboard application to Vercel using a serverless architecture. The application has been refactored from a traditional Express.js server to serverless functions compatible with Vercel's platform.

## Architecture Changes

### Before (Express Server)
- Single `server/index.js` file running continuously
- Express router-based API endpoints
- Database connections initialized at server startup
- Hardcoded `localhost:3001` URLs in frontend

### After (Serverless)
- Individual serverless functions in `api/` directory
- Each endpoint is a separate file (e.g., `api/ai/query.js`)
- Database connections created per-request with connection pooling
- Environment-aware API URLs using `VITE_API_URL`

## Required Environment Variables

Configure these in your Vercel project settings at: **Project Settings → Environment Variables**

### 1. PostgreSQL Database (Neon)
```env
POSTGRES_URL=postgresql://username:password@host.region.neon.tech/database?sslmode=require
```

**Where to get it:**
- Go to [Neon Console](https://console.neon.tech)
- Select your project
- Go to "Connection Details"
- Copy the connection string

### 2. Neo4j Aura Database
```env
NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password_here
NEO4J_DATABASE=neo4j
```

**Where to get it:**
- Go to [Neo4j Aura Console](https://console.neo4j.io)
- Select your instance
- Click "Connect" tab
- Copy the connection URI and credentials

### 3. Google Gemini AI API
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

**Where to get it:**
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key
- Copy the key

### 4. OpenAI API (for Voice Features)
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

**Where to get it:**
- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Create a new API key
- Copy the key

### 5. Frontend Build Variables (Optional)
These are set during build time and don't need to be configured in Vercel:

```env
VITE_API_URL=/api
```

The frontend automatically uses relative paths (`/api`) when deployed to Vercel.

### 6. Optional Services
If you're using image generation features:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_RECRAFT_API_URL=https://external.api.recraft.ai/v1
VITE_RECRAFT_API_KEY=your_recraft_key
```

## Step-by-Step Deployment Instructions

### 1. Prepare Your Repository

Ensure all changes are committed:
```bash
git add .
git commit -m "Refactor to serverless architecture for Vercel"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Select the repository: `@T-MOBILE`

### 3. Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset:** Vite
- **Build Command:** `pnpm run build && cp -r videos dist/`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

### 4. Configure Environment Variables

In the Vercel project settings:

1. Go to **Settings → Environment Variables**
2. Add each required variable (see list above)
3. For each variable:
   - Enter the **Key** (e.g., `POSTGRES_URL`)
   - Enter the **Value** (your actual credential)
   - Select **All** environments (Production, Preview, Development)
   - Click **Save**

**Important:** Make sure to add ALL of the following:
- ✅ `POSTGRES_URL`
- ✅ `NEO4J_URI`
- ✅ `NEO4J_USERNAME`
- ✅ `NEO4J_PASSWORD`
- ✅ `NEO4J_DATABASE`
- ✅ `GOOGLE_API_KEY`
- ✅ `OPENAI_API_KEY`

### 5. Deploy

Click **"Deploy"** button. Vercel will:
1. Install dependencies
2. Build the frontend
3. Deploy serverless functions
4. Deploy static assets

### 6. Verify Deployment

After deployment completes:

1. Open the deployed URL
2. Check that the dashboard loads
3. Test API endpoints by using the AI Analytics feature
4. Check browser console for any errors
5. Verify Network Topology loads data from Neo4j

## Troubleshooting

### Issue: "Failed to fetch" errors

**Cause:** API endpoints not responding

**Solutions:**
1. Check that all environment variables are set in Vercel
2. Go to **Deployments → Functions** to see function logs
3. Verify database connection strings are correct
4. Check that databases are accessible from Vercel's IP addresses

### Issue: Neo4j connection fails

**Cause:** Neo4j Aura connection string incorrect or firewall

**Solutions:**
1. Verify `NEO4J_URI` starts with `neo4j+s://` (secure connection)
2. Check username and password are correct
3. In Neo4j Aura console, ensure "Allow from anywhere" is enabled

### Issue: PostgreSQL connection fails

**Cause:** Neon connection string incorrect or SSL issues

**Solutions:**
1. Ensure connection string ends with `?sslmode=require`
2. Verify the connection string is copied correctly from Neon
3. Check that your Neon project is active (not suspended)

### Issue: OpenAI API errors

**Cause:** Invalid API key or insufficient credits

**Solutions:**
1. Verify API key is valid at OpenAI platform
2. Check that you have sufficient credits/quota
3. Ensure the key has proper permissions

## Function Configuration

The serverless functions are configured in `vercel.json`:

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

- **Memory:** 1024 MB (sufficient for database operations)
- **Max Duration:** 30 seconds (allows time for AI processing)

## API Endpoints

After deployment, these endpoints will be available:

### AI Analytics
- `POST /api/ai/query` - Natural language query
- `GET /api/ai/dashboard-context` - Get dashboard data
- `GET /api/ai/suggested-queries` - Get query suggestions

### Network Topology
- `GET /api/network-topology/nodes` - Get all nodes
- `POST /api/network-topology/nodes` - Create node

## Database Connection Pooling

The serverless functions use optimized connection pooling:

**PostgreSQL:**
- Max 1 connection per function instance
- 30-second idle timeout
- 10-second connection timeout

**Neo4j:**
- Singleton driver pattern
- Connection pooling managed by Neo4j driver
- Connections reused across function invocations

## Performance Considerations

1. **Cold Starts:** First request may be slower (~2-3 seconds)
2. **Warm Functions:** Subsequent requests are fast (~100-500ms)
3. **Database Connections:** Pooled and reused efficiently
4. **API Rate Limits:** Be aware of Gemini and OpenAI rate limits

## Cost Estimation

**Vercel Pro Plan:** (~$20/month)
- 100GB bandwidth
- Unlimited serverless function executions
- 1000 GB-hours compute time

**Additional Costs:**
- Neon PostgreSQL: Free tier available, paid plans start at $19/month
- Neo4j Aura: Free tier available, paid plans start at $65/month
- Google Gemini API: Pay per request (very affordable)
- OpenAI API: Pay per token (voice features)

## Security Best Practices

1. ✅ Never commit API keys to Git
2. ✅ Use environment variables for all secrets
3. ✅ Enable SSL for all database connections
4. ✅ Restrict database access to known IP ranges when possible
5. ✅ Rotate API keys periodically
6. ✅ Monitor API usage and set up alerts

## Monitoring & Logs

View function logs in Vercel:
1. Go to **Deployments**
2. Click on your deployment
3. Click **Functions** tab
4. Select a function to view logs

## Support

If you encounter issues:
1. Check Vercel function logs
2. Review this guide's troubleshooting section
3. Verify all environment variables are set
4. Test database connections independently
5. Check API service status pages

## Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure CDN caching rules
3. Set up monitoring and alerts
4. Enable preview deployments for testing
5. Configure production environment protection

---

**Deployment Date:** 2025-10-28
**Architecture:** Serverless (Vercel)
**Framework:** Vite + React
**Databases:** PostgreSQL (Neon), Neo4j Aura
**AI Services:** Google Gemini, OpenAI GPT-4o
