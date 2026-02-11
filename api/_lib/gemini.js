import dotenv from 'dotenv';

dotenv.config();

// ===== PROVIDER CONFIGURATIONS =====

// OpenAI Configuration (default - fast for demo)
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o'; // Fast, capable, widely available
const openaiApiKey = process.env.OPENAI_API_KEY;

// ZAI Configuration (alternative)
const ZAI_API_URL = 'https://api.z.ai/api/coding/paas/v4/chat/completions';
const ZAI_MODEL = 'glm-4.7';
const zaiApiKey = process.env.ZAI_API_KEY;

// Default provider
const DEFAULT_PROVIDER = 'openai';

// Log available providers
if (openaiApiKey) console.log('✅ OpenAI API key configured');
else console.warn('⚠️ OPENAI_API_KEY not set');
if (zaiApiKey) console.log('✅ ZAI API key configured');
else console.warn('⚠️ ZAI_API_KEY not set');

/**
 * Get provider configuration
 */
function getProviderConfig(provider = DEFAULT_PROVIDER) {
  if (provider === 'openai') {
    if (!openaiApiKey) throw new Error('OPENAI_API_KEY environment variable is not configured.');
    return {
      name: 'OpenAI',
      model: OPENAI_MODEL,
      url: OPENAI_API_URL,
      apiKey: openaiApiKey,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      }
    };
  }
  
  if (provider === 'zai') {
    if (!zaiApiKey) throw new Error('ZAI_API_KEY environment variable is not configured.');
    return {
      name: 'ZAI',
      model: ZAI_MODEL,
      url: ZAI_API_URL,
      apiKey: zaiApiKey,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${zaiApiKey}`
      }
    };
  }
  
  throw new Error(`Unknown AI provider: ${provider}. Use 'openai' or 'zai'.`);
}

/**
 * Generate response from AI provider (OpenAI or ZAI)
 * Both use OpenAI-compatible chat completions format
 * @param {string} prompt - The prompt to send
 * @param {object} context - Optional context
 * @param {string} provider - 'openai' or 'zai' (default: 'openai')
 */
export async function generateResponse(prompt, context = {}, provider = DEFAULT_PROVIDER) {
  const config = getProviderConfig(provider);
  
  // Timeout: 55 seconds (Vercel Pro allows 60s)
  const TIMEOUT_MS = 55000;
  
  const startTime = Date.now();
  console.log(`[${config.name}] Sending request to ${config.model}...`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    
    const requestBody = {
      model: config.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      stream: false
    };
    
    // Use max_completion_tokens for newer OpenAI models, max_tokens for others
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
      
      console.error(`[${config.name}] API error:`, response.status, errorMessage);
      
      if (response.status === 401) {
        throw new Error(`${config.name} API key is invalid or missing.`);
      }
      if (response.status === 429) {
        throw new Error(`${config.name} API rate limited. Please try again in a moment.`);
      }
      if (response.status === 400) {
        // If max_completion_tokens fails, retry with max_tokens
        if (provider === 'openai' && errorMessage?.includes('max_completion_tokens')) {
          console.log('[OpenAI] Retrying with max_tokens...');
          requestBody.max_tokens = requestBody.max_completion_tokens;
          delete requestBody.max_completion_tokens;
          
          const retryResponse = await fetch(config.url, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(requestBody)
          });
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            const retryContent = retryData.choices?.[0]?.message?.content;
            if (retryContent) {
              const elapsed = Date.now() - startTime;
              console.log(`[${config.name}] Response in ${elapsed}ms (retry) using ${config.model}`);
              return retryContent;
            }
          }
        }
        throw new Error(`${config.name} API request error: ${errorMessage}`);
      }
      
      throw new Error(`${config.name} API error: ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error(`[${config.name}] Unexpected response format:`, JSON.stringify(data, null, 2));
      throw new Error(`Invalid response format from ${config.name} API`);
    }
    
    const elapsed = Date.now() - startTime;
    console.log(`[${config.name}] Response in ${elapsed}ms using ${config.model} (${data.usage?.total_tokens || 'unknown'} tokens)`);
    return content;
  } catch (error) {
    // Handle timeout/abort errors
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      const elapsed = Date.now() - startTime;
      console.error(`[${config.name}] Request timed out after ${elapsed}ms`);
      throw new Error(`Request timed out after ${Math.round(elapsed / 1000)}s. Try a simpler query or switch AI provider in settings.`);
    }
    
    // Re-throw formatted errors
    if (error.message?.includes('API') || error.message?.includes('timed out') || error.message?.includes('not configured')) {
      throw error;
    }
    
    throw new Error(`Failed to generate AI response (${config.name}): ${error.message || 'Unknown error'}`);
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

Answer: 1) Direct answer, 2) Key insights, 3) Security concerns, 4) Actionable steps with confidence % (90-100%: strong evidence, 75-89%: good evidence, 60-74%: moderate, <60%: speculative). Format steps as "**[Name] (XX%):** Description". Under 200 words.`;

  return await generateResponse(prompt, {}, provider);
}

// Enhance user query with dashboard context
export async function enhanceQuery(userQuery, dashboardContext, provider = DEFAULT_PROVIDER) {
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

  const enhanced = await generateResponse(prompt, {}, provider);
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
