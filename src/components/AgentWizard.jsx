import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import {
  Bot,
  Sparkles,
  Target,
  MessageSquare,
  Plug,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';
import { aiModels } from '../lib/aiAgentMockData';

const AgentWizard = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agentData, setAgentData] = useState({
    name: '',
    nickname: '',
    description: '',
    icon: '🤖',
    model: 'gpt-4-turbo',
    role: '',
    purpose: '',
    promptTemplate: '',
    temperature: 0.7,
    maxTokens: 2000,
    integrations: [],
    testPrompt: '',
    testResponse: ''
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: 'Basic Info', icon: Bot },
    { number: 2, title: 'Model Selection', icon: Sparkles },
    { number: 3, title: 'Role & Purpose', icon: Target },
    { number: 4, title: 'Prompt Config', icon: MessageSquare },
    { number: 5, title: 'Integrations', icon: Plug },
    { number: 6, title: 'Test & Deploy', icon: Rocket }
  ];

  const agentRoles = [
    'Threat Detection Specialist',
    'Vulnerability Hunter',
    'Anomaly Analyzer',
    'Incident Responder',
    'Network Monitor',
    'Security Analyst',
    'Risk Assessor',
    'Compliance Officer'
  ];

  const availableIntegrations = [
    { id: 'neo4j', name: 'Neo4j Graph Database', icon: '🔷' },
    { id: 'siem', name: 'SIEM Integration', icon: '🛡️' },
    { id: 't-platform', name: 'T-Platform', icon: '📡' },
    { id: 'slack', name: 'Slack Notifications', icon: '💬' },
    { id: 'email', name: 'Email Alerts', icon: '📧' },
    { id: 'pagerduty', name: 'PagerDuty', icon: '🚨' }
  ];

  const iconOptions = ['🤖', '🛡️', '🔍', '⚡', '🎯', '🔒', '👁️', '🚀'];

  const updateAgentData = (field, value) => {
    setAgentData(prev => ({ ...prev, [field]: value }));
  };

  const toggleIntegration = (integrationId) => {
    setAgentData(prev => ({
      ...prev,
      integrations: prev.integrations.includes(integrationId)
        ? prev.integrations.filter(id => id !== integrationId)
        : [...prev.integrations, integrationId]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTest = () => {
    // Simulate AI response
    updateAgentData('testResponse', `Based on your prompt, I am a ${agentData.role} specialized in ${agentData.purpose}. I'm ready to assist with threat detection and security analysis for T-Mobile's network infrastructure.`);
  };

  const handleDeploy = () => {
    onComplete(agentData);
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return agentData.name && agentData.nickname;
      case 2:
        return agentData.model;
      case 3:
        return agentData.role && agentData.purpose;
      case 4:
        return agentData.promptTemplate;
      case 5:
        return true; // Integrations are optional
      case 6:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-white">
            <Bot className="w-6 h-6 text-[#E20074]" />
            Create New AI Agent
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div
                  key={step.number}
                  className={`flex flex-col items-center gap-1 ${
                    isCurrent ? 'text-[#E20074]' : isCompleted ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCurrent ? 'border-[#E20074] bg-[#E20074]/10' :
                    isCompleted ? 'border-green-500 bg-green-500/10' :
                    'border-gray-600 bg-gray-800'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Agent Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Agent-42"
                  value={agentData.name}
                  onChange={(e) => updateAgentData('name', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="nickname" className="text-white">Display Name / Nickname *</Label>
                <Input
                  id="nickname"
                  placeholder="e.g., Sentinel-42"
                  value={agentData.nickname}
                  onChange={(e) => updateAgentData('nickname', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of what this agent does..."
                  value={agentData.description}
                  onChange={(e) => updateAgentData('description', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-white">Icon</Label>
                <div className="flex gap-2 mt-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      onClick={() => updateAgentData('icon', icon)}
                      className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                        agentData.icon === icon
                          ? 'border-[#E20074] bg-[#E20074]/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Model Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-white mb-3 block">Select AI Model *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiModels.map(model => (
                    <Card
                      key={model.id}
                      className={`cursor-pointer transition-all ${
                        agentData.model === model.id
                          ? 'border-[#E20074] bg-[#E20074]/5'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                      onClick={() => updateAgentData('model', model.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-white">{model.name}</h4>
                            <p className="text-xs text-gray-400">{model.provider}</p>
                          </div>
                          {agentData.model === model.id && (
                            <Check className="w-5 h-5 text-[#E20074]" />
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline" className="text-xs">
                            ${model.cost}/1K tokens
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-400">
                  💡 <strong>Tip:</strong> GPT-4 Turbo offers the best balance of performance and cost for most security tasks.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Role & Purpose */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="role" className="text-white">Agent Role *</Label>
                <Select value={agentData.role} onValueChange={(value) => updateAgentData('role', value)}>
                  <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a role..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {agentRoles.map(role => (
                      <SelectItem key={role} value={role} className="text-white">
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="purpose" className="text-white">Purpose / Objective *</Label>
                <Textarea
                  id="purpose"
                  placeholder="Describe the agent's primary objective and what it should focus on..."
                  value={agentData.purpose}
                  onChange={(e) => updateAgentData('purpose', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  rows={4}
                />
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-sm text-purple-400">
                  <strong>Example Purpose:</strong> "Monitor T-Mobile's 5G network infrastructure for anomalous traffic patterns, detect potential DDoS attacks, and alert security teams of suspicious behavior in real-time."
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Prompt Configuration */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="promptTemplate" className="text-white">System Prompt Template *</Label>
                <Textarea
                  id="promptTemplate"
                  placeholder="You are a [role] for T-Mobile. Your objective is to..."
                  value={agentData.promptTemplate}
                  onChange={(e) => updateAgentData('promptTemplate', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white font-mono text-sm"
                  rows={8}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="temperature" className="text-white">Temperature (Creativity)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={agentData.temperature}
                    onChange={(e) => updateAgentData('temperature', parseFloat(e.target.value))}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">0 = Focused, 1 = Creative</p>
                </div>

                <div>
                  <Label htmlFor="maxTokens" className="text-white">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    value={agentData.maxTokens}
                    onChange={(e) => updateAgentData('maxTokens', parseInt(e.target.value))}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">Response length limit</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Integrations */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <Label className="text-white mb-3 block">Select Integrations</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableIntegrations.map(integration => (
                    <Card
                      key={integration.id}
                      className={`cursor-pointer transition-all ${
                        agentData.integrations.includes(integration.id)
                          ? 'border-[#E20074] bg-[#E20074]/5'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                      onClick={() => toggleIntegration(integration.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{integration.icon}</span>
                            <span className="font-medium text-white">{integration.name}</span>
                          </div>
                          {agentData.integrations.includes(integration.id) && (
                            <Check className="w-5 h-5 text-[#E20074]" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm text-green-400">
                  ✓ Selected {agentData.integrations.length} integration(s). You can modify these later.
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Test & Deploy */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold text-white mb-3">Agent Configuration Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white font-medium">{agentData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model:</span>
                    <span className="text-white font-medium">
                      {aiModels.find(m => m.id === agentData.model)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <span className="text-white font-medium">{agentData.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Integrations:</span>
                    <span className="text-white font-medium">{agentData.integrations.length} selected</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="testPrompt" className="text-white">Test Prompt (Optional)</Label>
                <Textarea
                  id="testPrompt"
                  placeholder="Enter a test prompt to see how your agent responds..."
                  value={agentData.testPrompt}
                  onChange={(e) => updateAgentData('testPrompt', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
                <Button
                  onClick={handleTest}
                  variant="outline"
                  className="mt-2"
                  size="sm"
                >
                  Test Agent
                </Button>
              </div>

              {agentData.testResponse && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-400 font-semibold mb-2">Agent Response:</p>
                  <p className="text-sm text-white">{agentData.testResponse}</p>
                </div>
              )}

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm text-green-400">
                  🚀 <strong>Ready to Deploy!</strong> Your agent is configured and ready to start monitoring the T-Mobile network.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <DialogFooter className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-[#E20074] hover:bg-[#E20074]/90"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleDeploy}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Rocket className="w-4 h-4" />
                Deploy Agent
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentWizard;

