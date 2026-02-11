import { query } from '../_lib/db.js';
import { naturalLanguageToSQL, explainResults } from '../_lib/gemini.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userQuery, dashboardContext = {}, aiProvider = 'openai' } = req.body;
    
    if (!userQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Validate provider
    const provider = ['openai', 'zai'].includes(aiProvider) ? aiProvider : 'openai';
    console.log(`Processing query with ${provider}: ${userQuery}`);

    // Step 1: Convert natural language to SQL
    const sqlQuery = await naturalLanguageToSQL(userQuery, dashboardContext, provider);
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
    const explanation = await explainResults(userQuery, sqlQuery, results, dashboardContext, provider);

    res.status(200).json({
      query: userQuery,
      sqlQuery,
      results,
      explanation,
      resultCount: results.length,
      provider
    });

  } catch (error) {
    console.error('AI query error:', error);
    
    if (error.message?.includes('timed out') || error.message?.includes('timeout')) {
      return res.status(504).json({ 
        error: 'Request timed out',
        details: error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to process query',
      details: error.message 
    });
  }
}

// Vercel serverless function configuration - increase timeout to 60s
export const config = {
  maxDuration: 60,
};
