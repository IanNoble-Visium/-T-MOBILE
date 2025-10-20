/**
 * Recraft API Integration
 * Generates high-resolution SVG images for network devices
 */

const RECRAFT_API_URL = import.meta.env.VITE_RECRAFT_API_URL || 'https://external.api.recraft.ai/v1';
const RECRAFT_API_KEY = import.meta.env.VITE_RECRAFT_API_KEY;

/**
 * Generate an image using Recraft API
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
    console.log(`Calling Recraft API with prompt: ${prompt}`);
    console.log(`API URL: ${RECRAFT_API_URL}/images/generations`);
    console.log(`API Key (first 20 chars): ${RECRAFT_API_KEY.substring(0, 20)}...`);

    const requestBody = {
      prompt,
      style: options.style || 'digital_illustration',
      model: options.model || 'recraftv3',
      response_format: options.format || 'url',
      size: options.size || '1024x1024',
      ...options
    };

    // Remove unsupported parameters
    delete requestBody.background;

    console.log(`Request body:`, requestBody);

    const response = await fetch(`${RECRAFT_API_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RECRAFT_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`Recraft API response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let error;

      if (contentType && contentType.includes('application/json')) {
        error = await response.json();
      } else {
        error = await response.text();
      }

      console.error('Recraft API error:', error);
      console.error('Response status:', response.status);
      return null;
    }

    const data = await response.json();
    console.log(`Recraft API response:`, data);
    console.log(`Recraft API response keys:`, Object.keys(data));
    if (data.data) {
      console.log(`Recraft API data array:`, data.data);
      if (data.data[0]) {
        console.log(`Recraft API first item:`, data.data[0]);
        console.log(`Recraft API first item keys:`, Object.keys(data.data[0]));
      }
    }
    return data;
  } catch (error) {
    console.error('Error generating image with Recraft:', error);
    console.error('Error details:', error.message);
    return null;
  }
}

/**
 * Remove background from an image using Recraft API
 * @param {string} imageUrl - URL of the image to process
 * @returns {Promise<string|null>} - URL of the image with transparent background
 */
export async function removeBackground(imageUrl) {
  if (!RECRAFT_API_KEY) {
    console.warn('Recraft API key not configured');
    return null;
  }

  try {
    console.log(`Removing background from image: ${imageUrl}`);

    // Fetch the image as a blob
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('Failed to fetch image for background removal');
      return null;
    }
    const imageBlob = await imageResponse.blob();

    // Create form data
    const formData = new FormData();
    formData.append('file', imageBlob, 'image.png');
    formData.append('response_format', 'url');

    const response = await fetch(`${RECRAFT_API_URL}/images/removeBackground`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RECRAFT_API_KEY}`
      },
      body: formData
    });

    console.log(`Remove background API response status: ${response.status}`);

    if (!response.ok) {
      const error = await response.json();
      console.error('Remove background API error:', error);
      return null;
    }

    const data = await response.json();
    console.log(`Remove background API response:`, data);

    if (data && data.image && data.image.url) {
      console.log(`Successfully removed background: ${data.image.url}`);
      return data.image.url;
    }

    console.warn('Remove background API returned unexpected format:', data);
    return null;
  } catch (error) {
    console.error('Error removing background:', error);
    console.error('Error details:', error.message);
    return null;
  }
}

/**
 * Generate a network device image with transparent background based on node type and name
 * @param {string} nodeName - Name of the network node
 * @param {string} nodeType - Type of the network node (router, switch, firewall, etc.)
 * @returns {Promise<string|null>} - URL of the generated image with transparent background
 */
export async function generateNetworkDeviceSVG(nodeName, nodeType) {
  const typePrompts = {
    router: 'high-resolution icon of a modern network router with clean lines, professional tech style, minimalist design',
    switch: 'high-resolution icon of a network switch with multiple ports, professional tech style, minimalist design',
    firewall: 'high-resolution icon of a security firewall with shield symbol, professional tech style, minimalist design',
    server: 'high-resolution icon of a modern server rack, professional tech style, minimalist design',
    endpoint: 'high-resolution icon of a computer workstation, professional tech style, minimalist design',
    gateway: 'high-resolution icon of a network gateway device, professional tech style, minimalist design',
    load_balancer: 'high-resolution icon of a load balancer with distribution arrows, professional tech style, minimalist design',
    access_point: 'high-resolution icon of a wireless access point with signal waves, professional tech style, minimalist design'
  };

  const basePrompt = typePrompts[nodeType] || typePrompts.router;
  const fullPrompt = `Create ${basePrompt} for T-Mobile network device: ${nodeName}`;

  console.log(`Generating network device image for ${nodeName} (type: ${nodeType})`);
  console.log(`Will remove background to create transparent PNG`);

  // Step 1: Generate the image
  const result = await generateSVGImage(fullPrompt, {
    style: 'digital_illustration',
    size: '1024x1024',
    response_format: 'url'
  });

  if (!result || !result.data || !result.data[0]) {
    console.warn(`Failed to generate image for ${nodeName}. Result:`, result);
    return null;
  }

  const generatedImageUrl = result.data[0].url;
  console.log(`Successfully generated image for ${nodeName}: ${generatedImageUrl}`);

  // Step 2: Remove background to make it transparent
  console.log(`Removing background from image for ${nodeName}...`);
  const transparentImageUrl = await removeBackground(generatedImageUrl);

  if (!transparentImageUrl) {
    console.warn(`Failed to remove background for ${nodeName}, using original image`);
    return generatedImageUrl; // Fallback to original image if background removal fails
  }

  console.log(`Successfully created transparent image for ${nodeName}: ${transparentImageUrl}`);
  return transparentImageUrl;
}

/**
 * Check if Recraft API is configured
 * @returns {boolean}
 */
export function isRecraftConfigured() {
  return !!RECRAFT_API_KEY;
}

