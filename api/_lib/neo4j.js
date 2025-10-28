import neo4j from 'neo4j-driver';

let driver = null;

/**
 * Get or create Neo4j driver instance
 * Implements singleton pattern for serverless
 */
export function getDriver() {
  if (!driver) {
    const NEO4J_URI = process.env.NEO4J_URI;
    const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
    const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

    if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
      console.error('Neo4j configuration missing');
      return null;
    }

    try {
      driver = neo4j.driver(
        NEO4J_URI,
        neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
        {
          maxConnectionPoolSize: 10,
          connectionAcquisitionTimeout: 30000,
          maxConnectionLifetime: 3600000,
          logging: neo4j.logging.console('warn'),
        }
      );
    } catch (error) {
      console.error('Failed to create Neo4j driver:', error);
      return null;
    }
  }

  return driver;
}

/**
 * Execute a Cypher query
 */
export async function executeQuery(query, params = {}) {
  const driver = getDriver();
  
  if (!driver) {
    throw new Error('Neo4j driver not available');
  }

  const database = process.env.NEO4J_DATABASE || 'neo4j';
  const session = driver.session({ database });

  try {
    const result = await session.run(query, params);
    return result.records.map(record => record.toObject());
  } catch (error) {
    console.error('Neo4j query error:', error.message);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Execute a write transaction
 */
export async function executeTransaction(callback) {
  const driver = getDriver();
  
  if (!driver) {
    throw new Error('Neo4j driver not available');
  }

  const database = process.env.NEO4J_DATABASE || 'neo4j';
  const session = driver.session({ database });

  try {
    return await session.executeWrite(callback);
  } catch (error) {
    console.error('Neo4j transaction error:', error.message);
    throw error;
  } finally {
    await session.close();
  }
}

/**
 * Close driver (for cleanup)
 */
export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}
