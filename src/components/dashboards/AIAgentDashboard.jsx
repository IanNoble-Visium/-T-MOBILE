import React, { useState, useEffect, useMemo, useRef } from 'react';
import AgentWizard from '../AgentWizard';
import AgentMarketplace from '../AgentMarketplace';
import AgentDetailModal from '../AgentDetailModal';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import KPICard from '../KPICard';
import AgentCard from '../AgentCard';
import ActivityFeed from '../ActivityFeed';
import {
  Bot,
  Plus,
  Store,
  TrendingUp,
  Clock,
  Zap,
  Users
} from 'lucide-react';
import {
  generateAgents,
  generateActivityStream,
  generateActivity,
  generateAgentKPIs
} from '../../lib/aiAgentMockData';

const AIAgentDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [kpis, setKPIs] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  // Search and Filters
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [perfFilter, setPerfFilter] = useState('all');
  const searchInputRef = useRef(null);

  const getPerfLevel = (a) => {
    if (a.efficiency > 80 && a.falsePositiveRate < 5) return 'high';
    if (a.efficiency < 60 || a.falsePositiveRate > 10) return 'needs-attention';
    return 'average';
  };

  const filteredAgents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter((a) => {
      // Text match (id, name, nickname, role, type, modelName)
      const matchesQuery = q === '' || [a.id, a.name, a.nickname, a.role, a.type, a.modelName]
        .some((v) => String(v).toLowerCase().includes(q));

      // Status
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;

      // Type
      const matchesType = typeFilter === 'all' || a.type === typeFilter;

      // Model
      const matchesModel = modelFilter === 'all' || a.modelName === modelFilter;

      // Performance
      const matchesPerf = perfFilter === 'all' || getPerfLevel(a) === perfFilter;

      return matchesQuery && matchesStatus && matchesType && matchesModel && matchesPerf;
    });
  }, [agents, query, statusFilter, typeFilter, modelFilter, perfFilter]);
  const types = useMemo(() => Array.from(new Set(agents.map(a => a.type))).sort(), [agents]);
  const models = useMemo(() => Array.from(new Set(agents.map(a => a.modelName))).sort(), [agents]);

  // Count active filters (query + non-"all" selections)
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (query.trim() !== '') n++;
    if (statusFilter !== 'all') n++;
    if (typeFilter !== 'all') n++;
    if (modelFilter !== 'all') n++;
    if (perfFilter !== 'all') n++;
    return n;
  }, [query, statusFilter, typeFilter, modelFilter, perfFilter]);

  // Focus search on Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setModelFilter('all');
    setPerfFilter('all');
  };

  // Apply agent updates from modal actions
  const handleAgentUpdate = (updatedAgent) => {
    setAgents((prev) => {
      const next = prev.map((a) => (a.id === updatedAgent.id ? updatedAgent : a));
      setKPIs(generateAgentKPIs(next));
      return next;
    });
    setSelectedAgent(updatedAgent);
  };

  const [showMarketplace, setShowMarketplace] = useState(false);

  const handleWizardComplete = (newAgentData) => {
    // Create new agent from wizard data
    const newAgent = {
      ...newAgentData,
      id: `agent-${agents.length + 1}`,
      status: 'idle',
      type: 'threat-hunter',
      priority: 'medium',
      findings: 0,
      alertsRaised: 0,
      efficiency: 85,
      accuracy: 90,
      responseTime: 1500,
      falsePositiveRate: 3,
      tokenUsage: 0,
      tokenCost: 0,
      createdAt: new Date(),
      lastActive: new Date(),
      avgRating: 4.5,
      collaborationCount: 0
    };
    setAgents(prev => [...prev, newAgent]);
    setKPIs(generateAgentKPIs([...agents, newAgent]));
  };

  const handleMarketplaceDeploy = (template) => {
    // Create agent from marketplace template
    const newAgent = {
      id: `agent-${agents.length + 1}`,
      name: `Agent-${agents.length + 1}`,
      nickname: template.name,
      status: 'idle',
      model: template.model,
      modelName: template.model,
      modelProvider: 'OpenAI',
      role: template.role,
      purpose: template.description,
      currentTask: 'Initializing...',
      type: 'threat-hunter',
      priority: 'medium',
      findings: 0,
      alertsRaised: 0,
      efficiency: 85,
      accuracy: 90,
      responseTime: 1500,
      falsePositiveRate: 3,
      tokenUsage: 0,
      maxTokens: 100000,
      tokenCost: 0,
      createdAt: new Date(),
      lastActive: new Date(),
      promptTemplate: template.promptTemplate,
      integrations: template.integrations,
      avgRating: 4.5,
      collaborationCount: 0
    };
    setAgents(prev => [...prev, newAgent]);
    setKPIs(generateAgentKPIs([...agents, newAgent]));
  };

  // Initialize data
  useEffect(() => {
    const initialAgents = generateAgents(40);
    setAgents(initialAgents);
    setKPIs(generateAgentKPIs(initialAgents));
    setActivities(generateActivityStream(50));
  }, []);

  // Real-time activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 99)]);

      // Update agent metrics randomly
      setAgents(prev => prev.map(agent => {
        if (Math.random() > 0.8) {
          return {
            ...agent,
            findings: agent.findings + Math.floor(Math.random() * 3),
            alertsRaised: agent.alertsRaised + (Math.random() > 0.9 ? 1 : 0),
            lastActive: new Date()
          };
        }
        return agent;
      }));

      // Update KPIs
      setKPIs(prev => ({
        ...prev,
        threatsDetected24h: prev.threatsDetected24h + Math.floor(Math.random() * 2)
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
  };

  const handleCloseAgentDetail = () => {
    setSelectedAgent(null);
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-[#E20074]" />
              AI Agents Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Real-time monitoring of {agents.length} AI agents scanning T-Mobile network for threats
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowMarketplace(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Agent Marketplace
            </Button>
            <Button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-2 bg-[#E20074] hover:bg-[#E20074]/90"
            >
              <Plus className="w-4 h-4" />
              Create Agent
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Active Agents"
          value={kpis.activeAgents || 0}
          subtitle={`${kpis.idleAgents || 0} idle agents`}
          trend="+12%"
          icon={<Bot className="w-6 h-6" />}
          color="green"
        />
        <KPICard
          title="Threats Detected (24h)"
          value={kpis.threatsDetected24h || 0}
          subtitle="Critical incidents"
          trend="+8%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="red"
        />
        <KPICard
          title="Avg Response Time"
          value={`${kpis.avgResponseTime || 0}ms`}
          subtitle="2.3s average"
          trend="-15%"
          icon={<Clock className="w-6 h-6" />}
          color="blue"
        />
        <KPICard
          title="Agent Efficiency"
          value={`${kpis.avgEfficiency || 0}%`}
          subtitle="Overall performance"
          trend="+5%"
          icon={<Zap className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Agent Grid (2/3 width) */}
        <div className="lg:col-span-2">
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#E20074]" />
                  Agent Status Panel
                </h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    🟢 {agents.filter(a => a.efficiency > 80 && a.falsePositiveRate < 5).length} High Performers
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    🔴 {agents.filter(a => a.efficiency < 60 || a.falsePositiveRate > 10).length} Need Attention
                  </Badge>
                </div>
              </div>

              {/* Search + Filters */}
              <div className="mb-4 grid grid-cols-1 xl:grid-cols-5 gap-3">
                <div className="xl:col-span-2">
                  <Input
                    ref={searchInputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search agents (Ctrl/Cmd+K)"
                    aria-label="Search agents"
                  />
                  {activeFilterCount > 0 && (
                    <div className="mt-1">
                      <Badge className="bg-[#E20074] text-white">
                        {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
                      </Badge>
                    </div>
                  )}
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger aria-label="Filter by status" className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="responding">Responding</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger aria-label="Filter by type" className="w-full">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map((t) => (
                      <SelectItem key={t} value={t}>{t.replace('-', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={modelFilter} onValueChange={setModelFilter}>
                  <SelectTrigger aria-label="Filter by model" className="w-full">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    {models.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={perfFilter} onValueChange={setPerfFilter}>
                  <SelectTrigger aria-label="Filter by performance" className="w-full">
                    <SelectValue placeholder="Performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Performance</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="needs-attention">Needs Attention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active filters + result count */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex flex-wrap gap-2">
                  {query && <Badge variant="outline">Query: {query}</Badge>}
                  {statusFilter !== 'all' && <Badge variant="outline">Status: {statusFilter}</Badge>}
                  {typeFilter !== 'all' && <Badge variant="outline">Type: {typeFilter}</Badge>}
                  {modelFilter !== 'all' && <Badge variant="outline">Model: {modelFilter}</Badge>}
                  {perfFilter !== 'all' && <Badge variant="outline">Perf: {perfFilter}</Badge>}
                  {(query || statusFilter !== 'all' || typeFilter !== 'all' || modelFilter !== 'all' || perfFilter !== 'all') && (
                    <Button size="sm" variant="ghost" onClick={clearFilters} className="text-gray-300 hover:text-white">
                      Clear
                    </Button>
                  )}
                </div>
                <div className="text-gray-400">
                  Showing <span className="text-white font-semibold">{filteredAgents.length}</span> of {agents.length}
                </div>
              </div>


              {/* Agent Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredAgents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onClick={handleAgentClick}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Analytics */}
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#E20074]" />
                Performance Metrics
              </h2>

              <div className="space-y-4">
                {/* Detection Speed */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Detection Speed</span>
                    <span className="text-sm font-semibold text-white">2.3s avg</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                {/* False Positive Rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">False Positive Rate</span>
                    <span className="text-sm font-semibold text-white">3.2%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>

                {/* System Uptime */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">System Uptime</span>
                    <span className="text-sm font-semibold text-white">99.8%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                  </div>
                </div>

                {/* Agent Utilization */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Agent Utilization</span>
                    <span className="text-sm font-semibold text-white">87%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />

          {/* Agent Collaboration */}
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-6">
            <CardContent className="p-6">




              <h2 className="text-lg font-semibold text-white mb-4">Agent Collaboration</h2>
              <div className="space-y-3">
                <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                  Delegate: Threat Hunter → Vulnerability Scanner
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                  Task Transfer: Anomaly Detector → Incident Responder
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                  Joint Investigation: Multi-Agent Analysis
                </Button>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <p className="text-xs text-gray-400 font-semibold mb-2">Active Collaborations:</p>
                  <div className="space-y-1 text-xs text-gray-300">
                    <p>• Agent-7 ↔ Agent-12 (threat correlation)</p>
                    <p>• Agent-3 → Agent-15 (evidence sharing)</p>
                    <p>• Agent-9 → Agent-22 (pattern analysis)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Scenarios */}
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm mt-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Training Scenarios</h2>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start text-xs text-red-400 border-red-400/30">
                  🏴‍☠️ Ransomware Simulation
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start text-xs text-orange-400 border-orange-400/30">
                  🎯 APT Attack Chain
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start text-xs text-yellow-400 border-yellow-400/30">
                  🔓 Zero-Day Exploitation
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start text-xs text-green-400 border-green-400/30">
                  🕵️ Insider Threat Exercise
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AgentWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />

      <AgentMarketplace
        isOpen={showMarketplace}
        onClose={() => setShowMarketplace(false)}
        onDeploy={handleMarketplaceDeploy}
      />

      {/* Add CSS for animations */}
      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Agent Detail Modal */}
      <AgentDetailModal
        agent={selectedAgent}
        isOpen={!!selectedAgent}
        onClose={handleCloseAgentDetail}
        onUpdate={handleAgentUpdate}
      />
    </div>
  );
};

export default AIAgentDashboard;

