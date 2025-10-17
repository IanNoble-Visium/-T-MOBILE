import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Clock } from 'lucide-react';

const ActivityFeed = ({ activities }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'outline';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Vulnerability': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'Malware': 'bg-red-500/10 text-red-500 border-red-500/20',
      'Phishing': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'DDoS': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'Intrusion': 'bg-red-600/10 text-red-600 border-red-600/20',
      'Data Exfiltration': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      'Anomaly': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Prevention': 'bg-green-500/10 text-green-500 border-green-500/20'
    };
    return colors[category] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#E20074]" />
            Live Activity Feed
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {activities.length} events
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-colors"
                style={{
                  animation: `fadeInSlide 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getSeverityColor(activity.severity)} className="text-xs">
                      {activity.severity.toUpperCase()}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCategoryColor(activity.category)}`}
                    >
                      {activity.category}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-[#E20074]">{activity.agentName}</span>
                  {' '}{activity.action} on{' '}
                  <span className="font-semibold text-white">{activity.target}</span>
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;

