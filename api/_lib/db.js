import pg from 'pg';

const { Pool } = pg;

let pool = null;

/**
 * Get or create PostgreSQL connection pool
 * Implements singleton pattern for serverless
 */
export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false
      },
      // Serverless-optimized settings
      max: 1, // Limit connections per function
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
      pool = null; // Reset pool on error
    });
  }

  return pool;
}

/**
 * Execute a database query
 */
export async function query(text, params) {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executed', { duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

/**
 * Close pool (for cleanup)
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
