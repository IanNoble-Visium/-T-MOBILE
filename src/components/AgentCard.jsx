import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Bot, Activity, AlertTriangle, Shield, Eye, Zap } from 'lucide-react';

const AgentCard = ({ agent, onClick }) => {
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
        return <Activity className="w-5 h-5" />;
      case 'vulnerability-scanner':
        return <Shield className="w-5 h-5" />;
      case 'anomaly-detector':
        return <Eye className="w-5 h-5" />;
      case 'incident-responder':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bot className="w-5 h-5" />;
    }
  };

  const performance = getPerformanceIndicator();

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-800 bg-gray-900/50 backdrop-blur-sm"
      onClick={() => onClick(agent)}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gray-800">
              {getTypeIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">{agent.nickname}</h3>
              <p className="text-xs text-gray-400">{agent.name}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={getStatusBadgeVariant(agent.status)} className="text-xs">
              {agent.status.toUpperCase()}
            </Badge>
            <div className={`flex items-center gap-1 text-xs ${performance.color}`}>
              <span>{performance.icon}</span>
            </div>
          </div>
        </div>

        {/* Model Badge */}
        <div className="mb-3">
          <Badge variant="outline" className="text-xs border-[#E20074] text-[#E20074]">
            {agent.modelName}
          </Badge>
        </div>

        {/* Current Task */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1">Current Task:</p>
          <p className="text-xs text-gray-200 line-clamp-2">{agent.currentTask}</p>
        </div>

        {/* Efficiency Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Efficiency</span>
            <span className="text-xs font-semibold text-white">{agent.efficiency}%</span>
          </div>
          <Progress value={agent.efficiency} className="h-1.5" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
          <div className="bg-gray-800/50 rounded p-2">
            <p className="text-xs text-gray-400">Findings</p>
            <p className="text-sm font-semibold text-white">{agent.findings}</p>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <p className="text-xs text-gray-400">Alerts</p>
            <p className="text-sm font-semibold text-white">{agent.alertsRaised}</p>
          </div>
          <div className="bg-gray-800/50 rounded p-2">
            <p className="text-xs text-gray-400">Accuracy</p>
            <p className="text-sm font-semibold text-white">{agent.accuracy}%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8"
            onClick={(e) => {
              e.stopPropagation();
              onClick(agent);
            }}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;

