/**
 * Recraft API Integration
 * Generates high-resolution SVG images for network devices
 */

const RECRAFT_API_URL = import.meta.env.VITE_RECRAFT_API_URL || 'https://external.api.recraft.ai/v1';
const RECRAFT_API_KEY = import.meta.env.VITE_RECRAFT_API_KEY;

/**
 * Generate an SVG image using Recraft API
 * @param {string} prompt - The prompt describing the image to generate
 * @param {Object} options - Additional options for image generation
 * @returns {Promise<Object>} - Response containing the image URL and metadata
 */
export async function generateSVGImage(prompt, options = {}) {
  if (!RECRAFT_API_KEY) {
    console.warn('Recraft API key not configured');
    return null;
  }

  try {
    const response = await fetch(`${RECRAFT_API_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RECRAFT_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        style: options.style || 'digital_illustration',
        model: options.model || 'recraftv3',
        response_format: options.format || 'url',
        size: options.size || '1024x1024',
        ...options
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Recraft API error:', error);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating SVG with Recraft:', error);
    return null;
  }
}

/**
 * Generate a network device SVG based on node type and name
 * @param {string} nodeName - Name of the network node
 * @param {string} nodeType - Type of the network node (router, switch, firewall, etc.)
 * @returns {Promise<string|null>} - URL of the generated SVG image
 */
export async function generateNetworkDeviceSVG(nodeName, nodeType) {
  const typePrompts = {
    router: 'high-resolution SVG icon of a modern network router with clean lines, professional tech style, minimalist design',
    switch: 'high-resolution SVG icon of a network switch with multiple ports, professional tech style, minimalist design',
    firewall: 'high-resolution SVG icon of a security firewall with shield symbol, professional tech style, minimalist design',
    server: 'high-resolution SVG icon of a modern server rack, professional tech style, minimalist design',
    endpoint: 'high-resolution SVG icon of a computer workstation, professional tech style, minimalist design',
    gateway: 'high-resolution SVG icon of a network gateway device, professional tech style, minimalist design',
    load_balancer: 'high-resolution SVG icon of a load balancer with distribution arrows, professional tech style, minimalist design',
    access_point: 'high-resolution SVG icon of a wireless access point with signal waves, professional tech style, minimalist design'
  };

  const basePrompt = typePrompts[nodeType] || typePrompts.router;
  const fullPrompt = `Create ${basePrompt} for T-Mobile network device: ${nodeName}`;

  const result = await generateSVGImage(fullPrompt, {
    style: 'digital_illustration',
    size: '512x512'
  });

  if (result && result.data && result.data[0]) {
    return result.data[0].url;
  }

  return null;
}

/**
 * Check if Recraft API is configured
 * @returns {boolean}
 */
export function isRecraftConfigured() {
  return !!RECRAFT_API_KEY;
}

