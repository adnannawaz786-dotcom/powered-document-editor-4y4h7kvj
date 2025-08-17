import React, { useState } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { 
  FileText, 
  Plus, 
  Search, 
  Settings, 
  Bot, 
  Send, 
  Sparkles,
  Menu,
  X
} from 'lucide-react'

function App() {
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [editorContent, setEditorContent] = useState('')

  const documents = [
    { id: 1, title: 'Getting Started', lastModified: '2 hours ago' },
    { id: 2, title: 'Project Planning', lastModified: '1 day ago' },
    { id: 3, title: 'Meeting Notes', lastModified: '3 days ago' },
    { id: 4, title: 'Research Document', lastModified: '1 week ago' },
  ]

  const handleDocumentSelect = (doc) => {
    setSelectedDocument(doc)
    setEditorContent(`# ${doc.title}\n\nStart writing your content here...`)
  }

  const handleAiSubmit = (e) => {
    e.preventDefault()
    // Placeholder for AI functionality
    console.log('AI Query:', aiQuery)
    setAiQuery('')
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Top Navigation */}
      <div className="h-12 border-b border-gray-200 flex items-center px-4 bg-white z-10">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1 hover:bg-gray-100 rounded mr-3"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center justify-between">
          <h1 className="text-sm font-medium text-gray-900">
            {selectedDocument ? selectedDocument.title : 'Untitled'}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
              className={`p-2 rounded-md transition-colors ${
                aiSidebarOpen 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Bot className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        <PanelGroup direction="horizontal">
          {/* Left Sidebar */}
          {!sidebarCollapsed && (
            <>
              <Panel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full border-r border-gray-200 bg-gray-50">
                  {/* Sidebar Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-medium text-gray-900">Documents</h2>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Document List */}
                  <div className="p-2">
                    {documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => handleDocumentSelect(doc)}
                        className={`w-full text-left p-3 rounded-md mb-1 transition-colors ${
                          selectedDocument?.id === doc.id
                            ? 'bg-blue-100 border border-blue-200'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="w-4 h-4 mt-0.5 text-gray-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doc.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {doc.lastModified}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </Panel>
              <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
            </>
          )}

          {/* Main Editor */}
          <Panel defaultSize={aiSidebarOpen ? 60 : 80}>
            <div className="h-full bg-white">
              {selectedDocument ? (
                <div className="h-full p-8">
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Start writing..."
                    className="w-full h-full resize-none border-none outline-none text-gray-900 font-mono text-sm leading-relaxed"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", monospace' }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a document to start editing
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Choose from your existing documents or create a new one
                    </p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      <Plus className="w-4 h-4" />
                      New Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          {/* AI Sidebar */}
          {aiSidebarOpen && (
            <>
              <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-gray-300 transition-colors" />
              <Panel defaultSize={25} minSize={20} maxSize={40}>
                <div className="h-full border-l border-gray-200 bg-gray-50 flex flex-col">
                  {/* AI Sidebar Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm font-medium text-gray-900">AI Assistant</h3>
                      </div>
                      <button
                        onClick={() => setAiSidebarOpen(false)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* AI Chat Area */}
                  <div className="flex-1 p-4">
                    <div className="space-y-4 mb-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700">
                          👋 Hi! I'm your AI writing assistant. I can help you:
                        </p>
                        <ul className="text-xs text-gray-600 mt-2 space-y-1">
                          <li>• Improve your writing</li>
                          <li>• Generate ideas</li>
                          <li>• Fix grammar and style</li>
                          <li>• Summarize content</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* AI Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleAiSubmit} className="space-y-3">
                      <textarea
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder="Ask me anything about your document..."
                        className="w-full p-3 text-sm border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                      <button
                        type="submit"
                        disabled={!aiQuery.trim()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Send to AI
                      </button>
                    </form>
                  </div>
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  )
}

export default App