import { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Send,
  Sparkles,
  Loader2,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Shield,
  Activity,
  Network,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Settings,
  X,
  Zap,
  Bot
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useNetworkAIContext } from '@/components/NetworkAIContext';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const AIAnalyticsDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState([]);
  const [dashboardContext, setDashboardContext] = useState(null);
  const [networkContext, setNetworkContext] = useState(null);
  const messagesEndRef = useRef(null);

  // AI Provider settings
  const [aiProvider, setAiProvider] = useState(() => {
    try {
      return localStorage.getItem('aiProvider') || 'openai';
    } catch { return 'openai'; }
  });
  const [showSettings, setShowSettings] = useState(false);

  // Voice conversation states
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micPermission, setMicPermission] = useState('unknown'); // 'granted', 'denied', 'prompt', 'unknown'
  const [micError, setMicError] = useState(null);
  const audioRef = useRef(null);
  const voiceMessagesRef = useRef([]);

  // Use custom speech recognition hook (replaces browser Web Speech API)
  const {
    isListening,
    transcript,
    error: speechError,
    isProcessing: speechProcessing,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition,
    reset: resetSpeechRecognition
  } = useSpeechRecognition();

  // Get network AI context
  const { context: networkAIContext, suggestedQueries: networkQueries, contextString } = useNetworkAIContext();

  // Check for microphone permissions on mount
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        if (navigator.permissions) {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
          setMicPermission(permissionStatus.state);
          console.log('Microphone permission:', permissionStatus.state);

          permissionStatus.onchange = () => {
            setMicPermission(permissionStatus.state);
            console.log('Microphone permission changed to:', permissionStatus.state);
          };
        }
      } catch (error) {
        console.warn('Could not query microphone permission:', error);
      }
    };

    checkMicPermission();
  }, []);

  // Handle transcript changes from speech recognition
  useEffect(() => {
    if (transcript && !speechProcessing) {
      console.log('✅ Final transcript:', transcript);
      handleVoiceInput(transcript);
      resetSpeechRecognition(); // Clear for next input
    }
  }, [transcript, speechProcessing]);

  // Handle speech recognition errors
  useEffect(() => {
    if (speechError) {
      setMicError(speechError);
      console.error('Speech recognition error:', speechError);
    }
  }, [speechError]);

  // Handle voice enabled changes
  useEffect(() => {
    if (voiceEnabled && !isLoading) {
      console.log('Voice mode enabled - starting listening');
      if (!isListening) {
        startListening();
      }
    } else if (!voiceEnabled) {
      console.log('Voice mode disabled - stopping listening');
      if (isListening) {
        stopListening();
      }
    }
  }, [voiceEnabled, isLoading]);

  // Fetch dashboard context and suggested queries on mount
  useEffect(() => {
    fetchDashboardContext();
    fetchSuggestedQueries();

    // Set network context when available
    if (networkAIContext) {
      setNetworkContext(networkAIContext);
    }

    // Combine suggested queries from both sources
    if (networkQueries && networkQueries.length > 0) {
      setSuggestedQueries(prev => [...(prev || []), ...networkQueries].slice(0, 8));
    }

    // Add welcome message
    setMessages([{
      id: 'welcome',
      type: 'assistant',
      content: 'Welcome to the AI-Powered Security Analytics Dashboard! I can help you query and understand your security data using natural language. Try asking me about threats, incidents, devices, network topology, or alarms. You can also enable voice mode to have a conversation with me!',
      timestamp: new Date()
    }]);
  }, [networkAIContext, networkQueries]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchDashboardContext = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/dashboard-context`);
      setDashboardContext(response.data);
    } catch (error) {
      console.error('Error fetching dashboard context:', error);
    }
  };

  const fetchSuggestedQueries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/suggested-queries`);
      setSuggestedQueries(response.data);
    } catch (error) {
      console.error('Error fetching suggested queries:', error);
    }
  };

  const handleProviderChange = (provider) => {
    setAiProvider(provider);
    try { localStorage.setItem('aiProvider', provider); } catch {}
  };

  const handleEnhanceQuery = async () => {
    if (!inputQuery.trim() || !dashboardContext) return;
    
    setIsEnhancing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/enhance-query`, {
        userQuery: inputQuery,
        dashboardContext
      });
      
      setInputQuery(response.data.enhancedQuery);
    } catch (error) {
      console.error('Error enhancing query:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputQuery,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/query`, {
        userQuery: userMessage.content,
        dashboardContext,
        networkContext: networkContext || {},
        networkContextString: contextString || '',
        aiProvider
      });

      const providerLabel = response.data.provider === 'zai' ? 'ZAI GLM-4.7' : 'OpenAI GPT-4o';
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.data.explanation,
        data: {
          sqlQuery: response.data.sqlQuery,
          results: response.data.results,
          resultCount: response.data.resultCount,
          provider: providerLabel
        },
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'error',
        content: error.response?.data?.details || error.response?.data?.error || 'Failed to process query. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceMode = async () => {
    const newVoiceEnabled = !voiceEnabled;
    
    if (newVoiceEnabled) {
      // Request microphone permissions explicitly
      try {
        console.log('Requesting microphone access...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ Microphone access granted');
        setMicPermission('granted');
        setMicError(null);
        
        // Stop the stream immediately (we just needed permission)
        stream.getTracks().forEach(track => track.stop());
        
        setVoiceEnabled(true);
        voiceMessagesRef.current = [];
        startListening();
      } catch (error) {
        console.error('❌ Microphone access denied:', error);
        setMicPermission('denied');
        setMicError('Microphone access denied. Please allow microphone permissions in your browser settings.');
        setVoiceEnabled(false);
      }
    } else {
      setVoiceEnabled(false);
      stopListening();
      stopSpeaking();
      setMicError(null);
    }
  };

  const startListening = () => {
    if (!isListening && !isLoading) {
      setMicError(null);
      startSpeechRecognition();
    }
  };

  const stopListening = () => {
    if (isListening) {
      stopSpeechRecognition();
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };

  const handleVoiceInput = async (text) => {
    if (!text.trim() || isLoading) return;

    stopListening();
    
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add to voice conversation history
    voiceMessagesRef.current.push({
      role: 'user',
      content: text
    });

    try {
      // Call GPT-5.2 Pro voice chat endpoint
      const response = await axios.post(`${API_BASE_URL}/ai/voice-chat`, {
        messages: voiceMessagesRef.current,
        dashboardContext
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        voiceMode: true
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Add to voice conversation history
      voiceMessagesRef.current.push({
        role: 'assistant',
        content: response.data.message
      });

      // Convert response to speech
      await speakText(response.data.message);

    } catch (error) {
      console.error('Voice query error:', error);
      const errorDetails = error.response?.data;
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'error',
        content: `Failed to process voice query: ${errorDetails?.details || errorDetails?.error || error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setMicError(`API Error: ${errorDetails?.details || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text) => {
    try {
      setIsSpeaking(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/ai/text-to-speech`,
        { text, voice: 'nova' },
        { responseType: 'blob' }
      );

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
    }
  };

  const handleSuggestedQuery = async (query) => {
    if (voiceEnabled) {
      handleVoiceInput(query);
    } else {
      // Auto-submit the suggested query
      const userMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: query,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await axios.post(`${API_BASE_URL}/ai/query`, {
          userQuery: query,
          dashboardContext,
          networkContext: networkContext || {},
          networkContextString: contextString || '',
          aiProvider
        });

        const providerLabel = response.data.provider === 'zai' ? 'ZAI GLM-4.7' : 'OpenAI GPT-4o';
        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: response.data.explanation,
          data: {
            sqlQuery: response.data.sqlQuery,
            results: response.data.results,
            resultCount: response.data.resultCount,
            provider: providerLabel
          },
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Query error:', error);
        const errorDetails = error.response?.data;
        const errorMessage = {
          id: `error-${Date.now()}`,
          type: 'error',
          content: errorDetails?.details 
            ? `Failed to process query: ${errorDetails.details}` 
            : errorDetails?.error 
            ? `Failed to process query: ${errorDetails.error}` 
            : 'Failed to process query. Please check your API key configuration or try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <div key={message.id} className="flex justify-end mb-4">
          <div className="max-w-3xl bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm">{message.content}</p>
            <span className="text-xs text-muted-foreground mt-2 block">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      );
    }

    if (message.type === 'error') {
      return (
        <div key={message.id} className="flex justify-start mb-4">
          <div className="max-w-3xl bg-red-500/10 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-500">{message.content}</p>
                <span className="text-xs text-muted-foreground mt-2 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Assistant message
    return (
      <div key={message.id} className="flex justify-start mb-4">
        <div className="max-w-3xl bg-card rounded-lg p-4 border border-border">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm prose prose-sm dark:prose-invert max-w-none markdown-content">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              
              {message.data && (
                <div className="mt-3 space-y-2">
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View SQL Query ({message.data.resultCount} results){message.data.provider ? ` · ${message.data.provider}` : ''}
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {message.data.sqlQuery}
                    </pre>
                  </details>
                </div>
              )}
              
              <span className="text-xs text-muted-foreground mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
      {/* Hero Section with Voice Toggle */}
      <div className="relative overflow-hidden rounded-lg gradient-cyber p-8 text-white">
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-10 h-10" />
              <h1 className="text-4xl font-bold">AI Security Analytics</h1>
            </div>
            <p className="text-lg opacity-90">
              Natural Language Intelligence powered by {aiProvider === 'openai' ? 'OpenAI GPT-4o' : 'ZAI GLM-4.7'}
            </p>
          </div>
          
          {/* Controls: Settings + Voice */}
          <div className="flex flex-col items-end gap-2">
            {/* Settings + Voice Row */}
            <div className="flex items-center gap-2">
              {/* AI Settings Gear */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`relative p-3 rounded-lg font-semibold transition-all duration-300 ${
                  showSettings
                    ? 'bg-white text-primary shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title="AI Provider Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button
                onClick={toggleVoiceMode}
                className={`relative px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  voiceEnabled
                    ? 'bg-white text-primary shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  {voiceEnabled ? (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>Voice ON</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-5 h-5" />
                      <span>Voice OFF</span>
                    </>
                  )}
                </div>
              </button>
              
            </div>
              
              {/* Voice Status Indicator */}
              {voiceEnabled && (
                <div className="flex items-center gap-2 text-sm">
                  {isListening && (
                    <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full animate-pulse">
                      <Radio className="w-4 h-4" />
                      <span>Listening...</span>
                    </div>
                  )}
                  {isSpeaking && (
                    <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full animate-pulse">
                      <Volume2 className="w-4 h-4" />
                      <span>Speaking...</span>
                    </div>
                  )}
                  {!isListening && !isSpeaking && !isLoading && (
                    <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                      <Mic className="w-4 h-4" />
                      <span>Ready</span>
                    </div>
                  )}
                </div>
              )}

              {/* Provider Badge */}
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs">
                <Zap className="w-3 h-3" />
                <span>{aiProvider === 'openai' ? 'OpenAI GPT-4o' : 'ZAI GLM-4.7'}</span>
              </div>
            </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Sparkles className="w-full h-full" />
        </div>
      </div>

      {/* AI Provider Settings Panel */}
      {showSettings && (
        <div className="bg-card rounded-lg border border-border p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">AI Provider Settings</h3>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 hover:bg-accent rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* OpenAI Option */}
            <button
              onClick={() => handleProviderChange('openai')}
              className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                aiProvider === 'openai'
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              {aiProvider === 'openai' && (
                <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  aiProvider === 'openai' ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">OpenAI</p>
                  <p className="text-xs text-muted-foreground">GPT-4o</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Fast, reliable responses. Recommended for demos and production use.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded">Fast</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded">Reliable</span>
              </div>
            </button>

            {/* ZAI Option */}
            <button
              onClick={() => handleProviderChange('zai')}
              className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                aiProvider === 'zai'
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              {aiProvider === 'zai' && (
                <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  aiProvider === 'zai' ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">ZAI</p>
                  <p className="text-xs text-muted-foreground">GLM-4.7</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Alternative provider. May have higher latency.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 rounded">Slower</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 text-purple-500 rounded">Alternative</span>
              </div>
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3">
            Provider selection is saved and persists across sessions. Switch to OpenAI for faster responses during demos.
          </p>
        </div>
      )}

      {/* Voice Transcript Display */}
      {voiceEnabled && transcript && (
        <div className="bg-primary/10 rounded-lg border border-primary/30 p-4 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Listening...</span>
          </div>
          <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
        </div>
      )}

      {/* Microphone Error Display */}
      {micError && (
        <div className="bg-red-500/10 rounded-lg border border-red-500/30 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-500 mb-1">Microphone Issue</p>
              <p className="text-sm text-red-500/90">{micError}</p>
              {micPermission === 'denied' && (
                <div className="mt-3 text-xs text-red-500/80">
                  <p className="font-semibold mb-1">To fix this:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Click the lock/camera icon in your browser's address bar</li>
                    <li>Change microphone permission to "Allow"</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Microphone Permission Status (for debugging) */}
      {voiceEnabled && micPermission !== 'granted' && !micError && (
        <div className="bg-yellow-500/10 rounded-lg border border-yellow-500/30 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-500 mb-1">Microphone Permission</p>
              <p className="text-sm text-yellow-500/90">
                {micPermission === 'prompt' && 'Please allow microphone access when prompted by your browser.'}
                {micPermission === 'unknown' && 'Checking microphone permissions...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Context Summary */}
      {dashboardContext && (
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Current Security Status</h3>
          </div>
          <p className="text-sm text-muted-foreground">{dashboardContext.summary}</p>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-card rounded-lg border border-border overflow-hidden flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6">
              {messages.map(renderMessage)}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Analyzing your query...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4 bg-background/50">
              {voiceEnabled ? (
                <div className="flex items-center justify-center gap-4 py-4">
                  <div className={`relative ${isListening ? 'animate-pulse' : ''}`}>
                    <div className={`absolute inset-0 rounded-full ${isListening ? 'bg-red-500/20 animate-ping' : ''}`} />
                    <div className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
                      isListening ? 'bg-red-500' : isSpeaking ? 'bg-blue-500' : 'bg-primary'
                    }`}>
                      {isListening ? (
                        <Mic className="w-8 h-8 text-white" />
                      ) : isSpeaking ? (
                        <Volume2 className="w-8 h-8 text-white animate-pulse" />
                      ) : (
                        <Mic className="w-8 h-8 text-white opacity-50" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-base font-semibold">
                      {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : isLoading ? 'Thinking...' : 'Speak now'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isListening ? 'Say your question' : isSpeaking ? 'AI is responding' : isLoading ? 'Processing your request' : 'Voice mode active'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmitQuery} className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputQuery}
                        onChange={(e) => setInputQuery(e.target.value)}
                        placeholder="Ask me anything about your security data..."
                        className="w-full px-4 py-3 pr-12 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={handleEnhanceQuery}
                        disabled={!inputQuery.trim() || isEnhancing || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Enhance query with AI"
                      >
                        {isEnhancing ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!inputQuery.trim() || isLoading}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      Send
                    </button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Click the sparkle icon to enhance your query with dashboard context
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Suggested Queries Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-card rounded-lg border border-border p-4 h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">
                {voiceEnabled ? 'Say or Click' : 'Suggested Queries'}
              </h3>
            </div>
            <div className="space-y-4">
              {suggestedQueries && Array.isArray(suggestedQueries) && suggestedQueries.length > 0 ? (
                suggestedQueries.map((item, idx) => {
                  // Handle both old format (objects with category) and new format (strings)
                  if (typeof item === 'string') {
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuery(item)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm transition-colors text-secondary-foreground hover:text-primary"
                      >
                        {item}
                      </button>
                    )
                  }

                  // Old format with categories
                  return (
                    <div key={idx}>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        {item.category === 'Threats' && <Shield className="w-4 h-4" />}
                        {item.category === 'Overview' && <TrendingUp className="w-4 h-4" />}
                        {item.category}
                      </h4>
                      <div className="space-y-2">
                        {item.queries.map((query, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleSuggestedQuery(query)}
                            className="w-full text-left p-2 text-xs bg-background hover:bg-primary/10 rounded border border-border hover:border-primary/50 transition-colors"
                          >
                            {query}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground">No suggested queries available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default AIAnalyticsDashboard;
