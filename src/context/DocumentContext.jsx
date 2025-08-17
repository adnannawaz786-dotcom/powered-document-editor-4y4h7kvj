import React, { createContext, useContext, useReducer, useEffect } from 'react';

const DocumentContext = createContext();

// Action types
const DOCUMENT_ACTIONS = {
  SET_DOCUMENTS: 'SET_DOCUMENTS',
  SET_ACTIVE_DOCUMENT: 'SET_ACTIVE_DOCUMENT',
  UPDATE_DOCUMENT: 'UPDATE_DOCUMENT',
  CREATE_DOCUMENT: 'CREATE_DOCUMENT',
  DELETE_DOCUMENT: 'DELETE_DOCUMENT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_DOCUMENT_CONTENT: 'UPDATE_DOCUMENT_CONTENT',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_AI_SIDEBAR_OPEN: 'SET_AI_SIDEBAR_OPEN',
  SET_UNSAVED_CHANGES: 'SET_UNSAVED_CHANGES',
  ADD_RECENT_DOCUMENT: 'ADD_RECENT_DOCUMENT',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_VIEW_MODE: 'SET_VIEW_MODE'
};

// Initial state
const initialState = {
  documents: [],
  activeDocument: null,
  loading: false,
  error: null,
  sidebarOpen: true,
  aiSidebarOpen: false,
  unsavedChanges: false,
  recentDocuments: [],
  searchQuery: '',
  viewMode: 'edit' // 'edit' | 'preview' | 'focus'
};

// Reducer function
const documentReducer = (state, action) => {
  switch (action.type) {
    case DOCUMENT_ACTIONS.SET_DOCUMENTS:
      return {
        ...state,
        documents: action.payload,
        loading: false,
        error: null
      };

    case DOCUMENT_ACTIONS.SET_ACTIVE_DOCUMENT:
      return {
        ...state,
        activeDocument: action.payload,
        unsavedChanges: false,
        error: null
      };

    case DOCUMENT_ACTIONS.UPDATE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? { ...doc, ...action.payload } : doc
        ),
        activeDocument: state.activeDocument?.id === action.payload.id
          ? { ...state.activeDocument, ...action.payload }
          : state.activeDocument,
        unsavedChanges: false
      };

    case DOCUMENT_ACTIONS.CREATE_DOCUMENT:
      const newDocument = {
        id: Date.now().toString(),
        title: action.payload.title || 'Untitled Document',
        content: action.payload.content || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...action.payload
      };
      return {
        ...state,
        documents: [newDocument, ...state.documents],
        activeDocument: newDocument,
        unsavedChanges: false
      };

    case DOCUMENT_ACTIONS.DELETE_DOCUMENT:
      const filteredDocs = state.documents.filter(doc => doc.id !== action.payload);
      return {
        ...state,
        documents: filteredDocs,
        activeDocument: state.activeDocument?.id === action.payload ? null : state.activeDocument,
        recentDocuments: state.recentDocuments.filter(id => id !== action.payload)
      };

    case DOCUMENT_ACTIONS.UPDATE_DOCUMENT_CONTENT:
      const updatedDoc = {
        ...state.activeDocument,
        content: action.payload,
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        activeDocument: updatedDoc,
        documents: state.documents.map(doc =>
          doc.id === updatedDoc.id ? updatedDoc : doc
        ),
        unsavedChanges: true
      };

    case DOCUMENT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case DOCUMENT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case DOCUMENT_ACTIONS.SET_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: action.payload
      };

    case DOCUMENT_ACTIONS.SET_AI_SIDEBAR_OPEN:
      return {
        ...state,
        aiSidebarOpen: action.payload
      };

    case DOCUMENT_ACTIONS.SET_UNSAVED_CHANGES:
      return {
        ...state,
        unsavedChanges: action.payload
      };

    case DOCUMENT_ACTIONS.ADD_RECENT_DOCUMENT:
      const recentDocs = state.recentDocuments.filter(id => id !== action.payload);
      return {
        ...state,
        recentDocuments: [action.payload, ...recentDocs].slice(0, 5)
      };

    case DOCUMENT_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };

    case DOCUMENT_ACTIONS.SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload
      };

    default:
      return state;
  }
};

// Document Provider Component
export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  // Load documents from localStorage on mount
  useEffect(() => {
    const savedDocuments = localStorage.getItem('documents');
    const savedRecentDocuments = localStorage.getItem('recentDocuments');
    
    if (savedDocuments) {
      try {
        const documents = JSON.parse(savedDocuments);
        dispatch({ type: DOCUMENT_ACTIONS.SET_DOCUMENTS, payload: documents });
      } catch (error) {
        console.error('Error loading documents from localStorage:', error);
      }
    }

    if (savedRecentDocuments) {
      try {
        const recentDocuments = JSON.parse(savedRecentDocuments);
        dispatch({ type: DOCUMENT_ACTIONS.ADD_RECENT_DOCUMENT, payload: recentDocuments });
      } catch (error) {
        console.error('Error loading recent documents from localStorage:', error);
      }
    }
  }, []);

  // Save documents to localStorage whenever documents change
  useEffect(() => {
    if (state.documents.length > 0) {
      localStorage.setItem('documents', JSON.stringify(state.documents));
    }
  }, [state.documents]);

  // Save recent documents to localStorage
  useEffect(() => {
    if (state.recentDocuments.length > 0) {
      localStorage.setItem('recentDocuments', JSON.stringify(state.recentDocuments));
    }
  }, [state.recentDocuments]);

  // Action creators
  const actions = {
    setDocuments: (documents) => {
      dispatch({ type: DOCUMENT_ACTIONS.SET_DOCUMENTS, payload: documents });
    },

    setActiveDocument: (document) => {
      dispatch({ type: DOCUMENT_ACTIONS.SET_ACTIVE_DOCUMENT, payload: document });
      if (document) {
        dispatch({ type: DOCUMENT_ACTIONS.ADD_RECENT_DOCUMENT, payload: document.id });
      }
    },

    updateDocument: (documentData) => {
      dispatch({ type: DOCUMENT_ACTIONS.UPDATE_DOCUMENT, payload: documentData });
    },

    createDocument: (documentData = {}) => {
      dispatch({ type: DOCUMENT_ACTIONS.CREATE_DOCUMENT, payload: documentData });
    },

    deleteDocument: (documentId) => {
      dispatch({ type: DOCUMENT_ACTIONS.DELETE_DOCUMENT, payload: documentId });
    },

    updateDocumentContent: (content) => {
      dispatch({ type: DOCUMENT_ACTIONS.UPDATE_DOCUMENT_CONTENT, payload: content });
    },

    saveDocument: async () => {
      if (!state.activeDocument || !state.unsavedChanges) return;
      
      try {
        dispatch({ type: DOCUMENT_ACTIONS.SET_LOADING, payload: true });
        
        // Simulate API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedDocument = {
          ...state.activeDocument,
          updatedAt: new Date().toISOString()
        };

        dispatch({ type: DOCUMENT_ACTIONS.UPDATE_DOCUMENT, payload: updatedDocument });
        dispatch({ type: DOCUMENT_ACTIONS.SET_UNSAVED_CHANGES, payload: false });
      } catch (error) {
        dispatch({ type: DOCUMENT_ACTIONS.SET_ERROR, payload: 'Failed to save document' });
      } finally {
        dispatch({ type: DOCUMENT_ACTIONS.SET_LOADING, payload: false });
      }
    },

    toggleSidebar: () => {
      dispatch({ type: DOCUMENT_ACTIONS.SET_SIDEBAR_OPEN, payload: !state.sidebarOpen });
    },

    toggleAISidebar: () => {
      dispatch({ type: DOCUMENT_ACTIONS.SET_AI_SIDEBAR_OPEN, payload: !state.aiSidebarOpen });
    },

    setSearchQuery: (query) => {
      dispatch({ type: DOCUMENT_ACTIONS.SET_SEARCH_QUERY, payload: query });
    },

    setViewMode: (mode) => {
      dispatch({ type: DOCUMENT_ACTIONS.SET_VIEW_MODE, payload: mode });
    },

    clearError: () => {
      dispatch({ type: DOCUMENT_ACTIONS.SET_ERROR, payload: null });
    }
  };

  // Computed values
  const computedValues = {
    filteredDocuments: state.documents.filter(doc =>
      doc.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(state.searchQuery.toLowerCase())
    ),

    recentDocumentsData: state.recentDocuments
      .map(id => state.documents.find(doc => doc.id === id))
      .filter(Boolean),

    hasUnsavedChanges: state.unsavedChanges
  };

  const value = {
    ...state,
    ...computedValues,
    ...actions
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

// Custom hook to use the document context
export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

// Export the context for advanced usage
export { DocumentContext };