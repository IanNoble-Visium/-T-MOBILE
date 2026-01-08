# Image Generation Workflow - Debug Guide

## Overview
This guide explains the fixes made to the image generation workflow and how to test them.

## Issues Fixed

### 1. **imageExistsInCloudinary Function (cloudinaryApi.js:91)**
**Problem**: HEAD requests were causing CORS issues and not properly detecting missing images.

**Solution**: 
- Changed to use Image object loading instead of fetch
- More reliable for detecting if images exist in Cloudinary
- Includes 5-second timeout to prevent hanging

**Code Location**: `src/lib/cloudinaryApi.js:91-126`

### 2. **getNodeImage Function (nodeImageManager.js:50)**
**Problem**: Only checked if images existed in Cloudinary, never triggered automatic generation.

**Solution**:
- Added `autoGenerate` parameter (default: false)
- When `autoGenerate=true` and image doesn't exist, calls `generateAndStoreNodeImage`
- Allows gradual image generation without overwhelming APIs

**Code Location**: `src/lib/nodeImageManager.js:50-87`

### 3. **uploadImageToCloudinary Function (cloudinaryApi.js:11)**
**Problem**: Upload process wasn't properly handling image URLs from Recraft.

**Solution**:
- Added better error logging
- Added timestamp for authenticated uploads
- Made upload preset optional
- Added resource_type parameter

**Code Location**: `src/lib/cloudinaryApi.js:11-63`

### 4. **loadImages Function (NetworkTopologyVisualizationEnhanced.jsx:35)**
**Problem**: Never triggered automatic image generation for missing images.

**Solution**:
- First tries to get existing images without auto-generation
- If image doesn't exist, triggers auto-generation (limited to 5 per load)
- Includes comprehensive logging for debugging

**Code Location**: `src/components/NetworkTopologyVisualizationEnhanced.jsx:35-71`

## Testing the Workflow

### Step 1: Check Environment Variables
Verify these are set in `.env`:
```
VITE_CLOUDINARY_CLOUD_NAME=dod8ajzjd
VITE_CLOUDINARY_API_KEY=841983555962286
VITE_CLOUDINARY_API_SECRET=W1gSyjhw17u1vT5UQObDrDMmrl0
VITE_RECRAFT_API_URL=https://external.api.recraft.ai/v1
VITE_RECRAFT_API_KEY=<your_key>
```

### Step 2: Open Browser Console
1. Navigate to Network Topology dashboard
2. Open DevTools (F12)
3. Go to Console tab
4. Look for these log messages:

**Expected Logs**:
```
Auto-generating image for node node-047 (1/5)
Generating image for node: East Coast Gateway (type: gateway)
Generating network device SVG for East Coast Gateway (type: gateway)
Calling Recraft API with prompt: Create high-resolution SVG icon...
Recraft API response: {...}
Generated image URL for East Coast Gateway: https://...
Uploading to Cloudinary with publicId: tmobile/network-nodes/node-047_east_coast_gateway
Uploading image to Cloudinary: tmobile/network-nodes/node-047_east_coast_gateway from https://...
Successfully uploaded image to Cloudinary: tmobile/network-nodes/node-047_east_coast_gateway
Successfully uploaded and cached image for East Coast Gateway: https://res.cloudinary.com/...
```

### Step 3: Monitor Network Tab
1. In DevTools, go to Network tab
2. Filter by "image" or "upload"
3. Look for:
   - Requests to `external.api.recraft.ai` (image generation)
   - Requests to `api.cloudinary.com` (image upload)
   - Requests to `res.cloudinary.com` (image loading)

### Step 4: Check Cloudinary Dashboard
1. Go to https://cloudinary.com/console
2. Navigate to Media Library
3. Look for folder: `tmobile/network-nodes`
4. Verify images are being uploaded with names like:
   - `node-047_east_coast_gateway`
   - `node-048_west_coast_gateway`
   - etc.

### Step 5: Verify Visual Changes
1. Watch the Network Topology visualization
2. Nodes should gradually display custom SVG images instead of colored circles
3. Images should be 24x24 pixels (or 28x28 when alarmed, 32x32 when selected)

## Troubleshooting

### Issue: No images are being generated
**Check**:
1. Console shows "Recraft API not configured" → Check VITE_RECRAFT_API_KEY
2. Console shows "Cloudinary not configured" → Check VITE_CLOUDINARY_CLOUD_NAME
3. No Recraft API calls in Network tab → Check API key validity

### Issue: Images are generated but not uploaded to Cloudinary
**Check**:
1. Look for "Cloudinary upload error" in console
2. Check Network tab for failed requests to api.cloudinary.com
3. Verify upload preset exists or API key is valid
4. Check Cloudinary dashboard for errors

### Issue: Images are uploaded but not displaying
**Check**:
1. Verify URLs in Cloudinary Media Library are accessible
2. Check if CORS is blocking image loads
3. Try accessing image URL directly in browser
4. Check browser console for image load errors

### Issue: Timeout errors
**Check**:
1. Network connectivity to Recraft API
2. Network connectivity to Cloudinary
3. API rate limits (may need to add delays between requests)

## Performance Considerations

### Rate Limiting
- Auto-generation is limited to 5 images per visualization load
- This prevents overwhelming the APIs
- Use "Generate Node Images" button for batch generation of all nodes

### Caching
- Generated images are cached in localStorage
- Cache persists across page reloads
- Clear cache with "Clear Cache" button in Node Image Generator dialog

### Optimization
- Images are optimized to 64x64 pixels for visualization
- Cloudinary transformations: `w_64,h_64,c_fill,f_auto,q_auto`
- Fallback to colored circles if images fail to load

## Manual Image Generation

For generating all node images at once:
1. Click "Generate Node Images" button in Network Topology dashboard
2. Verify configuration status (Recraft and Cloudinary should be Connected)
3. Click "Generate Images"
4. Monitor progress bar
5. Wait for completion message
6. Visualization will refresh with new images

## Next Steps

If issues persist:
1. Check all console logs for error messages
2. Verify API credentials are correct
3. Test API endpoints directly with curl or Postman
4. Check Cloudinary and Recraft dashboards for account status
5. Review rate limits and quotas

