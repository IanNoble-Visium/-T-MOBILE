import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import {
  Store,
  Search,
  Star,
  Download,
  TrendingUp,
  Shield,
  Activity,
  BarChart3,
  Users,
  FileCheck,
  Sparkles,
  Rocket
} from 'lucide-react';
import { generateTemplates } from '../lib/aiAgentMockData';

const AgentMarketplace = ({ isOpen, onClose, onDeploy }) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const generatedTemplates = generateTemplates(24);
    setTemplates(generatedTemplates);
    setFilteredTemplates(generatedTemplates);
  }, []);

  useEffect(() => {
    let filtered = templates;

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  }, [templates, categoryFilter, searchQuery, sortBy]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'network-monitoring':
        return <Activity className="w-4 h-4" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4" />;
      case 'customer-service':
        return <Users className="w-4 h-4" />;
      case 'compliance':
        return <FileCheck className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'security': 'bg-red-500/10 text-red-500 border-red-500/20',
      'network-monitoring': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'analytics': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'customer-service': 'bg-green-500/10 text-green-500 border-green-500/20',
      'compliance': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };
    return colors[category] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const handleDeploy = (template, customize = false) => {
    if (customize) {
      setSelectedTemplate(template);
    } else {
      onDeploy(template);
      onClose();
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories', count: templates.length },
    { value: 'security', label: 'Security', count: templates.filter(t => t.category === 'security').length },
    { value: 'network-monitoring', label: 'Network Monitoring', count: templates.filter(t => t.category === 'network-monitoring').length },
    { value: 'analytics', label: 'Analytics', count: templates.filter(t => t.category === 'analytics').length },
    { value: 'customer-service', label: 'Customer Service', count: templates.filter(t => t.category === 'customer-service').length },
    { value: 'compliance', label: 'Compliance', count: templates.filter(t => t.category === 'compliance').length }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-white">
            <Store className="w-6 h-6 text-[#E20074]" />
            Agent Marketplace
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Browse and deploy pre-built AI agent templates for instant security operations
          </DialogDescription>
        </DialogHeader>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value} className="text-white">
                  {cat.label} ({cat.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="rating" className="text-white">Highest Rated</SelectItem>
              <SelectItem value="downloads" className="text-white">Most Downloaded</SelectItem>
              <SelectItem value="name" className="text-white">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              className="border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all cursor-pointer group"
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl">{template.icon}</div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getCategoryColor(template.category)}`}
                  >
                    <span className="flex items-center gap-1">
                      {getCategoryIcon(template.category)}
                      {template.category.replace('-', ' ')}
                    </span>
                  </Badge>
                </div>
                <CardTitle className="text-lg text-white group-hover:text-[#E20074] transition-colors">
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Download className="w-4 h-4" />
                    <span className="text-xs">{template.downloads.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#E20074] hover:bg-[#E20074]/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeploy(template, false);
                    }}
                  >
                    <Rocket className="w-3 h-3 mr-1" />
                    Deploy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                    }}
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No templates found matching your criteria.</p>
          </div>
        )}

        {/* Template Detail View */}
        {selectedTemplate && (
          <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
            <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-3 text-white">
                  <span className="text-4xl">{selectedTemplate.icon}</span>
                  {selectedTemplate.name}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  by {selectedTemplate.author}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge
                    variant="outline"
                    className={`${getCategoryColor(selectedTemplate.category)}`}
                  >
                    {selectedTemplate.category.replace('-', ' ')}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{selectedTemplate.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">{selectedTemplate.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-400">{selectedTemplate.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Configuration</h3>
                  <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Model:</span>
                      <span className="text-white font-medium">{selectedTemplate.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Role:</span>
                      <span className="text-white font-medium">{selectedTemplate.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Integrations:</span>
                      <span className="text-white font-medium">{selectedTemplate.integrations.length} configured</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-[#E20074] hover:bg-[#E20074]/90"
                    onClick={() => handleDeploy(selectedTemplate, false)}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy Now
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDeploy(selectedTemplate, true)}
                  >
                    Customize & Deploy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AgentMarketplace;

