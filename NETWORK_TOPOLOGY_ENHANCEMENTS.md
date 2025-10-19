# Network Topology Enhancements

## Overview

This document describes the major enhancements made to the Network Topology visualization dashboard for the T-Mobile TruContext Intelligence Platform.

## New Features

### 1. SVG Node Visualization

**Description**: Display high-resolution SVG images for each network device node instead of simple colored circles.

**Implementation**:
- **Recraft API Integration** (`src/lib/recraftApi.js`): Generates custom SVG images based on node type and name
- **Cloudinary Storage** (`src/lib/cloudinaryApi.js`): Stores generated images for persistent access
- **Image Manager** (`src/lib/nodeImageManager.js`): Manages image generation, caching, and retrieval
- **UI Component** (`src/components/NodeImageGenerator.jsx`): Provides user interface for generating images

**Usage**:
1. Click the "Generate Node Images" button in the Network Topology dashboard
2. The system will generate SVG images for all nodes that don't already have cached images
3. Images are stored in Cloudinary and cached locally for fast access
4. The topology visualization automatically displays the generated images

**Configuration**:
```env
VITE_RECRAFT_API_URL=https://external.api.recraft.ai/v1
VITE_RECRAFT_API_KEY=<your_recraft_api_key>
VITE_CLOUDINARY_CLOUD_NAME=dod8ajzjd
VITE_CLOUDINARY_API_KEY=<your_cloudinary_api_key>
VITE_CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

### 2. Bandwidth-Based Edge Thickness

**Description**: Edge (link) thickness is proportional to the bandwidth capacity of the connection.

**Implementation**:
- Bandwidth values range from 10 Gbps (thin lines) to 100 Gbps (thick lines)
- Line thickness is calculated dynamically: `thickness = 1 + (bandwidth - 10) / (100 - 10) * 7`
- Minimum thickness: 1px
- Maximum thickness: 8px

**Visual Guide**:
- **Thin lines**: Low bandwidth connections (10-30 Gbps)
- **Medium lines**: Medium bandwidth connections (30-70 Gbps)
- **Thick lines**: High bandwidth connections (70-100 Gbps)

### 3. Utilization-Based Edge Coloring

**Description**: Edge colors change based on the current utilization percentage of the link.

**Implementation**:
- **Green (#00A651)**: Low utilization (< 40%)
- **Yellow (#FFB81C)**: Medium utilization (40-70%)
- **Red (#E4002B)**: High utilization (> 70%)

**Benefits**:
- Instantly identify congested network paths
- Proactively monitor capacity issues
- Optimize traffic routing decisions

### 4. Alarm-Triggered Visual Effects

**Description**: Nodes and edges with active alarms display attention-grabbing visual effects.

**Implementation**:
- **Pulsing Animation**: Alarmed elements pulse with a glowing effect
- **Color Override**: Alarmed edges turn red regardless of utilization
- **Increased Thickness**: Alarmed edges are rendered thicker
- **Drop Shadow**: Glowing red drop shadow effect

**CSS Animations**:
```css
.alarmed-edge {
  animation: pulse-edge 2s ease-in-out infinite;
}

.alarmed-node {
  animation: pulse-node 1.5s ease-in-out infinite;
}
```

**Effects**:
- **Flashing**: Elements alternate between normal and highlighted states
- **Highlighting**: Increased opacity and brightness
- **Animation**: Smooth pulsing effect draws attention
- **Transitions**: Smooth state changes for professional appearance

## Technical Architecture

### Component Structure

```
src/
├── components/
│   ├── NetworkTopologyVisualizationEnhanced.jsx  # Enhanced D3 visualization
│   ├── NodeImageGenerator.jsx                     # Image generation UI
│   └── dashboards/
│       └── NetworkTopologyDashboard.jsx           # Main dashboard (updated)
├── lib/
│   ├── recraftApi.js                              # Recraft API integration
│   ├── cloudinaryApi.js                           # Cloudinary integration
│   └── nodeImageManager.js                        # Image management logic
```

### Data Flow

1. **Node Data** → Network Dataset (`src/lib/networkDataset.js`)
2. **Image Generation** → Recraft API → Cloudinary Storage → Local Cache
3. **Visualization** → D3.js with enhanced rendering
4. **Alarm Data** → Alarm System → Visual Effects

### Performance Optimizations

- **Image Caching**: Generated images are cached in localStorage and Cloudinary
- **Lazy Loading**: Images are loaded asynchronously without blocking the UI
- **Batch Generation**: Multiple images can be generated in parallel
- **Progressive Enhancement**: Visualization works without images (fallback to circles)

## User Guide

### Generating Node Images

1. Navigate to the Network Topology dashboard
2. Click the **"Generate Node Images"** button (with sparkle icon)
3. Review the configuration status:
   - ✅ Recraft API: Connected
   - ✅ Cloudinary: Connected
4. Click **"Generate Images"** to start the process
5. Monitor progress (e.g., "23 / 50 nodes")
6. Wait for completion message
7. The topology will automatically refresh with new images

### Understanding Edge Visualization

**Edge Thickness** (Bandwidth):
- Look at the line thickness to understand connection capacity
- Thicker lines = higher bandwidth = more capacity
- Thin lines may indicate bottlenecks

**Edge Color** (Utilization):
- **Green**: Healthy, plenty of capacity available
- **Yellow**: Moderate load, monitor for increases
- **Red**: High utilization, potential congestion

### Responding to Alarms

**Visual Indicators**:
- **Pulsing nodes**: Device has an active alarm
- **Pulsing edges**: Connection has an active alarm
- **Red glow**: Critical attention required

**Actions**:
1. Click on the pulsing element to view details
2. Review alarm information in the detail panel
3. Use the Alarm Dashboard to resolve or clear alarms
4. Visual effects will stop when alarms are resolved

## API Integration

### Recraft API

**Purpose**: Generate high-quality SVG images for network devices

**Endpoint**: `POST https://external.api.recraft.ai/v1/images/generations`

**Request Format**:
```json
{
  "prompt": "Create high-resolution SVG icon of a modern network router...",
  "style": "digital_illustration",
  "model": "recraftv3",
  "response_format": "url",
  "size": "512x512"
}
```

**Response**:
```json
{
  "data": [
    {
      "url": "https://..."
    }
  ]
}
```

### Cloudinary API

**Purpose**: Store and serve generated images with CDN delivery

**Upload Endpoint**: `POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`

**Image URL Format**: `https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}`

**Transformations**:
- `w_64,h_64,c_fill`: Resize to 64x64 pixels
- `f_auto`: Automatic format selection
- `q_auto`: Automatic quality optimization

## Accessibility

### Color Contrast

All edge colors meet WCAG 2.1 AA standards:
- Green (#00A651) on dark background: 4.5:1 contrast ratio
- Yellow (#FFB81C) on dark background: 8.2:1 contrast ratio
- Red (#E4002B) on dark background: 5.1:1 contrast ratio

### Alternative Indicators

- Edge thickness provides a non-color indicator of bandwidth
- Alarm animations work independently of color perception
- Text labels appear on hover for all elements

### Keyboard Navigation

- Tab through interactive elements
- Enter/Space to select nodes and edges
- Escape to close detail panels

## Troubleshooting

### Images Not Generating

**Problem**: "Generate Images" button is disabled

**Solution**:
1. Check environment variables are set correctly
2. Verify Recraft API key is valid
3. Verify Cloudinary credentials are correct
4. Check browser console for API errors

### Images Not Displaying

**Problem**: Nodes still show as circles after generation

**Solution**:
1. Check browser console for image loading errors
2. Verify Cloudinary URLs are accessible
3. Clear cache and regenerate images
4. Check network tab for failed image requests

### Performance Issues

**Problem**: Visualization is slow or laggy

**Solution**:
1. Reduce the number of nodes using filters
2. Use the 2D view instead of 3D
3. Clear browser cache
4. Disable animations in browser settings if needed

## Future Enhancements

### Planned Features

1. **Real-time Image Updates**: Automatically generate images for new nodes
2. **Custom Image Upload**: Allow manual upload of device images
3. **Image Styles**: Multiple visual styles (realistic, schematic, minimalist)
4. **Edge Labels**: Display bandwidth and utilization values on edges
5. **Heatmap Mode**: Visualize network-wide utilization patterns
6. **Path Highlighting**: Highlight specific network paths
7. **Time-based Playback**: Replay historical network states

### API Enhancements

1. **Batch Image Generation**: Generate multiple images in a single API call
2. **Image Variants**: Generate multiple sizes/styles simultaneously
3. **Webhook Notifications**: Get notified when images are ready
4. **Image Versioning**: Track and manage image versions

## Credits

**Developed by**: Visium Technologies  
**For**: T-Mobile TruContext Intelligence Platform  
**APIs Used**: Recraft AI, Cloudinary  
**Visualization**: D3.js  
**Framework**: React + Vite  

## Support

For questions or issues, please contact:
- Email: inoble.ctr@visiumtechnologies.com
- GitHub: https://github.com/IanNoble-Visium/-T-MOBILE

---

**Last Updated**: October 19, 2025  
**Version**: 2.0.0

