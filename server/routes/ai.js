import express from 'express';
import { query } from '../db/connection.js';
import { 
  naturalLanguageToSQL, 
  explainResults, 
  enhanceQuery,
  generateDashboardSummary 
} from '../services/gemini.js';
import OpenAI from 'openai';
import { executeQuery as neo4jQuery } from '../db/neo4j.js';

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Natural language query endpoint
router.post('/query', async (req, res) => {
  try {
    const { userQuery, dashboardContext = {} } = req.body;
    
    if (!userQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('Processing natural language query:', userQuery);

    // Step 1: Convert natural language to SQL
    const sqlQuery = await naturalLanguageToSQL(userQuery, dashboardContext);
    console.log('Generated SQL:', sqlQuery);

    // Step 2: Validate SQL (basic security check)
    const sqlLower = sqlQuery.toLowerCase();
    if (
      sqlLower.includes('insert') ||
      sqlLower.includes('update') ||
      sqlLower.includes('delete') ||
      sqlLower.includes('drop') ||
      sqlLower.includes('truncate') ||
      sqlLower.includes('alter') ||
      sqlLower.includes('create')
    ) {
      return res.status(400).json({ 
        error: 'Only SELECT queries are allowed',
        query: userQuery
      });
    }

    // Step 3: Execute SQL query
    let results;
    try {
      const queryResult = await query(sqlQuery);
      results = queryResult.rows;
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({ 
        error: 'Failed to execute query',
        details: dbError.message,
        sqlQuery
      });
    }

    // Step 4: Generate human-readable explanation
    const explanation = await explainResults(userQuery, sqlQuery, results, dashboardContext);

    res.json({
      query: userQuery,
      sqlQuery,
      results,
      explanation,
      resultCount: results.length
    });

  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({ 
      error: 'Failed to process query',
      details: error.message 
    });
  }
});

// Enhance query endpoint
router.post('/enhance-query', async (req, res) => {
  try {
    const { userQuery, dashboardContext = {} } = req.body;
    
    if (!userQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('Enhancing query:', userQuery);

    // Generate dashboard context summary if data provided
    let contextSummary = dashboardContext.summary;
    if (!contextSummary && dashboardContext.data) {
      contextSummary = generateDashboardSummary(dashboardContext.data);
    }

    const enhancedQuery = await enhanceQuery(userQuery, {
      ...dashboardContext,
      summary: contextSummary
    });

    res.json({
      originalQuery: userQuery,
      enhancedQuery,
      contextUsed: !!contextSummary
    });

  } catch (error) {
    console.error('Query enhancement error:', error);
    res.status(500).json({ 
      error: 'Failed to enhance query',
      details: error.message 
    });
  }
});

// Get dashboard context for query enhancement
router.get('/dashboard-context', async (req, res) => {
  try {
    // Fetch current dashboard state
    const [kpiResult, threatsResult, incidentsResult, devicesResult] = await Promise.all([
      query('SELECT * FROM kpi_metrics ORDER BY timestamp DESC LIMIT 1'),
      query(`SELECT * FROM threat_events WHERE timestamp > NOW() - INTERVAL '24 hours' ORDER BY timestamp DESC LIMIT 20`),
      query(`SELECT * FROM incidents WHERE status IN ('open', 'investigating') ORDER BY created_at DESC`),
      query('SELECT COUNT(*) as total FROM devices')
    ]);

    const dashboardData = {
      kpiMetrics: kpiResult.rows[0],
      recentThreats: threatsResult.rows,
      activeIncidents: incidentsResult.rows,
      deviceStats: devicesResult.rows[0]
    };

    const summary = generateDashboardSummary(dashboardData);

    res.json({
      data: dashboardData,
      summary
    });

  } catch (error) {
    console.error('Error fetching dashboard context:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard context',
      details: error.message 
    });
  }
});

// Get suggested queries based on current context
router.get('/suggested-queries', async (req, res) => {
  try {
    const suggestions = [
      {
        category: 'Threats',
        queries: [
          'Show me all critical threats from the last 24 hours',
          'What are the most common threat types this week?',
          'Which countries are the top sources of attacks?',
          'How many threats were blocked today?'
        ]
      },
      {
        category: 'Incidents',
        queries: [
          'What are the current open incidents?',
          'Show me high severity incidents',
          'Which incidents have the most affected assets?',
          'What incidents were resolved this week?'
        ]
      },
      {
        category: 'Devices',
        queries: [
          'How many IoT devices are monitored?',
          'Show me devices with low security posture',
          'Which devices have detected the most threats?',
          'What is the average security posture across all devices?'
        ]
      },
      {
        category: 'Network',
        queries: [
          'What is the current network health status?',
          'Show me bandwidth utilization trends',
          'How many devices are currently connected?',
          'What is the 5G coverage percentage?'
        ]
      },
      {
        category: 'Overview',
        queries: [
          'Give me a security overview for today',
          'What\'s happening right now?',
          'Show me the most critical issues',
          'Compare this week to last week'
        ]
      }
    ];

    res.json(suggestions);

  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to generate suggested queries',
      details: error.message 
    });
  }
});

// Voice chat endpoint using GPT-4o
router.post('/voice-chat', async (req, res) => {
  try {
    const { messages, dashboardContext = {} } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log('Processing voice chat with OpenAI');
    console.log('Messages received:', messages.length);

    // Fetch fresh data for context from both databases
    let dataContext = '';
    try {
      // PostgreSQL queries
      const [threatsResult, incidentsResult, devicesResult] = await Promise.all([
        query(`SELECT COUNT(*) as total, severity, COUNT(CASE WHEN timestamp > NOW() - INTERVAL '24 hours' THEN 1 END) as last_24h FROM threat_events GROUP BY severity`),
        query(`SELECT status, COUNT(*) as count FROM incidents GROUP BY status`),
        query('SELECT COUNT(*) as total FROM devices')
      ]);

      const threatStats = threatsResult.rows;
      const incidentStats = incidentsResult.rows;
      const deviceCount = devicesResult.rows[0]?.total || 0;

      // Neo4j Cypher queries for network topology
      let neo4jData = {};
      try {
        const [nodeStats, edgeStats, nodeTypes, criticalNodes] = await Promise.all([
          // Get total nodes
          neo4jQuery('MATCH (n) RETURN count(n) as total'),
          // Get total relationships/edges
          neo4jQuery('MATCH ()-[r]->() RETURN count(r) as total'),
          // Get node counts by label/type
          neo4jQuery('MATCH (n) RETURN labels(n)[0] as type, count(n) as count ORDER BY count DESC'),
          // Get nodes with high connectivity (potential critical infrastructure) - using modern COUNT {} syntax
          neo4jQuery('MATCH (n) RETURN n.name as name, labels(n)[0] as type, COUNT { (n)--() } as connections ORDER BY connections DESC LIMIT 5')
        ]);

        neo4jData = {
          totalNodes: nodeStats[0]?.total?.toNumber ? nodeStats[0].total.toNumber() : nodeStats[0]?.total || 0,
          totalEdges: edgeStats[0]?.total?.toNumber ? edgeStats[0].total.toNumber() : edgeStats[0]?.total || 0,
          nodeTypes: nodeTypes.map(t => ({
            type: t.type,
            count: t.count?.toNumber ? t.count.toNumber() : t.count
          })),
          criticalNodes: criticalNodes.map(n => ({
            name: n.name,
            type: n.type,
            connections: n.connections?.toNumber ? n.connections.toNumber() : n.connections
          }))
        };

        console.log('Neo4j data fetched:', neo4jData);
      } catch (neo4jError) {
        console.error('Error fetching Neo4j data:', neo4jError);
        neo4jData = { error: 'Neo4j data unavailable' };
      }

      dataContext = `
Real-time Data from Multiple Sources:

PostgreSQL (Security & Threat Data):
- Total Devices Monitored: ${deviceCount}
- Threat Statistics by Severity: ${JSON.stringify(threatStats)}
- Incident Statistics by Status: ${JSON.stringify(incidentStats)}

Neo4j (Network Topology Data):
- Total Network Nodes: ${neo4jData.totalNodes || 'N/A'}
- Total Network Connections: ${neo4jData.totalEdges || 'N/A'}
- Node Types Distribution: ${JSON.stringify(neo4jData.nodeTypes || [])}
- Critical Infrastructure Nodes: ${JSON.stringify(neo4jData.criticalNodes || [])}

${dashboardContext?.summary ? `\nDashboard Summary: ${dashboardContext.summary}` : ''}`;

    } catch (dbError) {
      console.error('Error fetching context data:', dbError);
      dataContext = dashboardContext?.summary || 'Limited context available';
    }

    // Build context-aware system message
    const systemMessage = {
      role: 'system',
      content: `You are an AI security analyst assistant for T-Mobile's TruContext Smart City platform. 
You help users understand security data, threats, incidents, and network analytics through natural conversation.

Current Dashboard Data:
${dataContext}

Guidelines:
- Be conversational, friendly, and concise in your responses
- Provide actionable insights about security threats and network health based on the actual data above
- When discussing data, be specific with the numbers provided
- If you need more information than what's available, acknowledge it and provide guidance on what can be checked
- Keep responses brief but informative for voice conversation (2-3 sentences max)
- Use natural language suitable for spoken responses
- Reference the actual statistics when answering questions about threats, incidents, or devices`
    };

    // Create messages array with system context
    const chatMessages = [systemMessage, ...messages];

    console.log('Calling OpenAI API...');

    // Try multiple model names for compatibility
    let completion;
    const modelOptions = ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'];
    let modelUsed = null;

    for (const model of modelOptions) {
      try {
        console.log(`Trying model: ${model}`);
        completion = await openai.chat.completions.create({
          model: model,
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 500,
          presence_penalty: 0.6,
          frequency_penalty: 0.3
        });
        modelUsed = model;
        console.log(`✅ Success with model: ${model}`);
        break;
      } catch (modelError) {
        console.warn(`❌ Model ${model} failed:`, modelError.message);
        if (model === modelOptions[modelOptions.length - 1]) {
          throw modelError; // Throw error on last attempt
        }
      }
    }

    if (!completion) {
      throw new Error('All model attempts failed');
    }

    const assistantMessage = completion.choices[0].message.content;
    console.log('Response generated successfully');

    res.json({
      message: assistantMessage,
      usage: completion.usage,
      model: modelUsed
    });

  } catch (error) {
    console.error('❌ Voice chat error:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      status: error.status
    });
    
    res.status(500).json({ 
      error: 'Failed to process voice chat',
      details: error.message,
      type: error.type || 'unknown'
    });
  }
});

// Text-to-speech endpoint using OpenAI TTS
router.post('/text-to-speech', async (req, res) => {
  try {
    const { text, voice = 'nova' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('Converting text to speech:', text.substring(0, 50) + '...');

    // Call OpenAI TTS API with high-quality model
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: voice, // Options: alloy, echo, fable, onyx, nova, shimmer
      input: text,
      speed: 1.0
    });

    // Convert response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Set appropriate headers for audio streaming
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache'
    });

    res.send(buffer);

  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({ 
      error: 'Failed to convert text to speech',
      details: error.message 
    });
  }
});

export default router;
