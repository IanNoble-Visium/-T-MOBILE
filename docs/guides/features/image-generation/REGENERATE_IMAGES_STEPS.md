# Step-by-Step Image Regeneration Guide

## Current Status
- ❌ 44 images missing (node-007 through node-050)
- ✅ 6 images cached (node-001 through node-006)
- ❌ All missing images returning 404 errors
- ✅ Transparent background setting already configured

## Why Regeneration is Needed

The images were never successfully uploaded to Cloudinary because the upload signature was malformed. The fix has been applied, so now you need to:

1. Clear the old cached URLs (they point to non-existent images)
2. Regenerate all images with the fixed upload signature
3. Verify images are successfully uploaded to Cloudinary

## Step-by-Step Instructions

### Step 1: Open the Network Topology Dashboard
1. Navigate to the Network Topology page in your T-Mobile dashboard
2. Look for the "Generate Node Images" button (with sparkles icon)

### Step 2: Clear the Cache
1. Click the "Generate Node Images" button
2. A dialog will open showing:
   - Configuration status (Recraft and Cloudinary)
   - Cache statistics (currently showing 6 cached images)
3. Click the "Clear Cache" button (trash icon)
4. Confirm the action when prompted

**Expected Result:**
- Cache statistics should show: "Cached Images: 0"
- All old URLs will be removed from localStorage

### Step 3: Verify Configuration
Before generating, verify both APIs are connected:

In the dialog, you should see:
- ✅ Recraft: Connected
- ✅ Cloudinary: Connected

If either shows "Not Configured":
- Check your `.env` file has all required variables
- Restart the development server
- Try again

### Step 4: Generate All Images
1. Click the "Generate Images" button
2. A progress bar will appear showing:
   - Current progress (e.g., "5 / 50")
   - Percentage complete

**Expected Timeline:**
- Total time: ~2-3 minutes (50 images × 3 seconds delay = 150 seconds)
- First image: ~10-15 seconds (Recraft generation)
- Subsequent images: ~3-5 seconds each (with rate limiting)

### Step 5: Monitor the Console
Open the browser console (F12) and watch for:

**Good signs:**
```
✓ Generating image for node: dallas_data_center (type: router)
✓ Generated image URL for dallas_data_center: https://...
✓ Uploading to Cloudinary with publicId: tmobile/network-nodes/node-001_dallas_data_center
✓ Successfully uploaded image to Cloudinary: tmobile/network-nodes/node-001_dallas_data_center
✓ Successfully uploaded and cached image for dallas_data_center: https://res.cloudinary.com/...
```

**Bad signs (if you see these, let me know):**
```
✗ Cloudinary upload error: {error: "Invalid signature"}
✗ Recraft API response status: 429 (rate limit)
✗ Failed to generate image for node
```

### Step 6: Verify Completion
When generation completes, you should see:
```
Batch generation complete:
  - Generated: 50 images
  - Cached: 0 images
  - Failed: 0 images
  - Total processed: 50 / 50 ✅
```

### Step 7: Verify Images Display
1. Close the dialog
2. The network topology should now show node icons instead of plain circles
3. All 50 nodes should have custom SVG icons
4. Icons should have transparent backgrounds (look clean on any background)

### Step 8: Verify in Cloudinary (Optional)
To confirm images were uploaded:

1. Go to https://cloudinary.com/console/media_library
2. Navigate to folder: `tmobile/network-nodes`
3. You should see 50 images with names like:
   - `node-001_dallas_data_center`
   - `node-002_houston_cell_tower_1`
   - etc.

## Troubleshooting

### Issue: "Cloudinary not fully configured" error
**Solution:**
1. Check `.env` file has these variables:
   - `VITE_CLOUDINARY_CLOUD_NAME=dod8ajzjd`
   - `VITE_CLOUDINARY_API_KEY=841983555962286`
   - `VITE_CLOUDINARY_API_SECRET=W1gSyjhw17u1vT5UQObDrDMmrl0`
2. Restart development server
3. Try again

### Issue: Generation stops after a few images
**Solution:**
- This is likely a Recraft rate limit (429 error)
- Wait 5-10 minutes
- Try again
- The batch generator includes 3-second delays between requests

### Issue: Images still showing 404 after generation
**Solution:**
1. Check browser console for upload errors
2. Verify images exist in Cloudinary Media Library
3. Clear browser cache (Ctrl+Shift+Delete)
4. Refresh the page
5. Try regenerating again

### Issue: Images have white backgrounds instead of transparent
**Solution:**
- This shouldn't happen - transparent background is configured
- If it does occur, check Recraft API response in console
- May need to regenerate with updated Recraft API settings

## What Changed

### Fixed Cloudinary Upload Signature
**File:** `src/lib/cloudinaryApi.js` (line 54)

```javascript
// BEFORE (broken):
const signatureString = `folder=tmobile/network-nodes&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;

// AFTER (fixed):
const signatureString = `folder=tmobile/network-nodes&public_id=${publicId}&timestamp=${timestamp}&${CLOUDINARY_API_SECRET}`;
```

The missing `&` before the API secret caused all uploads to fail.

### Transparent Background Already Configured
**File:** `src/lib/recraftApi.js` (line 110)

```javascript
const result = await generateSVGImage(fullPrompt, {
  style: 'digital_illustration',
  size: '1024x1024',
  background: 'transparent'  // ✅ Already set!
});
```

## Expected Results After Regeneration

✅ All 50 node images successfully uploaded to Cloudinary
✅ Images accessible at: `https://res.cloudinary.com/dod8ajzjd/image/upload/f_auto/tmobile/network-nodes/node-XXX_name`
✅ Node icons display correctly in network topology
✅ No 404 errors in console
✅ Images have transparent backgrounds (look professional on any background)
✅ Images cached in localStorage for fast loading on subsequent visits

## Next Steps

1. **Now:** Follow the step-by-step instructions above
2. **After regeneration:** Verify images display correctly
3. **If issues:** Check console logs and refer to troubleshooting section
4. **Optional:** Verify images in Cloudinary Media Library

Good luck! The fix is in place, and regeneration should work smoothly now. 🚀

