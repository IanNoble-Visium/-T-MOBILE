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
 * @returns {Promise<string|null>} - Image URL or null
 */
export async function getNodeImage(node) {
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

  // If no cached image, return null (will use default circle)
  return null;
}

/**
 * Generate and store image for a node
 * @param {Object} node - Network node object
 * @returns {Promise<string|null>} - Generated image URL or null
 */
export async function generateAndStoreNodeImage(node) {
  const { id, name, type } = node;

  // Check if Recraft is configured
  if (!isRecraftConfigured()) {
    console.warn('Recraft API not configured. Cannot generate images.');
    return null;
  }

  try {
    // Generate SVG using Recraft
    const generatedUrl = await generateNetworkDeviceSVG(name, type);
    
    if (!generatedUrl) {
      console.warn(`Failed to generate image for node ${name}`);
      return null;
    }

    // Upload to Cloudinary if configured
    if (isCloudinaryConfigured()) {
      const publicId = generateNodePublicId(id, name);
      const uploadResult = await uploadImageToCloudinary(generatedUrl, publicId);
      
      if (uploadResult && uploadResult.secure_url) {
        const optimizedUrl = getOptimizedNodeImageUrl(publicId, 64);
        
        // Cache the result
        imageCache.set(id, optimizedUrl);
        saveCacheToStorage();
        
        return optimizedUrl;
      }
    }

    // If Cloudinary upload failed, cache the Recraft URL directly
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

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    
    // Check if already has image
    const existingImage = await getNodeImage(node);
    if (existingImage) {
      results[node.id] = existingImage;
    } else {
      // Generate new image
      const imageUrl = await generateAndStoreNodeImage(node);
      if (imageUrl) {
        results[node.id] = imageUrl;
      }
    }

    // Report progress
    if (onProgress) {
      onProgress(i + 1, total);
    }

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

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

