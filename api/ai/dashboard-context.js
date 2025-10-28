import { query } from '../_lib/db.js';
import { generateDashboardSummary } from '../_lib/gemini.js';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({
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
}
