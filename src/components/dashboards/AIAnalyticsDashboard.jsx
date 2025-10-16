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
  Activity
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API_BASE_URL = 'http://localhost:3001/api';

const AIAnalyticsDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState([]);
  const [dashboardContext, setDashboardContext] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch dashboard context and suggested queries on mount
  useEffect(() => {
    fetchDashboardContext();
    fetchSuggestedQueries();
    
    // Add welcome message
    setMessages([{
      id: 'welcome',
      type: 'assistant',
      content: 'Welcome to the AI-Powered Security Analytics Dashboard! I can help you query and understand your security data using natural language. Try asking me about threats, incidents, devices, or network metrics.',
      timestamp: new Date()
    }]);
  }, []);

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
        dashboardContext
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: response.data.explanation,
        data: {
          sqlQuery: response.data.sqlQuery,
          results: response.data.results,
          resultCount: response.data.resultCount
        },
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'error',
        content: error.response?.data?.error || 'Failed to process query. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = (query) => {
    setInputQuery(query);
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
                      View SQL Query ({message.data.resultCount} results)
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
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg gradient-cyber p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-10 h-10" />
            <h1 className="text-4xl font-bold">AI Security Analytics</h1>
          </div>
          <p className="text-lg opacity-90">
            Natural Language Intelligence powered by Google Gemini AI
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Sparkles className="w-full h-full" />
        </div>
      </div>

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
            </div>
          </div>
        </div>

        {/* Suggested Queries Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-card rounded-lg border border-border p-4 h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Suggested Queries</h3>
            </div>
            <div className="space-y-4">
              {suggestedQueries.map((category, idx) => (
                <div key={idx}>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    {category.category === 'Threats' && <Shield className="w-4 h-4" />}
                    {category.category === 'Overview' && <TrendingUp className="w-4 h-4" />}
                    {category.category}
                  </h4>
                  <div className="space-y-2">
                    {category.queries.map((query, qIdx) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;
