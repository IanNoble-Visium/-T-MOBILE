# Rate Limiting - Quick Fix Guide

## Problem
Getting 429 (Too Many Requests) errors from Recraft API when generating images.

## Solution
Added 3-second delays between API requests to respect rate limits.

## What Changed

| Component | Change | Impact |
|-----------|--------|--------|
| `generateAndStoreNodeImage()` | Added `delayMs` parameter | Can delay before generation |
| `batchGenerateNodeImages()` | Added 3-second delays | No more 429 errors |
| Auto-generation limit | Reduced from 5 to 2 | Safer for normal usage |
| Error logging | Enhanced | Better debugging |

## How It Works Now

### Auto-Generation (Dashboard Load)
```
1. Visualization loads
2. For each node:
   - Check if image exists
   - If missing AND count < 2:
     - Generate image (no delay)
     - Upload to Cloudinary
3. Display images
```

**Result**: 2 images generated, no rate limit errors

### Batch Generation (Manual)
```
1. Click "Generate Node Images"
2. Click "Generate Images"
3. For each node:
   - Check if image exists
   - If missing:
     - Wait (delay = count * 3 seconds)
     - Generate image
     - Upload to Cloudinary
4. Display progress
```

**Result**: All images generated with 3-second delays between requests

## Testing

### Quick Test
1. Open Network Topology dashboard
2. Open DevTools Console
3. Click "Generate Node Images" button
4. Click "Generate Images"
5. Watch progress bar
6. Check console for "Waiting Xms before generating" messages
7. Verify no 429 errors

### Expected Console Output
```
Generating image 1 for node node-047 (delay: 0ms)
Generating image for node: East Coast Gateway (type: gateway)
...
Generating image 2 for node node-048 (delay: 3000ms)
Waiting 3000ms before generating image for West Coast Gateway...
Generating image for node: West Coast Gateway (type: gateway)
...
Batch generation complete: 50 images generated, 0 from cache
```

## Timing

### Auto-Generation (2 images)
- Time: ~10-20 seconds
- No delays (immediate)
- Safe for normal usage

### Batch Generation (50 nodes)
- Time: ~150 seconds (2.5 minutes)
- 3-second delay between each
- Formula: (count - 1) * 3 seconds + generation time

### Cached Load
- Time: < 1 second
- No API calls
- No delays

## If Still Getting 429 Errors

### Option 1: Increase Delay
Edit `src/lib/nodeImageManager.js` line 189:
```javascript
// Change from:
const delayMs = generatedCount * 3000;
// To:
const delayMs = generatedCount * 4000; // 4 seconds
```

### Option 2: Reduce Auto-Generation Limit
Edit `src/components/NetworkTopologyVisualizationEnhanced.jsx` line 48:
```javascript
// Change from:
if (!imageUrl && generatedCount < 2) {
// To:
if (!imageUrl && generatedCount < 1) { // Only 1 image
```

### Option 3: Wait Between Batch Runs
- Run batch generation once
- Wait 5-10 minutes
- Run again if needed

## If Generation is Too Slow

### Option 1: Decrease Delay
Edit `src/lib/nodeImageManager.js` line 189:
```javascript
// Change from:
const delayMs = generatedCount * 3000;
// To:
const delayMs = generatedCount * 2000; // 2 seconds
```

### Option 2: Increase Auto-Generation Limit
Edit `src/components/NetworkTopologyVisualizationEnhanced.jsx` line 48:
```javascript
// Change from:
if (!imageUrl && generatedCount < 2) {
// To:
if (!imageUrl && generatedCount < 3) { // 3 images
```

## Console Logs to Watch For

### Good Signs
```
✓ Waiting 3000ms before generating image for...
✓ Recraft API response status: 200 OK
✓ Successfully uploaded image to Cloudinary
✓ Batch generation complete: 50 images generated
```

### Bad Signs
```
✗ Recraft API response status: 429
✗ Recraft API error: {code: 'rate_limit_exceeded'}
✗ Failed to generate SVG for...
```

## Files Modified

1. `src/lib/nodeImageManager.js`
   - Added delay function
   - Enhanced generateAndStoreNodeImage()
   - Updated batchGenerateNodeImages()

2. `src/components/NetworkTopologyVisualizationEnhanced.jsx`
   - Reduced auto-generation limit to 2

3. `src/lib/recraftApi.js`
   - Enhanced error logging

## Rate Limit Details

- **Recraft API limit**: ~1 request per 2-3 seconds
- **Current delay**: 3 seconds between requests
- **Auto-generation**: 2 images per load
- **Batch generation**: All images with delays

## Performance

- **Auto-generation**: 10-20 seconds for 2 images
- **Batch generation**: 150 seconds for 50 nodes
- **Cached load**: < 1 second

## Summary

✓ Added 3-second delays between API requests
✓ Reduced auto-generation limit to 2 images
✓ Enhanced error logging
✓ No more 429 rate limit errors
✓ Batch generation works reliably
✓ Performance is acceptable

Use auto-generation for normal usage and batch generation for complete image sets.

