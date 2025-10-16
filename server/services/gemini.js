import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Generate response from Gemini
export async function generateResponse(prompt, context = {}) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate AI response');
  }
}

// Convert natural language to SQL query
export async function naturalLanguageToSQL(userQuery, dashboardContext = {}) {
  const schemaContext = `
Database Schema:
- threat_events: id, timestamp, type, severity, source_city, source_country, target_city, target_country, status, mitre_technique, confidence, description
- devices: id, type, name, location_city, location_country, security_posture, last_seen, threats_detected, compliance_status, os, ip_address
- incidents: id, title, severity, status, assigned_to, created_at, updated_at, affected_assets, playbook, priority
- kpi_metrics: timestamp, threats_detected_24h, threats_blocked_24h, active_incidents, network_health_score, cost_savings, protected_devices, iot_devices, sase_connections, uptime_percentage, mean_time_to_detect, mean_time_to_respond
- network_metrics: timestamp, total_bandwidth, bandwidth_utilization, latency_avg, five_g_coverage, active_connections, sase_protected_devices, total_iot_devices, device_health_good, device_health_warning, device_health_critical
- event_stream: id, timestamp, type, severity, source, description
`;

  const contextInfo = dashboardContext.summary ? `\nCurrent Dashboard Context:\n${dashboardContext.summary}` : '';

  const prompt = `You are a PostgreSQL expert. Convert this natural language query into a safe, read-only SQL query.

${schemaContext}${contextInfo}

User Query: "${userQuery}"

Rules:
1. Only SELECT statements allowed (no INSERT, UPDATE, DELETE, DROP)
2. Use proper JOIN syntax when querying multiple tables
3. Add LIMIT clauses to prevent excessive results (max 100 rows unless specifically requested)
4. Use aggregate functions (COUNT, AVG, SUM) when appropriate
5. Format timestamps properly
6. Return only the SQL query without explanation

SQL Query:`;

  const sqlQuery = await generateResponse(prompt);
  return sqlQuery.trim().replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();
}

// Generate human-readable explanation of SQL results
export async function explainResults(userQuery, sqlQuery, results, dashboardContext = {}) {
  const contextInfo = dashboardContext.summary ? `\nDashboard Context: ${dashboardContext.summary}` : '';
  
  const prompt = `You are a cybersecurity analyst. Explain these database query results in a clear, actionable way.

User asked: "${userQuery}"
${contextInfo}

SQL executed: ${sqlQuery}

Results: ${JSON.stringify(results.slice(0, 10))} ${results.length > 10 ? `... and ${results.length - 10} more rows` : ''}

Provide a concise, professional explanation that:
1. Directly answers the user's question
2. Highlights key insights and trends
3. Notes any security concerns or anomalies
4. Suggests actionable next steps if relevant
5. Uses clear language without SQL jargon

Keep the response under 300 words.`;

  return await generateResponse(prompt);
}

// Enhance user query with dashboard context
export async function enhanceQuery(userQuery, dashboardContext) {
  const prompt = `You are a cybersecurity AI assistant. Enhance this user query with relevant context to make it more specific and actionable.

Dashboard Context:
${dashboardContext.summary || 'No specific context available'}

User Query: "${userQuery}"

Enhanced Query Instructions:
1. If the query is vague (e.g., "what's happening?"), add specific metrics and timeframes based on context
2. Include relevant security metrics if not specified
3. Add appropriate time ranges if not mentioned
4. Make the query more specific and answerable
5. Keep the enhanced query natural and conversational
6. Don't change clear, specific queries - only enhance vague ones

Return ONLY the enhanced query text, nothing else:`;

  const enhanced = await generateResponse(prompt);
  return enhanced.trim().replace(/^["']|["']$/g, ''); // Remove surrounding quotes if present
}

// Generate dashboard summary for context
export function generateDashboardSummary(dashboardData) {
  const parts = [];
  
  if (dashboardData.kpiMetrics) {
    const kpi = dashboardData.kpiMetrics;
    parts.push(`Current KPIs: ${kpi.threats_detected_24h || 0} threats detected (24h), ${kpi.threats_blocked_24h || 0} blocked, ${kpi.active_incidents || 0} active incidents, ${kpi.network_health_score || 0}% network health`);
  }
  
  if (dashboardData.recentThreats) {
    const critical = dashboardData.recentThreats.filter(t => t.severity === 'critical').length;
    const high = dashboardData.recentThreats.filter(t => t.severity === 'high').length;
    if (critical > 0 || high > 0) {
      parts.push(`Recent threats: ${critical} critical, ${high} high severity`);
    }
  }
  
  if (dashboardData.activeIncidents) {
    const openCount = dashboardData.activeIncidents.filter(i => i.status === 'open').length;
    if (openCount > 0) {
      parts.push(`${openCount} open incidents requiring attention`);
    }
  }
  
  if (dashboardData.deviceStats) {
    parts.push(`Monitoring ${dashboardData.deviceStats.total || 0} devices`);
  }
  
  return parts.join('. ') + '.';
}

export default {
  generateResponse,
  naturalLanguageToSQL,
  explainResults,
  enhanceQuery,
  generateDashboardSummary
};
