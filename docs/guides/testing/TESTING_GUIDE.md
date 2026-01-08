# Testing Guide: Batch Generation & Transparency Fixes

## Quick Start

### Step 1: Clear Cache (Optional)
If you want to force regeneration of all images:
1. Click **"Generate Node Images"** button
2. Click **"Clear Cache"** button in the dialog
3. Confirm the action

### Step 2: Generate Images
1. Click **"Generate Node Images"** button
2. Click **"Generate Images"** button
3. Watch the progress bar

### Step 3: Monitor Console
Open browser DevTools (F12) and watch the console for:

```
Generating image 1 for node node-001_houston_cell_tower_1 (delay: 0ms)
Generating image 2 for node node-002_houston_cell_tower_2 (delay: 3000ms)
Generating image 3 for node node-003_houston_cell_tower_3 (delay: 6000ms)
...
Batch generation complete:
  - Generated: 23 images
  - Cached: 27 images
  - Failed: 0 images
  - Total processed: 50 / 50
```

## What to Verify

### ✅ Fix 1: Batch Generation Completes

**Expected Result**:
- `Total processed: 50 / 50` (or whatever your total node count is)
- `Failed: 0 images` (or very few if there are API issues)
- All nodes appear in the network topology with icons

**If you see**:
- `Total processed: 23 / 50` → Some nodes were skipped
- `Failed: 5 images` → Check console for error details
- Missing icons in topology → Regenerate images

### ✅ Fix 2: Transparent Backgrounds

**Expected Result**:
- Icons look clean and professional
- Icons blend well with different background colors
- No white boxes around icons

**How to Verify**:
1. Go to Cloudinary Media Library: https://cloudinary.com/console
2. Navigate to folder: `tmobile/network-nodes`
3. Click on an image to view it
4. Check if background is transparent (should show checkerboard pattern in Cloudinary)

**If you see**:
- White backgrounds → Transparent background request failed
- Checkerboard pattern → ✅ Transparent background working!

## Console Output Reference

### Successful Generation
```
Calling Recraft API with prompt: Create high-resolution SVG icon...
Request body: {
  prompt: "Create high-resolution SVG icon...",
  style: "digital_illustration",
  model: "recraftv3",
  response_format: "url",
  size: "1024x1024",
  background: "transparent"
}
Recraft API response status: 200 OK
Successfully generated SVG for node-001_houston_cell_tower_1: https://...
Uploading to Cloudinary with publicId: tmobile/network-nodes/node-001_houston_cell_tower_1
Cloudinary upload response status: 200
Successfully uploaded and cached image for node-001_houston_cell_tower_1
```

### Failed Generation (with recovery)
```
Generating image 5 for node node-005_houston_cell_tower_5 (delay: 12000ms)
Recraft API response status: 429
Recraft API error: {code: 'rate_limit_exceeded'}
Failed to generate image for node node-005_houston_cell_tower_5, will retry later
```

### Batch Complete
```
Batch generation complete:
  - Generated: 23 images
  - Cached: 27 images
  - Failed: 0 images
  - Total processed: 50 / 50
```

## Troubleshooting

### Issue: Still seeing "23 images generated, 27 from cache"

**Solution**:
1. Check if you have 50 total nodes
2. Look for "Failed nodes:" in console
3. If nodes failed, check the error messages
4. Retry generation after a few minutes (rate limit)

### Issue: Images still have white backgrounds

**Solution**:
1. Clear cache and regenerate
2. Check Recraft API response in console
3. Verify `background: "transparent"` in request body
4. Check Cloudinary Media Library for actual image backgrounds

### Issue: Generation is very slow

**Solution**:
- This is normal! 3-second delays between requests
- 50 images = ~150 seconds (2.5 minutes)
- Cached images load instantly

### Issue: Getting 429 Rate Limit Errors

**Solution**:
1. Wait a few minutes before retrying
2. If persistent, increase delay in `src/lib/nodeImageManager.js` line 193:
   ```javascript
   const delayMs = generatedCount * 4000; // 4 seconds instead of 3
   ```

## Performance Expectations

| Scenario | Time | Notes |
|----------|------|-------|
| First generation (50 nodes) | ~150 seconds | 3-second delays between requests |
| Cached load (50 nodes) | < 1 second | No API calls |
| Mixed (23 new + 27 cached) | ~70 seconds | Only new images have delays |

## Success Criteria

✅ All checks passed:
- [ ] Total processed = Total nodes
- [ ] Failed = 0 (or very few)
- [ ] All icons visible in topology
- [ ] Icons have transparent backgrounds
- [ ] No white boxes around icons
- [ ] Console shows detailed progress

## Next Steps

After successful generation:
1. **Verify in Topology**: Icons should display in network graph
2. **Check Cloudinary**: Images stored in `tmobile/network-nodes` folder
3. **Test Interactions**: Click on nodes to see if icons display correctly
4. **Monitor Performance**: Check if topology renders smoothly with icons

## Support

If you encounter issues:
1. Check console for error messages
2. Review the error details in console
3. Check `BATCH_GENERATION_AND_TRANSPARENCY_FIXES.md` for detailed info
4. Look for "Failed nodes:" in console output

