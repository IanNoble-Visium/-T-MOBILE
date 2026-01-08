# Quick Start: Individual Node Image Regeneration

## 🎯 Goal
Regenerate individual node images when they don't match the expected device type or appearance.

## 🚀 Quick Steps

### Step 1: Right-Click on a Node
In the Network Topology visualization, **right-click** on any node you want to regenerate.

### Step 2: Customize the Image
The Node Image Regenerator dialog will open with these options:

1. **Current Image Preview** - See what the node currently looks like
2. **Device Type** - Select the correct device type (Router, Switch, Firewall, Server, **Data Center**, etc.)
3. **AI Style** - Choose visual style (Digital Illustration, Realistic Image, Vector Illustration, Icon)
4. **Custom Prompt** - Add specific details (e.g., "with magenta lighting and glass facade")
5. **Full Prompt Preview** - See the complete prompt that will be sent to AI

### Step 3: Click "Regenerate Image"
- The system generates a new image
- Removes the background (transparent PNG)
- Uploads to Cloudinary
- Updates the visualization immediately

## 💡 Example: Fix Data Center Node

**Problem:** `node-001_new_york_data_center` shows a router icon instead of a building.

**Solution:**
1. Right-click on the node
2. Change **Device Type** to "Data Center"
3. Add **Custom Prompt**: `modern glass facade with magenta lighting, professional architectural visualization`
4. Select **Style**: "Realistic Image"
5. Click **"Regenerate Image"**

**Result:** ✅ Photorealistic data center building with T-Mobile branding!

## 🎨 Style Guide

### Digital Illustration (Default)
- Clean, modern tech illustrations
- Best for: Routers, switches, firewalls, servers
- Example: Minimalist network device icons

### Realistic Image
- Photorealistic rendering
- Best for: Data centers, buildings, physical infrastructure
- Example: Architectural visualization of data center

### Vector Illustration
- Flat, vector-style graphics
- Best for: Simple, clean icons
- Example: Flat design network diagrams

### Icon Style
- Simplified icon design
- Best for: Small, recognizable symbols
- Example: UI/UX style icons

## 📝 Custom Prompt Tips

### For Data Centers
```
modern glass facade with magenta lighting, professional architectural visualization
```

### For Routers with Branding
```
with magenta and cyan color scheme, T-Mobile branding
```

### For Security Devices
```
with prominent shield symbol and cybersecurity elements, glowing blue accents
```

### For Servers
```
modern rack-mounted server with LED indicators, enterprise data center equipment
```

## ⚡ Features

✅ **Real-time Updates** - See changes immediately in the visualization
✅ **Transparent Backgrounds** - All images have transparent backgrounds
✅ **High Resolution** - 1024x1024 pixel images
✅ **Cloudinary Storage** - Images stored in `tmobile/network-nodes/` folder
✅ **Cache Management** - Automatic cache updates
✅ **Error Handling** - Graceful fallbacks if generation fails

## 🔧 Technical Notes

- **Image Format**: PNG with transparent background
- **Resolution**: 1024x1024 pixels
- **Storage**: Cloudinary folder `tmobile/network-nodes/`
- **Naming**: `node-{id}_{sanitized_name}`
- **Overwrite**: Yes, regeneration overwrites the old image

## 🎯 Common Use Cases

### 1. Wrong Device Type
**Scenario:** Node shows wrong icon type
**Fix:** Change device type in the dialog

### 2. Need Custom Styling
**Scenario:** Need specific visual elements
**Fix:** Add custom prompt with details

### 3. Branding Requirements
**Scenario:** Need T-Mobile colors/branding
**Fix:** Add "with T-Mobile branding" to custom prompt

### 4. Different Visual Style
**Scenario:** Need realistic vs. illustration
**Fix:** Change AI style selector

## 📚 More Information

See `INDIVIDUAL_NODE_REGENERATION.md` for complete documentation including:
- Detailed API reference
- Component documentation
- Troubleshooting guide
- Advanced use cases

