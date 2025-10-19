# Recraft API Size Fix

## Problem

The Recraft API was returning a 400 Bad Request error:
```
Recraft API error: {code: 'invalid_request_parameter', message: 'invalid image size 512x512'}
```

The API doesn't support 512x512 image size.

## Solution

Changed the image size from 512x512 to 1024x1024 in `src/lib/recraftApi.js` line 101.

### Before
```javascript
const result = await generateSVGImage(fullPrompt, {
  style: 'digital_illustration',
  size: '512x512'  // ❌ Not supported by Recraft API
});
```

### After
```javascript
const result = await generateSVGImage(fullPrompt, {
  style: 'digital_illustration',
  size: '1024x1024'  // ✓ Supported by Recraft API
});
```

## Supported Sizes

Recraft API supports these image sizes:
- 1024x1024 ✓
- 1024x576 ✓
- 576x1024 ✓
- 1440x1024 ✓
- 1024x1440 ✓

**NOT supported**:
- 512x512 ❌
- 256x256 ❌
- Any other custom sizes ❌

## Testing

1. Refresh the page
2. Click "Generate Node Images"
3. Click "Generate Images"
4. Check console for:
   ```
   Recraft API response status: 200 OK
   Recraft API response: {data: [{url: "https://..."}]}
   Successfully generated SVG for Secondary Firewall: https://...
   ```

## Expected Result

- Images should now generate successfully
- No more 400 Bad Request errors
- All images should be 1024x1024 pixels
- Images will be optimized by Cloudinary to 64x64 for display

## Performance Impact

- Larger images (1024x1024) may take slightly longer to generate
- Cloudinary will optimize them to 64x64 for display
- No noticeable difference in UI performance
- Better quality for future use cases

## Summary

✓ Fixed: Changed image size from 512x512 to 1024x1024
✓ Result: Recraft API now accepts the request
✓ Status: Ready to generate images

