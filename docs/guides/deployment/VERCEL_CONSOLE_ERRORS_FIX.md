# Fix Vercel Console Errors - Complete Guide

## 🚨 YOUR CURRENT ERRORS

```
❌ GET http://localhost:3001/api/network-topology/nodes net::ERR_BLOCKED_BY_CLIENT
❌ Error fetching nodes from Neo4j: TypeError: Failed to fetch
❌ Neo4j unavailable, falling back to localStorage: Failed to fetch
```

---

## 🔍 ROOT CAUSE ANALYSIS

### Why is this happening?

Your **Vercel-deployed frontend** is trying to call `http://localhost:3001` because:

1. ✅ Your code is **correctly configured** to use `VITE_API_BASE_URL`
2. ❌ But `VITE_API_BASE_URL` is **NOT set in Vercel** (or not set correctly)
3. ❌ So it falls back to the default: `http://localhost:3001/api`
4. ❌ The browser blocks this because:
   - You're on HTTPS (Vercel) trying to call HTTP (localhost)
   - Mixed content is blocked by browsers
   - localhost:3001 doesn't exist in production anyway

### What is `ERR_BLOCKED_BY_CLIENT`?

This error means:
- **Browser security** blocked the request (mixed content HTTP/HTTPS)
- OR **Ad blocker** blocked the request
- OR **CORS policy** blocked the request
- In your case: It's **mixed content** (HTTPS → HTTP) + **non-existent endpoint**

---

## ✅ THE FIX - Step by Step

### **STEP 1: Deploy Backend to Render** (if not done yet)

If you haven't deployed your backend yet, follow these steps:

#### 1.1 Create Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Authorize Render

#### 1.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect repository: `IanNoble-Visium/-T-MOBILE`
3. Configure:
   - **Name**: `tmobile-backend`
   - **Build Command**: `pnpm install`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: Free

#### 1.3 Add Environment Variables (9 required)

Click "Advanced" → "Environment Variables" → Add these:

```bash
NODE_ENV=production
PORT=3001
POSTGRES_URL=your_postgresql_connection_string
NEO4J_URI=neo4j+s://a52f4a1a.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_neo4j_password
NEO4J_DATABASE=neo4j
GOOGLE_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

#### 1.4 Deploy and Get URL
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. **Copy your backend URL** (e.g., `https://tmobile-backend.onrender.com`)
4. Test it: `https://your-backend.onrender.com/health` should return JSON

---

### **STEP 2: Configure Vercel Environment Variables** ⭐ **CRITICAL**

This is the step that will fix your console errors!

#### 2.1 Open Vercel Settings
1. Go to https://vercel.com
2. Click on your project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left sidebar

#### 2.2 Add Required Variables

For **EACH** variable below, click "Add New" and:
- Enter the **Key** (variable name)
- Enter the **Value**
- **IMPORTANT**: Check **ALL THREE** boxes:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Click "Save"

**Variable 1:**
```
Key:   VITE_API_BASE_URL
Value: https://your-backend.onrender.com/api
```
**Replace** `your-backend.onrender.com` with your actual Render URL!

**Variable 2:**
```
Key:   VITE_API_URL
Value: https://your-backend.onrender.com/api
```
**Same URL as above!**

#### 2.3 Optional Variables (for image generation)

If you want image generation features, also add:

```
VITE_CLOUDINARY_CLOUD_NAME=dod8ajzjd
VITE_CLOUDINARY_API_KEY=841983555962286
VITE_CLOUDINARY_API_SECRET=your_cloudinary_secret
VITE_RECRAFT_API_URL=https://external.api.recraft.ai/v1
VITE_RECRAFT_API_KEY=your_recraft_key
```

---

### **STEP 3: Redeploy Vercel** ⭐ **CRITICAL**

**Why?** Environment variables are **baked into the build** at build time. You MUST redeploy!

#### 3.1 Trigger Redeploy
1. Go to **"Deployments"** tab
2. Find the **latest deployment**
3. Click the **"..."** menu (three dots on the right)
4. Click **"Redeploy"**
5. **UNCHECK** "Use existing Build Cache" (force fresh build)
6. Click **"Redeploy"**

#### 3.2 Monitor Deployment
1. Click on the deployment in progress
2. Watch the build logs
3. Look for: `✓ Environment variables loaded`
4. Wait for deployment to complete (2-3 minutes)

---

### **STEP 4: Verify the Fix**

#### 4.1 Clear Browser Cache
1. Open a **new incognito/private window**
2. This ensures you're not seeing cached code

#### 4.2 Open Your Vercel Site
1. Go to your Vercel deployment URL
2. Open **DevTools** (F12)
3. Go to **Console** tab
4. Go to **Network** tab

#### 4.3 Navigate to Network Topology
1. Click on "Network Topology" in your app
2. Watch the Network tab

#### 4.4 Check API Calls
You should now see:
- ✅ `GET https://your-backend.onrender.com/api/network-topology/nodes`
- ✅ Status: `200 OK`
- ✅ No `ERR_BLOCKED_BY_CLIENT` errors
- ✅ No `localhost:3001` calls

#### 4.5 Check Console
You should now see:
- ✅ No "Failed to fetch" errors
- ✅ No "falling back to localStorage" messages
- ✅ Network topology loads successfully

---

## 🔍 HOW TO VERIFY ENVIRONMENT VARIABLES ARE SET

### Method 1: Check Vercel Dashboard
1. Vercel → Your Project → Settings → Environment Variables
2. You should see:
   - `VITE_API_BASE_URL` with your Render URL
   - `VITE_API_URL` with your Render URL
3. Each should have **3 checkmarks** (Production, Preview, Development)

### Method 2: Check Build Logs
1. Vercel → Deployments → Click latest deployment
2. Scroll through build logs
3. Look for environment variable injection

### Method 3: Check Runtime (Browser)
1. Open your Vercel site
2. Open DevTools Console
3. Type: `import.meta.env.VITE_API_BASE_URL`
4. **Note**: This won't work in production builds, but you can check the Network tab

### Method 4: Check Network Tab (Best Method)
1. Open DevTools → Network tab
2. Navigate to Network Topology
3. Look at the API call URLs
4. They should be calling your Render backend, NOT localhost

---

## 🎯 EXPECTED RESULTS

### Before Fix:
```
❌ GET http://localhost:3001/api/network-topology/nodes
❌ Status: ERR_BLOCKED_BY_CLIENT
❌ Console: "Failed to fetch"
❌ Console: "Neo4j unavailable, falling back to localStorage"
```

### After Fix:
```
✅ GET https://your-backend.onrender.com/api/network-topology/nodes
✅ Status: 200 OK
✅ Response: { success: true, data: [...nodes], count: 50 }
✅ Console: No errors
✅ Network Topology: Displays nodes and edges
```

---

## 🐛 TROUBLESHOOTING

### Issue 1: Still seeing localhost:3001 after redeploy

**Possible causes:**
- Environment variables not set correctly
- Didn't redeploy after setting variables
- Browser cache

**Fix:**
1. Double-check Vercel environment variables
2. Ensure ALL environments are checked (Production, Preview, Development)
3. Redeploy with "Use existing Build Cache" **UNCHECKED**
4. Test in incognito window
5. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

### Issue 2: Getting CORS errors

**Error:**
```
Access to fetch at 'https://your-backend.onrender.com/api/...' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Fix:**
Your backend already has CORS configured, but verify:
1. Check Render logs for CORS errors
2. Ensure backend is running
3. Test backend directly: `curl https://your-backend.onrender.com/health`

---

### Issue 3: Backend returns 404

**Error:**
```
GET https://your-backend.onrender.com/api/network-topology/nodes
Status: 404 Not Found
```

**Possible causes:**
- Backend not deployed
- Backend crashed
- Wrong URL

**Fix:**
1. Check Render dashboard - is service running?
2. Check Render logs for errors
3. Test health endpoint: `https://your-backend.onrender.com/health`
4. Verify environment variables in Render

---

### Issue 4: Backend is slow (cold start)

**Symptom:**
- First request takes 30+ seconds
- Subsequent requests are fast

**Explanation:**
- Render free tier spins down after 15 minutes of inactivity
- First request "wakes up" the service (cold start)
- This is **normal behavior** for free tier

**Solutions:**
- Wait 30 seconds for first request
- Upgrade to Render Starter ($7/month) for always-on service
- Use UptimeRobot to ping your backend every 10 minutes

---

### Issue 5: Environment variables not taking effect

**Symptom:**
- Set variables in Vercel
- Redeployed
- Still seeing localhost:3001

**Fix:**
1. Verify variable names are **EXACTLY**:
   - `VITE_API_BASE_URL` (case-sensitive!)
   - `VITE_API_URL` (case-sensitive!)
2. Verify values include `/api` at the end:
   - ✅ `https://your-backend.onrender.com/api`
   - ❌ `https://your-backend.onrender.com`
3. Verify ALL environments are checked
4. Redeploy with **fresh build** (no cache)
5. Wait for deployment to complete
6. Test in incognito window

---

## 📋 QUICK CHECKLIST

Use this checklist to ensure everything is configured correctly:

### Backend (Render)
- [ ] Backend deployed to Render
- [ ] All 9 environment variables set
- [ ] Service is running (green status)
- [ ] Health endpoint returns 200 OK: `https://your-backend.onrender.com/health`
- [ ] Backend URL copied (e.g., `https://tmobile-backend.onrender.com`)

### Frontend (Vercel)
- [ ] `VITE_API_BASE_URL` set to `https://your-backend.onrender.com/api`
- [ ] `VITE_API_URL` set to `https://your-backend.onrender.com/api`
- [ ] Both variables enabled for ALL environments (Production, Preview, Development)
- [ ] Vercel redeployed with fresh build (no cache)
- [ ] Deployment completed successfully

### Verification
- [ ] Tested in incognito window
- [ ] Network tab shows calls to Render backend (not localhost)
- [ ] API calls return 200 status
- [ ] No `ERR_BLOCKED_BY_CLIENT` errors
- [ ] No "Failed to fetch" errors
- [ ] No "falling back to localStorage" messages
- [ ] Network Topology displays nodes and edges
- [ ] Console is clean (no errors)

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful when:

1. ✅ Open your Vercel URL
2. ✅ Navigate to Network Topology
3. ✅ Network tab shows: `GET https://your-backend.onrender.com/api/network-topology/nodes`
4. ✅ Status: `200 OK`
5. ✅ Console: No errors
6. ✅ Network Topology: Displays nodes and edges
7. ✅ All dashboards load data successfully

---

## 📞 STILL HAVING ISSUES?

If you're still seeing errors after following all steps:

1. **Share these details:**
   - Your Vercel deployment URL
   - Your Render backend URL
   - Screenshot of Vercel environment variables
   - Screenshot of browser console errors
   - Screenshot of Network tab

2. **Check these logs:**
   - Vercel build logs
   - Render deployment logs
   - Browser console
   - Browser Network tab

3. **Common mistakes:**
   - Typo in environment variable name
   - Missing `/api` in URL
   - Forgot to redeploy after setting variables
   - Testing in cached browser window
   - Backend not running

---

## 🚀 NEXT STEPS AFTER FIX

Once your console errors are fixed:

1. **Test all features:**
   - Network Topology
   - Executive Dashboard
   - AI Analytics
   - Threat Intelligence
   - All other dashboards

2. **Monitor performance:**
   - Check Render logs for errors
   - Check Vercel analytics
   - Monitor API response times

3. **Optional enhancements:**
   - Add custom domain
   - Enable Vercel analytics
   - Set up monitoring (UptimeRobot)
   - Configure alerts

---

**Created**: 2025-10-28
**Status**: Ready to Use ✅
**Estimated Time**: 15-20 minutes

