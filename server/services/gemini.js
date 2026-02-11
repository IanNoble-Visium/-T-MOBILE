import dotenv from 'dotenv';

dotenv.config();

// ===== PROVIDER CONFIGURATIONS =====

// OpenAI Configuration (default - fast for demo)
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o';

// ZAI Configuration (alternative)
const ZAI_API_URL = 'https://api.z.ai/api/coding/paas/v4/chat/completions';
const ZAI_MODEL = 'glm-4.7';

const DEFAULT_PROVIDER = 'openai';

/**
 * Get provider configuration
 */
function getProviderConfig(provider = DEFAULT_PROVIDER) {
  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY environment variable is not configured.');
    return {
      name: 'OpenAI',
      model: OPENAI_MODEL,
      url: OPENAI_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    };
  }
  
  if (provider === 'zai') {
    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey) throw new Error('ZAI_API_KEY environment variable is not configured.');
    return {
      name: 'ZAI',
      model: ZAI_MODEL,
      url: ZAI_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    };
  }
  
  throw new Error(`Unknown AI provider: ${provider}. Use 'openai' or 'zai'.`);
}

/**
 * Generate response from AI provider (OpenAI or ZAI)
 */
export async function generateResponse(prompt, context = {}, provider = DEFAULT_PROVIDER) {
  const config = getProviderConfig(provider);
  const TIMEOUT_MS = 55000;
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const requestBody = {
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: false
    };
    
    if (provider === 'openai') {
      requestBody.max_completion_tokens = 1000;
    } else {
      requestBody.max_tokens = 1000;
    }
    
    const response = await fetch(config.url, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || `HTTP ${response.status}`;
      
      if (response.status === 401) throw new Error(`${config.name} API key is invalid or missing.`);
      if (response.status === 429) throw new Error(`${config.name} API rate limited. Please try again.`);
      throw new Error(`${config.name} API error: ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error(`Invalid response format from ${config.name} API`);
    
    const elapsed = Date.now() - startTime;
    console.log(`[${config.name}] Response in ${elapsed}ms using ${config.model}`);
    return content;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out. Try a simpler query or switch AI provider.`);
    }
    if (error.message?.includes('API') || error.message?.includes('timed out') || error.message?.includes('not configured')) {
      throw error;
    }
    throw new Error(`Failed to generate AI response (${config.name}): ${error.message}`);
  }
}

// Convert natural language to SQL query
export async function naturalLanguageToSQL(userQuery, dashboardContext = {}, provider = DEFAULT_PROVIDER) {
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

  const sqlQuery = await generateResponse(prompt, {}, provider);
  return sqlQuery.trim().replace(/```sql\n?/g, '').replace(/```\n?/g, '').trim();
}

// Generate human-readable explanation of SQL results
export async function explainResults(userQuery, sqlQuery, results, dashboardContext = {}, provider = DEFAULT_PROVIDER) {
  const contextInfo = dashboardContext.summary ? `\nDashboard Context: ${dashboardContext.summary}` : '';
  
  const prompt = `Cybersecurity analyst. Explain query results concisely:

User: "${userQuery}"
${contextInfo}
SQL: ${sqlQuery}
Results: ${JSON.stringify(results.slice(0, 5))} ${results.length > 5 ? `(+${results.length - 5} more)` : ''}

Answer: 1) Direct answer, 2) Key insights, 3) Security concerns, 4) Actionable steps with confidence %. Under 200 words.`;

  return await generateResponse(prompt, {}, provider);
}

// Enhance user query with dashboard context
export async function enhanceQuery(userQuery, dashboardContext, provider = DEFAULT_PROVIDER) {
  const prompt = `Cybersecurity AI assistant. Enhance this vague query with context. If already specific, return as-is.

Context: ${dashboardContext.summary || 'None'}
Query: "${userQuery}"

Return ONLY the enhanced query text:`;

  const enhanced = await generateResponse(prompt, {}, provider);
  return enhanced.trim().replace(/^["']|["']$/g, '');
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
