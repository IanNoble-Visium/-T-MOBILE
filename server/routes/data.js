import express from 'express';
import { query } from '../db/connection.js';

const router = express.Router();

// Get KPI metrics (latest or historical)
router.get('/kpi-metrics', async (req, res) => {
  try {
    const { days = 1 } = req.query;
    const sql = `
      SELECT * FROM kpi_metrics 
      WHERE timestamp > NOW() - INTERVAL '${parseInt(days)} days'
      ORDER BY timestamp DESC
    `;
    const result = await query(sql);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching KPI metrics:', error);
    res.status(500).json({ error: 'Failed to fetch KPI metrics' });
  }
});

// Get latest KPI metrics
router.get('/kpi-metrics/latest', async (req, res) => {
  try {
    const result = await query('SELECT * FROM kpi_metrics ORDER BY timestamp DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Error fetching latest KPI:', error);
    res.status(500).json({ error: 'Failed to fetch latest KPI metrics' });
  }
});

// Get threat events
router.get('/threat-events', async (req, res) => {
  try {
    const { limit = 100, severity, type, days = 7 } = req.query;
    let sql = `
      SELECT * FROM threat_events 
      WHERE timestamp > NOW() - INTERVAL '${parseInt(days)} days'
    `;
    
    if (severity) {
      sql += ` AND severity = $1`;
    }
    if (type) {
      sql += ` AND type = $${severity ? 2 : 1}`;
    }
    
    sql += ` ORDER BY timestamp DESC LIMIT ${parseInt(limit)}`;
    
    const params = [];
    if (severity) params.push(severity);
    if (type) params.push(type);
    
    const result = await query(sql, params.length > 0 ? params : undefined);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching threat events:', error);
    res.status(500).json({ error: 'Failed to fetch threat events' });
  }
});

// Get devices
router.get('/devices', async (req, res) => {
  try {
    const { type, limit = 100 } = req.query;
    let sql = 'SELECT * FROM devices';
    
    if (type) {
      sql += ' WHERE type = $1';
    }
    
    sql += ` ORDER BY last_seen DESC LIMIT ${parseInt(limit)}`;
    
    const result = await query(sql, type ? [type] : undefined);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Get device statistics
router.get('/devices/stats', async (req, res) => {
  try {
    const sql = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE type = 'iot') as iot_devices,
        COUNT(*) FILTER (WHERE type = 'mobile') as mobile_devices,
        COUNT(*) FILTER (WHERE type = 'endpoint') as endpoint_devices,
        COUNT(*) FILTER (WHERE type = 'network') as network_devices,
        ROUND(AVG(security_posture)) as avg_security_posture,
        COUNT(*) FILTER (WHERE compliance_status = true) as compliant_devices
      FROM devices
    `;
    const result = await query(sql);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching device stats:', error);
    res.status(500).json({ error: 'Failed to fetch device statistics' });
  }
});

// Get incidents
router.get('/incidents', async (req, res) => {
  try {
    const { status, severity, limit = 50 } = req.query;
    let sql = 'SELECT * FROM incidents WHERE 1=1';
    const params = [];
    let paramCount = 1;
    
    if (status) {
      sql += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    if (severity) {
      sql += ` AND severity = $${paramCount}`;
      params.push(severity);
    }
    
    sql += ` ORDER BY created_at DESC LIMIT ${parseInt(limit)}`;
    
    const result = await query(sql, params.length > 0 ? params : undefined);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// Get network metrics
router.get('/network-metrics', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const sql = `
      SELECT * FROM network_metrics 
      WHERE timestamp > NOW() - INTERVAL '${parseInt(days)} days'
      ORDER BY timestamp DESC
    `;
    const result = await query(sql);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching network metrics:', error);
    res.status(500).json({ error: 'Failed to fetch network metrics' });
  }
});

// Get latest network metrics
router.get('/network-metrics/latest', async (req, res) => {
  try {
    const result = await query('SELECT * FROM network_metrics ORDER BY timestamp DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Error fetching latest network metrics:', error);
    res.status(500).json({ error: 'Failed to fetch latest network metrics' });
  }
});

// Get event stream
router.get('/event-stream', async (req, res) => {
  try {
    const { limit = 50, severity } = req.query;
    let sql = 'SELECT * FROM event_stream';
    
    if (severity) {
      sql += ' WHERE severity = $1';
    }
    
    sql += ` ORDER BY timestamp DESC LIMIT ${parseInt(limit)}`;
    
    const result = await query(sql, severity ? [severity] : undefined);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching event stream:', error);
    res.status(500).json({ error: 'Failed to fetch event stream' });
  }
});

// Get dashboard summary
router.get('/dashboard-summary', async (req, res) => {
  try {
    const result = await query('SELECT * FROM dashboard_summary');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

// Get time series data for charts
router.get('/time-series', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const sql = `
      SELECT 
        DATE(k.timestamp) as date,
        AVG(k.threats_detected_24h)::INTEGER as threats,
        AVG(k.threats_blocked_24h)::INTEGER as blocked,
        AVG(k.active_incidents)::INTEGER as incidents,
        AVG(k.protected_devices)::INTEGER as devices,
        AVG(k.network_health_score)::INTEGER as network_health
      FROM kpi_metrics k
      WHERE k.timestamp > NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY DATE(k.timestamp)
      ORDER BY DATE(k.timestamp)
    `;
    const result = await query(sql);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching time series:', error);
    res.status(500).json({ error: 'Failed to fetch time series data' });
  }
});

// Get threat statistics
router.get('/threat-stats', async (req, res) => {
  try {
    const sql = `
      SELECT 
        COUNT(*) as total_threats,
        COUNT(*) FILTER (WHERE severity = 'critical') as critical,
        COUNT(*) FILTER (WHERE severity = 'high') as high,
        COUNT(*) FILTER (WHERE severity = 'medium') as medium,
        COUNT(*) FILTER (WHERE severity = 'low') as low,
        COUNT(*) FILTER (WHERE status = 'blocked') as blocked,
        COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '24 hours') as last_24h,
        COUNT(DISTINCT type) as unique_types,
        COUNT(DISTINCT source_country) as source_countries
      FROM threat_events
      WHERE timestamp > NOW() - INTERVAL '7 days'
    `;
    const result = await query(sql);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching threat stats:', error);
    res.status(500).json({ error: 'Failed to fetch threat statistics' });
  }
});

export default router;
