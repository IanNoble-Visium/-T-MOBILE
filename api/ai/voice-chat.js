import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Voice Chat Endpoint
 * Handles conversational AI for voice using latest OpenAI chat models (gpt-5.2-chat-latest, with fallbacks).
 * 
 * POST /api/ai/voice-chat
 * Body: {
 *   messages: [{ role: 'user'|'assistant', content: string }],
 *   dashboardContext: { ... }
 * }
 * 
 * Response: {
 *   success: true,
 *   message: string
 * }
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      details: 'Only POST requests are supported'
    });
  }

  try {
    const { messages, dashboardContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        details: 'Messages array is required and must not be empty'
      });
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return res.status(500).json({
        success: false,
        error: 'Configuration error',
        details: 'OpenAI API key not configured'
      });
    }

    // Build system message with dashboard context
    const systemMessage = buildSystemMessage(dashboardContext);

    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: 'system', content: systemMessage },
      ...messages
    ];

    console.log('Sending voice chat request to OpenAI...');
    console.log('Message count:', messages.length);

    // Use latest chat models (v1/chat/completions). Try newest first, fallback for older accounts.
    const chatModels = ['gpt-5.2-chat-latest', 'gpt-5.1-chat-latest', 'gpt-4o', 'gpt-3.5-turbo'];
    // Models that require max_completion_tokens instead of max_tokens
    const newModelFormat = ['gpt-5.2-chat-latest', 'gpt-5.1-chat-latest'];
    let completion = null;
    let modelUsed = null;

    for (const model of chatModels) {
      try {
        // Use max_completion_tokens for newer models, max_tokens for older ones
        const useNewFormat = newModelFormat.includes(model);
        const requestParams = {
          model,
          messages: openaiMessages,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        };
        
        // Add the correct token limit parameter based on model version
        if (useNewFormat) {
          requestParams.max_completion_tokens = 500; // Keep responses concise for voice
        } else {
          requestParams.max_tokens = 500; // Keep responses concise for voice
        }
        
        completion = await openai.chat.completions.create(requestParams);
        modelUsed = model;
        console.log(`Voice chat using model: ${model}`);
        break;
      } catch (err) {
        console.warn(`Model ${model} failed:`, err.message);
        // If it's a max_tokens error and we're using an old model, try with max_completion_tokens
        if (err.message?.includes('max_tokens') && !newModelFormat.includes(model)) {
          try {
            console.log(`Retrying ${model} with max_completion_tokens...`);
            completion = await openai.chat.completions.create({
              model,
              messages: openaiMessages,
              temperature: 0.7,
              max_completion_tokens: 500,
              top_p: 1,
              frequency_penalty: 0,
              presence_penalty: 0,
            });
            modelUsed = model;
            console.log(`Voice chat using model: ${model} (with max_completion_tokens)`);
            break;
          } catch (retryErr) {
            console.warn(`Retry with max_completion_tokens also failed:`, retryErr.message);
          }
        }
        if (model === chatModels[chatModels.length - 1]) throw err;
      }
    }

    const assistantMessage = completion.choices[0].message.content;

    console.log('Voice chat response generated successfully');
    console.log('Response length:', assistantMessage.length, 'characters');

    return res.status(200).json({
      success: true,
      message: assistantMessage
    });

  } catch (error) {
    console.error('Voice chat error:', error);

    // Handle OpenAI API errors
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      if (status === 401) {
        return res.status(500).json({
          success: false,
          error: 'Authentication error',
          details: 'Invalid OpenAI API key'
        });
      }

      if (status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          details: 'Too many requests. Please try again later.'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'OpenAI API error',
        details: errorData?.error?.message || 'Unknown error'
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}

/**
 * Build system message with dashboard context
 */
function buildSystemMessage(dashboardContext) {
  const baseMessage = `You are an AI security analyst assistant for T-Mobile's network security dashboard. You help users understand security threats, network topology, and system health through natural voice conversations.

Key responsibilities:
- Provide clear, concise answers about network security
- Explain security threats and incidents
- Help users understand network topology and device status
- Offer actionable recommendations
- Keep responses brief and conversational (suitable for voice)

Communication style:
- Be professional but friendly
- Use simple language, avoid jargon when possible
- Keep responses under 3 sentences when possible
- If asked for details, provide them clearly and concisely
- Always prioritize security and accuracy`;

  // Add dashboard context if available
  if (dashboardContext) {
    let contextInfo = '\n\nCurrent Dashboard Context:';

    if (dashboardContext.totalThreats !== undefined) {
      contextInfo += `\n- Total Threats: ${dashboardContext.totalThreats}`;
    }

    if (dashboardContext.criticalIncidents !== undefined) {
      contextInfo += `\n- Critical Incidents: ${dashboardContext.criticalIncidents}`;
    }

    if (dashboardContext.networkHealth !== undefined) {
      contextInfo += `\n- Network Health: ${dashboardContext.networkHealth}%`;
    }

    if (dashboardContext.devicesMonitored !== undefined) {
      contextInfo += `\n- Devices Monitored: ${dashboardContext.devicesMonitored}`;
    }

    if (dashboardContext.recentThreats && Array.isArray(dashboardContext.recentThreats)) {
      contextInfo += `\n- Recent Threats: ${dashboardContext.recentThreats.slice(0, 3).map(t => t.type || t.name).join(', ')}`;
    }

    return baseMessage + contextInfo;
  }

  return baseMessage;
}

// Vercel serverless function configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

