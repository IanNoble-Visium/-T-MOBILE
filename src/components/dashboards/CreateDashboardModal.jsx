import { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const CreateDashboardModal = ({ onClose, onCreate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [suggestedPrompts] = useState([
    'Create a dashboard that shows network topology with alarm status and utilization metrics',
    'Build a dashboard for SOC/NOC to determine saturation awareness',
    'Show device health metrics and connection status across regions',
    'Display threat detection trends and incident response metrics',
    'Create a network performance dashboard with latency and bandwidth analysis'
  ]);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/dashboards/enhance-prompt`, {
        userPrompt: prompt
      });
      setPrompt(response.data.enhancedPrompt);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onCreate(prompt);
      setPrompt('');
    }
  };

  const handleSuggestedPrompt = (suggestedPrompt) => {
    setPrompt(suggestedPrompt);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900">
          <div>
            <h2 className="text-2xl font-bold text-white">Create with AI</h2>
            <p className="text-sm text-slate-400 mt-1">
              AI will generate a dashboard for your graph. Guide it with a prompt, or receive a generic dashboard based on your database schema.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Input Area */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Optional: Describe a focus, e.g., 'product sales in the last 30 days'"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:border-transparent resize-none"
                rows="4"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={!prompt.trim() || isEnhancing || isLoading}
                className="absolute top-3 right-3 p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:text-[#E20074]"
                title="Enhance prompt with AI"
              >
                {isEnhancing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Click the sparkle icon to enhance your prompt with database context
            </p>

            {/* Suggested Prompts */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-300">Suggested prompts:</p>
              <div className="space-y-2">
                {suggestedPrompts.map((suggested, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestedPrompt(suggested)}
                    className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
                  >
                    {suggested}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="flex-1 px-4 py-3 bg-[#0066CC] text-white rounded-lg hover:bg-[#0066CC]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-300">
              <strong>Note:</strong> AI can make mistakes - always validate and refine your dashboard after it is created. You can edit individual charts or remove them as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDashboardModal;

