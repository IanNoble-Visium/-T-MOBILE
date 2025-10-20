/**
 * Cloudinary API Integration
 * Handles uploading and storing SVG images for network nodes
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dod8ajzjd';
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;
// Note: Upload preset is optional - we use authenticated upload instead

/**
 * Upload an image URL to Cloudinary
 * @param {string} imageUrl - URL of the image to upload
 * @param {string} publicId - Public ID for the uploaded image
 * @returns {Promise<Object>} - Cloudinary response with secure_url
 */
/**
 * Generate SHA1 signature for Cloudinary authenticated upload
 * @param {string} str - String to hash
 * @returns {Promise<string>} - SHA1 hash in hex format
 */
async function sha1(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function uploadImageToCloudinary(imageUrl, publicId) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary not fully configured');
    console.error(`  - Cloud Name: ${CLOUDINARY_CLOUD_NAME ? '✓' : '✗'}`);
    console.error(`  - API Key: ${CLOUDINARY_API_KEY ? '✓' : '✗'}`);
    console.error(`  - API Secret: ${CLOUDINARY_API_SECRET ? '✓' : '✗'}`);
    return null;
  }

  try {
    const formData = new FormData();

    // Use the image URL as the file source - Cloudinary will fetch it
    formData.append('file', imageUrl);
    formData.append('public_id', publicId);
    // NOTE: public_id already includes the folder path (tmobile/network-nodes/node-XXX)
    // so we do NOT add a separate folder parameter
    formData.append('resource_type', 'auto');
    formData.append('api_key', CLOUDINARY_API_KEY);

    // Add timestamp for authenticated uploads
    const timestamp = Math.floor(Date.now() / 1000);
    formData.append('timestamp', timestamp);

    // Create signature for authenticated upload
    // IMPORTANT: The signature must include ALL parameters in alphabetical order
    // API secret is appended at the end WITHOUT a separator
    // Format: public_id=X&timestamp=Y{API_SECRET}
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = await sha1(signatureString);
    formData.append('signature', signature);

    console.log(`Using authenticated upload with signature for: ${publicId}`);
    console.log(`Signature string: public_id=${publicId}&timestamp=${timestamp}[SECRET]`);
    console.log(`Uploading image to Cloudinary: ${publicId} from ${imageUrl}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    console.log(`Cloudinary upload response status: ${response.status}`);

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary upload error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }

    const data = await response.json();
    console.log(`Successfully uploaded image to Cloudinary: ${publicId}`);
    console.log(`Cloudinary response:`, data);
    console.log(`Cloudinary secure_url:`, data.secure_url);
    return data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    console.error('Error details:', error.message);
    return null;
  }
}

/**
 * Get Cloudinary URL for a node image
 * @param {string} publicId - Public ID of the image
 * @param {Object} transformations - Cloudinary transformation options
 * @returns {string} - Cloudinary URL
 */
export function getCloudinaryUrl(publicId, transformations = {}) {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const transformString = Object.entries(transformations)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  // Always add format specification to ensure proper image delivery
  // Use 'auto' format to let Cloudinary choose the best format
  const formatSpec = 'f_auto';

  if (transformString) {
    return `${baseUrl}/${transformString},${formatSpec}/${publicId}`;
  }

  return `${baseUrl}/${formatSpec}/${publicId}`;
}

/**
 * Generate a public ID for a network node
 * @param {string} nodeId - Node ID
 * @param {string} nodeName - Node name
 * @returns {string} - Sanitized public ID
 */
export function generateNodePublicId(nodeId, nodeName) {
  const sanitized = nodeName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  return `tmobile/network-nodes/${nodeId}_${sanitized}`;
}

/**
 * Check if an image exists in Cloudinary
 * @param {string} publicId - Public ID to check
 * @returns {Promise<boolean>}
 */
export async function imageExistsInCloudinary(publicId) {
  try {
    const url = getCloudinaryUrl(publicId);
    // Try to load the image as an Image object - this is more reliable than fetch
    return new Promise((resolve) => {
      const img = new Image();
      // Set a timeout in case the image takes too long to load
      const timeout = setTimeout(() => {
        console.warn(`Timeout checking image in Cloudinary: ${publicId}`);
        resolve(false);
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        console.log(`Image exists in Cloudinary: ${publicId}`);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        console.log(`Image does not exist in Cloudinary: ${publicId}`);
        resolve(false);
      };

      img.src = url;
    });
  } catch (error) {
    console.warn(`Error checking if image exists in Cloudinary (${publicId}):`, error);
    return false;
  }
}

/**
 * Check if Cloudinary is configured
 * @returns {boolean}
 */
export function isCloudinaryConfigured() {
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}

/**
 * Get Cloudinary configuration status for debugging
 * @returns {Object}
 */
export function getCloudinaryConfigStatus() {
  return {
    cloudName: CLOUDINARY_CLOUD_NAME ? `${CLOUDINARY_CLOUD_NAME.substring(0, 3)}...` : 'NOT SET',
    apiKey: CLOUDINARY_API_KEY ? `${CLOUDINARY_API_KEY.substring(0, 3)}...` : 'NOT SET',
    apiSecret: CLOUDINARY_API_SECRET ? `${CLOUDINARY_API_SECRET.substring(0, 3)}...` : 'NOT SET',
    isConfigured: isCloudinaryConfigured()
  };
}

/**
 * Get optimized image URL for network topology visualization
 * @param {string} publicId - Public ID of the image
 * @param {number} size - Desired size (width/height)
 * @returns {string}
 */
export function getOptimizedNodeImageUrl(publicId, size = 64) {
  return getCloudinaryUrl(publicId, {
    w: size,
    h: size,
    c: 'fill',
    q: 'auto'
    // Note: 'f' (format) is handled by getCloudinaryUrl with 'f_auto'
  });
}

