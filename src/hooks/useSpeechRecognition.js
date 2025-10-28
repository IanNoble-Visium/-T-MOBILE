import { useState, useRef, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Custom hook for speech recognition using OpenAI Whisper API
 * Replaces unreliable browser Web Speech API with server-side transcription
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  /**
   * Start recording audio from microphone
   */
  const startListening = useCallback(async () => {
    try {
      setError(null);
      setTranscript('');
      audioChunksRef.current = [];

      // Request microphone access
      console.log('🎤 Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      console.log('✅ Microphone access granted');

      // Create MediaRecorder
      // Use webm format (widely supported and works with Whisper)
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000, // 128 kbps for good quality
      });

      mediaRecorderRef.current = mediaRecorder;

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`📦 Audio chunk received: ${event.data.size} bytes`);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        console.log('🛑 Recording stopped, processing audio...');
        setIsListening(false);
        
        if (audioChunksRef.current.length === 0) {
          console.warn('⚠️ No audio data recorded');
          setError('No audio data recorded. Please try again.');
          return;
        }

        // Combine audio chunks into a single blob
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log(`📊 Total audio size: ${audioBlob.size} bytes`);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        // Send to server for transcription
        await transcribeAudio(audioBlob);
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event.error);
        setError(`Recording error: ${event.error.message}`);
        setIsListening(false);
      };

      // Start recording
      mediaRecorder.start();
      setIsListening(true);
      console.log('🔴 Recording started');

    } catch (err) {
      console.error('❌ Failed to start recording:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone permissions.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError(`Failed to start recording: ${err.message}`);
      }
      
      setIsListening(false);
    }
  }, []);

  /**
   * Stop recording audio
   */
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('⏹️ Stopping recording...');
      mediaRecorderRef.current.stop();
    }
  }, []);

  /**
   * Transcribe audio using OpenAI Whisper API
   */
  const transcribeAudio = async (audioBlob) => {
    try {
      setIsProcessing(true);
      setError(null);

      console.log('🚀 Sending audio to server for transcription...');

      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1]; // Remove data:audio/webm;base64, prefix
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // Send to server
      const response = await axios.post(`${API_BASE_URL}/ai/speech-to-text`, {
        audio: base64Audio,
        format: 'webm'
      });

      if (response.data.success && response.data.text) {
        const transcribedText = response.data.text.trim();
        console.log('✅ Transcription successful:', transcribedText);
        setTranscript(transcribedText);
        setError(null);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      console.error('❌ Transcription error:', err);
      
      if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please wait a moment and try again.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please check if OpenAI API key is configured.');
      } else {
        setError(`Transcription failed: ${err.message}`);
      }
      
      setTranscript('');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsListening(false);
    setTranscript('');
    setError(null);
    setIsProcessing(false);
    audioChunksRef.current = [];
  }, []);

  return {
    isListening,
    transcript,
    error,
    isProcessing,
    startListening,
    stopListening,
    reset,
  };
}

export default useSpeechRecognition;

