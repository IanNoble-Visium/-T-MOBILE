import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

// Neo4j connection configuration
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;
const NEO4J_DATABASE = process.env.NEO4J_DATABASE || 'neo4j';

// Validate configuration
if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
  console.error('❌ Neo4j configuration missing. Please set NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD in .env');
  process.exit(1);
}

// Create driver instance
let driver = null;

/**
 * Initialize Neo4j driver
 * @returns {Promise<void>}
 */
export async function initializeNeo4j() {
  try {
    driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
      {
        maxConnectionPoolSize: 50,
        minConnectionPoolSize: 10,
        connectionAcquisitionTimeout: 30000,
        maxConnectionLifetime: 3600000,
        logging: neo4j.logging.console('warn'),
      }
    );

    // Test connection
    const session = driver.session({ database: NEO4J_DATABASE });
    await session.run('RETURN 1');
    await session.close();

    console.log('✅ Neo4j connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Neo4j:', error.message);
    throw error;
  }
}

/**
 * Execute a Cypher query
 * @param {string} query - Cypher query string
 * @param {object} params - Query parameters
 * @returns {Promise<array>} Query results
 */
export async function executeQuery(query, params = {}) {
  if (!driver) {
    throw new Error('Neo4j driver not initialized. Call initializeNeo4j() first.');
  }

  const session = driver.session({ database: NEO4J_DATABASE });

  try {
    const result = await session.run(query, params);
    return result.records.map(record => record.toObject());
  } catch (error) {
    console.error('❌ Neo4j query error:', error.message);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Execute a write transaction
 * @param {function} callback - Transaction callback
 * @returns {Promise<any>} Transaction result
 */
export async function executeTransaction(callback) {
  if (!driver) {
    throw new Error('Neo4j driver not initialized. Call initializeNeo4j() first.');
  }

  const session = driver.session({ database: NEO4J_DATABASE });

  try {
    const result = await session.executeWrite(callback);
    return result;
  } catch (error) {
    console.error('❌ Neo4j transaction error:', error.message);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Execute a read transaction
 * @param {function} callback - Transaction callback
 * @returns {Promise<any>} Transaction result
 */
export async function executeReadTransaction(callback) {
  if (!driver) {
    throw new Error('Neo4j driver not initialized. Call initializeNeo4j() first.');
  }

  const session = driver.session({ database: NEO4J_DATABASE });

  try {
    const result = await session.executeRead(callback);
    return result;
  } catch (error) {
    console.error('❌ Neo4j read transaction error:', error.message);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Close Neo4j driver connection
 * @returns {Promise<void>}
 */
export async function closeNeo4j() {
  if (driver) {
    await driver.close();
    console.log('✅ Neo4j connection closed');
  }
}

/**
 * Check if Neo4j is connected
 * @returns {boolean}
 */
export function isNeo4jConnected() {
  return driver !== null;
}

/**
 * Get driver instance
 * @returns {neo4j.Driver}
 */
export function getDriver() {
  return driver;
}

export default {
  initializeNeo4j,
  executeQuery,
  executeTransaction,
  executeReadTransaction,
  closeNeo4j,
  isNeo4jConnected,
  getDriver,
};

