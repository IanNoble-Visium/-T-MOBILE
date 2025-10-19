# Recraft API Rate Limiting - Implementation Guide

## Problem

The Recraft API has rate limiting (429 Too Many Requests errors). When trying to generate multiple images at once, the API rejects requests if they come too quickly.

## Solution

Implemented rate limiting with delays between API requests:

### 1. Auto-Generation on Visualization Load
- **Limit**: 2 images per load (reduced from 5)
- **Reason**: Prevents hitting rate limits during normal usage
- **Behavior**: Only generates images for first 2 missing nodes
- **File**: `src/components/NetworkTopologyVisualizationEnhanced.jsx`

### 2. Batch Generation (Manual)
- **Delay**: 3 seconds between each image generation
- **Reason**: Recraft API allows ~1 request per 2-3 seconds
- **Behavior**: Generates all missing images with delays
- **File**: `src/lib/nodeImageManager.js`

### 3. Individual Generation
- **Delay**: Optional parameter for custom delays
- **Reason**: Allows fine-tuning for different rate limits
- **Behavior**: Can specify delay before generation
- **File**: `src/lib/nodeImageManager.js`

## How to Use

### Option 1: Auto-Generation (Recommended for Normal Use)
```javascript
// Automatically happens when visualization loads
// Generates up to 2 images with no additional delays
// Safe for normal usage
```

**When to use**: 
- Normal dashboard usage
- Don't need all images immediately
- Want to avoid rate limiting

**Expected behavior**:
- First 2 missing images are generated
- Remaining nodes show colored circles
- Use "Generate Node Images" button for more

### Option 2: Batch Generation (For Complete Image Set)
```javascript
// Click "Generate Node Images" button in the UI
// Generates all missing images with 3-second delays
// Takes longer but generates everything
```

**When to use**:
- Want all nodes to have custom images
- Have time to wait for generation
- Running during off-peak hours

**Expected behavior**:
- Progress bar shows: "1 / 50 nodes", "2 / 50 nodes", etc.
- 3-second delay between each generation
- Total time: ~150 seconds for 50 nodes
- All images generated and cached

### Option 3: Custom Delay (Advanced)
```javascript
import { generateAndStoreNodeImage } from '@/lib/nodeImageManager'

// Generate with custom delay
const imageUrl = await generateAndStoreNodeImage(node, 5000) // 5 second delay
```

**When to use**:
- Need different rate limits
- Testing API behavior
- Custom integration

## Rate Limiting Details

### Recraft API Limits
- **Typical limit**: ~1 request per 2-3 seconds
- **Error code**: 429 (Too Many Requests)
- **Response**: `{code: 'rate_limit_exceeded', message: ''}`

### Current Implementation
- **Auto-generation**: 2 images per load (no delays)
- **Batch generation**: 3 seconds between requests
- **Total time for 50 nodes**: ~150 seconds (2.5 minutes)

### Adjusting Rate Limits

If you get 429 errors:
1. Increase delay in `batchGenerateNodeImages()`:
   ```javascript
   const delayMs = generatedCount * 4000; // 4 seconds instead of 3
   ```

If generation is too slow:
1. Decrease delay in `batchGenerateNodeImages()`:
   ```javascript
   const delayMs = generatedCount * 2000; // 2 seconds instead of 3
   ```

## Console Logs

### Auto-Generation Logs
```
Auto-generating image for node node-047 (1/2)
Generating image for node: East Coast Gateway (type: gateway)
Generating network device SVG for East Coast Gateway (type: gateway)
Calling Recraft API with prompt: Create high-resolution SVG icon...
Recraft API response status: 200 OK
Generated image URL for East Coast Gateway: https://...
Uploading to Cloudinary with publicId: tmobile/network-nodes/node-047_east_coast_gateway
Successfully uploaded and cached image for East Coast Gateway: https://res.cloudinary.com/...
```

### Batch Generation Logs
```
Generating image 1 for node node-047 (delay: 0ms)
Waiting 0ms before generating image for East Coast Gateway...
Generating image for node: East Coast Gateway (type: gateway)
...
Generating image 2 for node node-048 (delay: 3000ms)
Waiting 3000ms before generating image for West Coast Gateway...
Generating image for node: West Coast Gateway (type: gateway)
...
Batch generation complete: 50 images generated, 0 from cache
```

### Error Logs
```
Recraft API response status: 429 
Recraft API error: {code: 'rate_limit_exceeded', message: ''}
Failed to generate SVG for Primary Firewall. Result: null
Failed to generate image for node Primary Firewall
```

## Troubleshooting

### Issue: Still Getting 429 Errors
**Solution**:
1. Increase delay in `batchGenerateNodeImages()` to 4-5 seconds
2. Reduce auto-generation limit from 2 to 1
3. Wait longer between batch generations

### Issue: Generation is Too Slow
**Solution**:
1. Decrease delay in `batchGenerateNodeImages()` to 2 seconds
2. Increase auto-generation limit from 2 to 3
3. Run batch generation during off-peak hours

### Issue: Some Images Failed to Generate
**Solution**:
1. Check console for error messages
2. Verify Recraft API key is valid
3. Try again after waiting a few minutes
4. Check Recraft dashboard for account status

## Best Practices

1. **Use auto-generation for normal usage**
   - Only generates 2 images per load
   - Doesn't overwhelm the API
   - Provides good user experience

2. **Use batch generation for complete sets**
   - Run during off-peak hours
   - Allow 3-5 minutes for 50 nodes
   - Monitor progress bar

3. **Monitor rate limits**
   - Watch console for 429 errors
   - Adjust delays if needed
   - Check Recraft dashboard for quota

4. **Cache images**
   - Generated images are cached
   - Subsequent loads don't hit API
   - Clear cache only when needed

## Performance Expectations

### Auto-Generation (2 images)
- Time: ~10-20 seconds
- API calls: 2 to Recraft, 2 to Cloudinary
- User impact: Minimal

### Batch Generation (50 nodes)
- Time: ~150 seconds (2.5 minutes)
- API calls: 50 to Recraft, 50 to Cloudinary
- User impact: Progress bar shows status

### Cached Load
- Time: < 1 second
- API calls: 0
- User impact: None

## Configuration

### Environment Variables
```
VITE_RECRAFT_API_KEY=<your_key>
VITE_RECRAFT_API_URL=https://external.api.recraft.ai/v1
```

### Rate Limit Settings
Edit `src/lib/nodeImageManager.js`:
```javascript
// Line 189: Adjust delay between batch generations
const delayMs = generatedCount * 3000; // Change 3000 to desired milliseconds

// Line 45: Adjust auto-generation limit
if (!imageUrl && generatedCount < 2) { // Change 2 to desired limit
```

Edit `src/components/NetworkTopologyVisualizationEnhanced.jsx`:
```javascript
// Line 48: Adjust auto-generation limit
if (!imageUrl && generatedCount < 2) { // Change 2 to desired limit
```

## Summary

- **Auto-generation**: 2 images per load, no delays
- **Batch generation**: All images, 3-second delays
- **Rate limit**: ~1 request per 2-3 seconds
- **Total time for 50 nodes**: ~2.5 minutes
- **Cached loads**: < 1 second

Use auto-generation for normal usage and batch generation for complete image sets.

