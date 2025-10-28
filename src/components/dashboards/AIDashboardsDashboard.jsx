import { useState, useEffect, useRef } from 'react';
import {
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  Save,
  Download,
  Upload,
  Sparkles,
  Loader2,
  X,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import CreateDashboardModal from '@/components/dashboards/CreateDashboardModal';
import ChartComponent from '@/components/dashboards/ChartComponent';
import SaveDashboardModal from '@/components/dashboards/SaveDashboardModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const AIDashboardsDashboard = () => {
  const [charts, setCharts] = useState([]);
  const [savedDashboards, setSavedDashboards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [editingChartId, setEditingChartId] = useState(null);
  const [showDashboardSelector, setShowDashboardSelector] = useState(false);

  // Load saved dashboards on mount
  useEffect(() => {
    loadSavedDashboards();
  }, []);

  const loadSavedDashboards = () => {
    try {
      const saved = localStorage.getItem('ai_dashboards');
      if (saved) {
        setSavedDashboards(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved dashboards:', error);
    }
  };

  const handleCreateDashboard = async (prompt) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/dashboards/generate`, {
        prompt,
        context: {
          timestamp: new Date().toISOString(),
          dataSource: ['neo4j', 'postgresql']
        }
      });

      const newCharts = response.data.charts || [];
      setCharts(prev => [...prev, ...newCharts]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating dashboard:', error);
      alert('Failed to create dashboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveChart = (chartId) => {
    setCharts(prev => prev.filter(chart => chart.id !== chartId));
  };

  const handleEditChart = (chartId) => {
    setEditingChartId(chartId);
  };

  const handleUpdateChart = (chartId, updatedChart) => {
    setCharts(prev =>
      prev.map(chart => (chart.id === chartId ? updatedChart : chart))
    );
    setEditingChartId(null);
  };

  const handleSaveDashboard = (dashboardName) => {
    const dashboard = {
      id: Date.now().toString(),
      name: dashboardName,
      charts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [...savedDashboards, dashboard];
    setSavedDashboards(updated);
    localStorage.setItem('ai_dashboards', JSON.stringify(updated));
    setShowSaveModal(false);
  };

  const handleLoadDashboard = (dashboardId) => {
    const dashboard = savedDashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      setCharts(dashboard.charts);
      setSelectedDashboard(dashboard);
      setShowDashboardSelector(false);
    }
  };

  const handleDeleteDashboard = (dashboardId) => {
    const updated = savedDashboards.filter(d => d.id !== dashboardId);
    setSavedDashboards(updated);
    localStorage.setItem('ai_dashboards', JSON.stringify(updated));
    if (selectedDashboard?.id === dashboardId) {
      setSelectedDashboard(null);
      setCharts([]);
    }
  };

  const handleExportDashboard = () => {
    const data = {
      dashboard: selectedDashboard,
      charts,
      exportedAt: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${selectedDashboard?.name || 'export'}.json`;
    a.click();
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg gradient-cyber p-8 text-white">
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BarChart3 className="w-10 h-10 flex-shrink-0" />
            <h1 className="text-4xl font-bold whitespace-nowrap">AI Dashboards</h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl">
            Create intelligent dashboards with natural language prompts powered by AI
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E20074] text-white rounded-lg hover:bg-[#E20074]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Dashboard
        </button>

        {charts.length > 0 && (
          <>
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0066CC]/90 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Dashboard
            </button>

            {selectedDashboard && (
              <button
                onClick={handleExportDashboard}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            )}
          </>
        )}

        {savedDashboards.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowDashboardSelector(!showDashboardSelector)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Load Dashboard
              <ChevronDown className="w-4 h-4" />
            </button>

            {showDashboardSelector && (
              <div className="absolute top-full mt-2 left-0 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 min-w-64">
                {savedDashboards.map(dashboard => (
                  <div
                    key={dashboard.id}
                    className="flex items-center justify-between p-3 hover:bg-slate-700 border-b border-slate-700 last:border-b-0"
                  >
                    <button
                      onClick={() => handleLoadDashboard(dashboard.id)}
                      className="flex-1 text-left text-white hover:text-[#E20074] transition-colors"
                    >
                      <div className="font-medium">{dashboard.name}</div>
                      <div className="text-xs text-slate-400">
                        {dashboard.charts.length} charts
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteDashboard(dashboard.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Charts Grid */}
      {charts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts.map(chart => (
            <div
              key={chart.id}
              className="relative bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-[#E20074]/50 transition-colors"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleEditChart(chart.id)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-[#E20074]"
                  title="Edit chart"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRemoveChart(chart.id)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                  title="Remove chart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ChartComponent
                chart={chart}
                isEditing={editingChartId === chart.id}
                onUpdate={(updated) => handleUpdateChart(chart.id, updated)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BarChart3 className="w-16 h-16 text-slate-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Dashboards Yet</h2>
          <p className="text-slate-400 mb-6">
            Create your first dashboard by clicking the "Create Dashboard" button above
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-[#E20074] text-white rounded-lg hover:bg-[#E20074]/90 transition-colors"
          >
            Create Your First Dashboard
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateDashboardModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateDashboard}
          isLoading={isLoading}
        />
      )}

      {showSaveModal && (
        <SaveDashboardModal
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveDashboard}
        />
      )}
    </div>
  );
};

export default AIDashboardsDashboard;
