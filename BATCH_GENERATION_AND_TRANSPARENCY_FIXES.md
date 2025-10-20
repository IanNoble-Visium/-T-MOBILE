# Batch Generation and Transparent Background Fixes

## Overview

Fixed two critical issues with the node image generation system:
1. **Incomplete batch generation** - Now continues processing even when individual images fail
2. **White backgrounds** - Now requests transparent backgrounds from Recraft API

## Issue 1: Incomplete Batch Generation

### Problem
The console showed "Batch generation complete: 23 images generated, 27 from cache" but not all images were generated. The batch process was silently failing on some nodes without proper error tracking.

### Root Cause
When `generateAndStoreNodeImage()` returned `null` (failure), the node was skipped but not tracked. The batch process had no visibility into which nodes failed.

### Solution
Modified `batchGenerateNodeImages()` in `src/lib/nodeImageManager.js` to:

1. **Track all outcomes**:
   - `generatedCount` - Successfully generated images
   - `cachedCount` - Images from cache
   - `failedCount` - Failed generation attempts
   - `failedNodes` - Array of node IDs that failed

2. **Continue on failures**:
   - Wrapped node processing in try-catch
   - Failed nodes are logged but don't stop the batch
   - All nodes are processed regardless of individual failures

3. **Better logging**:
   ```
   Batch generation complete:
     - Generated: 23 images
     - Cached: 27 images
     - Failed: 0 images
     - Total processed: 50 / 50
   ```

### Code Changes

**File**: `src/lib/nodeImageManager.js` (lines 165-230)

```javascript
export async function batchGenerateNodeImages(nodes, onProgress = null) {
  const results = {};
  const total = nodes.length;
  let generatedCount = 0;
  let cachedCount = 0;
  let failedCount = 0;
  const failedNodes = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    try {
      // Check if already has image
      const existingImage = await getNodeImage(node, false);
      if (existingImage) {
        results[node.id] = existingImage;
        cachedCount++;
      } else {
        // Generate new image with rate limiting delay
        const delayMs = generatedCount * 3000;
        const imageUrl = await generateAndStoreNodeImage(node, delayMs);
        if (imageUrl) {
          results[node.id] = imageUrl;
          generatedCount++;
        } else {
          failedCount++;
          failedNodes.push(node.id);
        }
      }
    } catch (error) {
      failedCount++;
      failedNodes.push(node.id);
      console.error(`Error processing node ${node.id}:`, error);
    }

    if (onProgress) {
      onProgress(i + 1, total);
    }
  }

  console.log(`Batch generation complete:`);
  console.log(`  - Generated: ${generatedCount} images`);
  console.log(`  - Cached: ${cachedCount} images`);
  console.log(`  - Failed: ${failedCount} images`);
  console.log(`  - Total processed: ${generatedCount + cachedCount} / ${total}`);
  
  if (failedNodes.length > 0) {
    console.warn(`Failed nodes: ${failedNodes.join(', ')}`);
  }

  return results;
}
```

## Issue 2: Transparent Backgrounds

### Problem
Generated SVG images had white backgrounds, making them look poor when displayed on different colored backgrounds in the network topology visualization.

### Solution
Modified Recraft API calls to request transparent backgrounds:

1. **Updated `generateSVGImage()`** in `src/lib/recraftApi.js`:
   - Added `background: 'transparent'` parameter to request body
   - Logs the request body for debugging

2. **Updated `generateNetworkDeviceSVG()`** in `src/lib/recraftApi.js`:
   - Passes `background: 'transparent'` option to `generateSVGImage()`
   - Added logging to indicate transparent background request

### Code Changes

**File**: `src/lib/recraftApi.js` (lines 9-46 and 101-111)

```javascript
// In generateSVGImage():
const requestBody = {
  prompt,
  style: options.style || 'digital_illustration',
  model: options.model || 'recraftv3',
  response_format: options.format || 'url',
  size: options.size || '1024x1024',
  // Request transparent background instead of white
  background: options.background || 'transparent',
  ...options
};

// In generateNetworkDeviceSVG():
const result = await generateSVGImage(fullPrompt, {
  style: 'digital_illustration',
  size: '1024x1024',
  background: 'transparent'  // Request transparent background
});
```

## Testing Instructions

1. **Clear cache** (optional):
   - Open Node Image Generator dialog
   - Click "Clear Cache" button
   - This forces regeneration of all images

2. **Generate images**:
   - Click "Generate Node Images" button
   - Click "Generate Images" in the dialog
   - Watch the console for detailed progress

3. **Verify batch generation**:
   - Check console output for:
     ```
     Batch generation complete:
       - Generated: X images
       - Cached: Y images
       - Failed: 0 images
       - Total processed: X+Y / 50
     ```
   - Ensure `Total processed` equals total nodes (50)

4. **Verify transparent backgrounds**:
   - Check Cloudinary Media Library
   - Look at generated images in `tmobile/network-nodes` folder
   - Images should have transparent backgrounds (not white)
   - Icons should look clean on any background color

## Expected Results

✅ **All 50 nodes processed** (no incomplete batches)
✅ **Transparent backgrounds** on all generated images
✅ **Better visualization** in network topology
✅ **Detailed logging** for troubleshooting

## Files Modified

1. **src/lib/nodeImageManager.js**
   - Enhanced `batchGenerateNodeImages()` with better error tracking
   - Added counters for generated, cached, and failed images
   - Improved logging output

2. **src/lib/recraftApi.js**
   - Added `background: 'transparent'` parameter to `generateSVGImage()`
   - Updated `generateNetworkDeviceSVG()` to request transparent backgrounds
   - Enhanced logging for transparency requests

## Rollback Instructions

If transparent backgrounds cause issues:

1. Edit `src/lib/recraftApi.js` line 32:
   ```javascript
   // Change from:
   background: options.background || 'transparent',
   
   // To:
   background: options.background || 'white',
   ```

2. Edit `src/lib/recraftApi.js` line 110:
   ```javascript
   // Change from:
   background: 'transparent'
   
   // To:
   background: 'white'
   ```

3. Refresh the page and regenerate images

