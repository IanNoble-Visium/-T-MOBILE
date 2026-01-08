# Image Generation Workflow - Test Cases

## Test Environment Setup

### Prerequisites
1. All environment variables configured in `.env`
2. Recraft API key is valid and has quota
3. Cloudinary account is active
4. Browser DevTools console is open
5. Network tab is open to monitor API calls

## Test Case 1: Initial Load with Missing Images

**Objective**: Verify that images are auto-generated when visualization loads

**Steps**:
1. Clear browser cache and localStorage
2. Navigate to Network Topology dashboard
3. Observe console logs

**Expected Results**:
- Console shows: "Auto-generating image for node node-047 (1/5)"
- Console shows: "Generating image for node: East Coast Gateway (type: gateway)"
- Console shows: "Calling Recraft API with prompt: Create high-resolution SVG icon..."
- Network tab shows POST request to `external.api.recraft.ai/v1/images/generations`
- Console shows: "Generated image URL for East Coast Gateway: https://..."
- Network tab shows POST request to `api.cloudinary.com/v1_1/<cloud_name>/image/upload`
- Console shows: "Successfully uploaded image to Cloudinary: tmobile/network-nodes/node-047_east_coast_gateway"
- Visualization shows custom SVG image instead of colored circle

**Pass Criteria**:
- ✓ At least 1 image is auto-generated
- ✓ No 404 errors in console
- ✓ Images appear in visualization
- ✓ Cloudinary upload succeeds

## Test Case 2: Rate Limiting

**Objective**: Verify that auto-generation is limited to 5 images per load

**Steps**:
1. Clear cache and localStorage
2. Navigate to Network Topology dashboard
3. Count auto-generation logs in console

**Expected Results**:
- Console shows exactly 5 "Auto-generating image for node" messages
- After 5 generations, no more auto-generation attempts
- Console shows: "Loaded X node images (5 auto-generated)"

**Pass Criteria**:
- ✓ Exactly 5 images are auto-generated
- ✓ No more than 5 Recraft API calls
- ✓ No more than 5 Cloudinary uploads

## Test Case 3: Caching

**Objective**: Verify that generated images are cached

**Steps**:
1. Complete Test Case 1
2. Refresh the page
3. Observe console logs

**Expected Results**:
- Console shows: "Loaded X node images (0 auto-generated)"
- No Recraft API calls
- No Cloudinary uploads
- Images still display in visualization

**Pass Criteria**:
- ✓ No new API calls on refresh
- ✓ Images load from cache
- ✓ Visualization displays cached images

## Test Case 4: Manual Generation

**Objective**: Verify that manual generation works for all nodes

**Steps**:
1. Click "Generate Node Images" button
2. Verify configuration status
3. Click "Generate Images"
4. Monitor progress bar
5. Wait for completion

**Expected Results**:
- Configuration shows: "Recraft API: Connected"
- Configuration shows: "Cloudinary: Connected"
- Progress bar shows: "1 / 50 nodes", "2 / 50 nodes", etc.
- Console shows generation logs for each node
- Completion message appears
- All nodes display custom SVG images

**Pass Criteria**:
- ✓ All nodes have images generated
- ✓ Progress bar updates correctly
- ✓ No errors during generation
- ✓ All images display in visualization

## Test Case 5: Error Handling - Missing API Key

**Objective**: Verify graceful handling when Recraft API key is missing

**Steps**:
1. Remove VITE_RECRAFT_API_KEY from .env
2. Restart dev server
3. Navigate to Network Topology dashboard

**Expected Results**:
- Console shows: "Recraft API not configured. Cannot generate images."
- No Recraft API calls
- Visualization displays colored circles (fallback)
- No errors or crashes

**Pass Criteria**:
- ✓ Graceful degradation
- ✓ No crashes
- ✓ Fallback to circles works

## Test Case 6: Error Handling - Cloudinary Upload Failure

**Objective**: Verify handling when Cloudinary upload fails

**Steps**:
1. Use invalid Cloudinary credentials
2. Navigate to Network Topology dashboard
3. Observe console logs

**Expected Results**:
- Console shows: "Cloudinary upload error: ..."
- Console shows: "Caching Recraft URL directly for [node name]"
- Images still display (using Recraft URL directly)
- No crashes

**Pass Criteria**:
- ✓ Graceful fallback to Recraft URL
- ✓ Images still display
- ✓ No crashes

## Test Case 7: Cloudinary Media Library

**Objective**: Verify images are properly stored in Cloudinary

**Steps**:
1. Complete Test Case 1 or 4
2. Go to https://cloudinary.com/console
3. Navigate to Media Library
4. Look for folder: tmobile/network-nodes

**Expected Results**:
- Folder exists: tmobile/network-nodes
- Images are present with names like:
  - node-047_east_coast_gateway
  - node-048_west_coast_gateway
  - node-049_primary_firewall
  - etc.
- Images are accessible and display correctly
- Image metadata shows upload timestamp

**Pass Criteria**:
- ✓ All generated images in Cloudinary
- ✓ Correct folder structure
- ✓ Images are accessible

## Test Case 8: Visualization Display

**Objective**: Verify images display correctly in visualization

**Steps**:
1. Complete Test Case 1 or 4
2. Observe node rendering
3. Hover over nodes
4. Click on nodes
5. Check alarmed nodes

**Expected Results**:
- Normal nodes: 24x24 pixel images
- Hovered nodes: 24x24 pixel images with opacity change
- Selected nodes: 32x32 pixel images
- Alarmed nodes: 28x28 pixel images with glow effect
- Images have proper aspect ratio
- No distortion or stretching

**Pass Criteria**:
- ✓ Images display at correct sizes
- ✓ Proper opacity changes on hover
- ✓ Proper sizing on selection
- ✓ Alarm effects work correctly

## Test Case 9: Performance

**Objective**: Verify performance is acceptable

**Steps**:
1. Open DevTools Performance tab
2. Complete Test Case 1
3. Record performance metrics
4. Refresh page and record again

**Expected Results**:
- Initial load: < 5 seconds
- Refresh (cached): < 1 second
- No memory leaks
- Smooth animations
- No jank or stuttering

**Pass Criteria**:
- ✓ Acceptable load times
- ✓ Smooth performance
- ✓ No memory issues

## Test Case 10: Accessibility

**Objective**: Verify accessibility features work

**Steps**:
1. Use keyboard navigation (Tab key)
2. Check ARIA labels in DevTools
3. Use screen reader (if available)
4. Check color contrast

**Expected Results**:
- Nodes are keyboard accessible
- ARIA labels are present
- Screen reader announces node information
- Color contrast meets WCAG AA standards

**Pass Criteria**:
- ✓ Keyboard navigation works
- ✓ ARIA labels present
- ✓ Screen reader compatible
- ✓ Color contrast acceptable

## Regression Testing

After fixes, verify these still work:
- [ ] Network topology visualization renders
- [ ] Nodes are clickable
- [ ] Edges are clickable
- [ ] Filters work correctly
- [ ] Layout options work
- [ ] Alarm highlighting works
- [ ] 3D view works
- [ ] Node detail panel works
- [ ] Alarm dashboard works

## Success Criteria

All test cases must pass:
- ✓ No 404 errors
- ✓ Images auto-generate on load
- ✓ Images are cached
- ✓ Manual generation works
- ✓ Error handling is graceful
- ✓ Images display correctly
- ✓ Performance is acceptable
- ✓ Accessibility works
- ✓ No regressions

