import dotenv from 'dotenv';

dotenv.config();

// ZAI API Configuration
// Using Coding Plan endpoint (required for GLM Coding Max Yearly Plan)
const ZAI_API_URL = 'https://api.z.ai/api/coding/paas/v4/chat/completions';
const ZAI_MODEL = 'glm-4.7'; // Latest GLM 4.7 model from ZAI

// Generate response from ZAI API (GLM-4.7)
// Includes timeout handling to prevent Vercel 504 errors (30s limit)
export async function generateResponse(prompt, context = {}) {
  const zaiApiKey = process.env.ZAI_API_KEY;
  
  if (!zaiApiKey) {
    throw new Error('ZAI_API_KEY environment variable is not configured. Please set it in your environment variables.');
  }

  // Timeout wrapper: 25 seconds to stay under Vercel's 30s limit
  const TIMEOUT_MS = 25000;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const response = await fetch(ZAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${zaiApiKey}`
      },
      body: JSON.stringify({
        model: ZAI_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000, // Reduced from 2000 to speed up responses
        stream: false
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || `HTTP ${response.status}`;
      
      console.error('ZAI API error:', errorMessage);
      
      if (response.status === 401 || errorMessage?.includes('API_KEY') || errorMessage?.includes('authentication')) {
        throw new Error('Invalid or missing ZAI API key. Please check your ZAI_API_KEY environment variable.');
      }
      if (response.status === 429 || errorMessage?.includes('quota') || errorMessage?.includes('rate limit')) {
        throw new Error('ZAI API quota exceeded or rate limited. Please try again later.');
      }
      
      throw new Error(`ZAI API error: ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Invalid response format from ZAI API');
    }
    
    return content;
  } catch (error) {
    // Handle timeout/abort errors
    if (error.name === 'AbortError' || error.message?.includes('aborted') || error.message?.includes('timeout')) {
      console.error('ZAI API request timed out after 25 seconds');
      throw new Error('Request timed out. The AI service is taking too long to respond. Please try a simpler query or try again later.');
    }
    
    console.error('ZAI API error:', error);
    throw new Error(`Failed to generate AI response: ${error.message || 'Unknown error'}`);
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

  const prompt = `PostgreSQL expert. Convert to SQL (SELECT only):

${schemaContext}${contextInfo}

Query: "${userQuery}"

Rules: SELECT only, use JOINs, add LIMIT 100, use aggregates when needed. Return SQL only:`;

  const sqlQuery = await generateResponse(prompt);
  return sqlQuery.trim().replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();
}

// Generate human-readable explanation of SQL results
export async function explainResults(userQuery, sqlQuery, results, dashboardContext = {}) {
  const contextInfo = dashboardContext.summary ? `\nDashboard Context: ${dashboardContext.summary}` : '';
  
  const prompt = `Cybersecurity analyst. Explain query results concisely:

User: "${userQuery}"
${contextInfo}
SQL: ${sqlQuery}
Results: ${JSON.stringify(results.slice(0, 5))} ${results.length > 5 ? `(+${results.length - 5} more)` : ''}

Answer: 1) Direct answer, 2) Key insights, 3) Security concerns, 4) Actionable steps with confidence % (90-100%: strong evidence, 75-89%: good evidence, 60-74%: moderate, <60%: speculative). Format steps as "**[Name] (XX%):** Description". Under 200 words.`;

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
