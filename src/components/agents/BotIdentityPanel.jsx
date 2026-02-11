import React, { useState } from 'react';
import {
  Fingerprint,
  Heart,
  Activity,
  User,
  Wrench,
  Database,
  FileText
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import ReactMarkdown from 'react-markdown';

const identityComponents = [
  {
    id: 'identity',
    name: 'IDENTITY.md',
    title: 'Who I am',
    description: 'My core definition',
    icon: Fingerprint,
    color: 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30',
    iconColor: 'text-blue-400'
  },
  {
    id: 'soul',
    name: 'SOUL.md',
    title: 'How I choose',
    description: 'My guiding values',
    icon: Heart,
    color: 'bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30',
    iconColor: 'text-purple-400'
  },
  {
    id: 'heartbeat',
    name: 'HEARTBEAT.md',
    title: 'What wakes me up',
    description: 'My recurring awareness',
    icon: Activity,
    color: 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30',
    iconColor: 'text-red-400'
  },
  {
    id: 'user',
    name: 'USER.md',
    title: 'Who I serve',
    description: 'User inputs & goals',
    icon: User,
    color: 'bg-cyan-500/20 border-cyan-500/50 hover:bg-cyan-500/30',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'tools',
    name: 'TOOLS.md',
    title: 'What I can do',
    description: 'My available capabilities',
    icon: Wrench,
    color: 'bg-pink-500/20 border-pink-500/50 hover:bg-pink-500/30',
    iconColor: 'text-pink-400'
  },
  {
    id: 'memory',
    name: 'MEMORY.md',
    title: 'What I remember',
    description: 'My stored knowledge',
    icon: Database,
    color: 'bg-teal-500/20 border-teal-500/50 hover:bg-teal-500/30',
    iconColor: 'text-teal-400'
  }
];

const IdentityViewModal = ({ isOpen, onClose, component, content }) => {
  if (!component || !content) return null;

  const Icon = component.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${component.color}`}>
              <Icon className={`w-6 h-6 ${component.iconColor}`} />
            </div>
            <div>
              <DialogTitle className="text-xl text-white">{component.name}</DialogTitle>
              <p className="text-sm text-gray-400 mt-1">{component.title} • {component.description}</p>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                className="text-gray-300 markdown-content"
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-white mb-3 mt-5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium text-white mb-2 mt-4">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300">{children}</ul>,
                  li: ({ children }) => <li className="ml-4">{children}</li>,
                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  code: ({ children }) => <code className="bg-gray-900 px-1.5 py-0.5 rounded text-[#E20074] font-mono text-xs">{children}</code>
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const BotIdentityPanel = ({ agent }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (!agent?.botIdentity) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4">
        <p className="text-sm text-gray-400">Bot Identity System data not available for this agent.</p>
      </div>
    );
  }

  const handleCardClick = (component) => {
    const content = agent.botIdentity[component.id];
    if (content) {
      setSelectedComponent({ ...component, content });
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#E20074]" />
          Bot Identity System
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          OpenClaw's advanced bot architecture defines six core identity components that shape how this agent operates, learns, and interacts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {identityComponents.map((component) => {
            const Icon = component.icon;
            const hasContent = agent.botIdentity[component.id];
            
            return (
              <button
                key={component.id}
                onClick={() => hasContent && handleCardClick(component)}
                disabled={!hasContent}
                className={`
                  ${component.color}
                  ${hasContent ? 'cursor-pointer transition-all' : 'opacity-50 cursor-not-allowed'}
                  border rounded-lg p-4 text-left
                  flex flex-col gap-2
                  focus:outline-none focus:ring-2 focus:ring-[#E20074] focus:ring-offset-2 focus:ring-offset-gray-900
                `}
                aria-label={`View ${component.name}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${component.iconColor}`} />
                    <span className="font-mono text-sm font-semibold text-white">{component.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{component.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{component.description}</p>
                </div>
                {hasContent && (
                  <div className="mt-auto pt-2 border-t border-gray-700/50">
                    <span className="text-xs text-gray-400">Click to view details →</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <IdentityViewModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedComponent(null);
        }}
        component={selectedComponent}
        content={selectedComponent?.content}
      />
    </>
  );
};

export default BotIdentityPanel;
