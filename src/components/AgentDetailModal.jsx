import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from './ui/alert-dialog';
import { toast } from 'sonner';
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

const AgentDetailModal = ({ agent, isOpen, onClose, onUpdate }) => {
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
  // Local state for Edit Configuration dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editPrompt, setEditPrompt] = useState(agent?.promptTemplate || '');
  const [editPriority, setEditPriority] = useState(agent?.priority || 'medium');
  const [editName, setEditName] = useState(agent?.name || '');
  const [editNickname, setEditNickname] = useState(agent?.nickname || '');
  const [editType, setEditType] = useState(agent?.type || 'threat-hunter');
  const [editModel, setEditModel] = useState(agent?.modelName || agent?.model || '');
  const [resetCounters, setResetCounters] = useState(false);


  const [editMaxTokens, setEditMaxTokens] = useState(Number(agent?.maxTokens) || 8000);


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
              {agent.deactivated ? (
                <Badge variant="outline" className="border-gray-500 text-gray-300">DEACTIVATED</Badge>
              ) : (
                <Badge variant={getStatusBadgeVariant(agent.status)}>
                  {agent.status.toUpperCase()}
                </Badge>
              )}
              <div className={`flex items-center gap-1 text-sm ${performance.color}`} aria-live="polite">
                <span aria-hidden>{performance.icon}</span>
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
          {/* Pause / Resume with confirmation */}
          {agent.deactivated ? (
            <Button variant="outline" className="flex-1" disabled aria-disabled>
              Deactivated
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1" aria-label={agent.status === 'idle' ? 'Resume Agent' : 'Pause Agent'}>
                  {agent.status === 'idle' ? 'Resume Agent' : 'Pause Agent'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    {agent.status === 'idle' ? 'Resume this agent?' : 'Pause this agent?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {agent.status === 'idle'
                      ? 'The agent will resume active monitoring and investigations.'
                      : 'The agent will switch to idle state and stop active tasks.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-[#E20074] hover:bg-[#E20074]/90"
                    onClick={() => {
                      const updated = {
                        ...agent,
                        status: agent.status === 'idle' ? 'active' : 'idle',
                        deactivated: false,
                        lastActive: new Date(),
                      };
                      onUpdate?.(updated);
                      toast.success(agent.status === 'idle' ? 'Agent resumed' : 'Agent paused');
                    }}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Edit Configuration */}
          <AlertDialog open={editOpen} onOpenChange={(open) => {
            setEditOpen(open);
            if (open) {
              setEditName(agent?.name || '');
              setEditNickname(agent?.nickname || '');
              setEditType(agent?.type || 'threat-hunter');
              setEditModel(agent?.modelName || agent?.model || '');
              setEditPrompt(agent?.promptTemplate || '');
              setEditPriority(agent?.priority || 'medium');
              setEditMaxTokens(Number(agent?.maxTokens) || 8000);
              setResetCounters(false);
            }
          }}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1" aria-label="Edit Configuration" disabled={agent.deactivated}>
                Edit Configuration
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Edit Configuration</AlertDialogTitle>
                <AlertDialogDescription>
                  Update key configuration fields for this agent. Changes take effect immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4 py-2">
                {/* Agent Identity */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Agent Identity</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="agentName" className="text-gray-300">Agent Name</Label>
                      <Input id="agentName" value={editName} onChange={(e) => setEditName(e.target.value)} aria-label="Agent name" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="agentNickname" className="text-gray-300">Nickname</Label>
                      <Input id="agentNickname" value={editNickname} onChange={(e) => setEditNickname(e.target.value)} aria-label="Agent nickname" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="agentType" className="text-gray-300">Type</Label>
                      <Select value={editType} onValueChange={setEditType}>
                        <SelectTrigger id="agentType" className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="threat-hunter">Threat Hunter</SelectItem>
                          <SelectItem value="vulnerability-scanner">Vulnerability Scanner</SelectItem>
                          <SelectItem value="anomaly-detector">Anomaly Detector</SelectItem>
                          <SelectItem value="incident-responder">Incident Responder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="agentModel" className="text-gray-300">Model</Label>
                      <Input id="agentModel" value={editModel} onChange={(e) => setEditModel(e.target.value)} placeholder="e.g., GPT-4 Turbo" aria-label="Model name" />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                {/* Configuration */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Configuration</p>
                  <div className="space-y-1">
                    <Label htmlFor="prompt" className="text-gray-300">Prompt Template</Label>
                    <Textarea id="prompt" value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} className="min-h-24" aria-label="Prompt template" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="priority" className="text-gray-300">Priority</Label>
                      <Select value={editPriority} onValueChange={setEditPriority}>
                        <SelectTrigger id="priority" className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="maxTokens" className="text-gray-300">Max Tokens</Label>
                      <Input id="maxTokens" type="number" min={256} step={1} value={editMaxTokens} onChange={(e) => setEditMaxTokens(e.target.value)} aria-label="Max tokens" />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                {/* Performance */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Performance</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-300">
                    <div>Findings: {agent.findings ?? 0}</div>
                    <div>Alerts Raised: {agent.alertsRaised ?? 0}</div>
                    <div>Token Usage: {agent.tokenUsage ?? 0}</div>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="resetCounters" checked={resetCounters} onCheckedChange={setResetCounters} aria-label="Reset performance counters to zero" />
                      <Label htmlFor="resetCounters" className="text-gray-300">Reset performance counters to zero</Label>
                    </div>
                  </div>
                </div>
              </div>

              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#E20074] hover:bg-[#E20074]/90"
                  onClick={() => {
                    const updated = {
                      ...agent,
                      name: editName,
                      nickname: editNickname,
                      type: editType,
                      modelName: editModel,
                      model: editModel,
                      promptTemplate: editPrompt,
                      priority: editPriority,
                      maxTokens: Number(editMaxTokens),
                      ...(resetCounters ? { findings: 0, alertsRaised: 0, tokenUsage: 0 } : {}),
                    };
                    onUpdate?.(updated);
                    toast.success(resetCounters ? 'Configuration updated and counters reset' : 'Configuration updated');
                    setEditOpen(false);
                  }}
                >
                  Save Changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Deactivate */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1" aria-label="Deactivate Agent" disabled={agent.deactivated}>
                Deactivate Agent
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Deactivate this agent?</AlertDialogTitle>
                <AlertDialogDescription>
                  The agent will be set to an inactive state and removed from active monitoring until resumed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#E20074] hover:bg-[#E20074]/90"
                  onClick={() => {
                    const updated = {
                      ...agent,
                      status: 'idle',
                      deactivated: true,
                      lastActive: new Date(),
                    };
                    onUpdate?.(updated);
                    toast.success('Agent deactivated');
                  }}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentDetailModal;

