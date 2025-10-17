# T-Mobile TruContext Intelligence Platform Demo

A comprehensive security intelligence platform demo showcasing the integration of T-Mobile's 5G network capabilities with Visium Technologies' TruContext analytics engine.

## Overview

This demo application presents a unified security operations platform that combines:

- **T-Mobile 5G Advanced Network** - Ultra-low latency, high-bandwidth connectivity
- **SASE Security Platform** - Powered by Palo Alto Networks Precision AI
- **Cyber Defense Center** - 24/7 SOC with threat hunting and digital forensics
- **IoT Security Hub** - Comprehensive IoT device management and security
- **TruContext Graph Analytics** - Graph-based threat analysis and relationship discovery

## Features

### Header & Navigation (NEW - October 17, 2025)
- **Functional Search Bar** - Real-time filtering across dashboard content
- **Alarm Notifications** - Interactive dropdown showing active alarms with severity indicators
- **User Profile Menu** - Quick access to preferences and logout
- **User Preferences Modal** - Theme selection, notification settings, default dashboard
- **Settings Panel** - Data source configuration, auto-refresh, layout preferences
- **Cross-Dashboard Integration** - Consistent search and notifications across all screens

### Executive Dashboard
- Real-time KPIs and security metrics
- Competitive advantage analysis (vs. Verizon, AT&T)
- Network health monitoring
- Cost savings visualization
- Live security event stream

### SASE Platform Dashboard
- T-SIMsecure and Device Client deployment metrics
- Zero Trust Network Access (ZTNA) enforcement
- Palo Alto Networks Precision AI threat detection
- Malware, ransomware, and phishing blocking statistics
- URL filtering and IPS activations

### Cyber Defense Center Dashboard
- **NEW** - Launched October 15, 2025
- Active incident management
- Threat hunting operations
- Digital forensics investigations
- 24/7 SOC team status
- Real-time alert monitoring

### Threat Protect Dashboard
- **ENHANCED** - Fully functional with live data integration
- Real-time endpoint protection monitoring
- VPN security with encrypted traffic analytics
- Malicious site blocking and URL filtering
- Threat intelligence with type and severity analysis
- Device protection coverage across endpoints, mobile, IoT, and network devices
- Live threat feed with auto-refresh
- Comprehensive security posture metrics
- 24/7 always-on protection status

### T-Platform Dashboard
- Unified network management
- 5G coverage and performance metrics
- Bandwidth utilization
- Network slicing and edge computing

### IoT Security Hub Dashboard
- NB-IoT, LTE-M, and 5G device tracking
- Device health monitoring
- Behavioral anomaly detection
- Firmware update management
- Security alert tracking

### Graph Analytics Dashboard
- **NEW** - Immersive 3D Network Topology Visualization
- TruContext-powered graph visualization with cyberpunk 3D rendering
- Interactive 3D network topology with 48 nodes and 76 connections
- Orbital camera controls for full 360° exploration
- Glowing neon nodes with regional color clustering (6 regions)
- Pulsating energy beam connections with data flow animations
- Hover tooltips with detailed node metrics and infrastructure data
- Real-time network statistics overlay
- Attack path identification and relationship discovery

### Threat Intelligence Dashboard
- Global threat landscape
- Geographic threat distribution
- MITRE ATT&CK technique mapping
- Threat event timeline

### AI Security Analytics Dashboard
- **NEW** - Natural language query interface powered by Google Gemini AI
- **Query Enhancement** - AI-powered context enrichment with sparkle (✨) icon
- **Conversational Intelligence** - Ask questions about security data in plain English
- **Dashboard Context Awareness** - Real-time security status integration
- **Suggested Queries** - Pre-built questions organized by category
- **SQL Transparency** - View generated queries for each response
- **Chat History** - Full conversation tracking with timestamps
- **Database Integration** - PostgreSQL backend with live data querying

### AI Agent Management Dashboard
- **NEW** - Launched October 17, 2025
- **Real-time Agent Monitoring** - Track 40 AI agents scanning T-Mobile network for threats
- **Agent Wizard Creator** - 6-step wizard to create custom AI agents
  - Agent Basics (name, nickname, description)
  - Model Selection (GPT-4, Claude, Gemini, Llama, Mistral)
  - Role/Purpose Definition
  - Prompt Template Configuration
  - Integration Settings
  - Review & Deploy
- **Agent Marketplace** - Deploy pre-built agent templates
  - 24 pre-configured templates across 6 categories
  - Search, filter, and sort functionality
  - One-click deployment
- **Agent Detail Modal** - Comprehensive agent information viewer
  - Overview tab with basic info and key metrics
  - Performance tab with efficiency, accuracy, response time
  - Configuration tab with prompt templates and integrations
  - Activity tab with recent actions timeline
- **Live Performance Metrics** - Real-time KPI cards
  - Active Agents count with idle agent tracking
  - Threats Detected (24h) with critical incident count
  - Average Response Time monitoring
  - Agent Efficiency percentage
- **Agent Status Panel** - Grid view of all agents with:
  - Status indicators (Active, Idle, Investigating, Responding)
  - Performance indicators (🟢 High, 🟡 Average, 🔴 Needs Attention)
  - Model information and current tasks
  - Efficiency progress bars
  - Quick action buttons
- **Activity Feed** - Real-time agent activity stream
  - Severity badges (CRITICAL, HIGH, MEDIUM, LOW)
  - Category badges (Vulnerability, Malware, Phishing, etc.)
  - Auto-updating every 3 seconds
- **Agent Collaboration** - Multi-agent analysis tracking
- **Training Scenarios** - Agent training and simulation management

## Technology Stack

### Frontend
- **Framework**: React 19 with Vite
- **UI Components**: shadcn/ui with Tailwind CSS
- **3D Visualization**: React Three Fiber with Three.js and three-stdlib
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend
- **Server**: Node.js with Express
- **Database**: PostgreSQL (Neon Cloud)
- **AI Service**: Google Gemini 2.5 Flash (Latest stable model)
- **Real-time**: CORS-enabled API
- **Auto-reload**: Nodemon for development

### Frontend
- **Framework**: React 19 with Vite
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Markdown**: react-markdown for formatted AI responses

## Design System

### Color Palette
- **T-Mobile Magenta**: `#E20074`
- **TruContext Blue**: `#0066CC`
- **Success Green**: `#00A651`
- **Warning Yellow**: `#FFB81C`
- **Danger Red**: `#E4002B`

### Typography
- Professional, clean sans-serif fonts
- Clear hierarchy with bold headings
- Readable body text with proper contrast

### Dark Theme
- Modern dark background for reduced eye strain
- High contrast for data visibility
- Accent colors for important metrics

## Data Architecture

### Database (PostgreSQL)
The application now uses a **PostgreSQL database** hosted on Neon with the following schema:

- **threat_events**: 500+ security threats with geographic data and MITRE techniques
- **devices**: 1,000+ monitored devices (IoT, mobile, endpoints, network)
- **incidents**: 20+ security incidents with status tracking
- **kpi_metrics**: 30 days of time-series KPI data
- **network_metrics**: Comprehensive network and SASE performance metrics
- **event_stream**: 100+ real-time security events

### AI-Powered Natural Language Queries
The **AI Analytics Dashboard** uses Google Gemini AI to:
1. Convert natural language questions into safe SQL queries
2. Execute queries against the PostgreSQL database
3. Generate human-readable explanations of results
4. Enhance vague queries with current dashboard context

**Example Query Flow:**
```
User: "What's happening?"
↓ (Click ✨ to enhance)
Enhanced: "What's happening with our security posture? Include current 
threat levels (2,847 detected, 2,721 blocked), active incidents (8), 
network health (96%), and any critical alerts."
↓ (AI generates SQL)
SQL: "SELECT * FROM kpi_metrics ORDER BY timestamp DESC LIMIT 1..."
↓ (Execute & explain)
AI Response: "Your security posture is strong. We've detected 2,847 
threats in the last 24 hours and successfully blocked 2,721 of them..."
```

**Note**: Mock data generators are still available in `src/lib/mockData.js` for reference, but all dashboards can now optionally use live database data.

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm package manager (recommended) or npm
- PostgreSQL database (Neon account) - optional for AI features
- Google Gemini API key - optional for AI features

### Installation & Running

1. **Install dependencies**
```bash
pnpm install
```

2. **Environment Variables (Optional - for AI features)**

Create a `.env` file in the root directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
POSTGRES_URL=your_postgresql_connection_string
PORT=3001
NODE_ENV=development
```

3. **Run the Application**

**Option A: Frontend + Backend together**
```bash
pnpm start
```

**Option B: Run separately**
```bash
# Terminal 1 - Backend API
pnpm run server:dev

# Terminal 2 - Frontend
pnpm run dev
```

4. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001 (if running backend)

### Build for Production
```bash
# Build frontend
pnpm run build

# Preview production build
pnpm run preview
```

For detailed setup instructions, see [Quick Start Guide](docs/guides/QUICK_START.md).

## Documentation

For detailed documentation, guides, and technical references, see the [docs/](docs/) folder:

### Guides
- [Quick Start Guide](docs/guides/QUICK_START.md) - Installation and basic setup
- [Presentation Guide](docs/guides/PRESENTATION_GUIDE.md) - Tips for presenting the demo
- [AI Analytics Setup](docs/guides/AI_ANALYTICS_SETUP.md) - AI features configuration
- [Network Topology Guide](docs/guides/NETWORK_TOPOLOGY_GUIDE.md) - Network visualization features

### Technical Documentation
- [Neo4j Integration](docs/technical/NEO4J_INTEGRATION.md) - Neo4j database integration
- [Neo4j Testing](docs/technical/NEO4J_TESTING.md) - Testing Neo4j features
- [Network Topology Implementation](docs/technical/NETWORK_TOPOLOGY_IMPLEMENTATION.md) - Implementation details
- [Implementation Summary](docs/technical/IMPLEMENTATION_SUMMARY.md) - Complete implementation overview
- [AI Confidence Scores](docs/technical/AI_CONFIDENCE_SCORES.md) - AI model confidence metrics

### Security
- [Security Remediation Report](SECURITY_REMEDIATION_REPORT.md) - Security incident details
- [Immediate Actions Required](IMMEDIATE_ACTION_REQUIRED.md) - Critical security actions

## Deployment

The application is optimized for static hosting and can be deployed to:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any static hosting service

## Recent Updates

### October 17, 2025 - Production Readiness & Bug Fixes

**✅ Critical Bug Fixes for Demo Readiness**

All critical issues have been resolved to ensure a flawless demo experience:

1. **Authentication & Session Management** ✅
   - Fixed logout functionality to properly clear all auth data
   - Enhanced session management with localStorage and sessionStorage
   - Implemented proper redirect flow after logout
   - Fixed landing page display on initial load

2. **KPICard Component Error Resolution** ✅
   - Fixed "Element type is invalid" error across all dashboards
   - Updated 7 dashboards with 27 KPI cards total
   - Changed icon prop handling from component references to JSX elements
   - Consistent icon sizing (w-6 h-6) across all dashboards
   - **Affected Dashboards:**
     - Executive Dashboard (4 cards)
     - Cyber Defense Dashboard (4 cards)
     - Threat Protect Dashboard (4 cards)
     - SASE Dashboard (4 cards)
     - IoT Dashboard (4 cards)
     - T-Platform Dashboard (3 cards)
     - AI Agents Dashboard (4 cards)

3. **AI Agents Dashboard - Full Implementation** ✅
   - Complete agent management system with 40 active agents
   - Real-time monitoring with 3-second update intervals
   - Agent Wizard Creator (6-step process)
   - Agent Marketplace (24 pre-built templates)
   - **NEW: Agent Detail Modal** - Comprehensive agent information viewer
     - 4 tabbed sections (Overview, Performance, Configuration, Activity)
     - Performance metrics with progress bars
     - Configuration details with prompt templates
     - Recent activity timeline
     - Action buttons (Pause, Edit, Deactivate)
   - Fixed performance warnings on "View Details" click
   - Smooth modal animations and transitions

4. **useAlarmSystem Hook Fix** ✅
   - Resolved "Maximum update depth exceeded" error
   - Implemented useRef guard to prevent infinite loops
   - Optimized dependency array for proper effect execution

**Status:** ✅ **ALL SYSTEMS READY FOR DEMO**
- Zero console errors
- All dashboards functional
- All features working correctly
- Smooth user experience
- Production-ready performance

### October 2025 - Threat Protect Dashboard Enhancement

**✅ Fully Functional Threat Protect Dashboard**
- Complete rebuild from placeholder to production-ready dashboard
- **Live PostgreSQL Integration**: Real-time data from threat_events, devices, network_metrics, and event_stream tables
- **Auto-Refresh**: Dashboard updates every 10 seconds with latest threat intelligence
- **Graceful Fallback**: Switches to mock data if backend API is unavailable

**Dashboard Components:**

1. **KPI Metrics (4 Real-Time Cards)**
   - Protected Endpoints - Total monitored devices across all types
   - Threats Blocked (24h) - Dynamic block rate percentage calculation
   - VPN Connections - Active secure encrypted connections
   - Malicious Sites Blocked - URL filtering event tracking

2. **Protection Status Monitor**
   - Endpoint Protection with live coverage percentage and device count
   - VPN Security status with active connection metrics
   - Threat Intelligence feed synchronization (15 sources)
   - URL Filtering with real-time blocking statistics

3. **Interactive Data Visualizations**
   - Device Protection Coverage (Pie Chart) - Endpoints, Mobile, IoT, Network distribution
   - Threats by Type (Bar Chart) - Malware, Phishing, Ransomware breakdown
   - Threats by Severity (Pie Chart) - Critical, High, Medium, Low categorization

4. **VPN Security Section**
   - Active connection metrics with 100% encryption rate display
   - Security features: AES-256 Encryption, Split Tunneling, Kill Switch, DNS Leak Protection
   - All features with live status indicators

5. **Malicious Site Blocking Analytics**
   - Malware sites blocked counter
   - Phishing attempts blocked counter
   - Ransomware prevention statistics
   - Total blocked sites aggregation
   - 28 active URL filtering categories (Malware, Phishing, Gambling, Adult, Spam)

6. **Recent Threats Table**
   - Live-updating table with last 10 blocked threats
   - Columns: ID, Type, Severity, Source Country, Status, Timestamp
   - Color-coded severity badges (Critical, High, Medium, Low)
   - Status icons (blocked/active) with visual indicators

7. **Overall Security Posture Dashboard**
   - Block Rate percentage with "Excellent" rating
   - Average Security Score from all monitored devices
   - Compliance Rate percentage across device fleet
   - 24/7 Always-On protection coverage indicator

**Technical Implementation:**
- **API Endpoints Used**: `/api/data/kpi-metrics/latest`, `/api/data/network-metrics/latest`, `/api/data/threat-events`, `/api/data/devices/stats`, `/api/data/event-stream`, `/api/data/threat-stats`
- **Loading States**: Professional spinner during data fetch
- **Error Handling**: Comprehensive try-catch with fallback to mock data
- **Performance**: Optimized with useEffect hooks and 10-second refresh intervals
- **Responsive Design**: Mobile-friendly grid layouts with Tailwind CSS
- **Chart Library**: Recharts with custom dark theme styling

### October 2025 - AI Analytics Enhancements

**✅ Google Gemini 2.5 Flash Integration**
- Updated from deprecated Gemini 1.5 models to the latest **Gemini 2.5 Flash** stable model
- Improved response quality and speed
- Enhanced support for complex security data analysis
- 1M+ token context window for processing large datasets

**✅ Markdown-Formatted AI Responses**
- Implemented `react-markdown` for rich text formatting
- AI responses now display with:
  - **Bold emphasis** for important terms and findings
  - *Italic text* for contextual notes
  - Bulleted and numbered lists for organized information
  - Code blocks for SQL queries and technical details
  - Headers for structured sections
  - Blockquotes for highlights
- Custom CSS styling matching the application's dark theme
- Enhanced readability and professional presentation

**✅ Improved User Experience**
- Real-time query enhancement with dashboard context
- Collapsible SQL query viewer to see generated queries
- Smooth chat interface with auto-scrolling
- Timestamp tracking for all conversations
- Professional error handling with clear messaging

### October 2025 - Immersive 3D Network Topology Visualization

**✅ High-Wow-Factor 3D Network Visualization**
- Complete transformation of Graph Analytics dashboard with immersive 3D rendering
- **React Three Fiber Integration**: Professional 3D graphics engine for smooth performance
- **Geographic Network Mapping**: 48 infrastructure nodes positioned on 3D globe using real lat/lon coordinates
- **Cyberpunk Visual Design**: Dark space background with neon color palette and glowing effects

**3D Visualization Features:**

1. **Interactive 3D Scene**
   - Orbital camera controls (mouse drag to rotate, wheel to zoom)
   - Smooth 60fps animations with WebGL acceleration
   - Professional lighting with cyan and pink accent lights
   - Responsive canvas that fills dashboard container

2. **Network Node Representation**
   - **48 Glowing Neon Nodes** with infrastructure type-based colors:
     - Data Centers: Magenta (#E20074)
     - Cell Towers: Blue (#0066CC)
     - Routers: Green (#00A651)
     - Switches: Yellow (#FFB81C)
     - Gateways: Red (#E4002B)
     - Firewalls: Purple (#9C27B0)
   - Pulsating scale animations for visual impact
   - Regional color-coded glowing auras

3. **Connection Visualization**
   - **76 Pulsating Energy Beams** connecting infrastructure nodes
   - Cyan-colored lines with opacity pulsing effects
   - Yellow data flow particles along connection paths
   - Dynamic animations showing network data transmission

4. **Regional Clustering**
   - **6 Geographic Regions** with vibrant cyberpunk colors:
     - Northeast: Hot Pink (#FF0080)
     - West: Cyan (#00FFFF)
     - Midwest: Yellow (#FFFF00)
     - South: Orange Red (#FF4500)
     - Pacific: Purple (#8000FF)
     - Southeast: Lime Green (#00FF00)
   - Visual grouping for network topology understanding

5. **Interactive Features**
   - **Hover Tooltips**: Detailed node information on mouse hover
     - Node type, region, status, capacity, location, vendor, model
     - Professional cyberpunk-styled overlay with monospace font
   - **Real-time Stats Overlay**: Live network metrics in bottom-right corner
     - Node count, connection count, regions covered, active systems
   - **Responsive Controls**: Smooth camera movement with spherical coordinates

**Technical Implementation:**
- **React Three Fiber**: Declarative 3D rendering with React components
- **Three.js stdlib**: OrbitControls and 3D math utilities
- **Custom Camera System**: Spherical coordinate-based orbital controls
- **Performance Optimized**: Efficient rendering with proper component separation
- **Error Handling**: Graceful fallbacks and proper hook usage
- **Cyberpunk Styling**: Dark theme with neon accents and glowing effects

**User Experience Impact:**
- Transforms static placeholder into immersive 3D exploration experience
- Enables intuitive understanding of complex network topologies
- Provides "wow factor" for executive presentations and demos
- Maintains professional appearance while delivering cutting-edge visuals
- Fully integrated with existing dashboard navigation and data systems

## AI Analytics Features

### Natural Language Query Examples

**Security Overview:**
- "Give me a security overview for today"
- "What's the current threat landscape?"
- "Show me the most critical issues"

**Threats:**
- "Show me all critical threats from the last 24 hours"
- "What are the most common threat types this week?"
- "Which countries are the top sources of attacks?"

**Devices:**
- "How many IoT devices are monitored?"
- "Show me devices with low security posture"
- "Which devices have detected the most threats?"

**Incidents:**
- "What incidents are currently open?"
- "Show me high severity incidents"
- "What incidents were resolved this week?"

**Network:**
- "What is the current network health status?"
- "Show me bandwidth utilization trends"
- "How many devices are currently connected?"

### Query Enhancement Feature

The **sparkle (✨) icon** next to the query input enhances your question with real-time context:

1. Type a general question like "What's happening?"
2. Click the ✨ sparkle icon
3. AI enriches your query with current metrics from all dashboards
4. Get a more detailed, contextual response

### API Endpoints

**Data APIs** (`/api/data/*`):
- `GET /kpi-metrics/latest` - Latest KPI metrics
- `GET /threat-events` - Threat events with filters
- `GET /devices` - Device information
- `GET /incidents` - Security incidents
- `GET /event-stream` - Real-time events
- `GET /dashboard-summary` - Overall summary

**AI APIs** (`/api/ai/*`):
- `POST /query` - Natural language query
- `POST /enhance-query` - Context-aware query enhancement
- `GET /dashboard-context` - Current dashboard state
- `GET /suggested-queries` - Categorized query suggestions

## Integration Roadmap

To connect this demo to live T-Mobile systems:

1. **Database Integration** ✅ - PostgreSQL with comprehensive schema
2. **AI Integration** ✅ - Google Gemini AI for natural language queries
3. **Add Authentication**: Implement T-Mobile SSO/OAuth integration
4. **Connect to SASE API**: Integrate with Palo Alto Networks API
5. **Connect to T-Platform**: Integrate with T-Mobile network management APIs
6. **Connect to IoT Hub**: Integrate with T-Mobile IoT platform APIs
7. **Connect to TruContext**: Integrate with Visium TruContext graph database (Neo4j)
8. **Add WebSocket Support**: Enable real-time data streaming for live updates

## Key Differentiators

### Why T-Mobile + TruContext Wins

1. **Speed**: 2-minute threat detection vs. 15-20 minutes for competitors
2. **Coverage**: 98% threat detection accuracy with Precision AI
3. **Cost**: 95% cost efficiency vs. traditional SIEM solutions
4. **Innovation**: Graph-based analytics reveal hidden attack paths
5. **Integration**: Unified platform across SASE, IoT, and network management
6. **5G Advantage**: Ultra-low latency enables real-time threat response
7. **AI Intelligence**: Natural language querying makes security data accessible to everyone
8. **Context Awareness**: AI-powered query enhancement provides deeper insights
9. **Immersive Visualization**: Cutting-edge 3D network topology with cyberpunk aesthetics

## Documentation

### Header Features & Navigation
- **[Header Enhancements Guide](docs/guides/HEADER_ENHANCEMENTS.md)** - Comprehensive guide to all header features
- **[Quick Reference](docs/guides/HEADER_QUICK_REFERENCE.md)** - Quick lookup for header features and shortcuts
- **[Testing Guide](docs/guides/TESTING_HEADER_FEATURES.md)** - Complete testing checklist for all header features
- **[Search Implementation](docs/guides/IMPLEMENTING_SEARCH_IN_DASHBOARDS.md)** - How to add search to your dashboard

### Technical Documentation
- **[Neo4j Integration](docs/technical/NEO4J_INTEGRATION.md)** - Database integration details
- **[Architecture Overview](docs/technical/ARCHITECTURE.md)** - System architecture and design patterns
- **[API Reference](docs/technical/API_REFERENCE.md)** - Backend API endpoints

### Implementation Guides
- **[Network Topology Implementation](docs/guides/NETWORK_TOPOLOGY_GUIDE.md)** - Network visualization setup
- **[AI Analytics Setup](docs/guides/AI_ANALYTICS_SETUP.md)** - AI integration guide

## Presentation Tips

### Recommended Demo Flow

1. **Start with Executive Dashboard** to show overall value proposition
   - Highlight key metrics and competitive advantages
   - Show real-time security event stream
   - Emphasize cost savings and network health

2. **Demo the AI Agents Dashboard** 🤖 (NEW - High Impact!)
   - Show 40 AI agents actively monitoring the network
   - Click "View Details" on an agent to open the comprehensive modal
   - Navigate through the 4 tabs (Overview, Performance, Configuration, Activity)
   - Demonstrate the Agent Wizard Creator (6-step process)
   - Browse the Agent Marketplace and deploy a template
   - Highlight real-time updates (agents update every 3 seconds)
   - Show performance indicators (🟢 High, 🟡 Average, 🔴 Needs Attention)
   - Emphasize the activity feed with live threat detection

3. **Demo the AI Analytics Dashboard** to showcase natural language intelligence
   - Ask: "Show me all critical threats from the last 24 hours"
   - Use the ✨ sparkle icon to demonstrate query enhancement
   - Show how non-technical users can query security data
   - Demonstrate the markdown-formatted responses

4. **Showcase the IMMERSIVE 3D NETWORK TOPOLOGY** in Graph Analytics
   - Demonstrate orbital camera controls (drag to rotate, scroll to zoom)
   - Hover over nodes to show detailed infrastructure information
   - Highlight regional clustering with vibrant cyberpunk colors
   - Point out the pulsating energy beams and data flow animations
   - Show the real-time network statistics overlay

5. **Demo the ENHANCED Threat Protect Dashboard** to showcase real-time endpoint protection
   - Show live threat blocking with auto-refreshing data
   - Highlight VPN security features and malicious site blocking
   - Demonstrate device protection coverage across all device types
   - Show the real-time threat feed and security posture metrics

6. **Highlight the Cyber Defense Center** as a competitive differentiator
   - Show active incident management
   - Demonstrate threat hunting operations
   - Highlight 24/7 SOC capabilities

7. **Show SASE Platform** to emphasize Palo Alto Precision AI integration
   - Demonstrate Zero Trust Network Access (ZTNA)
   - Show threat detection and blocking statistics

8. **Demonstrate Header Features** (Interactive Elements)
   - Show functional search bar
   - Click alarm notifications dropdown
   - Open user preferences modal
   - Access settings panel
   - Demonstrate logout functionality

### Key Talking Points

- **AI-Powered Security**: 40 AI agents working 24/7 to protect the network
- **Real-time Intelligence**: All dashboards update in real-time with live data
- **Natural Language Queries**: Anyone can ask security questions in plain English
- **Immersive Visualization**: Cutting-edge 3D network topology
- **PostgreSQL Database Integration**: Production-ready data architecture
- **Google Gemini AI**: Latest AI technology for intelligent analysis
- **Zero Console Errors**: Production-ready, fully tested application

## License

Proprietary - Visium Technologies & T-Mobile

## Contact

For questions about this demo or TruContext platform:
- **Visium Technologies**: [https://www.visiumtechnologies.com](https://www.visiumtechnologies.com)
- **T-Mobile Business**: [https://www.t-mobile.com/business](https://www.t-mobile.com/business)

---

**Built with ❤️ by Visium Technologies for T-Mobile**
