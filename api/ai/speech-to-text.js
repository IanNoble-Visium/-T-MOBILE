import OpenAI from 'openai';
import { Readable } from 'stream';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ error: 'Speech-to-text service not configured' });
    }

    // Get audio data from request body
    // The audio should be sent as base64-encoded string or as multipart/form-data
    const contentType = req.headers['content-type'] || '';
    
    let audioBuffer;
    let audioFormat = 'webm'; // Default format from browser MediaRecorder

    if (contentType.includes('application/json')) {
      // Audio sent as base64-encoded JSON
      const { audio, format } = req.body;
      
      if (!audio) {
        return res.status(400).json({ error: 'Audio data is required' });
      }

      // Decode base64 audio
      audioBuffer = Buffer.from(audio, 'base64');
      audioFormat = format || 'webm';
      
      console.log(`Received audio: ${audioBuffer.length} bytes, format: ${audioFormat}`);
    } else if (contentType.includes('multipart/form-data')) {
      // Audio sent as multipart form data
      // Note: Vercel serverless functions don't support multipart parsing by default
      // We'll need to use the JSON approach instead
      return res.status(400).json({ 
        error: 'Multipart form data not supported. Please send audio as base64-encoded JSON.' 
      });
    } else {
      // Raw audio data in request body
      audioBuffer = req.body;
      console.log(`Received raw audio: ${audioBuffer.length} bytes`);
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ error: 'Empty audio data received' });
    }

    // Create a File object for OpenAI Whisper API
    // Whisper supports: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm
    const audioFile = new File([audioBuffer], `audio.${audioFormat}`, {
      type: `audio/${audioFormat}`
    });

    console.log('Transcribing audio with OpenAI Whisper...');
    
    // Call OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // Specify English for better accuracy
      response_format: 'json', // Options: json, text, srt, verbose_json, vtt
      temperature: 0.2, // Lower temperature for more consistent results
    });

    console.log('Transcription successful:', transcription.text);

    res.status(200).json({
      success: true,
      text: transcription.text,
      language: 'en'
    });

  } catch (error) {
    console.error('Speech-to-text error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(500).json({ 
        error: 'OpenAI API authentication failed. Please check API key configuration.' 
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again in a moment.' 
      });
    }

    res.status(500).json({
      error: 'Failed to transcribe audio',
      details: error.message
    });
  }
}

// Increase body size limit for audio data (default is 4.5MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

