# 🚀 Quick Start - Deploy T-Mobile Dashboard to Production

## ⏱️ Estimated Time: 30 minutes

---

## 📋 PREREQUISITES CHECKLIST

Before you start, make sure you have:

- [ ] GitHub account with access to the repository
- [ ] Vercel account (already have - frontend is deployed)
- [ ] Access to the following credentials:
  - [ ] PostgreSQL (Neon) connection string
  - [ ] Neo4j Aura password
  - [ ] Google Gemini API key
  - [ ] OpenAI API key

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### STEP 1: Deploy Backend to Render (15 minutes)

#### 1.1 Create Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Authorize Render to access your repositories

#### 1.2 Create Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect account" if needed
4. Find and select repository: `IanNoble-Visium/-T-MOBILE`
5. Click "Connect"

#### 1.3 Configure Service
Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `tmobile-backend` (or your choice) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | (leave blank) |
| **Runtime** | `Node` |
| **Build Command** | `pnpm install` |
| **Start Command** | `node server/index.js` |
| **Instance Type** | `Free` |

#### 1.4 Add Environment Variables

Click "Advanced" → Scroll to "Environment Variables" → Click "Add Environment Variable"

Add these **9 variables** (one at a time):

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

**Replace the placeholder values** with your actual credentials.

#### 1.5 Deploy
1. Click "Create Web Service" (bottom of page)
2. Wait for deployment (5-10 minutes)
3. Watch the logs for success messages:
   - ✅ `Neo4j connection established successfully`
   - ✅ `Connected to PostgreSQL database`
   - ✅ `T-Mobile TruContext Demo API Server`

#### 1.6 Copy Backend URL
1. Once deployed, you'll see your service URL at the top
2. **Copy this URL** - you'll need it for Step 2
3. Example: `https://tmobile-backend.onrender.com`

---

### STEP 2: Configure Vercel Frontend (10 minutes)

#### 2.1 Open Vercel Project Settings
1. Go to https://vercel.com
2. Click on your project (T-Mobile dashboard)
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar

#### 2.2 Add Environment Variables

For **EACH** variable below:
1. Click "Add New"
2. Enter the **Key** (variable name)
3. Enter the **Value**
4. Select **ALL** environments: Production, Preview, Development
5. Click "Save"

**Required Variables (2):**

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api` |
| `VITE_API_URL` | `https://your-backend.onrender.com/api` |

**Replace** `your-backend.onrender.com` with your actual Render URL from Step 1.6.

**Optional Variables (5) - for image generation:**

| Key | Value |
|-----|-------|
| `VITE_CLOUDINARY_CLOUD_NAME` | `dod8ajzjd` |
| `VITE_CLOUDINARY_API_KEY` | `841983555962286` |
| `VITE_CLOUDINARY_API_SECRET` | Your Cloudinary secret |
| `VITE_RECRAFT_API_URL` | `https://external.api.recraft.ai/v1` |
| `VITE_RECRAFT_API_KEY` | Your Recraft API key |

#### 2.3 Redeploy Vercel
1. Go to "Deployments" tab
2. Click "..." menu on the latest deployment
3. Click "Redeploy"
4. Click "Redeploy" again to confirm
5. Wait for deployment to complete (2-3 minutes)

---

### STEP 3: Verify Deployment (5 minutes)

#### 3.1 Test Backend
Open a new browser tab and visit:
```
https://your-backend.onrender.com/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-28T...",
  "service": "T-Mobile TruContext Demo API"
}
```

If you see this, your backend is working! ✅

#### 3.2 Test Frontend
1. Open your Vercel deployment URL
2. Open browser DevTools (F12)
3. Go to "Console" tab
4. Look for any errors
5. Go to "Network" tab
6. Navigate to "Network Topology" page
7. Check API calls - should see 200 status codes

#### 3.3 Test Features
- [ ] Network Topology loads and displays nodes
- [ ] Executive Dashboard shows KPIs
- [ ] AI Analytics works
- [ ] No errors in console
- [ ] No `ERR_BLOCKED_BY_CLIENT` errors

---

## 🎉 SUCCESS!

If all tests pass, your deployment is complete!

Your application is now running:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com

---

## 🐛 TROUBLESHOOTING

### Problem: Backend deployment fails

**Check Render logs:**
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for error messages

**Common issues:**
- Missing environment variables → Add them in Step 1.4
- Wrong build command → Should be `pnpm install`
- Wrong start command → Should be `node server/index.js`

**Fix:**
1. Go to "Settings" tab
2. Update the incorrect setting
3. Click "Save Changes"
4. Redeploy from "Manual Deploy" → "Deploy latest commit"

---

### Problem: Frontend can't connect to backend

**Check browser console:**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for API errors

**Common issues:**
- `VITE_API_BASE_URL` not set → Add in Vercel settings
- Wrong backend URL → Update in Vercel settings
- CORS errors → Backend should have CORS enabled (already configured)

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Verify `VITE_API_BASE_URL` is correct
3. Should be: `https://your-backend.onrender.com/api`
4. Redeploy Vercel

---

### Problem: Database connection errors

**Check Render logs for:**
- `❌ Neo4j configuration missing` → Check Neo4j env vars
- `Database connection error` → Check PostgreSQL URL
- `Failed to connect to Neo4j` → Check Neo4j password

**Fix:**
1. Verify credentials are correct
2. Test credentials locally first
3. Update environment variables in Render
4. Redeploy

---

### Problem: Render service is slow or times out

**This is normal for free tier:**
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds (cold start)
- Subsequent requests are fast

**Solutions:**
- Wait 30 seconds and try again
- Upgrade to Render Starter ($7/month) for always-on service
- Use a service like UptimeRobot to ping your backend every 10 minutes

---

## 📊 MONITORING YOUR DEPLOYMENT

### Render Dashboard
- **Logs**: Real-time server logs
- **Metrics**: CPU, Memory, Request count
- **Events**: Deployment history

### Vercel Dashboard
- **Analytics**: Page views, performance
- **Logs**: Function logs, build logs
- **Deployments**: Deployment history

### Database Monitoring
- **Neon**: Query performance, storage usage
- **Neo4j Aura**: Node count, query performance

---

## 🔄 MAKING UPDATES

### To update your code:

1. **Make changes locally**
2. **Test locally**:
   ```bash
   # Terminal 1 - Backend
   pnpm run server:dev
   
   # Terminal 2 - Frontend
   pnpm run dev
   ```
3. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
4. **Automatic deployment**:
   - Render will automatically redeploy backend
   - Vercel will automatically redeploy frontend
5. **Verify changes** in production

---

## 🔐 SECURITY REMINDERS

- [ ] Never commit `.env` files to Git
- [ ] Rotate Neo4j password if it was exposed
- [ ] Enable 2FA on all service accounts
- [ ] Monitor API usage for unusual activity
- [ ] Set up billing alerts
- [ ] Regularly review access logs

---

## 📞 NEED HELP?

### Documentation
- **Full Guide**: See `VERCEL_DEPLOYMENT_GUIDE.md`
- **Environment Variables**: See `ENVIRONMENT_VARIABLES_REFERENCE.md`
- **Architecture**: See `DEPLOYMENT_ARCHITECTURE.md`

### Support Links
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **Neon**: https://neon.tech/docs
- **Neo4j**: https://neo4j.com/docs/aura/

### Common Commands

**Check backend health:**
```bash
curl https://your-backend.onrender.com/health
```

**Check backend API:**
```bash
curl https://your-backend.onrender.com/api/network-topology/nodes
```

**View Render logs:**
```bash
# In Render dashboard → Your Service → Logs
```

**Redeploy Render:**
```bash
# In Render dashboard → Your Service → Manual Deploy → Deploy latest commit
```

**Redeploy Vercel:**
```bash
# In Vercel dashboard → Deployments → ... → Redeploy
```

---

## ✅ FINAL CHECKLIST

- [ ] Backend deployed to Render
- [ ] Backend health check returns 200 OK
- [ ] All backend environment variables configured
- [ ] Frontend environment variables configured in Vercel
- [ ] Frontend redeployed with new variables
- [ ] Network Topology loads successfully
- [ ] AI features work
- [ ] No console errors
- [ ] No API errors
- [ ] Databases connected successfully

---

## 🎊 CONGRATULATIONS!

Your T-Mobile Dashboard is now live in production!

**Frontend**: https://your-app.vercel.app
**Backend**: https://your-backend.onrender.com

Share the frontend URL with your team and stakeholders.

---

## 📈 NEXT STEPS (Optional)

1. **Set up custom domain** in Vercel
2. **Enable analytics** in Vercel
3. **Set up monitoring** with UptimeRobot
4. **Configure alerts** for downtime
5. **Upgrade to paid tiers** if needed for better performance
6. **Add authentication** for production use
7. **Set up CI/CD** for automated testing
8. **Configure backup** for databases

---

## 💡 PRO TIPS

1. **Bookmark your backend URL** for quick access
2. **Save your environment variables** in a password manager
3. **Monitor Render logs** during first few days
4. **Test all features** after deployment
5. **Keep local .env** in sync with production
6. **Document any custom configurations**
7. **Set up staging environment** for testing

---

**Last Updated**: 2025-10-28
**Version**: 1.0
**Status**: Production Ready ✅

