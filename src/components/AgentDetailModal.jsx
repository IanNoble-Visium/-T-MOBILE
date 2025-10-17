import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bot, 
  Activity, 
  AlertTriangle, 
  Shield, 
  Eye, 
  Zap,
  Clock,
  TrendingUp,
  Target,
  Settings,
  BarChart3,
  FileText,
  X
} from 'lucide-react';

const AgentDetailModal = ({ agent, isOpen, onClose }) => {
  if (!agent) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'investigating':
        return 'bg-orange-500';
      case 'responding':
        return 'bg-red-500';
      case 'idle':
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'investigating':
        return 'secondary';
      case 'responding':
        return 'destructive';
      case 'idle':
      default:
        return 'outline';
    }
  };

  const getPerformanceIndicator = () => {
    if (agent.efficiency > 80 && agent.falsePositiveRate < 5) {
      return { color: 'text-green-500', icon: '🟢', label: 'High Performance' };
    } else if (agent.efficiency < 60 || agent.falsePositiveRate > 10) {
      return { color: 'text-red-500', icon: '🔴', label: 'Needs Attention' };
    } else {
      return { color: 'text-yellow-500', icon: '🟡', label: 'Average Performance' };
    }
  };

  const getTypeIcon = () => {
    switch (agent.type) {
      case 'threat-hunter':
        return <Activity className="w-6 h-6" />;
      case 'vulnerability-scanner':
        return <Shield className="w-6 h-6" />;
      case 'anomaly-detector':
        return <Eye className="w-6 h-6" />;
      case 'incident-responder':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <Bot className="w-6 h-6" />;
    }
  };

  const performance = getPerformanceIndicator();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gray-800">
                {getTypeIcon()}
              </div>
              <div>
                <DialogTitle className="text-2xl text-white">{agent.nickname}</DialogTitle>
                <DialogDescription className="text-gray-400">{agent.name}</DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(agent.status)}>
                {agent.status.toUpperCase()}
              </Badge>
              <div className={`flex items-center gap-1 text-sm ${performance.color}`}>
                <span>{performance.icon}</span>
                <span>{performance.label}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Basic Info */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Agent ID</p>
                  <p className="text-white font-mono">{agent.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="text-white capitalize">{agent.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="text-white">{agent.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Priority</p>
                  <Badge variant={agent.priority === 'high' ? 'destructive' : 'secondary'}>
                    {agent.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Model</p>
                  <Badge variant="outline" className="border-[#E20074] text-[#E20074]">
                    {agent.modelName}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Provider</p>
                  <p className="text-white">{agent.modelProvider}</p>
                </div>
              </div>
            </div>

            {/* Current Task */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Current Task
              </h3>
              <p className="text-gray-300">{agent.currentTask}</p>
            </div>

            {/* Purpose */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Purpose</h3>
              <p className="text-gray-300">{agent.purpose}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Findings</p>
                <p className="text-2xl font-bold text-white">{agent.findings}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Alerts Raised</p>
                <p className="text-2xl font-bold text-white">{agent.alertsRaised}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Efficiency</p>
                <p className="text-2xl font-bold text-green-500">{agent.efficiency}%</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-blue-500">{agent.accuracy}%</p>
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Metrics
              </h3>
              
              {/* Efficiency */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Efficiency</span>
                  <span className="text-sm font-semibold text-white">{agent.efficiency}%</span>
                </div>
                <Progress value={agent.efficiency} className="h-2" />
              </div>

              {/* Accuracy */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Accuracy</span>
                  <span className="text-sm font-semibold text-white">{agent.accuracy}%</span>
                </div>
                <Progress value={agent.accuracy} className="h-2" />
              </div>

              {/* Response Time */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Response Time
                  </span>
                  <span className="text-sm font-semibold text-white">{agent.responseTime}ms</span>
                </div>
              </div>

              {/* False Positive Rate */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">False Positive Rate</span>
                  <span className={`text-sm font-semibold ${agent.falsePositiveRate < 5 ? 'text-green-500' : agent.falsePositiveRate > 10 ? 'text-red-500' : 'text-yellow-500'}`}>
                    {agent.falsePositiveRate}%
                  </span>
                </div>
                <Progress value={agent.falsePositiveRate} className="h-2" />
              </div>

              {/* Token Usage */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Token Usage</span>
                  <span className="text-sm font-semibold text-white">
                    {agent.tokenUsage.toLocaleString()} / {agent.maxTokens.toLocaleString()}
                  </span>
                </div>
                <Progress value={(agent.tokenUsage / agent.maxTokens) * 100} className="h-2" />
              </div>

              {/* Cost */}
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
                <span className="text-sm text-gray-400">Estimated Cost</span>
                <span className="text-lg font-bold text-[#E20074]">${agent.tokenCost.toFixed(4)}</span>
              </div>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration
              </h3>

              {/* Prompt Template */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Prompt Template</p>
                <div className="bg-gray-900 rounded p-3 font-mono text-xs text-gray-300 max-h-40 overflow-y-auto">
                  {agent.promptTemplate}
                </div>
              </div>

              {/* Integrations */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Integrations</p>
                <div className="flex flex-wrap gap-2">
                  {agent.integrations && agent.integrations.map((integration, index) => (
                    <Badge key={index} variant="outline">
                      {integration}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Created At</p>
                  <p className="text-white">{new Date(agent.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Active</p>
                  <p className="text-white">{new Date(agent.lastActive).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-900 rounded">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Detected potential threat</p>
                    <p className="text-xs text-gray-400">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-900 rounded">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Completed vulnerability scan</p>
                    <p className="text-xs text-gray-400">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-900 rounded">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Raised alert for anomaly</p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-800">
          <Button variant="outline" className="flex-1">
            Pause Agent
          </Button>
          <Button variant="outline" className="flex-1">
            Edit Configuration
          </Button>
          <Button variant="destructive" className="flex-1">
            Deactivate Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentDetailModal;

