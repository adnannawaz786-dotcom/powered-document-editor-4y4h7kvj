import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Settings, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Home,
  Star,
  Clock,
  Archive
} from 'lucide-react';
import { useDocument } from '../context/DocumentContext';

const Sidebar = () => {
  const location = useLocation();
  const { documents, createDocument, deleteDocument } = useDocument();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    recent: true,
    favorites: false,
    archived: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCreateDocument = () => {
    const newDoc = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false
    };
    createDocument(newDoc);
  };

  const handleDeleteDocument = (e, docId) => {
    e.preventDefault();
    e.stopPropagation();
    deleteDocument(docId);
  };

  const recentDocuments = documents
    .filter(doc => !doc.isArchived)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const favoriteDocuments = documents.filter(doc => doc.isFavorite && !doc.isArchived);
  const archivedDocuments = documents.filter(doc => doc.isArchived);

  const SidebarItem = ({ icon: Icon, label, to, isActive, onClick, children }) => (
    <div className="w-full">
      {to ? (
        <Link
          to={to}
          className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
            isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">{label}</span>}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
            isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
          {!isCollapsed && <span className="truncate flex-1 text-left">{label}</span>}
          {!isCollapsed && children}
        </button>
      )}
    </div>
  );

  const DocumentItem = ({ doc }) => (
    <Link
      to={`/document/${doc.id}`}
      className="flex items-center w-full px-6 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md group transition-colors"
    >
      <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
      <span className="truncate flex-1">{doc.title || 'Untitled'}</span>
      <button
        onClick={(e) => handleDeleteDocument(e, doc.id)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </Link>
  );

  const SectionHeader = ({ section, label, icon: Icon, count }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center w-full px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      {expandedSections[section] ? (
        <ChevronDown className="w-3 h-3 mr-1" />
      ) : (
        <ChevronRight className="w-3 h-3 mr-1" />
      )}
      <Icon className="w-3 h-3 mr-2" />
      <span className="flex-1 text-left">{label}</span>
      {count > 0 && (
        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-200 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Documents
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-1">
          {/* Main Navigation */}
          <SidebarItem
            icon={Home}
            label="Home"
            to="/"
            isActive={location.pathname === '/'}
          />
          
          <button
            onClick={handleCreateDocument}
            className="flex items-center w-full px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4 mr-3 flex-shrink-0" />
            {!isCollapsed && <span>New Document</span>}
          </button>

          {/* Divider */}
          <div className="my-4 border-t border-gray-200 dark:border-gray-800" />

          {/* Recent Documents */}
          {!isCollapsed && (
            <>
              <SectionHeader
                section="recent"
                label="Recent"
                icon={Clock}
                count={recentDocuments.length}
              />
              {expandedSections.recent && (
                <div className="space-y-1">
                  {recentDocuments.map(doc => (
                    <DocumentItem key={doc.id} doc={doc} />
                  ))}
                  {recentDocuments.length === 0 && (
                    <div className="px-6 py-2 text-xs text-gray-400">
                      No recent documents
                    </div>
                  )}
                </div>
              )}

              {/* Favorites */}
              <SectionHeader
                section="favorites"
                label="Favorites"
                icon={Star}
                count={favoriteDocuments.length}
              />
              {expandedSections.favorites && (
                <div className="space-y-1">
                  {favoriteDocuments.map(doc => (
                    <DocumentItem key={doc.id} doc={doc} />
                  ))}
                  {favoriteDocuments.length === 0 && (
                    <div className="px-6 py-2 text-xs text-gray-400">
                      No favorite documents
                    </div>
                  )}
                </div>
              )}

              {/* Archived */}
              <SectionHeader
                section="archived"
                label="Archived"
                icon={Archive}
                count={archivedDocuments.length}
              />
              {expandedSections.archived && (
                <div className="space-y-1">
                  {archivedDocuments.map(doc => (
                    <DocumentItem key={doc.id} doc={doc} />
                  ))}
                  {archivedDocuments.length === 0 && (
                    <div className="px-6 py-2 text-xs text-gray-400">
                      No archived documents
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <SidebarItem
          icon={Settings}
          label="Settings"
          to="/settings"
          isActive={location.pathname === '/settings'}
        />
      </div>
    </div>
  );
};

export default Sidebar;