# Testing Header Features - Complete Guide

## Overview

This guide provides step-by-step instructions for testing all header component features across the T-Mobile TruContext Intelligence Platform.

## Prerequisites

- Application running on `http://localhost:5175`
- Logged in as Admin User
- Browser DevTools open (F12) for console monitoring

## Test Cases

### 1. Search Functionality

#### Test 1.1: Search Input Display
- [ ] Navigate to any dashboard
- [ ] Verify search bar is visible in header (desktop only)
- [ ] Placeholder text reads "Search threats, devices, incidents..."
- [ ] Search bar is responsive and properly styled

#### Test 1.2: Search Input Interaction
- [ ] Click on search bar
- [ ] Type a search term (e.g., "threat")
- [ ] Verify text appears in input field
- [ ] Verify clear button (✕) appears when text is entered
- [ ] Click clear button
- [ ] Verify search input is cleared

#### Test 1.3: Search Across Dashboards
- [ ] Navigate to Executive Dashboard
- [ ] Enter search term in header
- [ ] Navigate to different dashboard (e.g., Network Topology)
- [ ] Verify search term persists in header
- [ ] Clear search
- [ ] Verify search is cleared across all dashboards

#### Test 1.4: Search Context Integration
- [ ] Open browser DevTools Console
- [ ] Enter search term
- [ ] Check console for any errors
- [ ] Verify no React warnings about missing dependencies

### 2. Alarm Notification Dropdown

#### Test 2.1: Bell Icon Display
- [ ] Verify bell icon is visible in header (right side)
- [ ] Check if red pulsing dot appears (indicates active alarms)
- [ ] Verify pulsing animation is smooth

#### Test 2.2: Alarm Dropdown Opening
- [ ] Click bell icon
- [ ] Verify dropdown opens with smooth animation
- [ ] Dropdown displays "Active Alarms (X)" header
- [ ] Verify dropdown is positioned correctly (right-aligned)

#### Test 2.3: Alarm List Display
- [ ] Verify alarms are displayed in dropdown
- [ ] Check each alarm shows:
  - [ ] Severity icon (🔴🟠🟡🔵)
  - [ ] Alarm type
  - [ ] Severity badge (Critical/High/Medium/Low)
  - [ ] Description (truncated if long)
  - [ ] Affected nodes and edges count
  - [ ] Timestamp
  - [ ] Color-coded left border (matches severity)

#### Test 2.4: Alarm Interaction
- [ ] Click on an alarm in the dropdown
- [ ] Verify app navigates to relevant dashboard
- [ ] Verify alarm is highlighted or selected
- [ ] Go back to previous dashboard
- [ ] Click bell icon again
- [ ] Verify dropdown still shows the alarm

#### Test 2.5: Resolve Individual Alarm
- [ ] Click the checkmark icon on an alarm
- [ ] Verify alarm is removed from dropdown
- [ ] Verify alarm count decreases
- [ ] Verify red pulsing dot disappears if no more alarms

#### Test 2.6: Resolve All Alarms
- [ ] Verify "Resolve All Alarms" button is visible
- [ ] Click "Resolve All Alarms" button
- [ ] Verify all alarms are removed from dropdown
- [ ] Verify dropdown shows "No active alarms"
- [ ] Verify red pulsing dot disappears

#### Test 2.7: Dropdown Closing
- [ ] Click outside dropdown
- [ ] Verify dropdown closes
- [ ] Click bell icon again
- [ ] Verify dropdown reopens

### 3. User Profile Menu

#### Test 3.1: Profile Menu Display
- [ ] Verify user avatar is visible (magenta gradient circle)
- [ ] Verify user name "Admin User" is displayed
- [ ] Verify user role "Security Operations" is displayed
- [ ] Verify chevron icon indicates dropdown

#### Test 3.2: Profile Menu Opening
- [ ] Click on user profile area
- [ ] Verify dropdown menu opens
- [ ] Verify menu shows user info
- [ ] Verify menu items are visible:
  - [ ] User Preferences
  - [ ] Logout

#### Test 3.3: Profile Menu Closing
- [ ] Click outside menu
- [ ] Verify menu closes
- [ ] Click profile area again
- [ ] Verify menu reopens

### 4. User Preferences Modal

#### Test 4.1: Opening Preferences
- [ ] Click user profile menu
- [ ] Click "User Preferences"
- [ ] Verify modal opens with smooth animation
- [ ] Verify modal title is "User Preferences"
- [ ] Verify close button (X) is visible

#### Test 4.2: Theme Selection
- [ ] Verify theme options are displayed (Light/Dark)
- [ ] Click "Light" button
- [ ] Verify button is highlighted
- [ ] Click "Dark" button
- [ ] Verify button is highlighted

#### Test 4.3: Notification Settings
- [ ] Verify "Enable notifications" checkbox
- [ ] Check the checkbox
- [ ] Verify "Sound alerts" checkbox becomes enabled
- [ ] Uncheck "Enable notifications"
- [ ] Verify "Sound alerts" checkbox becomes disabled

#### Test 4.4: Default Dashboard Selection
- [ ] Verify dropdown shows current selection
- [ ] Click dropdown
- [ ] Verify all options are available:
  - [ ] Executive Dashboard
  - [ ] AI Analytics
  - [ ] Network Topology
  - [ ] Geographic Map
  - [ ] Cyber Defense Center
- [ ] Select different option
- [ ] Verify selection updates

#### Test 4.5: Saving Preferences
- [ ] Make changes to preferences
- [ ] Click "Save Preferences"
- [ ] Verify modal closes
- [ ] Open preferences again
- [ ] Verify changes are persisted
- [ ] Check localStorage in DevTools:
  - [ ] Open DevTools → Application → LocalStorage
  - [ ] Verify `userPreferences` key exists
  - [ ] Verify settings are saved correctly

#### Test 4.6: Cancel Button
- [ ] Open preferences modal
- [ ] Make changes
- [ ] Click "Cancel"
- [ ] Verify modal closes without saving
- [ ] Open preferences again
- [ ] Verify changes were not saved

### 5. Settings Panel

#### Test 5.1: Opening Settings
- [ ] Click gear icon in header
- [ ] Verify settings panel opens
- [ ] Verify panel title is "Settings"
- [ ] Verify close button (X) is visible

#### Test 5.2: Data Source Configuration
- [ ] Verify data source options:
  - [ ] Neo4j (Live)
  - [ ] Mock Data (Demo)
- [ ] Verify Neo4j status indicator
- [ ] Check connection status (Connected/Disconnected)
- [ ] Select different data source
- [ ] Verify selection updates

#### Test 5.3: Auto-Refresh Settings
- [ ] Verify "Auto-refresh data" checkbox
- [ ] Check the checkbox
- [ ] Verify refresh interval input appears
- [ ] Verify default value is 30 seconds
- [ ] Change interval to 60 seconds
- [ ] Uncheck "Auto-refresh data"
- [ ] Verify interval input becomes disabled

#### Test 5.4: Dashboard Layout
- [ ] Verify layout dropdown
- [ ] Verify options:
  - [ ] Default Layout
  - [ ] Compact Layout
  - [ ] Wide Layout
- [ ] Select different layout
- [ ] Verify selection updates

#### Test 5.5: Export Settings
- [ ] Click "Export" button
- [ ] Verify file download starts
- [ ] Check downloaded file:
  - [ ] Filename format: `tmobile-settings-[timestamp].json`
  - [ ] File contains settings JSON
  - [ ] File is valid JSON

#### Test 5.6: Saving Settings
- [ ] Make changes to settings
- [ ] Click "Save Settings"
- [ ] Verify panel closes
- [ ] Open settings again
- [ ] Verify changes are persisted
- [ ] Check localStorage:
  - [ ] Verify `appSettings` key exists
  - [ ] Verify settings are saved correctly

#### Test 5.7: Cancel Button
- [ ] Open settings panel
- [ ] Make changes
- [ ] Click "Cancel"
- [ ] Verify panel closes without saving
- [ ] Open settings again
- [ ] Verify changes were not saved

### 6. Logout Functionality

#### Test 6.1: Logout Process
- [ ] Click user profile menu
- [ ] Click "Logout"
- [ ] Verify app redirects to login page
- [ ] Verify session is cleared

#### Test 6.2: Session Cleanup
- [ ] Open DevTools → Application → LocalStorage
- [ ] Verify the following keys are cleared:
  - [ ] `authToken`
  - [ ] `userPreferences`
  - [ ] `appSettings`

### 7. Responsive Design

#### Test 7.1: Desktop View (1920x1080)
- [ ] Verify all header elements are visible
- [ ] Verify search bar is visible
- [ ] Verify all icons are properly spaced
- [ ] Verify time display is visible

#### Test 7.2: Tablet View (768x1024)
- [ ] Resize browser to tablet size
- [ ] Verify header is responsive
- [ ] Verify search bar is visible
- [ ] Verify all functionality works

#### Test 7.3: Mobile View (375x667)
- [ ] Resize browser to mobile size
- [ ] Verify menu icon appears
- [ ] Verify search bar is hidden
- [ ] Verify all icons are accessible
- [ ] Verify dropdowns work correctly

### 8. Cross-Dashboard Testing

#### Test 8.1: Search Across All Dashboards
- [ ] Test search on each dashboard:
  - [ ] Executive Dashboard
  - [ ] AI Analytics
  - [ ] Network Topology
  - [ ] Geographic Map
  - [ ] Cyber Defense Center
  - [ ] SASE Platform
  - [ ] IoT Security Hub
  - [ ] Threat Protect
  - [ ] Graph Analytics
  - [ ] Threat Intelligence

#### Test 8.2: Alarms Across All Dashboards
- [ ] Verify alarm dropdown works on each dashboard
- [ ] Verify alarm navigation works correctly
- [ ] Verify alarm resolution works on each dashboard

#### Test 8.3: User Menu Across All Dashboards
- [ ] Verify user menu works on each dashboard
- [ ] Verify preferences modal works on each dashboard
- [ ] Verify settings panel works on each dashboard

## Performance Testing

### Test 9.1: Search Performance
- [ ] Enter search term
- [ ] Verify no lag or delay
- [ ] Monitor DevTools Performance tab
- [ ] Verify no excessive re-renders

### Test 9.2: Alarm Dropdown Performance
- [ ] Open alarm dropdown with many alarms
- [ ] Verify smooth scrolling
- [ ] Monitor DevTools Performance tab
- [ ] Verify no memory leaks

### Test 9.3: Modal Performance
- [ ] Open preferences modal
- [ ] Verify smooth animation
- [ ] Close modal
- [ ] Verify smooth animation
- [ ] Repeat multiple times
- [ ] Monitor DevTools Memory tab

## Browser Compatibility

Test on the following browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Accessibility Testing

- [ ] Verify keyboard navigation works
- [ ] Verify tab order is logical
- [ ] Verify focus indicators are visible
- [ ] Verify color contrast meets WCAG standards
- [ ] Test with screen reader (if available)

## Bug Reporting

If you find any issues:

1. **Document the issue:**
   - Browser and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable

2. **Check console for errors:**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Include error messages in report

3. **Check localStorage:**
   - Verify settings are saved correctly
   - Check for any corrupted data

---

**Last Updated:** October 17, 2025
**Version:** 1.0

