/**
 * Node Image Manager
 * Manages SVG image generation, caching, and retrieval for network nodes
 */

import { generateNetworkDeviceSVG, isRecraftConfigured } from './recraftApi';
import { 
  uploadImageToCloudinary, 
  generateNodePublicId, 
  getOptimizedNodeImageUrl,
  imageExistsInCloudinary,
  isCloudinaryConfigured 
} from './cloudinaryApi';

// In-memory cache for node images
const imageCache = new Map();

// LocalStorage key for persistent cache
const CACHE_KEY = 'tmobile_node_images_cache';

/**
 * Load cache from localStorage
 */
function loadCacheFromStorage() {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([key, value]) => {
        imageCache.set(key, value);
      });
    }
  } catch (error) {
    console.error('Error loading image cache:', error);
  }
}

/**
 * Save cache to localStorage
 */
function saveCacheToStorage() {
  try {
    const cacheObj = Object.fromEntries(imageCache.entries());
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
  } catch (error) {
    console.error('Error saving image cache:', error);
  }
}

/**
 * Get or generate image for a network node
 * @param {Object} node - Network node object
 * @param {boolean} autoGenerate - Whether to automatically generate missing images
 * @returns {Promise<string|null>} - Image URL or null
 */
export async function getNodeImage(node, autoGenerate = false) {
  const { id, name, type } = node;

  // Check memory cache first
  if (imageCache.has(id)) {
    return imageCache.get(id);
  }

  // Check if Cloudinary is configured
  if (isCloudinaryConfigured()) {
    const publicId = generateNodePublicId(id, name);

    // Check if image exists in Cloudinary
    const exists = await imageExistsInCloudinary(publicId);
    if (exists) {
      const imageUrl = getOptimizedNodeImageUrl(publicId, 64);
      imageCache.set(id, imageUrl);
      saveCacheToStorage();
      return imageUrl;
    }
  }

  // If image doesn't exist and autoGenerate is true, generate it
  if (autoGenerate && isRecraftConfigured()) {
    console.log(`Auto-generating image for node: ${name}`);
    const generatedUrl = await generateAndStoreNodeImage(node);
    return generatedUrl;
  }

  // If no cached image, return null (will use default circle)
  return null;
}

/**
 * Delay helper function
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate and store image for a node
 * @param {Object} node - Network node object
 * @param {number} delayMs - Delay before generation (for rate limiting)
 * @returns {Promise<string|null>} - Generated image URL or null
 */
export async function generateAndStoreNodeImage(node, delayMs = 0) {
  const { id, name, type } = node;

  // Check if Recraft is configured
  if (!isRecraftConfigured()) {
    console.warn('Recraft API not configured. Cannot generate images.');
    return null;
  }

  try {
    // Apply rate limiting delay
    if (delayMs > 0) {
      console.log(`Waiting ${delayMs}ms before generating image for ${name}...`);
      await delay(delayMs);
    }

    console.log(`Generating image for node: ${name} (type: ${type})`);

    // Generate SVG using Recraft
    const generatedUrl = await generateNetworkDeviceSVG(name, type);

    if (!generatedUrl) {
      console.warn(`Failed to generate image for node ${name}`);
      return null;
    }

    console.log(`Generated image URL for ${name}: ${generatedUrl}`);

    // Upload to Cloudinary if configured
    if (isCloudinaryConfigured()) {
      const publicId = generateNodePublicId(id, name);
      console.log(`Uploading to Cloudinary with publicId: ${publicId}`);

      const uploadResult = await uploadImageToCloudinary(generatedUrl, publicId);

      if (uploadResult && uploadResult.secure_url) {
        const optimizedUrl = getOptimizedNodeImageUrl(publicId, 64);
        console.log(`Successfully uploaded and cached image for ${name}: ${optimizedUrl}`);

        // Cache the result
        imageCache.set(id, optimizedUrl);
        saveCacheToStorage();

        return optimizedUrl;
      } else {
        console.warn(`Cloudinary upload failed for ${name}, using generated URL directly`);
      }
    }

    // If Cloudinary upload failed, cache the Recraft URL directly
    console.log(`Caching Recraft URL directly for ${name}`);
    imageCache.set(id, generatedUrl);
    saveCacheToStorage();

    return generatedUrl;
  } catch (error) {
    console.error(`Error generating image for node ${name}:`, error);
    return null;
  }
}

/**
 * Batch generate images for multiple nodes
 * @param {Array} nodes - Array of network nodes
 * @param {Function} onProgress - Progress callback (current, total)
 * @returns {Promise<Object>} - Map of node IDs to image URLs
 */
export async function batchGenerateNodeImages(nodes, onProgress = null) {
  const results = {};
  const total = nodes.length;
  let generatedCount = 0;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    // Check if already has image
    const existingImage = await getNodeImage(node, false);
    if (existingImage) {
      results[node.id] = existingImage;
      console.log(`Using cached image for node ${node.id}`);
    } else {
      // Generate new image with rate limiting delay
      // Recraft API has rate limits, so we add delays between requests
      // Typical rate limit is ~1 request per 2-3 seconds
      const delayMs = generatedCount * 3000; // 3 seconds between each generation
      console.log(`Generating image ${generatedCount + 1} for node ${node.id} (delay: ${delayMs}ms)`);

      const imageUrl = await generateAndStoreNodeImage(node, delayMs);
      if (imageUrl) {
        results[node.id] = imageUrl;
        generatedCount++;
      }
    }

    // Report progress
    if (onProgress) {
      onProgress(i + 1, total);
    }
  }

  console.log(`Batch generation complete: ${generatedCount} images generated, ${total - generatedCount} from cache`);
  return results;
}

/**
 * Clear all cached images
 */
export function clearImageCache() {
  imageCache.clear();
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get cache statistics
 * @returns {Object}
 */
export function getCacheStats() {
  return {
    size: imageCache.size,
    keys: Array.from(imageCache.keys())
  };
}

/**
 * Check if APIs are properly configured
 * @returns {Object}
 */
export function checkConfiguration() {
  return {
    recraft: isRecraftConfigured(),
    cloudinary: isCloudinaryConfigured(),
    ready: isRecraftConfigured() && isCloudinaryConfigured()
  };
}

// Initialize cache on module load
loadCacheFromStorage();

