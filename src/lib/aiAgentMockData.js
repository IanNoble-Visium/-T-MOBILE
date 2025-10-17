// Mock Data Generators for AI Agent Management Dashboard

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - random(0, daysAgo));
  date.setHours(random(0, 23), random(0, 59), random(0, 59));
  return date;
};

// AI Models
const aiModels = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', cost: 0.03 },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', cost: 0.01 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', cost: 0.015 },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', cost: 0.003 },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', cost: 0.00025 },
  { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'Google', cost: 0.001 }
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

// Generate a single agent
export const generateAgent = (id) => {
  const model = aiModels[random(0, aiModels.length - 1)];
  const type = agentTypes[random(0, agentTypes.length - 1)];
  const role = agentRoles[random(0, agentRoles.length - 1)];
  const nickname = agentNicknames[random(0, agentNicknames.length - 1)];
  const efficiency = random(50, 100);
  const accuracy = random(70, 99);
  const falsePositiveRate = random(1, 15);
  
  return {
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
    findings: random(10, 200),
    alertsRaised: random(5, 50),
    efficiency,
    accuracy,
    responseTime: random(500, 5000), // milliseconds
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
    integrations: ['Neo4j', 'SIEM', 'T-Platform'].slice(0, random(1, 3)),
    
    // Collaboration
    avgRating: parseFloat((random(30, 50) / 10).toFixed(1)),
    collaborationCount: random(0, 20)
  };
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
    'Model updated to GPT-4 Turbo',
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
  aiModels
};

