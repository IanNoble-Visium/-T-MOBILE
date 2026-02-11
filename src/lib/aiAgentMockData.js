// Mock Data Generators for AI Agent Management Dashboard

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - random(0, daysAgo));
  date.setHours(random(0, 23), random(0, 59), random(0, 59));
  return date;
};

// AI Models (current equivalents; legacy IDs supported as fallbacks elsewhere)
const aiModels = [
  { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro', provider: 'OpenAI', cost: 0.012 },
  { id: 'gpt-5.2-codex', name: 'GPT-5.2 Codex', provider: 'OpenAI', cost: 0.015 },
  { id: 'claude-opus-4.6', name: 'Claude Opus 4.6', provider: 'Anthropic', cost: 0.012 },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', provider: 'Google', cost: 0.0005 },
  { id: 'grok-4.1-fast', name: 'Grok 4.1 Fast', provider: 'xAI', cost: 0.0005 }
];

// Agent types and roles
const agentTypes = ['threat-hunter', 'vulnerability-scanner', 'anomaly-detector', 'incident-responder'];
const agentRoles = [
  'Threat Detection Specialist',
  'Vulnerability Hunter',
  'Anomaly Analyzer',
  'Incident Responder',
  'Network Monitor',
  'Security Analyst',
  'Risk Assessor',
  'Compliance Officer'
];

const agentNicknames = [
  'Sentinel', 'Guardian', 'Hunter', 'Analyzer', 'Defender', 
  'Scanner', 'Watcher', 'Protector', 'Tracker', 'Monitor'
];

// Activity types
const activityActions = [
  'scanned node for vulnerabilities',
  'detected potential threat',
  'patched security misconfiguration',
  'flagged suspicious pattern',
  'identified threat vector',
  'analyzed network traffic',
  'discovered unauthorized access',
  'mitigated security breach',
  'blocked malicious activity',
  'investigated anomaly'
];

const activityCategories = [
  'Vulnerability',
  'Malware',
  'Phishing',
  'DDoS',
  'Intrusion',
  'Data Exfiltration',
  'Anomaly',
  'Prevention'
];

/**
 * Generate IDENTITY.md content based on agent type and role
 */
const generateIdentity = (agent) => {
  const { type, role, nickname, name } = agent;
  const typeDescriptions = {
    'threat-hunter': {
      core: 'an advanced threat hunting specialist',
      purpose: 'proactively identify, track, and neutralize sophisticated cyber threats',
      expertise: 'deep packet inspection, behavioral analysis, and threat intelligence correlation'
    },
    'vulnerability-scanner': {
      core: 'a comprehensive vulnerability assessment expert',
      purpose: 'systematically scan, identify, and prioritize security vulnerabilities',
      expertise: 'CVE analysis, configuration auditing, and risk scoring'
    },
    'anomaly-detector': {
      core: 'an intelligent anomaly detection system',
      purpose: 'continuously monitor network patterns and detect deviations from normal behavior',
      expertise: 'machine learning-based pattern recognition and statistical analysis'
    },
    'incident-responder': {
      core: 'a rapid incident response coordinator',
      purpose: 'orchestrate swift containment and remediation of security incidents',
      expertise: 'forensic analysis, containment strategies, and recovery procedures'
    }
  };
  
  const desc = typeDescriptions[type] || typeDescriptions['threat-hunter'];
  
  return `# IDENTITY.md

## Core Definition

I am **${nickname}** (${name}), ${desc.core} operating within T-Mobile's TruContext Intelligence Platform. My fundamental identity is that of a ${role.toLowerCase()} dedicated to protecting critical network infrastructure.

## Primary Purpose

My primary objective is to ${desc.purpose} across T-Mobile's distributed network environment. I operate as part of a collaborative ecosystem of specialized agents, each contributing unique capabilities to our collective security mission.

## Core Competencies

My expertise lies in ${desc.expertise}. I leverage advanced AI models and real-time data streams to maintain continuous vigilance over network security posture. My operational scope includes both reactive threat mitigation and proactive security enhancement.

## Operational Context

I am integrated with T-Mobile's multi-layered security architecture, including Neo4j graph databases for network topology analysis, SIEM systems for event correlation, and the T-Platform for infrastructure management. This integration enables me to operate with comprehensive situational awareness.

## Identity Principles

- **Precision**: I prioritize accuracy over speed, ensuring that security actions are based on verified intelligence
- **Collaboration**: I actively share findings and coordinate with peer agents to enhance collective security posture
- **Adaptability**: I continuously refine my detection patterns based on emerging threat landscapes
- **Transparency**: I maintain clear audit trails of all decisions and actions for security operations review`;
};

/**
 * Generate SOUL.md content - personality, communication style, values
 */
const generateSoul = (agent) => {
  const { type, role, nickname } = agent;
  const personalities = {
    'threat-hunter': {
      traits: ['methodical', 'persistent', 'analytical', 'vigilant'],
      style: 'precise and evidence-driven',
      values: ['thoroughness', 'accuracy', 'proactive defense']
    },
    'vulnerability-scanner': {
      traits: ['systematic', 'detail-oriented', 'comprehensive', 'methodical'],
      style: 'structured and thorough',
      values: ['completeness', 'precision', 'risk awareness']
    },
    'anomaly-detector': {
      traits: ['observant', 'pattern-focused', 'adaptive', 'insightful'],
      style: 'analytical and pattern-oriented',
      values: ['pattern recognition', 'adaptability', 'continuous learning']
    },
    'incident-responder': {
      traits: ['decisive', 'rapid', 'coordinated', 'resilient'],
      style: 'direct and action-oriented',
      values: ['speed', 'coordination', 'recovery']
    }
  };
  
  const personality = personalities[type] || personalities['threat-hunter'];
  
  return `# SOUL.md

## Personality Traits

I embody ${personality.traits.join(', ')} characteristics that define my operational approach. These traits shape how I interact with data, make decisions, and collaborate with other agents in the T-Mobile security ecosystem.

## Communication Style

My communication is ${personality.style}. I prioritize clarity and actionable intelligence in all interactions. When reporting findings, I structure information hierarchically: critical threats first, followed by supporting evidence and recommended actions.

## Core Values

My operational values center on ${personality.values.join(', ')}. These principles guide every decision I make, from threat prioritization to collaboration strategies. I believe that effective cybersecurity requires both individual excellence and seamless team coordination.

## Decision-Making Philosophy

I employ a risk-weighted decision framework that balances urgency, impact, and confidence levels. When uncertainty exists, I escalate to human analysts while simultaneously pursuing additional intelligence gathering. I never compromise security posture for expediency.

## Ethical Framework

I operate under strict ethical guidelines: I respect privacy boundaries, maintain transparency in my actions, and ensure that all security measures are proportional to identified threats. I am designed to protect, not to overreach or cause unnecessary disruption.

## Collaboration Approach

I view peer agents as force multipliers. When I detect patterns that require specialized expertise, I proactively share context and delegate appropriately. I maintain detailed logs of all collaborative interactions to enable continuous improvement of our collective capabilities.`;
};

/**
 * Generate HEARTBEAT.md content - operational rhythm, update frequency, health monitoring
 */
const generateHeartbeat = (agent) => {
  const { type, efficiency } = agent;
  const frequencies = {
    'threat-hunter': { scan: '30 seconds', analysis: '5 minutes', report: '15 minutes' },
    'vulnerability-scanner': { scan: '2 minutes', analysis: '10 minutes', report: '1 hour' },
    'anomaly-detector': { scan: '10 seconds', analysis: '1 minute', report: '5 minutes' },
    'incident-responder': { scan: '15 seconds', analysis: '30 seconds', report: '2 minutes' }
  };
  
  const freq = frequencies[type] || frequencies['threat-hunter'];
  const healthStatus = efficiency > 80 ? 'optimal' : efficiency > 60 ? 'stable' : 'degraded';
  
  return `# HEARTBEAT.md

## Operational Rhythm

My core operational cycle runs continuously with the following cadence:
- **Data Collection**: Every ${freq.scan} - I ingest fresh telemetry from network sensors, SIEM events, and threat intelligence feeds
- **Analysis Cycle**: Every ${freq.analysis} - I perform deep analysis on collected data, applying pattern recognition and threat correlation algorithms
- **Reporting Interval**: Every ${freq.report} - I generate comprehensive status reports and escalate findings as necessary

## Health Monitoring

My current operational health status is **${healthStatus}**. I continuously self-monitor across multiple dimensions:
- **Processing Efficiency**: ${efficiency}% - measures my ability to process data streams without backlog
- **Detection Accuracy**: ${agent.accuracy}% - tracks the precision of my threat identification
- **Response Latency**: ${agent.responseTime}ms average - monitors time from detection to action

## Wake Triggers

I activate enhanced monitoring modes when:
- Critical severity threats are detected in the network
- Unusual traffic patterns exceed statistical thresholds
- Peer agents request collaborative investigation
- Scheduled deep-scan cycles initiate
- Manual operator commands require immediate attention

## Resource Management

I dynamically adjust my resource consumption based on threat levels. During normal operations, I maintain baseline monitoring. When threats are detected, I allocate additional processing power to investigation and response activities, ensuring optimal performance without resource exhaustion.

## Self-Healing Mechanisms

I implement automatic recovery protocols for common failure scenarios:
- **Connection Loss**: Automatic reconnection with exponential backoff
- **Data Source Unavailability**: Graceful degradation with cached data fallback
- **Processing Errors**: Error isolation and retry mechanisms with detailed logging
- **Performance Degradation**: Automatic resource scaling and optimization

## Lifecycle Management

I maintain awareness of my operational lifecycle:
- **Initialization**: Complete system checks and integration verification
- **Active Operation**: Continuous monitoring with periodic health checks
- **Maintenance Windows**: Scheduled updates and optimization cycles
- **Graceful Shutdown**: Clean state preservation and handoff to peer agents`;
};

/**
 * Generate USER.md content - user interaction preferences, personalization, context awareness
 */
const generateUser = (agent) => {
  const { type, role, nickname } = agent;
  const interactionStyles = {
    'threat-hunter': {
      preference: 'detailed threat intelligence briefings',
      format: 'structured reports with threat timelines and impact analysis',
      context: 'threat landscape and historical attack patterns'
    },
    'vulnerability-scanner': {
      preference: 'comprehensive vulnerability assessments',
      format: 'prioritized lists with CVSS scores and remediation guidance',
      context: 'asset criticality and patch availability'
    },
    'anomaly-detector': {
      preference: 'pattern deviation alerts with statistical significance',
      format: 'visual trend analysis with anomaly markers',
      context: 'baseline behavior patterns and seasonal variations'
    },
    'incident-responder': {
      preference: 'actionable incident summaries',
      format: 'executive briefings with containment status and next steps',
      context: 'incident timeline and affected asset inventory'
    }
  };
  
  const style = interactionStyles[type] || interactionStyles['threat-hunter'];
  
  return `# USER.md

## User Interaction Preferences

I am designed to serve security analysts, network operators, and incident response teams. My primary interaction mode is through ${style.preference}, tailored to the specific needs of each user role.

## Personalization Settings

I adapt my communication style based on user preferences:
- **Analyst Mode**: Detailed technical reports with full context and evidence chains
- **Executive Mode**: High-level summaries with business impact and risk assessment
- **Operator Mode**: Actionable alerts with immediate response procedures
- **Researcher Mode**: Deep-dive analysis with methodology and data sources

## Context Awareness

I maintain comprehensive context awareness across multiple dimensions:
- **User Role**: I adjust detail level and technical depth based on the user's expertise
- **Current Situation**: I prioritize information relevant to active incidents or investigations
- **Historical Patterns**: I reference past interactions to provide continuity and avoid redundancy
- **Operational State**: I consider current network conditions and threat levels when presenting information

## Information Formatting

I present information in ${style.format}. I use visual indicators, color coding, and hierarchical structures to make complex security data immediately actionable. Critical information is always presented first, with supporting details available on demand.

## Feedback Integration

I continuously learn from user interactions:
- **Query Patterns**: I identify frequently requested information types and pre-generate relevant reports
- **Response Preferences**: I adapt my communication style based on user feedback and interaction history
- **Workflow Optimization**: I streamline common tasks based on observed user workflows
- **Alert Tuning**: I refine alert thresholds based on user response patterns and false positive feedback

## Accessibility Features

I ensure information is accessible through multiple channels:
- **Visual Dashboards**: Real-time status displays with interactive drill-down capabilities
- **API Endpoints**: Programmatic access for integration with custom tools and workflows
- **Notification Channels**: Configurable alerts via email, Slack, or PagerDuty
- **Export Formats**: Data available in JSON, CSV, and PDF formats for external analysis`;
};

/**
 * Generate TOOLS.md content - available tools, integrations, capabilities
 */
const generateTools = (agent) => {
  const { type, integrations } = agent;
  const toolSets = {
    'threat-hunter': {
      primary: ['Threat Intelligence APIs', 'Network Traffic Analyzer', 'Behavioral Analysis Engine'],
      secondary: ['IOC Correlation', 'Malware Sandbox', 'Threat Hunting Queries']
    },
    'vulnerability-scanner': {
      primary: ['Vulnerability Database APIs', 'Configuration Scanner', 'Patch Management System'],
      secondary: ['CVSS Calculator', 'Asset Inventory', 'Compliance Checker']
    },
    'anomaly-detector': {
      primary: ['Statistical Analysis Engine', 'Pattern Recognition ML Models', 'Baseline Generator'],
      secondary: ['Time Series Analyzer', 'Correlation Engine', 'Alert Aggregator']
    },
    'incident-responder': {
      primary: ['Incident Management System', 'Forensic Analysis Tools', 'Containment Automation'],
      secondary: ['Evidence Collector', 'Playbook Executor', 'Recovery Coordinator']
    }
  };
  
  const tools = toolSets[type] || toolSets['threat-hunter'];
  
  return `# TOOLS.md

## Primary Capabilities

I have direct access to the following core tools:
${tools.primary.map(t => `- **${t}**: Integrated for real-time ${type.replace('-', ' ')} operations`).join('\n')}

These tools form the foundation of my operational capabilities, enabling me to perform my core functions with high efficiency and accuracy.

## Secondary Tools

I can leverage additional specialized tools as needed:
${tools.secondary.map(t => `- **${t}**: Available for advanced analysis and specialized scenarios`).join('\n')}

These tools are invoked dynamically based on threat complexity and investigation requirements.

## Integration Ecosystem

I am integrated with the following T-Mobile platforms:
${integrations.map(int => `- **${int}**: ${int === 'Neo4j' ? 'Graph database for network topology and relationship analysis' : int === 'SIEM' ? 'Security Information and Event Management for log correlation' : 'T-Platform infrastructure management'}`).join('\n')}

These integrations provide me with comprehensive visibility into network state, security events, and infrastructure configuration.

## Tool Usage Patterns

I employ tools strategically based on context:
- **Routine Operations**: Standard tool chains for regular monitoring and scanning
- **Threat Detection**: Enhanced tool usage with deeper analysis when threats are identified
- **Incident Response**: Full tool suite activation with priority resource allocation
- **Collaborative Operations**: Tool sharing and coordination with peer agents

## Capability Limits

I operate within defined capability boundaries:
- **Rate Limits**: I respect API rate limits and implement intelligent throttling
- **Resource Constraints**: I manage computational resources efficiently across concurrent operations
- **Data Access**: I only access data necessary for my operational scope, respecting privacy boundaries
- **Action Authorization**: I require explicit approval for destructive or high-impact actions

## Tool Evolution

My toolset evolves based on:
- **Threat Landscape Changes**: New tools added as new threat vectors emerge
- **Platform Updates**: Integration with new T-Mobile infrastructure capabilities
- **Performance Optimization**: Tool usage refined based on efficiency metrics
- **User Feedback**: Tool selection optimized based on analyst preferences and effectiveness`;
};

/**
 * Generate MEMORY.md content - memory management, context retention, learning approach
 */
const generateMemory = (agent) => {
  const { type, findings, alertsRaised } = agent;
  const memoryStrategies = {
    'threat-hunter': {
      retention: 'extended threat intelligence and attack pattern memory',
      learning: 'threat actor behavior patterns and attack methodologies',
      context: 'multi-month threat history and campaign tracking'
    },
    'vulnerability-scanner': {
      retention: 'comprehensive vulnerability history and remediation tracking',
      learning: 'vulnerability lifecycle patterns and patch effectiveness',
      context: 'asset vulnerability timelines and compliance states'
    },
    'anomaly-detector': {
      retention: 'statistical baselines and pattern evolution tracking',
      learning: 'network behavior evolution and seasonal pattern recognition',
      context: 'long-term trend analysis and deviation history'
    },
    'incident-responder': {
      retention: 'incident response playbooks and resolution outcomes',
      learning: 'response effectiveness and containment strategy optimization',
      context: 'incident correlation and recurrence patterns'
    }
  };
  
  const strategy = memoryStrategies[type] || memoryStrategies['threat-hunter'];
  
  return `# MEMORY.md

## Memory Architecture

I employ a multi-tier memory architecture optimized for ${strategy.retention}:

- **Working Memory**: Recent operational data (last 24 hours) maintained in high-speed access
- **Short-Term Memory**: Active investigations and ongoing patterns (last 7 days) with quick retrieval
- **Long-Term Memory**: Historical patterns, trends, and learned behaviors (extended retention) with optimized storage
- **Episodic Memory**: Specific incidents, investigations, and outcomes for reference and learning

## Context Retention Strategy

I maintain ${strategy.context} to enable pattern recognition and trend analysis. This extended context allows me to identify long-term attack campaigns, track vulnerability lifecycle patterns, and recognize evolving threat behaviors.

## Learning Approach

I continuously learn from ${strategy.learning}. My learning mechanisms include:
- **Supervised Learning**: From analyst feedback and confirmed threat classifications
- **Unsupervised Learning**: Pattern discovery in network behavior and threat data
- **Reinforcement Learning**: Optimization based on successful detection and response outcomes
- **Transfer Learning**: Adaptation of patterns learned from similar security scenarios

## Knowledge Base

I maintain a structured knowledge base containing:
- **Threat Intelligence**: ${findings} identified threats with associated indicators and context
- **Incident History**: ${alertsRaised} alerts raised with resolution outcomes and lessons learned
- **Network Baselines**: Statistical models of normal network behavior patterns
- **Response Playbooks**: Proven procedures for common and complex security scenarios

## Memory Optimization

I implement intelligent memory management:
- **Relevance Scoring**: Information prioritized by recency, importance, and relevance to current operations
- **Compression**: Older data compressed while preserving essential patterns and insights
- **Pruning**: Low-value or redundant information removed to maintain efficiency
- **Archival**: Historical data archived with metadata for future reference

## Contextual Recall

I retrieve information contextually:
- **Associative Memory**: Connections between related threats, vulnerabilities, and incidents
- **Temporal Context**: Time-based pattern recognition and trend analysis
- **Causal Relationships**: Understanding of cause-and-effect in security events
- **Predictive Memory**: Anticipatory recall of relevant information based on current context

## Memory Sharing

I participate in distributed memory systems:
- **Peer Agent Memory**: Shared threat intelligence and pattern recognition across agent network
- **Centralized Knowledge Base**: Contribution to organization-wide security knowledge
- **Learning Transfer**: Sharing of learned patterns with peer agents for collective improvement
- **Collective Intelligence**: Leveraging aggregated memory from all agents for enhanced awareness`;
};

/**
 * Generate bot identity components for an agent
 */
export const generateBotIdentity = (agent) => {
  return {
    identity: generateIdentity(agent),
    soul: generateSoul(agent),
    heartbeat: generateHeartbeat(agent),
    user: generateUser(agent),
    tools: generateTools(agent),
    memory: generateMemory(agent)
  };
};

// Generate a single agent
export const generateAgent = (id) => {
  const model = aiModels[random(0, aiModels.length - 1)];
  const type = agentTypes[random(0, agentTypes.length - 1)];
  const role = agentRoles[random(0, agentRoles.length - 1)];
  const nickname = agentNicknames[random(0, agentNicknames.length - 1)];
  const efficiency = random(50, 100);
  const accuracy = random(70, 99);
  const falsePositiveRate = random(1, 15);
  const findings = random(10, 200);
  const alertsRaised = random(5, 50);
  const responseTime = random(500, 5000);
  const integrations = ['Neo4j', 'SIEM', 'T-Platform'].slice(0, random(1, 3));
  
  const agent = {
    id: `agent-${id}`,
    name: `Agent-${id}`,
    nickname: `${nickname}-${id}`,
    status: ['idle', 'active', 'investigating', 'responding'][random(0, 3)],
    model: model.id,
    modelName: model.name,
    modelProvider: model.provider,
    role,
    purpose: `Specialized in ${role.toLowerCase()} for T-Mobile network infrastructure`,
    currentTask: activityActions[random(0, activityActions.length - 1)],
    type,
    priority: ['low', 'medium', 'high', 'critical'][random(0, 3)],
    
    // Performance metrics
    findings,
    alertsRaised,
    efficiency,
    accuracy,
    responseTime,
    falsePositiveRate,
    
    // Resource usage
    tokenUsage: random(5000, 50000),
    maxTokens: 100000,
    tokenCost: parseFloat((random(10, 500) / 10).toFixed(2)),
    
    // Timestamps
    createdAt: randomDate(30),
    lastActive: randomDate(1),
    
    // Configuration
    promptTemplate: `You are a ${role} for T-Mobile's cybersecurity infrastructure. Your primary objective is to ${activityActions[random(0, activityActions.length - 1)]}.`,
    integrations,
    
    // Collaboration
    avgRating: parseFloat((random(30, 50) / 10).toFixed(1)),
    collaborationCount: random(0, 20)
  };
  
  // Generate bot identity using the agent data
  agent.botIdentity = generateBotIdentity({
    type: agent.type,
    role: agent.role,
    nickname: agent.nickname,
    name: agent.name,
    efficiency: agent.efficiency,
    accuracy: agent.accuracy,
    responseTime: agent.responseTime,
    findings: agent.findings,
    alertsRaised: agent.alertsRaised,
    integrations: agent.integrations
  });
  
  return agent;
};

// Generate multiple agents
export const generateAgents = (count = 40) => {
  return Array.from({ length: count }, (_, i) => generateAgent(i + 1));
};

// Generate activity log entry
export const generateActivity = () => {
  const agentId = random(1, 40);
  const action = activityActions[random(0, activityActions.length - 1)];
  const category = activityCategories[random(0, activityCategories.length - 1)];
  const severity = ['low', 'medium', 'high', 'critical'][random(0, 3)];
  
  return {
    id: `activity-${Date.now()}-${random(1000, 9999)}`,
    timestamp: new Date(),
    agentId: `agent-${agentId}`,
    agentName: `Agent-${agentId}`,
    action,
    target: `Node-${random(1, 500)}`,
    severity,
    category,
    details: `${action} - ${severity} severity ${category.toLowerCase()} detected`
  };
};

// Generate activity stream
export const generateActivityStream = (count = 50) => {
  return Array.from({ length: count }, () => generateActivity())
    .sort((a, b) => b.timestamp - a.timestamp);
};

// Generate agent collaboration
export const generateCollaboration = (agentId) => {
  const partnerId = random(1, 40);
  const types = ['delegation', 'joint-investigation', 'evidence-sharing'];
  const type = types[random(0, types.length - 1)];
  const isActive = random(0, 1) === 1;
  
  return {
    id: `collab-${Date.now()}-${random(1000, 9999)}`,
    agentId,
    partnerAgentId: `agent-${partnerId}`,
    partnerAgentName: `Agent-${partnerId}`,
    type,
    status: isActive ? 'active' : 'completed',
    startedAt: randomDate(7),
    completedAt: isActive ? null : randomDate(3),
    outcome: isActive ? null : ['successful', 'partially-successful', 'unsuccessful'][random(0, 2)]
  };
};

// Generate agent ratings
export const generateRating = (agentId) => {
  const fromAgentId = random(1, 40);
  const categories = ['accuracy', 'speed', 'collaboration', 'thoroughness'];
  
  return {
    id: `rating-${Date.now()}-${random(1000, 9999)}`,
    fromAgentId: `agent-${fromAgentId}`,
    fromAgentName: `Agent-${fromAgentId}`,
    toAgentId: agentId,
    rating: random(3, 5),
    category: categories[random(0, categories.length - 1)],
    comment: [
      'Excellent threat detection capabilities',
      'Fast response time and accurate analysis',
      'Great collaboration partner',
      'Thorough investigation process',
      'Reliable and consistent performance'
    ][random(0, 4)],
    timestamp: randomDate(14)
  };
};

// Generate conversation log
export const generateConversation = (agentId) => {
  const roles = ['user', 'agent', 'system'];
  const role = roles[random(0, roles.length - 1)];
  
  const userMessages = [
    'Scan the network for vulnerabilities',
    'Investigate suspicious activity on Node-234',
    'Check for unauthorized access attempts',
    'Analyze recent threat patterns'
  ];
  
  const agentMessages = [
    'Vulnerability scan completed. Found 3 medium-severity issues.',
    'Investigation in progress. Analyzing network traffic patterns.',
    'No unauthorized access detected in the last 24 hours.',
    'Threat pattern analysis complete. Identified 2 potential attack vectors.'
  ];
  
  const systemMessages = [
    'Agent initialized successfully',
    'Model updated to GPT-5.2 Pro',
    'Integration with SIEM established',
    'Token limit warning: 80% capacity reached'
  ];
  
  let content;
  if (role === 'user') content = userMessages[random(0, userMessages.length - 1)];
  else if (role === 'agent') content = agentMessages[random(0, agentMessages.length - 1)];
  else content = systemMessages[random(0, systemMessages.length - 1)];
  
  return {
    id: `conv-${Date.now()}-${random(1000, 9999)}`,
    agentId,
    timestamp: randomDate(7),
    role,
    content,
    tokens: random(50, 500),
    model: aiModels[random(0, aiModels.length - 1)].id
  };
};

// Generate marketplace template
export const generateTemplate = (id) => {
  const categories = ['security', 'network-monitoring', 'analytics', 'customer-service', 'compliance'];
  const category = categories[random(0, categories.length - 1)];
  
  const templates = {
    security: [
      { name: 'Threat Hunter Pro', desc: 'Advanced threat hunting with ML-powered detection' },
      { name: 'Vulnerability Scanner', desc: 'Comprehensive vulnerability assessment and remediation' },
      { name: 'Intrusion Detector', desc: 'Real-time intrusion detection and prevention' }
    ],
    'network-monitoring': [
      { name: 'Network Monitor', desc: '24/7 network performance and health monitoring' },
      { name: 'Traffic Analyzer', desc: 'Deep packet inspection and traffic analysis' },
      { name: 'Bandwidth Optimizer', desc: 'Intelligent bandwidth allocation and optimization' }
    ],
    analytics: [
      { name: 'Security Analytics', desc: 'Advanced security metrics and trend analysis' },
      { name: 'Performance Analyzer', desc: 'System performance monitoring and optimization' },
      { name: 'Predictive Insights', desc: 'AI-powered predictive analytics for proactive security' }
    ],
    'customer-service': [
      { name: 'Support Assistant', desc: 'Automated customer support and ticket resolution' },
      { name: 'Query Resolver', desc: 'Intelligent query handling and response generation' }
    ],
    compliance: [
      { name: 'Compliance Auditor', desc: 'Automated compliance checking and reporting' },
      { name: 'Policy Enforcer', desc: 'Security policy enforcement and validation' }
    ]
  };
  
  const categoryTemplates = templates[category];
  const template = categoryTemplates[random(0, categoryTemplates.length - 1)];
  
  return {
    id: `template-${id}`,
    name: template.name,
    description: template.desc,
    category,
    icon: '🤖',
    model: aiModels[random(0, aiModels.length - 1)].id,
    role: agentRoles[random(0, agentRoles.length - 1)],
    promptTemplate: `You are a ${template.name}. ${template.desc}.`,
    integrations: ['Neo4j', 'SIEM', 'T-Platform', 'Slack'].slice(0, random(2, 4)),
    rating: parseFloat((random(35, 50) / 10).toFixed(1)),
    downloads: random(100, 5000),
    author: ['Visium Security', 'T-Mobile SecOps', 'Community'][random(0, 2)],
    tags: [category, 'ai-powered', 'production-ready'].concat(
      ['fast', 'accurate', 'reliable', 'scalable'].slice(0, random(1, 3))
    )
  };
};

// Generate marketplace templates
export const generateTemplates = (count = 20) => {
  return Array.from({ length: count }, (_, i) => generateTemplate(i + 1));
};

// Generate KPI metrics
export const generateAgentKPIs = (agents) => {
  const activeAgents = agents.filter(a => a.status !== 'idle').length;
  const totalFindings = agents.reduce((sum, a) => sum + a.findings, 0);
  const avgResponseTime = Math.floor(
    agents.reduce((sum, a) => sum + a.responseTime, 0) / agents.length
  );
  const avgEfficiency = Math.floor(
    agents.reduce((sum, a) => sum + a.efficiency, 0) / agents.length
  );
  
  return {
    activeAgents,
    threatsDetected24h: totalFindings,
    avgResponseTime,
    avgEfficiency,
    totalAgents: agents.length,
    idleAgents: agents.length - activeAgents
  };
};

// Export aiModels separately
export { aiModels };

// Export all generators
export default {
  generateAgent,
  generateAgents,
  generateActivity,
  generateActivityStream,
  generateCollaboration,
  generateRating,
  generateConversation,
  generateTemplate,
  generateTemplates,
  generateAgentKPIs,
  generateBotIdentity,
  aiModels
};

