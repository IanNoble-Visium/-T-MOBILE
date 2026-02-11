import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Validate Google API key
const googleApiKey = process.env.GOOGLE_API_KEY;
if (!googleApiKey) {
  console.error('GOOGLE_API_KEY environment variable is not set');
}

// Initialize Gemini AI (latest model) - only if API key exists
// Valid Gemini model names: gemini-3-pro-preview, gemini-3-flash-preview, gemini-1.5-pro
let genAI = null;
let model = null;
let modelName = null;

if (googleApiKey) {
  try {
    genAI = new GoogleGenerativeAI(googleApiKey);
    // Try latest models first, fallback to stable models
    const modelOptions = [
      'gemini-3-pro-preview',  // Latest preview model
      'gemini-3-flash-preview', // Fast preview model
      'gemini-1.5-pro',         // Stable production model
      'gemini-1.5-flash'        // Fast stable model
    ];
    
    // Initialize with first available model (will be validated on first use)
    modelName = modelOptions[0];
    model = genAI.getGenerativeModel({ model: modelName });
    console.log(`Initialized Gemini AI with model: ${modelName}`);
  } catch (initError) {
    console.error('Failed to initialize Gemini AI:', initError);
  }
}

// Generate response from Gemini
export async function generateResponse(prompt, context = {}) {
  // Check if API key is configured
  if (!googleApiKey) {
    const errorMsg = 'GOOGLE_API_KEY environment variable is not configured. Please set it in your Vercel environment variables.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Check if model is initialized
  if (!model) {
    const errorMsg = 'Gemini AI model failed to initialize. Please check your GOOGLE_API_KEY.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Try multiple models if the first one fails (model not found, etc.)
  const modelOptions = [
    'gemini-3-pro-preview',
    'gemini-3-flash-preview',
    'gemini-1.5-pro',
    'gemini-1.5-flash'
  ];
  
  let lastError = null;
  
  for (const tryModelName of modelOptions) {
    try {
      // Get model instance (create new if different from current)
      let modelToUse = model;
      if (tryModelName !== modelName) {
        modelToUse = genAI.getGenerativeModel({ model: tryModelName });
        console.log(`Trying Gemini model: ${tryModelName}`);
      }
      
      const result = await modelToUse.generateContent(prompt);
      const response = await result.response;
      
      // Update global model reference if we successfully used a different model
      if (tryModelName !== modelName) {
        model = modelToUse;
        modelName = tryModelName;
        console.log(`Successfully using Gemini model: ${modelName}`);
      }
      
      return response.text();
    } catch (error) {
      lastError = error;
      
      // If it's a "model not found" error, try next model
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        console.warn(`Model ${tryModelName} not available, trying next option...`);
        continue;
      }
      
      // For other errors, log and break
      console.error(`Gemini API error with model ${tryModelName}:`);
      console.error('- Error message:', error.message);
      console.error('- Error code:', error.code);
      console.error('- Error status:', error.status);
      
      // If it's not a model-not-found error, don't try other models
      if (!error.message?.includes('not found') && !error.message?.includes('404')) {
        break;
      }
    }
  }
  
  // If we get here, all models failed
  console.error('All Gemini models failed. Last error:', lastError);
  
  // Provide more specific error messages
  if (lastError?.message?.includes('API_KEY')) {
    throw new Error('Invalid or missing Google API key. Please check your GOOGLE_API_KEY environment variable.');
  }
  if (lastError?.message?.includes('quota') || lastError?.message?.includes('rate limit')) {
    throw new Error('Gemini API quota exceeded or rate limited. Please try again later.');
  }
  if (lastError?.message?.includes('safety')) {
    throw new Error('Gemini API blocked the request due to safety filters. Please rephrase your query.');
  }
  if (lastError?.message?.includes('not found') || lastError?.message?.includes('404')) {
    throw new Error('No available Gemini models found. Please check your API access or try again later.');
  }
  
  // Generic error with actual message
  throw new Error(`Failed to generate AI response: ${lastError?.message || 'Unknown error'}`);
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
4. Suggests actionable next steps if relevant - IMPORTANT: For each actionable next step, include a confidence percentage (0-100%) based on the evidence in the data
   - 90-100%: Strong evidence directly from the query results
   - 75-89%: Good evidence with reasonable inferences
   - 60-74%: Moderate evidence, some assumptions required
   - Below 60%: Speculative or based on general best practices rather than specific data
   Format each step as: "**[Step Name] (Confidence: XX%):** Description"
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
