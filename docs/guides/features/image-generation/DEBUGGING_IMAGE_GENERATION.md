# Debugging Image Generation Issues

## Current Issue

When clicking "Generate Node Images", the system says "0 images generated" even though the Recraft API is being called.

## Root Cause Analysis

The issue is likely one of these:

1. **Recraft API is returning 429 errors** - Rate limiting is still happening
2. **Recraft API response format is wrong** - We're not extracting the URL correctly
3. **Cloudinary upload is failing** - Images are generated but not uploaded
4. **Cache is not being updated** - Images are generated but not cached

## How to Debug

### Step 1: Check Recraft API Response

1. Open DevTools Console (F12)
2. Click "Generate Node Images"
3. Click "Generate Images"
4. Look for logs like:
   ```
   Recraft API response: {...}
   Recraft API response keys: [...]
   Recraft API data array: [...]
   Recraft API first item: {...}
   Recraft API first item keys: [...]
   ```

**What to look for**:
- Is `data` array present?
- Does `data[0]` have a `url` property?
- What are the actual keys in the response?

### Step 2: Check Cloudinary Upload

Look for logs like:
```
Uploading image to Cloudinary: tmobile/network-nodes/node-050_secondary_firewall from https://...
Cloudinary upload response status: 200
Cloudinary response: {...}
Cloudinary secure_url: https://res.cloudinary.com/...
```

**What to look for**:
- Is upload response status 200?
- Does response have `secure_url`?
- Is the URL valid?

### Step 3: Check Rate Limiting

Look for logs like:
```
Recraft API response status: 429
Recraft API error: {code: 'rate_limit_exceeded', message: ''}
```

**If you see 429 errors**:
- Increase delay in `src/lib/nodeImageManager.js` line 189
- Change from `3000` to `4000` or `5000`

### Step 4: Check Cache

Look for logs like:
```
Successfully uploaded and cached image for Secondary Firewall: https://res.cloudinary.com/...
```

**If you don't see this**:
- Check if Cloudinary upload is failing
- Check if response format is wrong

## Expected Console Output

### Successful Generation (One Image)

```
Generating image 1 for node node-050 (delay: 0ms)
Generating image for node: Secondary Firewall (type: firewall)
Generating network device SVG for Secondary Firewall (type: firewall)
Calling Recraft API with prompt: Create high-resolution SVG icon of a security firewall...
API URL: https://external.api.recraft.ai/v1/images/generations
API Key (first 20 chars): Hfcdja1KnZajZP9hSgzm...
Recraft API response status: 200 OK
Recraft API response: {data: [{url: "https://..."}]}
Recraft API response keys: ["data"]
Recraft API data array: [{url: "https://..."}]
Recraft API first item: {url: "https://..."}
Recraft API first item keys: ["url"]
Successfully generated SVG for Secondary Firewall: https://...
Generated image URL for Secondary Firewall: https://...
Uploading to Cloudinary with publicId: tmobile/network-nodes/node-050_secondary_firewall
Uploading image to Cloudinary: tmobile/network-nodes/node-050_secondary_firewall from https://...
Cloudinary upload response status: 200
Cloudinary response: {secure_url: "https://res.cloudinary.com/...", ...}
Cloudinary secure_url: https://res.cloudinary.com/...
Successfully uploaded and cached image for Secondary Firewall: https://res.cloudinary.com/...
```

### Failed Generation (Rate Limit)

```
Generating image 1 for node node-050 (delay: 0ms)
Generating image for node: Secondary Firewall (type: firewall)
Generating network device SVG for Secondary Firewall (type: firewall)
Calling Recraft API with prompt: Create high-resolution SVG icon of a security firewall...
API URL: https://external.api.recraft.ai/v1/images/generations
API Key (first 20 chars): Hfcdja1KnZajZP9hSgzm...
Recraft API response status: 429
Recraft API error: {code: 'rate_limit_exceeded', message: ''}
Failed to generate SVG for Secondary Firewall. Result: null
Failed to generate image for node Secondary Firewall
```

## Common Issues and Solutions

### Issue 1: 429 Rate Limit Errors

**Symptoms**:
- Recraft API response status: 429
- Recraft API error: {code: 'rate_limit_exceeded'}

**Solution**:
1. Edit `src/lib/nodeImageManager.js`
2. Find line 189: `const delayMs = generatedCount * 3000;`
3. Change to: `const delayMs = generatedCount * 5000;` (5 seconds)
4. Save and refresh

### Issue 2: Recraft API Response Format Wrong

**Symptoms**:
- Recraft API response keys don't include "data"
- Recraft API first item keys don't include "url"

**Solution**:
1. Check Recraft API documentation for correct response format
2. Update `generateNetworkDeviceSVG()` in `src/lib/recraftApi.js` line 97
3. Change from: `if (result && result.data && result.data[0])`
4. To: `if (result && result.data && result.data[0] && result.data[0].url)`

### Issue 3: Cloudinary Upload Failing

**Symptoms**:
- Cloudinary upload response status: 401 or 403
- Cloudinary response: {error: {message: "..."}}

**Solution**:
1. Check Cloudinary credentials in `.env`
2. Verify `VITE_CLOUDINARY_CLOUD_NAME` is correct
3. Verify `VITE_CLOUDINARY_API_KEY` is correct
4. Verify `VITE_CLOUDINARY_API_SECRET` is correct
5. Check if upload preset exists in Cloudinary dashboard

### Issue 4: Images Generated But Not Cached

**Symptoms**:
- Recraft API returns 200 OK
- Cloudinary upload returns 200 OK
- But "0 images generated" message

**Solution**:
1. Check if cache is being saved
2. Look for: "Successfully uploaded and cached image for..."
3. If not present, check `saveCacheToStorage()` function
4. Verify localStorage is not disabled

## Testing Steps

### Test 1: Single Image Generation

1. Open Network Topology dashboard
2. Open DevTools Console
3. Click "Generate Node Images"
4. Click "Generate Images"
5. Wait for first image to complete
6. Check console for success logs

### Test 2: Multiple Image Generation

1. Complete Test 1
2. Wait 5 seconds
3. Click "Generate Images" again
4. Verify second image generates with 3-second delay

### Test 3: Cache Verification

1. Complete Test 1 and 2
2. Refresh page
3. Check console for "Loaded X node images from cache/Cloudinary"
4. Verify images appear immediately

## Advanced Debugging

### Enable Verbose Logging

Add this to `src/lib/nodeImageManager.js` at the top:

```javascript
const DEBUG = true;

function debugLog(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}
```

Then use `debugLog()` instead of `console.log()` for detailed output.

### Check Network Requests

1. Open DevTools Network tab
2. Filter by "XHR" or "Fetch"
3. Look for requests to:
   - `https://external.api.recraft.ai/v1/images/generations`
   - `https://api.cloudinary.com/v1_1/<cloud_name>/image/upload`
4. Check response status and body

### Check Cloudinary Dashboard

1. Go to https://cloudinary.com/console
2. Navigate to Media Library
3. Look for folder: `tmobile/network-nodes`
4. Check if images are being uploaded
5. Verify image URLs are accessible

## Performance Expectations

- **First image**: 10-20 seconds (Recraft generation + Cloudinary upload)
- **Second image**: 13-23 seconds (3-second delay + generation + upload)
- **Third image**: 16-26 seconds (6-second delay + generation + upload)
- **Cached load**: < 1 second

## Next Steps

1. Run the tests above
2. Check console output
3. Compare with "Expected Console Output" section
4. Identify which step is failing
5. Apply the corresponding solution
6. Test again

## Support

If you're still having issues:

1. Share the full console output
2. Check Cloudinary dashboard for uploaded images
3. Verify API keys are correct
4. Check Recraft API account status
5. Try increasing delays to 5-10 seconds

