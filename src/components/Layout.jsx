import React, { useState } from 'react';
import { PanelLeft, Search, FileText, Settings, Plus, ChevronDown, Bot, X, Maximize2, Minimize2 } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [aiSidebarExpanded, setAiSidebarExpanded] = useState(false);

  const documents = [
    { id: 1, title: 'Getting Started', icon: FileText },
    { id: 2, title: 'Project Overview', icon: FileText },
    { id: 3, title: 'Meeting Notes', icon: FileText },
    { id: 4, title: 'Ideas & Brainstorming', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Main Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-200 bg-gray-50`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">Workspace</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Documents</span>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Plus className="w-3 h-3 text-gray-400" />
                </button>
              </div>
              <div className="space-y-1">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded cursor-pointer group"
                  >
                    <doc.icon className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="flex-1 truncate">{doc.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-gray-100 rounded mr-3"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Untitled Document</span>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
            className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
              aiSidebarOpen 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bot className="w-4 h-4 mr-2" />
            AI Assistant
          </button>
        </div>

        {/* Content and AI Sidebar Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-8">
              {children}
            </div>
          </div>

          {/* AI Sidebar */}
          <div className={`${aiSidebarOpen ? (aiSidebarExpanded ? 'w-96' : 'w-80') : 'w-0'} transition-all duration-300 overflow-hidden border-l border-gray-200 bg-white flex flex-col`}>
            {aiSidebarOpen && (
              <>
                {/* AI Sidebar Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bot className="w-5 h-5 mr-2 text-blue-600" />
                      <h2 className="font-medium text-gray-900">AI Assistant</h2>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setAiSidebarExpanded(!aiSidebarExpanded)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {aiSidebarExpanded ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setAiSidebarOpen(false)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Chat Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* AI Placeholder Messages */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
                          Hello! I'm your AI assistant. I can help you with writing, editing, and organizing your document. What would you like to work on?
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">You</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-blue-100 rounded-lg p-3 text-sm text-gray-700">
                          [AI conversation placeholder]
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Input Area */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Ask AI anything..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;