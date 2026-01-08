# Image Regeneration Guide

## Problem

Node images are returning 404 errors because they don't exist in Cloudinary. The images were never successfully uploaded.

## Root Cause

The Cloudinary upload signature was malformed. The signature string was missing the `&` before the API secret:

```
❌ WRONG: folder=X&public_id=Y&timestamp=Z{SECRET}
✅ CORRECT: folder=X&public_id=Y&timestamp=Z&{SECRET}
```

## Solution: Regenerate Images

### Step 1: Clear the Cache

The cached URLs are pointing to non-existent Cloudinary images. You need to clear the cache first.

**Option A: Using the UI**
1. Open the Network Topology dashboard
2. Click "Generate Node Images" button
3. Click "Clear Cache" button
4. Confirm the action

**Option B: Using Browser Console**
```javascript
// Run this in the browser console
localStorage.removeItem('tmobile_node_images_cache');
location.reload();
```

### Step 2: Verify Configuration

Before regenerating, verify that Cloudinary is properly configured:

**In Browser Console:**
```javascript
// Check if Cloudinary is configured
import { getCloudinaryConfigStatus } from './src/lib/cloudinaryApi.js';
console.log(getCloudinaryConfigStatus());
```

**Expected Output:**
```javascript
{
  cloudName: "dod8...",
  apiKey: "841...",
  apiSecret: "W1g...",
  isConfigured: true
}
```

If `isConfigured` is `false`, check your `.env` file:
- `VITE_CLOUDINARY_CLOUD_NAME` - Should be set
- `VITE_CLOUDINARY_API_KEY` - Should be set
- `VITE_CLOUDINARY_API_SECRET` - Should be set

### Step 3: Regenerate Images

1. Open the Network Topology dashboard
2. Click "Generate Node Images" button
3. Verify both "Recraft" and "Cloudinary" show "Connected"
4. Click "Generate Images"
5. Wait for the progress bar to complete
6. Monitor the console for any errors

### Step 4: Verify Upload Success

**In Browser Console:**
```javascript
// Check cache statistics
import { getCacheStats } from './src/lib/nodeImageManager.js';
console.log(getCacheStats());
```

**Expected Output:**
```javascript
{
  size: 50,  // Should match number of nodes
  keys: ["node-001", "node-002", ...]
}
```

### Step 5: Verify Images in Cloudinary

1. Go to https://cloudinary.com/console/media_library
2. Navigate to folder: `tmobile/network-nodes`
3. You should see 50 images with names like:
   - `node-001_dallas_data_center`
   - `node-002_houston_cell_tower_1`
   - etc.

## Troubleshooting

### Issue 1: "Cloudinary not fully configured" error

**Symptoms:**
- Console shows: `❌ Cloudinary not fully configured`
- Images not uploading

**Solution:**
1. Check `.env` file has all three variables set
2. Restart the development server
3. Clear browser cache
4. Try again

### Issue 2: Upload fails with 400/401 error

**Symptoms:**
- Console shows: `Cloudinary upload error: {error: "Invalid signature"}`

**Solution:**
1. Verify API credentials in `.env` are correct
2. Check that signature includes `&` before API secret
3. Restart development server
4. Try again

### Issue 3: Images still showing 404 after regeneration

**Symptoms:**
- Images generated but still return 404
- Console shows successful uploads

**Solution:**
1. Check Cloudinary Media Library to verify images exist
2. Try accessing URL directly in browser
3. Check if images have correct public IDs
4. Verify folder path is `tmobile/network-nodes`

### Issue 4: Rate limit errors from Recraft

**Symptoms:**
- Console shows: `Recraft API response status: 429`
- Generation stops after a few images

**Solution:**
1. Wait 5-10 minutes before trying again
2. Recraft has rate limits (~1 request per 2-3 seconds)
3. The batch generator already includes 3-second delays
4. If still failing, increase delay in `src/lib/nodeImageManager.js` line 193

## Code Changes Made

### File: `src/lib/cloudinaryApi.js`

**Change 1: Fixed signature string (line 54)**
```javascript
// BEFORE:
const signatureString = `folder=tmobile/network-nodes&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;

// AFTER:
const signatureString = `folder=tmobile/network-nodes&public_id=${publicId}&timestamp=${timestamp}&${CLOUDINARY_API_SECRET}`;
```

**Change 2: Better error logging (lines 31-38)**
```javascript
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary not fully configured');
  console.error(`  - Cloud Name: ${CLOUDINARY_CLOUD_NAME ? '✓' : '✗'}`);
  console.error(`  - API Key: ${CLOUDINARY_API_KEY ? '✓' : '✗'}`);
  console.error(`  - API Secret: ${CLOUDINARY_API_SECRET ? '✓' : '✗'}`);
  return null;
}
```

**Change 3: Added diagnostic function (lines 182-190)**
```javascript
export function getCloudinaryConfigStatus() {
  return {
    cloudName: CLOUDINARY_CLOUD_NAME ? `${CLOUDINARY_CLOUD_NAME.substring(0, 3)}...` : 'NOT SET',
    apiKey: CLOUDINARY_API_KEY ? `${CLOUDINARY_API_KEY.substring(0, 3)}...` : 'NOT SET',
    apiSecret: CLOUDINARY_API_SECRET ? `${CLOUDINARY_API_SECRET.substring(0, 3)}...` : 'NOT SET',
    isConfigured: isCloudinaryConfigured()
  };
}
```

**Change 4: Fixed configuration check (line 176)**
```javascript
// BEFORE:
export function isCloudinaryConfigured() {
  return !!CLOUDINARY_CLOUD_NAME;
}

// AFTER:
export function isCloudinaryConfigured() {
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}
```

## Expected Results

After following these steps:

✅ All 50 node images successfully uploaded to Cloudinary
✅ Images accessible at: `https://res.cloudinary.com/<cloud_name>/image/upload/f_auto/tmobile/network-nodes/node-XXX_name`
✅ Node icons display correctly in network topology
✅ No 404 errors in console
✅ Images cached in localStorage for fast loading

## Next Steps

1. Clear the cache
2. Regenerate all images
3. Verify in Cloudinary Media Library
4. Check that images display in topology
5. Monitor console for any errors

