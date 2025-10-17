# AI Analytics Dashboard Setup Guide

## Overview
This guide explains how to set up and use the new AI-powered Analytics Dashboard for the T-Mobile TruContext Demo application.

## Features
- **Natural Language Queries**: Ask questions about your security data in plain English
- **AI-Powered Query Enhancement**: Click the sparkle icon to enhance your query with current dashboard context
- **Real-time Database Integration**: All data is stored in PostgreSQL and queried via Google Gemini AI
- **Contextual Awareness**: The AI understands current security status and provides relevant insights
- **Suggested Queries**: Pre-built queries organized by category to help you get started

## Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL database (Neon)
- Google Gemini API key

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory with your credentials:
```
GOOGLE_API_KEY=your_gemini_api_key_here
POSTGRES_URL=your_postgresql_connection_string
PORT=3001
NODE_ENV=development
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Database Setup
The database has already been migrated with sample data. If you need to re-run the migration:
```bash
node server/db/migrate.js
```

This will:
- Create all necessary tables
- Populate with 500 threat events
- Add 1000 devices
- Create 20 incidents
- Generate 30 days of metrics
- Add 100 event stream entries

### 4. Start the Application

**Option A: Run both frontend and backend together**
```bash
pnpm start
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
pnpm run server:dev
```

Terminal 2 (Frontend):
```bash
pnpm run dev
```

### 5. Access the Dashboard
- Frontend: http://localhost:5173 (or the port Vite assigns)
- Backend API: http://localhost:3001
- AI Analytics: Navigate to "AI Analytics" in the sidebar

## Using the AI Analytics Dashboard

### Query Enhancement Feature
1. Type your query in the input field
2. Click the sparkle (✨) icon next to the input
3. The AI will enhance your query with current dashboard context
4. Submit the enhanced query to get more relevant results

**Example:**
- Original: "What's happening?"
- Enhanced: "What's happening with our security posture? Include current threat levels (2,847 detected, 2,721 blocked), active incidents (8), network health (96%), and any critical alerts."

### Example Queries
- "Show me all critical threats from the last 24 hours"
- "What are the most common threat types this week?"
- "How many IoT devices are monitored?"
- "What is the current network health status?"
- "Give me a security overview for today"
- "Show me devices with low security posture"
- "Which countries are the top sources of attacks?"
- "What incidents were resolved this week?"

### Understanding Responses
- Each response includes a natural language explanation
- Click "View SQL Query" to see the actual database query executed
- Response includes the number of results returned
- All queries are read-only for security

## API Endpoints

### Data Endpoints
- `GET /api/data/kpi-metrics/latest` - Latest KPI metrics
- `GET /api/data/threat-events` - Threat events (with filters)
- `GET /api/data/devices` - Device information
- `GET /api/data/incidents` - Security incidents
- `GET /api/data/event-stream` - Real-time events
- `GET /api/data/dashboard-summary` - Overall summary

### AI Endpoints
- `POST /api/ai/query` - Natural language query
- `POST /api/ai/enhance-query` - Enhance query with context
- `GET /api/ai/dashboard-context` - Get current dashboard state
- `GET /api/ai/suggested-queries` - Get suggested queries

## Database Schema

### Main Tables
- **threat_events**: Security threats with geographic data
- **devices**: All monitored devices (IoT, mobile, endpoints)
- **incidents**: Security incidents and their status
- **kpi_metrics**: Time-series KPI data
- **network_metrics**: Network performance and SASE metrics
- **event_stream**: Real-time security events

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL connection string in `.env`
- Check network connectivity to Neon database
- Ensure SSL is properly configured

### AI Query Issues
- Verify Google Gemini API key is valid
- Check API rate limits
- Review console logs for detailed error messages

### Frontend Not Connecting to Backend
- Ensure backend is running on port 3001
- Check for CORS issues in browser console
- Verify API_BASE_URL in AIAnalyticsDashboard.jsx

## Security Notes
- All AI queries are restricted to SELECT statements only
- SQL injection protection via parameterized queries
- API keys stored in environment variables (never in code)
- .env file is gitignored to prevent credential exposure

## Architecture

```
Frontend (React + Vite)
    ↓
Backend API (Express)
    ↓
Google Gemini AI ← Converts natural language to SQL
    ↓
PostgreSQL Database (Neon)
```

## Next Steps
1. Customize suggested queries for your use case
2. Add more dashboard context for better query enhancement
3. Implement query history/favorites
4. Add data visualization for query results
5. Extend AI capabilities with additional models

## Support
For issues or questions, check:
- Console logs (browser and server)
- API response errors
- Database query logs
