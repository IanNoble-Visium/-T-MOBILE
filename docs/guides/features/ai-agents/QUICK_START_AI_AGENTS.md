# AI Agents Dashboard - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Dev Server
```bash
npm run dev
```
Server runs on: **http://localhost:5173**

### Step 2: Login
```
Email: admin@tmobile.com
Password: TruContext2025!
```

### Step 3: Navigate to AI Agents
Click **"AI Agents"** in the sidebar (Bot icon 🤖)

---

## 📊 Dashboard Overview

### What You'll See
```
┌─────────────────────────────────────────────────────────┐
│ AI Agents Dashboard                                     │
│ Real-time monitoring of 40 AI agents                    │
│                                                         │
│ [Create Agent] [Agent Marketplace]                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Active Agents: 13  │ Threats: 247  │ Response: 2.3s   │
│ Efficiency: 87%                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Agent Status Panel          │ Live Activity Feed       │
│ ┌─────────────────────┐     │ ┌──────────────────┐    │
│ │ Agent-1  🟢 Active  │     │ CRITICAL Threat  │    │
│ │ Agent-2  🟡 Idle    │     │ HIGH Malware     │    │
│ │ Agent-3  🔴 Needs   │     │ MEDIUM Anomaly   │    │
│ │ ...                 │     │ ...              │    │
│ └─────────────────────┘     │ └──────────────────┘    │
│                                                         │
│ Performance Metrics                                     │
│ Detection Speed: ████████░ 85%                         │
│ False Positives: ██░░░░░░░ 12%                        │
│ System Uptime:   ██████████ 99.8%                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### 1. Create Agent (Wizard)
```
Click "Create Agent" → 6-step wizard
├── Step 1: Agent Basics (name, nickname, description)
├── Step 2: Model Selection (GPT-4, Claude, Gemini, etc.)
├── Step 3: Role/Purpose
├── Step 4: Prompt Template
├── Step 5: Integration Settings
└── Step 6: Review & Deploy
```

### 2. Agent Marketplace
```
Click "Agent Marketplace" → Browse templates
├── Search by name
├── Filter by category
├── Sort by rating/downloads
└── Click "Deploy" to add agent
```

### 3. Monitor Agents
```
Real-time updates every 3 seconds
├── Agent metrics (efficiency, accuracy, response time)
├── Activity feed (threats, findings, actions)
├── Performance indicators (🟢 High, 🟡 Average, 🔴 Needs Attention)
└── Collaboration status
```

---

## 🎨 UI Elements

### Status Indicators
- 🟢 **Green** - High Performance (efficiency > 80%, false positives < 5%)
- 🟡 **Yellow** - Average Performance
- 🔴 **Red** - Needs Attention (efficiency < 60%, false positives > 10%)

### Severity Badges
- 🔴 **CRITICAL** - Red badge
- 🟠 **HIGH** - Orange badge
- 🟡 **MEDIUM** - Yellow badge
- 🔵 **LOW** - Blue badge

### Agent Status
- 🟢 **Active** - Agent is running
- 🟡 **Idle** - Agent is waiting
- 🟠 **Investigating** - Agent is analyzing
- 🔴 **Responding** - Agent is taking action

---

## 📱 Responsive Design

### Desktop (1920x1080)
- Full dashboard with all elements visible
- 3-column layout (agents, metrics, activity)

### Tablet (768x1024)
- Stacked layout
- Scrollable sections
- Touch-friendly buttons

### Mobile (375x667)
- Single column
- Collapsible sections
- Optimized for touch

---

## 🔧 Troubleshooting

### Issue: Dashboard doesn't load
```
Solution:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page (F5)
3. Check console (F12) for errors
```

### Issue: Logout doesn't work
```
Solution:
1. Clear localStorage manually
2. Restart dev server (npm run dev)
3. Check browser console for errors
```

### Issue: Agents don't update
```
Solution:
1. Wait 3 seconds for update interval
2. Check browser console for errors
3. Verify JavaScript is enabled
```

### Issue: Wizard doesn't open
```
Solution:
1. Check browser console for errors
2. Verify all UI components are loaded
3. Try refreshing the page
```

---

## 📊 Mock Data

### Agents
- **Count:** 40 agents
- **Types:** Threat Hunter, Vulnerability Scanner, Anomaly Detector, Incident Responder
- **Models:** GPT-4, Claude, Gemini, etc.
- **Status:** Randomly distributed (active, idle, investigating, responding)

### Activities
- **Count:** 50 activities
- **Types:** Vulnerability, Malware, Phishing, DDoS, Intrusion, Data Exfiltration, Anomaly, Prevention
- **Update Interval:** Every 3 seconds

### Metrics
- **Active Agents:** 13
- **Threats Detected (24h):** 247
- **Avg Response Time:** 2.3s
- **Agent Efficiency:** 87%

---

## 🔐 Authentication

### Login Credentials
```
Email: admin@tmobile.com
Password: TruContext2025!
```

### Remember Me
- ✅ Checked: Stores auth in localStorage (persistent)
- ☐ Unchecked: Stores auth in sessionStorage (session only)

### Logout
```
Click user profile (top right) → Click "Logout"
→ Clears all auth data → Redirects to login
```

---

## 📚 Documentation

### Available Guides
- `docs/guides/AI_AGENTS_TESTING_GUIDE.md` - 10 detailed test scenarios
- `AI_AGENTS_FIXES_SUMMARY.md` - Technical details of fixes
- `AI_AGENTS_IMPLEMENTATION_COMPLETE.md` - Full implementation details

---

## 🎓 Learning Path

### Beginner
1. Login to application
2. Navigate to AI Agents dashboard
3. Observe real-time updates
4. Review KPI metrics

### Intermediate
1. Create a new agent using wizard
2. Deploy an agent from marketplace
3. Monitor agent performance
4. Review activity feed

### Advanced
1. Analyze agent collaboration
2. Review performance metrics
3. Understand agent types and roles
4. Explore training scenarios

---

## 🚀 Next Steps

### Immediate
- [ ] Test login/logout flow
- [ ] Explore AI Agents dashboard
- [ ] Create a test agent
- [ ] Deploy marketplace agent

### Short-term
- [ ] Test all dashboard features
- [ ] Verify responsive design
- [ ] Test on different browsers
- [ ] Review performance

### Medium-term
- [ ] Implement search functionality
- [ ] Add agent detail modal
- [ ] Implement agent collaboration
- [ ] Add advanced analytics

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `F12` - Open browser DevTools
- `Ctrl+Shift+Delete` - Clear browser cache
- `F5` - Refresh page
- `Ctrl+K` - Focus search (future feature)

### Performance Tips
- Use Chrome for best performance
- Clear cache if experiencing issues
- Close other tabs for better performance
- Monitor console for errors (F12)

### Testing Tips
- Wait 3 seconds between actions for updates
- Check console for any error messages
- Test on multiple browsers
- Test on different screen sizes

---

## 📞 Support

### Quick Help
1. Check this guide first
2. Review testing guide: `docs/guides/AI_AGENTS_TESTING_GUIDE.md`
3. Check browser console (F12)
4. Review error messages

### Common Issues
- **Page doesn't load:** Clear cache and refresh
- **Logout doesn't work:** Restart dev server
- **Agents don't update:** Wait 3 seconds
- **Wizard doesn't open:** Check console for errors

---

## 🎉 You're Ready!

The AI Agents dashboard is fully functional and ready to explore. Start by logging in and navigating to the AI Agents section to see it in action!

**Happy exploring! 🚀**

---

**Last Updated:** October 17, 2025
**Version:** 1.0
**Status:** ✅ READY TO USE

