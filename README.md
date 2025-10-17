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

## Technology Stack

- **Frontend Framework**: React 19 with Vite
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Animations**: Framer Motion

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

## Mock Data

All data in this demo is **simulated** using realistic mock data generators that produce:

- Threat events with geographic distribution
- Device metrics across multiple technologies
- Incident management workflows
- Network performance statistics
- Real-time event streams

**Note**: This demo is designed to be easily connected to live data sources by replacing the mock data imports with actual API calls.

## Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
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

## Integration Roadmap

To connect this demo to live T-Mobile systems:

1. **Replace Mock Data**: Update imports in dashboard components to use real API clients
2. **Add Authentication**: Implement T-Mobile SSO/OAuth integration
3. **Connect to SASE API**: Integrate with Palo Alto Networks API
4. **Connect to T-Platform**: Integrate with T-Mobile network management APIs
5. **Connect to IoT Hub**: Integrate with T-Mobile IoT platform APIs
6. **Connect to TruContext**: Integrate with Visium TruContext graph database (Neo4j)
7. **Add WebSocket Support**: Enable real-time data streaming for live updates

## Key Differentiators

### Why T-Mobile + TruContext Wins

1. **Speed**: 2-minute threat detection vs. 15-20 minutes for competitors
2. **Coverage**: 98% threat detection accuracy with Precision AI
3. **Cost**: 95% cost efficiency vs. traditional SIEM solutions
4. **Innovation**: Graph-based analytics reveal hidden attack paths
5. **Integration**: Unified platform across SASE, IoT, and network management
6. **5G Advantage**: Ultra-low latency enables real-time threat response

## Presentation Tips

- Start with **Executive Dashboard** to show overall value proposition
- Highlight the **NEW Cyber Defense Center** as a competitive differentiator
- Use **Graph Analytics** to demonstrate TruContext's unique capabilities
- Show **SASE Platform** to emphasize Palo Alto Precision AI integration
- Demonstrate **real-time updates** by refreshing the event streams

## License

Proprietary - Visium Technologies & T-Mobile

## Contact

For questions about this demo or TruContext platform:
- **Visium Technologies**: [https://www.visiumtechnologies.com](https://www.visiumtechnologies.com)
- **T-Mobile Business**: [https://www.t-mobile.com/business](https://www.t-mobile.com/business)

---

**Built with ❤️ by Visium Technologies for T-Mobile**

