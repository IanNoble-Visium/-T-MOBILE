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
export async function batchGenerateNodeImages(nodes, onProgress = null, forceRegenerate = false) {
  const results = {};
  const total = nodes.length;
  let generatedCount = 0;
  let cachedCount = 0;
  let failedCount = 0;
  const failedNodes = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    try {
      // Check if already has image (unless force regenerate is enabled)
      const existingImage = forceRegenerate ? null : await getNodeImage(node, false);
      if (existingImage) {
        results[node.id] = existingImage;
        cachedCount++;
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
          console.log(`Successfully generated image for node ${node.id}`);
        } else {
          failedCount++;
          failedNodes.push(node.id);
          console.warn(`Failed to generate image for node ${node.id}, will retry later`);
        }
      }
    } catch (error) {
      failedCount++;
      failedNodes.push(node.id);
      console.error(`Error processing node ${node.id}:`, error);
    }

    // Report progress
    if (onProgress) {
      onProgress(i + 1, total);
    }
  }

  console.log(`Batch generation complete:`);
  console.log(`  - Generated: ${generatedCount} images`);
  console.log(`  - Cached: ${cachedCount} images`);
  console.log(`  - Failed: ${failedCount} images`);
  console.log(`  - Total processed: ${generatedCount + cachedCount} / ${total}`);

  if (failedNodes.length > 0) {
    console.warn(`Failed nodes: ${failedNodes.join(', ')}`);
  }

  return results;
}

/**
 * Regenerate image for a single node with custom options
 * @param {Object} node - Network node object
 * @param {Object} options - Regeneration options
 * @param {string} options.deviceType - Device type for prompt generation
 * @param {string} options.style - Recraft AI style
 * @param {string} options.customPrompt - Custom prompt additions
 * @param {string} options.fullPrompt - Complete prompt to use
 * @returns {Promise<string|null>} - Generated image URL or null
 */
export async function regenerateSingleNodeImage(node, options = {}) {
  const { id, name } = node;
  const { deviceType, style, customPrompt, fullPrompt } = options;

  // Check if Recraft is configured
  if (!isRecraftConfigured()) {
    throw new Error('Recraft API not configured. Cannot generate images.');
  }

  try {
    console.log(`Regenerating image for node: ${name}`);
    console.log(`Options:`, { deviceType, style, customPrompt });

    // Import the necessary functions from recraftApi
    const { generateSVGImage, removeBackground } = await import('./recraftApi');

    // Step 1: Generate the image with custom options
    const result = await generateSVGImage(fullPrompt, {
      style: style || 'digital_illustration',
      size: '1024x1024',
      response_format: 'url'
    });

    if (!result || !result.data || !result.data[0]) {
      throw new Error(`Failed to generate image for ${name}`);
    }

    const generatedImageUrl = result.data[0].url;
    console.log(`Successfully generated image for ${name}: ${generatedImageUrl}`);

    // Step 2: Remove background to make it transparent
    console.log(`Removing background from image for ${name}...`);
    const transparentImageUrl = await removeBackground(generatedImageUrl);

    if (!transparentImageUrl) {
      console.warn(`Failed to remove background for ${name}, using original image`);
      // Use original image as fallback
    }

    const finalImageUrl = transparentImageUrl || generatedImageUrl;
    console.log(`Successfully created transparent image for ${name}: ${finalImageUrl}`);

    // Step 3: Upload to Cloudinary if configured (overwrite existing)
    if (isCloudinaryConfigured()) {
      const publicId = generateNodePublicId(id, name);
      console.log(`Uploading to Cloudinary with publicId: ${publicId} (will overwrite existing)`);

      const uploadResult = await uploadImageToCloudinary(finalImageUrl, publicId);

      if (uploadResult && uploadResult.secure_url) {
        const optimizedUrl = getOptimizedNodeImageUrl(publicId, 64);
        console.log(`Successfully uploaded and cached image for ${name}: ${optimizedUrl}`);

        // Update cache
        imageCache.set(id, optimizedUrl);
        saveCacheToStorage();

        return optimizedUrl;
      } else {
        console.warn(`Cloudinary upload failed for ${name}, using generated URL directly`);
      }
    }

    // If Cloudinary upload failed, cache the generated URL directly
    console.log(`Caching generated URL directly for ${name}`);
    imageCache.set(id, finalImageUrl);
    saveCacheToStorage();

    return finalImageUrl;
  } catch (error) {
    console.error(`Error regenerating image for node ${name}:`, error);
    throw error;
  }
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

