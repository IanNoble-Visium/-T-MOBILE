# AI Agents Dashboard - Testing Guide

## Quick Start

### 1. Access the Application
```
URL: http://localhost:5173
```

### 2. Login
```
Email: admin@tmobile.com
Password: TruContext2025!
Check: "Remember me" (optional)
Click: "Sign In"
```

### 3. Navigate to AI Agents
- Click "AI Agents" in the sidebar (Bot icon)
- Or use the navigation menu

---

## Testing Scenarios

### Scenario 1: Dashboard Overview
**Objective:** Verify AI Agents dashboard displays correctly

**Steps:**
1. Login to application
2. Click "AI Agents" in sidebar
3. Verify the following elements display:
   - ✅ Dashboard title: "AI Agents Dashboard"
   - ✅ Subtitle showing number of agents
   - ✅ "Create Agent" button (magenta)
   - ✅ "Agent Marketplace" button
   - ✅ KPI cards (4 cards showing metrics)
   - ✅ Agent Status Panel with agent grid
   - ✅ Performance Metrics section
   - ✅ Activity Feed on the right
   - ✅ Agent Collaboration section
   - ✅ Training Scenarios section

**Expected Result:** All elements display without errors

---

### Scenario 2: KPI Cards
**Objective:** Verify KPI cards show correct data

**Steps:**
1. On AI Agents dashboard, look at the top 4 KPI cards
2. Verify each card displays:
   - ✅ Title (Active Agents, Threats Detected, Avg Response Time, Agent Efficiency)
   - ✅ Value (number or percentage)
   - ✅ Subtitle (additional info)
   - ✅ Trend indicator (+12%, +8%, etc.)
   - ✅ Icon (Bot, TrendingUp, Clock, Zap)

**Expected Result:** All KPI cards display with correct formatting

---

### Scenario 3: Agent Grid
**Objective:** Verify agent cards display and update

**Steps:**
1. Scroll to "Agent Status Panel"
2. Verify agent grid displays:
   - ✅ Multiple agent cards (40 agents)
   - ✅ Each card shows: agent name, status, model, efficiency, accuracy
   - ✅ Color-coded status badges (green=active, orange=investigating, red=responding, gray=idle)
   - ✅ Performance indicators (🟢 High Performance, 🟡 Average, 🔴 Needs Attention)
3. Wait 3 seconds and observe:
   - ✅ Agent metrics update in real-time
   - ✅ Activity feed updates with new activities

**Expected Result:** Agents display correctly and update in real-time

---

### Scenario 4: Create Agent Wizard
**Objective:** Test the agent creation wizard

**Steps:**
1. Click "Create Agent" button (top right)
2. Verify wizard modal opens with:
   - ✅ Step indicator (1/6)
   - ✅ Step title and description
   - ✅ Form fields for current step
   - ✅ "Next" and "Back" buttons
3. Fill in Step 1 (Agent Basics):
   - Enter name: "Test Agent"
   - Enter nickname: "TestBot"
   - Enter description: "Test agent for demo"
   - Click "Next"
4. Verify Step 2 (Model Selection):
   - ✅ Model dropdown shows options (GPT-4, Claude, Gemini, etc.)
   - ✅ Select a model
   - Click "Next"
5. Continue through remaining steps:
   - Step 3: Role/Purpose
   - Step 4: Prompt Template
   - Step 5: Integration Settings
   - Step 6: Review & Deploy
6. Click "Deploy Agent" on final step
7. Verify:
   - ✅ Modal closes
   - ✅ New agent appears in grid
   - ✅ Agent count increases

**Expected Result:** Wizard completes and new agent is created

---

### Scenario 5: Agent Marketplace
**Objective:** Test marketplace deployment

**Steps:**
1. Click "Agent Marketplace" button
2. Verify marketplace modal opens with:
   - ✅ Search bar
   - ✅ Category filter
   - ✅ Sort options
   - ✅ Agent template cards
3. Browse templates:
   - ✅ Each template shows name, description, rating, downloads
   - ✅ Categories visible (Security, Network Monitoring, etc.)
4. Click "Deploy" on a template
5. Verify:
   - ✅ Modal closes
   - ✅ New agent appears in grid
   - ✅ Agent uses template settings

**Expected Result:** Marketplace agent deploys successfully

---

### Scenario 6: Activity Feed
**Objective:** Verify real-time activity updates

**Steps:**
1. Look at "Live Activity Feed" on the right
2. Observe activities:
   - ✅ Each activity shows severity badge (CRITICAL, HIGH, MEDIUM, LOW)
   - ✅ Category badge (Vulnerability, Malware, Phishing, etc.)
   - ✅ Agent name and action
   - ✅ Timestamp
3. Wait and observe:
   - ✅ New activities appear at top
   - ✅ Activities update every 3 seconds
   - ✅ Smooth animations

**Expected Result:** Activity feed updates in real-time

---

### Scenario 7: Performance Metrics
**Objective:** Verify performance metrics display

**Steps:**
1. Scroll to "Performance Metrics" section
2. Verify metrics display:
   - ✅ Detection Speed (2.3s avg) with progress bar
   - ✅ False Positive Rate (3.2%) with progress bar
   - ✅ System Uptime (99.8%) with progress bar
   - ✅ Agent Utilization (87%) with progress bar
3. Verify progress bars:
   - ✅ Correct width based on percentage
   - ✅ Color-coded (green, blue, purple, orange)

**Expected Result:** All metrics display correctly

---

### Scenario 8: Logout
**Objective:** Test logout functionality

**Steps:**
1. Click user profile icon (top right)
2. Click "Logout"
3. Verify:
   - ✅ Redirected to login page
   - ✅ All session data cleared
   - ✅ Can login again with credentials

**Expected Result:** Logout works and redirects to login

---

### Scenario 9: Navigation
**Objective:** Test navigation between dashboards

**Steps:**
1. From AI Agents dashboard, click another dashboard in sidebar
2. Verify:
   - ✅ Dashboard changes
   - ✅ Sidebar highlights correct item
3. Click "AI Agents" again
4. Verify:
   - ✅ AI Agents dashboard loads
   - ✅ Data is preserved

**Expected Result:** Navigation works smoothly

---

### Scenario 10: Responsive Design
**Objective:** Test on different screen sizes

**Steps:**
1. Open browser DevTools (F12)
2. Test on different breakpoints:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
3. Verify:
   - ✅ Layout adapts to screen size
   - ✅ All elements visible
   - ✅ No horizontal scrolling
   - ✅ Touch-friendly on mobile

**Expected Result:** Responsive design works on all sizes

---

## Performance Testing

### Load Time
- Expected: < 2 seconds
- Measure: Open DevTools → Network tab → Reload

### Real-time Updates
- Expected: Smooth updates every 3 seconds
- Measure: Watch activity feed and agent metrics

### Memory Usage
- Expected: < 100 MB
- Measure: Open DevTools → Memory tab

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Known Limitations

1. **Mock Data:** All agent data is generated randomly
2. **No Persistence:** Data resets on page refresh
3. **No Real AI:** Agents don't actually run AI models
4. **No Database:** Uses localStorage only

---

## Troubleshooting

### Issue: Dashboard doesn't load
**Solution:** 
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (F5)
- Check console for errors (F12)

### Issue: Logout doesn't work
**Solution:**
- Clear localStorage manually
- Restart dev server
- Check browser console for errors

### Issue: Agents don't update
**Solution:**
- Wait 3 seconds for update interval
- Check browser console for errors
- Verify JavaScript is enabled

---

## Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
OS: ___________

Scenario 1 (Dashboard Overview): ☐ PASS ☐ FAIL
Scenario 2 (KPI Cards): ☐ PASS ☐ FAIL
Scenario 3 (Agent Grid): ☐ PASS ☐ FAIL
Scenario 4 (Create Agent): ☐ PASS ☐ FAIL
Scenario 5 (Marketplace): ☐ PASS ☐ FAIL
Scenario 6 (Activity Feed): ☐ PASS ☐ FAIL
Scenario 7 (Performance Metrics): ☐ PASS ☐ FAIL
Scenario 8 (Logout): ☐ PASS ☐ FAIL
Scenario 9 (Navigation): ☐ PASS ☐ FAIL
Scenario 10 (Responsive): ☐ PASS ☐ FAIL

Overall Result: ☐ PASS ☐ FAIL

Notes:
_________________________________
_________________________________
```

---

**Last Updated:** October 17, 2025
**Version:** 1.0

