# Cloudinary Signature Fix

## Problem

Cloudinary was rejecting uploads with:
```
Invalid Signature 938da63ce447af8728fad92a8ef1647801bb24ef. 
String to sign - 'folder=tmobile/network-nodes&public_id=tmobile/network-nodes/node-021_houston_cell_tower_3&timestamp=1760908020'.
```

The error message revealed that Cloudinary was including the `folder` parameter in the string to sign, but our signature generation was NOT including it!

## Root Cause

**Incorrect signature string**:
```javascript
// ❌ WRONG - Missing folder parameter
const signatureString = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
```

**What Cloudinary expected**:
```
folder=tmobile/network-nodes&public_id=tmobile/network-nodes/node-021_houston_cell_tower_3&timestamp=1760908020
```

## Solution

Updated the signature string to include ALL parameters in **alphabetical order**:

```javascript
// ✅ CORRECT - Includes folder parameter in alphabetical order
const signatureString = `folder=tmobile/network-nodes&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
```

### Key Points

1. **All parameters must be included** in the signature string
2. **Alphabetical order matters**: `folder` comes before `public_id` which comes before `timestamp`
3. **API secret is appended** at the end (no `&` before it)
4. **SHA1 hash** of this string becomes the signature

## Signature Generation Process

```javascript
// 1. Create string with all parameters in alphabetical order
const signatureString = `folder=tmobile/network-nodes&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;

// 2. Hash with SHA1
const signature = await sha1(signatureString);

// 3. Send with upload request
formData.append('signature', signature);
```

## Testing

1. Refresh the page
2. Click "Generate Node Images"
3. Click "Generate Images"
4. Check console for:
   ```
   Signature string: folder=tmobile/network-nodes&public_id=tmobile/network-nodes/node-021_houston_cell_tower_3&timestamp=1760908020[SECRET]
   Uploading image to Cloudinary: tmobile/network-nodes/node-021_houston_cell_tower_3 from https://...
   Cloudinary upload response status: 200
   Successfully uploaded image to Cloudinary: tmobile/network-nodes/node-021_houston_cell_tower_3
   Cloudinary secure_url: https://res.cloudinary.com/dod8ajzjd/image/upload/tmobile/network-nodes/node-021_houston_cell_tower_3
   ```

## Verification in Cloudinary

1. Go to https://cloudinary.com/console
2. Click **Media Library**
3. Look for folder: **`tmobile/network-nodes`**
4. You should see all generated images there

## Files Modified

- `src/lib/cloudinaryApi.js` - Fixed signature generation to include folder parameter

## Summary

✓ Fixed: Signature now includes all parameters in alphabetical order
✓ Result: Cloudinary accepts the authenticated upload
✓ Folder: `tmobile/network-nodes` will be created automatically
✓ Status: Ready to upload images successfully

