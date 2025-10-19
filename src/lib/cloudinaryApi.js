/**
 * Cloudinary API Integration
 * Handles uploading and storing SVG images for network nodes
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dod8ajzjd';
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_PRESET = 'tmobile_network_nodes'; // You may need to create this in Cloudinary dashboard

/**
 * Upload an image URL to Cloudinary
 * @param {string} imageUrl - URL of the image to upload
 * @param {string} publicId - Public ID for the uploaded image
 * @returns {Promise<Object>} - Cloudinary response with secure_url
 */
export async function uploadImageToCloudinary(imageUrl, publicId) {
  if (!CLOUDINARY_CLOUD_NAME) {
    console.warn('Cloudinary not configured');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('file', imageUrl);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('public_id', publicId);
    formData.append('folder', 'tmobile/network-nodes');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary upload error:', error);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
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

  if (transformString) {
    return `${baseUrl}/${transformString}/${publicId}`;
  }

  return `${baseUrl}/${publicId}`;
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
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Check if Cloudinary is configured
 * @returns {boolean}
 */
export function isCloudinaryConfigured() {
  return !!CLOUDINARY_CLOUD_NAME;
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
    f: 'auto',
    q: 'auto'
  });
}

