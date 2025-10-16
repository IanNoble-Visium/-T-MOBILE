import express from 'express';
import { query } from '../db/connection.js';
import { 
  naturalLanguageToSQL, 
  explainResults, 
  enhanceQuery,
  generateDashboardSummary 
} from '../services/gemini.js';

const router = express.Router();

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

export default router;
