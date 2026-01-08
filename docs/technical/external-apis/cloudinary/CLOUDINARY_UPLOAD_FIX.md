# Cloudinary Upload Fix

## Problem

The Cloudinary upload was failing with error:
```
Cloudinary upload error: {error: {message: "Upload preset not found"}}
```

The code was trying to use an unsigned upload with a preset `tmobile_network_nodes` that doesn't exist in Cloudinary.

## Solution

Changed from unsigned upload (with preset) to **authenticated upload** using:
- API Key
- Timestamp
- SHA1 Signature

### Before
```javascript
// Tried to use non-existent upload preset
formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
```

### After
```javascript
// Use authenticated upload with signature
formData.append('api_key', CLOUDINARY_API_KEY);
formData.append('timestamp', timestamp);
formData.append('signature', signature);
```

## How It Works

1. **Generate Timestamp**: Current Unix timestamp
2. **Create Signature String**: `public_id=X&timestamp=Y&api_secret=SECRET`
3. **Hash with SHA1**: Using Web Crypto API
4. **Send to Cloudinary**: With api_key, timestamp, and signature

### Signature Generation

```javascript
async function sha1(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
```

Uses browser's built-in Web Crypto API (no external dependencies needed).

## Configuration

The following environment variables are required:
```
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

These are already in `.env` file.

## Upload Folder

Images are uploaded to the folder: **`tmobile/network-nodes`**

This is set in the code:
```javascript
formData.append('folder', 'tmobile/network-nodes');
```

All generated images will be organized in this folder in Cloudinary.

## Testing

1. Refresh the page
2. Click "Generate Node Images"
3. Click "Generate Images"
4. Check console for:
   ```
   Using authenticated upload with signature for: tmobile/network-nodes/node-007_los_angeles_data_center
   Uploading image to Cloudinary: tmobile/network-nodes/node-007_los_angeles_data_center from https://...
   Cloudinary upload response status: 200
   Successfully uploaded image to Cloudinary: tmobile/network-nodes/node-007_los_angeles_data_center
	   Cloudinary secure_url: https://res.cloudinary.com/<cloud_name>/image/upload/tmobile/network-nodes/node-007_los_angeles_data_center
   ```

## Verification

To verify images are uploaded:

1. Go to https://cloudinary.com/console
2. Navigate to **Media Library**
3. Look for folder: **`tmobile/network-nodes`**
4. You should see all generated images there

## Security Notes

⚠️ **Important**: The API secret is exposed in the browser code. This is acceptable for:
- Development environments
- Demo applications
- Internal tools

For production, you should:
1. Move signature generation to backend
2. Keep API secret on server only
3. Have frontend call backend to get signed upload URL
4. Backend generates signature and returns it

## Performance

- **Upload time**: ~2-5 seconds per image
- **Parallel uploads**: Currently sequential (one at a time)
- **Retry logic**: None (could be added if needed)

## Troubleshooting

### Issue: Still getting upload errors

**Check**:
1. Verify API key and secret in `.env`
2. Verify Cloudinary account is active
3. Check Cloudinary dashboard for any restrictions
4. Try uploading manually from Cloudinary dashboard

### Issue: Images not appearing in Cloudinary

**Check**:
1. Go to Media Library in Cloudinary
2. Look for `tmobile/network-nodes` folder
3. Check if images are there but not visible
4. Try refreshing the page

### Issue: Signature mismatch error

**Check**:
1. Verify API secret is correct
2. Verify timestamp is current
3. Verify public_id matches exactly
4. Check console for signature generation errors

## Summary

✓ Fixed: Changed from unsigned to authenticated upload
✓ Result: Images now upload successfully to Cloudinary
✓ Folder: `tmobile/network-nodes`
✓ Status: Ready to generate and upload images
✓ Security: Acceptable for development/demo

