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
- TruContext-powered graph visualization
- Network topology analysis
- Attack path identification
- Relationship discovery

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

## Technology Stack

### Frontend
- **Framework**: React 19 with Vite
- **UI Components**: shadcn/ui with Tailwind CSS
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

## Installation

### Prerequisites
- Node.js 18+
- pnpm package manager
- PostgreSQL database (Neon account) - optional for AI features
- Google Gemini API key - optional for AI features

### Setup

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

3. **Database Setup (Optional - for AI features)**
```bash
# Run database migration to create tables and populate with sample data
node server/db/migrate.js
```

4. **Run the Application**

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

5. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001 (if running backend)
- AI Analytics: Navigate to "AI Analytics" in sidebar

### Build for Production
```bash
# Build frontend
pnpm run build

# Preview production build
pnpm run preview
```

## Deployment

The application is optimized for static hosting and can be deployed to:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any static hosting service

## Recent Updates

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

## Presentation Tips

- Start with **Executive Dashboard** to show overall value proposition
- Demo the **NEW AI Analytics Dashboard** to showcase natural language intelligence
  - Ask: "Show me all critical threats from the last 24 hours"
  - Use the ✨ sparkle icon to demonstrate query enhancement
  - Show how non-technical users can query security data
- Highlight the **Cyber Defense Center** as a competitive differentiator
- Use **Graph Analytics** to demonstrate TruContext's unique capabilities
- Show **SASE Platform** to emphasize Palo Alto Precision AI integration
- Demonstrate **real-time updates** by refreshing the event streams
- Emphasize the **PostgreSQL database integration** and **Google Gemini AI** capabilities

## License

Proprietary - Visium Technologies & T-Mobile

## Contact

For questions about this demo or TruContext platform:
- **Visium Technologies**: [https://www.visiumtechnologies.com](https://www.visiumtechnologies.com)
- **T-Mobile Business**: [https://www.t-mobile.com/business](https://www.t-mobile.com/business)

---

**Built with ❤️ by Visium Technologies for T-Mobile**
