# Individual Node Image Regeneration Feature

## Overview
This feature allows you to regenerate individual node images in the network topology visualization with custom prompts, device types, and AI styles.

## How to Use

### 1. **Open the Regeneration Dialog**
- **Right-click** on any node in the network topology visualization
- The Node Image Regenerator dialog will open

### 2. **Customize the Image Generation**

#### **Current Image Preview**
- View the existing image for the selected node
- If no image exists, a placeholder will be shown

#### **Device Type Selector**
Choose from the following device types:
- Router
- Switch
- Firewall
- Server
- **Data Center** (new!)
- Endpoint
- Gateway
- Load Balancer
- Access Point

Each device type has a specific base prompt optimized for that device category.

#### **AI Style Selector**
Choose the visual style for the generated image:
- **Digital Illustration** (Default) - Clean, modern tech illustrations
- **Realistic Image** - Photorealistic rendering
- **Vector Illustration** - Flat, vector-style graphics
- **Icon Style** - Simplified icon design

#### **Custom Prompt (Optional)**
Add specific details to enhance the base prompt:
- Example: "with magenta lighting and glass facade"
- Example: "with T-Mobile branding and modern architecture"
- Example: "professional architectural visualization with night lighting"

#### **Full Prompt Preview**
- See the complete prompt that will be sent to Recraft AI
- This combines the base prompt (from device type) + node name + custom additions

### 3. **Regenerate the Image**
- Click the **"Regenerate Image"** button
- The system will:
  1. Generate a new image using Recraft AI with your custom prompt
  2. Remove the background to create a transparent PNG
  3. Upload the image to Cloudinary (overwriting the old image)
  4. Update the visualization immediately with the new image

### 4. **View the Results**
- The new image will appear in the network topology immediately
- The cache will be updated automatically
- The image is stored in Cloudinary at `tmobile/network-nodes/`

## Example Use Cases

### Use Case 1: Data Center Building
**Problem:** Node "node-001_new_york_data_center" shows a router icon instead of a data center building.

**Solution:**
1. Right-click on the node
2. Change Device Type to "Data Center"
3. Add custom prompt: "modern glass facade with magenta lighting, professional architectural visualization"
4. Select Style: "Realistic Image"
5. Click "Regenerate Image"

**Result:** A photorealistic data center building with T-Mobile branding

### Use Case 2: Custom Firewall Design
**Problem:** Need a more distinctive firewall icon with security emphasis.

**Solution:**
1. Right-click on the firewall node
2. Keep Device Type as "Firewall"
3. Add custom prompt: "with prominent shield symbol and cybersecurity elements, glowing blue accents"
4. Select Style: "Digital Illustration"
5. Click "Regenerate Image"

**Result:** A modern firewall icon with enhanced security visual elements

### Use Case 3: Branded Router
**Problem:** Router needs to match T-Mobile's visual identity.

**Solution:**
1. Right-click on the router node
2. Keep Device Type as "Router"
3. Add custom prompt: "with magenta and cyan color scheme, T-Mobile branding"
4. Select Style: "Vector Illustration"
5. Click "Regenerate Image"

**Result:** A clean vector router icon with T-Mobile colors

## Technical Details

### Image Generation Process
1. **Prompt Construction**
   - Base prompt from device type
   - Node name for context
   - Custom prompt additions
   - Combined into full prompt

2. **Recraft AI Generation**
   - Sends prompt to Recraft API
   - Uses selected style (digital_illustration, realistic_image, etc.)
   - Generates 1024x1024 high-resolution image

3. **Background Removal**
   - Automatically removes background
   - Creates transparent PNG
   - Ensures clean integration with dark UI

4. **Cloudinary Upload**
   - Uploads to `tmobile/network-nodes/` folder
   - Uses public_id: `node-{id}_{sanitized_name}`
   - Overwrites existing image (same public_id)

5. **Cache Update**
   - Updates in-memory cache
   - Updates localStorage cache
   - Triggers visualization refresh

### API Functions

#### `regenerateSingleNodeImage(node, options)`
Located in: `src/lib/nodeImageManager.js`

**Parameters:**
- `node` - Network node object with `id`, `name`, `type`
- `options` - Regeneration options:
  - `deviceType` - Device type for prompt
  - `style` - Recraft AI style
  - `customPrompt` - Custom prompt additions
  - `fullPrompt` - Complete prompt to use

**Returns:** Promise<string|null> - URL of the generated image

**Example:**
```javascript
import { regenerateSingleNodeImage } from '@/lib/nodeImageManager';

const newImageUrl = await regenerateSingleNodeImage(node, {
  deviceType: 'data_center',
  style: 'realistic_image',
  customPrompt: 'with glass facade and magenta lighting',
  fullPrompt: 'Create modern data center building with glass facade...'
});
```

### Component: NodeImageRegenerator

Located in: `src/components/NodeImageRegenerator.jsx`

**Props:**
- `node` - The node to regenerate image for
- `currentImageUrl` - URL of the current image
- `isOpen` - Dialog open state
- `onClose` - Close handler
- `onRegenerate` - Regeneration handler function

**Features:**
- Current image preview
- Device type selector
- AI style selector
- Custom prompt textarea
- Full prompt preview
- Error handling
- Loading states

### Integration with NetworkTopologyVisualizationEnhanced

**New Features:**
- Right-click context menu on nodes
- Opens NodeImageRegenerator dialog
- Real-time image updates after regeneration
- Updated help text: "Right-click nodes to regenerate image"

**Event Handlers:**
```javascript
.on('contextmenu', (event, d) => {
  event.preventDefault();
  event.stopPropagation();
  handleOpenRegenerator(d);
})
```

## Device Type Prompts

### Router
"high-resolution icon of a modern network router with clean lines, professional tech style, minimalist design"

### Switch
"high-resolution icon of a network switch with multiple ports, professional tech style, minimalist design"

### Firewall
"high-resolution icon of a security firewall with shield symbol, professional tech style, minimalist design"

### Server
"high-resolution icon of a modern server rack, professional tech style, minimalist design"

### Data Center
"modern data center building with glass facade and server infrastructure, professional architectural visualization"

### Endpoint
"high-resolution icon of a computer workstation, professional tech style, minimalist design"

### Gateway
"high-resolution icon of a network gateway device, professional tech style, minimalist design"

### Load Balancer
"high-resolution icon of a load balancer with distribution arrows, professional tech style, minimalist design"

### Access Point
"high-resolution icon of a wireless access point with signal waves, professional tech style, minimalist design"

## Troubleshooting

### Image Not Updating
- Check browser console for errors
- Verify Recraft API key is configured
- Verify Cloudinary credentials are configured
- Check network requests in DevTools

### Background Removal Failed
- The system will fallback to the original image
- Check console for "Failed to remove background" warning
- Original image will still be uploaded to Cloudinary

### Upload Failed
- Check Cloudinary configuration
- Verify API credentials
- Check console for upload errors
- Image will be cached locally as fallback

### Rate Limiting
- Recraft API has rate limits
- Individual regeneration has no built-in delay
- If you get rate limit errors, wait a few seconds between regenerations

## Future Enhancements

Potential improvements:
- Batch regeneration with custom prompts
- Image history/versioning
- Undo/redo functionality
- Image comparison (before/after)
- Save custom prompts as templates
- Export/import custom prompt library

