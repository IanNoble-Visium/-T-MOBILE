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

    res.status(200).json(suggestions);

  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to generate suggested queries',
      details: error.message 
    });
  }
}
