/**
 * Network AI Context Generator
 * Formats network topology and alarm data for AI queries
 */

/**
 * Generate network topology summary for AI
 */
export const generateNetworkTopologySummary = (dataset) => {
  if (!dataset || !dataset.nodes || !dataset.edges) {
    return 'No network data available'
  }

  const nodeTypes = {}
  const regions = new Set()
  let totalCapacity = 0

  dataset.nodes.forEach(node => {
    nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1
    regions.add(node.region)
    totalCapacity += node.capacity || 0
  })

  const summary = `
Network Topology Overview:
- Total Nodes: ${dataset.nodes.length}
- Total Connections: ${dataset.edges.length}
- Regions Covered: ${regions.size} (${Array.from(regions).join(', ')})
- Total Capacity: ${totalCapacity.toLocaleString()} units

Node Distribution:
${Object.entries(nodeTypes)
  .map(([type, count]) => `  - ${type}: ${count} nodes`)
  .join('\n')}

Average Link Utilization: ${
    dataset.edges.length > 0
      ? (dataset.edges.reduce((sum, e) => sum + (e.utilization || 0), 0) / dataset.edges.length).toFixed(1)
      : 0
  }%
  `

  return summary.trim()
}

/**
 * Generate alarm summary for AI
 */
export const generateAlarmSummary = (alarms) => {
  if (!alarms || alarms.length === 0) {
    return 'No active alarms'
  }

  const active = alarms.filter(a => !a.resolved)
  const bySeverity = {
    critical: active.filter(a => a.severity === 'critical').length,
    high: active.filter(a => a.severity === 'high').length,
    medium: active.filter(a => a.severity === 'medium').length,
    low: active.filter(a => a.severity === 'low').length
  }

  const byType = {}
  active.forEach(alarm => {
    byType[alarm.type] = (byType[alarm.type] || 0) + 1
  })

  const summary = `
Active Alarms Summary:
- Total Active: ${active.length}
- Critical: ${bySeverity.critical}
- High: ${bySeverity.high}
- Medium: ${bySeverity.medium}
- Low: ${bySeverity.low}

Alarm Types:
${Object.entries(byType)
  .map(([type, count]) => `  - ${type}: ${count}`)
  .join('\n')}

Affected Infrastructure:
- Nodes with Alarms: ${new Set(active.flatMap(a => a.affectedNodeIds)).size}
- Links with Alarms: ${new Set(active.flatMap(a => a.affectedEdgeIds)).size}
  `

  return summary.trim()
}

/**
 * Generate geographic distribution summary for AI
 */
export const generateGeographicSummary = (dataset, alarms = []) => {
  if (!dataset || !dataset.nodes) {
    return 'No geographic data available'
  }

  const byRegion = {}
  const alarmedByRegion = {}

  dataset.nodes.forEach(node => {
    if (!byRegion[node.region]) {
      byRegion[node.region] = { nodes: 0, capacity: 0 }
    }
    byRegion[node.region].nodes++
    byRegion[node.region].capacity += node.capacity || 0
  })

  const activeAlarms = alarms.filter(a => !a.resolved)
  activeAlarms.forEach(alarm => {
    alarm.affectedNodeIds.forEach(nodeId => {
      const node = dataset.nodes.find(n => n.id === nodeId)
      if (node) {
        if (!alarmedByRegion[node.region]) {
          alarmedByRegion[node.region] = 0
        }
        alarmedByRegion[node.region]++
      }
    })
  })

  const summary = `
Geographic Distribution:
${Object.entries(byRegion)
  .map(([region, data]) => {
    const alarmed = alarmedByRegion[region] || 0
    return `  ${region}:
    - Nodes: ${data.nodes}
    - Capacity: ${data.capacity.toLocaleString()} units
    - Alarmed: ${alarmed}`
  })
  .join('\n')}
  `

  return summary.trim()
}

/**
 * Generate detailed node information for AI
 */
export const generateNodeDetails = (node) => {
  if (!node) return 'Node not found'

  const details = `
Node Details:
- ID: ${node.id}
- Name: ${node.name}
- Type: ${node.type}
- Status: ${node.status}
- Location: ${node.location.city} (${node.location.lat.toFixed(4)}, ${node.location.lon.toFixed(4)})
- Region: ${node.region}
- Capacity: ${node.capacity?.toLocaleString() || 'N/A'} units
- Vendor: ${node.vendor || 'N/A'}
- Model: ${node.model || 'N/A'}
${node.uptime ? `- Uptime: ${node.uptime.toFixed(2)}%` : ''}
${node.coverage_radius ? `- Coverage Radius: ${node.coverage_radius} km` : ''}
  `

  return details.trim()
}

/**
 * Generate detailed edge information for AI
 */
export const generateEdgeDetails = (edge, sourceNode, targetNode) => {
  if (!edge) return 'Edge not found'

  const details = `
Connection Details:
- ID: ${edge.id}
- Source: ${sourceNode?.name || edge.source}
- Target: ${targetNode?.name || edge.target}
- Type: ${edge.type}
- Status: ${edge.status}
- Bandwidth: ${edge.bandwidth} Gbps
- Latency: ${edge.latency}ms
- Utilization: ${edge.utilization}%
  `

  return details.trim()
}

/**
 * Generate comprehensive network context for AI
 */
export const generateNetworkAIContext = (dataset, alarms = []) => {
  const context = {
    timestamp: new Date().toISOString(),
    topology: generateNetworkTopologySummary(dataset),
    alarms: generateAlarmSummary(alarms),
    geography: generateGeographicSummary(dataset, alarms),
    nodeCount: dataset?.nodes?.length || 0,
    edgeCount: dataset?.edges?.length || 0,
    activeAlarmCount: alarms.filter(a => !a.resolved).length,
    regions: [...new Set(dataset?.nodes?.map(n => n.region) || [])],
    nodeTypes: [...new Set(dataset?.nodes?.map(n => n.type) || [])],
    edgeTypes: [...new Set(dataset?.edges?.map(e => e.type) || [])]
  }

  return context
}

/**
 * Format network context as a string for AI prompt
 */
export const formatNetworkContextForPrompt = (dataset, alarms = []) => {
  const context = generateNetworkAIContext(dataset, alarms)

  return `
# Network Infrastructure Context

## Current Status
- Timestamp: ${context.timestamp}
- Total Nodes: ${context.nodeCount}
- Total Connections: ${context.edgeCount}
- Active Alarms: ${context.activeAlarmCount}

## Topology Summary
${context.topology}

## Alarm Status
${context.alarms}

## Geographic Distribution
${context.geography}

## Available Data
- Node Types: ${context.nodeTypes.join(', ')}
- Connection Types: ${context.edgeTypes.join(', ')}
- Regions: ${context.regions.join(', ')}

You can help users understand and analyze this network infrastructure, answer questions about topology, alarms, and geographic distribution, and provide recommendations for optimization and security.
  `.trim()
}

/**
 * Generate suggested AI queries based on network state
 */
export const generateSuggestedNetworkQueries = (dataset, alarms = []) => {
  const queries = [
    'What is the current state of the network topology?',
    'Which regions have the most infrastructure?',
    'What are the active alarms and their severity?',
    'Which nodes are experiencing issues?',
    'What is the network utilization across regions?',
    'Which connections have high latency?',
    'What is the geographic distribution of critical infrastructure?',
    'How many nodes are in each region?',
    'What types of network equipment do we have?',
    'Which nodes have the highest capacity?'
  ]

  // Add dynamic queries based on current state
  const activeAlarms = alarms.filter(a => !a.resolved)
  if (activeAlarms.length > 0) {
    queries.push(`What is causing the ${activeAlarms.length} active alarms?`)
    queries.push('How can we resolve the current alarms?')
  }

  if (dataset?.nodes) {
    const regions = [...new Set(dataset.nodes.map(n => n.region))]
    if (regions.length > 0) {
      queries.push(`What is the status of the ${regions[0]} region?`)
    }
  }

  return queries.slice(0, 8) // Return top 8 suggestions
}

export default {
  generateNetworkTopologySummary,
  generateAlarmSummary,
  generateGeographicSummary,
  generateNodeDetails,
  generateEdgeDetails,
  generateNetworkAIContext,
  formatNetworkContextForPrompt,
  generateSuggestedNetworkQueries
}

