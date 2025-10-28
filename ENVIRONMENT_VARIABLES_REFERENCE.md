# Environment Variables Quick Reference

## Copy-Paste Template for Vercel

Use this template when setting up environment variables in Vercel's dashboard:

```env
# PostgreSQL Database (Neon)
POSTGRES_URL=postgresql://username:password@host.region.neon.tech/database?sslmode=require

# Neo4j Aura Database
NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password_here
NEO4J_DATABASE=neo4j

# Google Gemini AI
GOOGLE_API_KEY=your_gemini_api_key_here

# OpenAI API
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Optional: Cloudinary (if using image features)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key

# Optional: Recraft AI (if using image generation)
VITE_RECRAFT_API_URL=https://external.api.recraft.ai/v1
VITE_RECRAFT_API_KEY=your_recraft_key
```

## Where to Get Each Variable

### POSTGRES_URL
📍 **Source:** [Neon Console](https://console.neon.tech)
1. Log in to Neon
2. Select your project
3. Navigate to "Connection Details"
4. Copy the connection string
5. Ensure it ends with `?sslmode=require`

### NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD
📍 **Source:** [Neo4j Aura Console](https://console.neo4j.io)
1. Log in to Neo4j Aura
2. Select your database instance
3. Click "Connect" tab
4. Copy the URI (starts with `neo4j+s://`)
5. Use credentials from initial setup

### GOOGLE_API_KEY
📍 **Source:** [Google AI Studio](https://aistudio.google.com/app/apikey)
1. Log in with Google account
2. Click "Create API Key"
3. Copy the generated key

### OPENAI_API_KEY
📍 **Source:** [OpenAI Platform](https://platform.openai.com/api-keys)
1. Log in to OpenAI
2. Navigate to API Keys
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

## Verification Checklist

After adding variables to Vercel:

- [ ] All 7 required variables are added
- [ ] No typos in variable names
- [ ] Values are correct (test locally first)
- [ ] Variables are set for "All" environments
- [ ] No trailing spaces in values
- [ ] Connection strings are complete

## Testing Environment Variables

Test locally before deploying:

1. Create `.env` file in project root
2. Copy variables from template above
3. Fill in actual values
4. Run: `pnpm run server` (test backend)
5. Run: `pnpm run dev` (test frontend)
6. Verify connections work

## Common Mistakes to Avoid

❌ **Don't:**
- Commit `.env` file to Git
- Use localhost URLs in production
- Forget the `?sslmode=require` in Postgres URL
- Use `neo4j://` instead of `neo4j+s://` (must be secure)
- Mix up variable names (case-sensitive)

✅ **Do:**
- Use secure connections (SSL/TLS)
- Test variables locally first
- Keep API keys secure
- Rotate keys periodically
- Set variables for all environments

## Security Reminders

🔒 **Important:**
1. Never share API keys publicly
2. Don't commit credentials to Git
3. Use environment variables only
4. Rotate keys if exposed
5. Monitor API usage for anomalies

## Support

If variables aren't working:
1. Check spelling (case-sensitive)
2. Verify values are correct
3. Check Vercel function logs
4. Test connections independently
5. Review error messages in browser console

---

**Last Updated:** 2025-10-28
**Required Variables:** 7 critical, 4 optional
**Deployment Platform:** Vercel
