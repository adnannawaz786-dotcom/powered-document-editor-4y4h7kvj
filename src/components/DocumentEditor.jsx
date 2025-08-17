import React, { useState, useEffect } from 'react';
import { Bold, Italic, Underline, Strikethrough, Code, Link, List, ListOrdered, Quote, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type, Palette, MoreHorizontal } from 'lucide-react';

const DocumentEditor = ({ document, onSave, onTitleChange }) => {
  const [title, setTitle] = useState(document?.title || 'Untitled');
  const [content, setContent] = useState(document?.content || '');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showFormatting, setShowFormatting] = useState(false);

  useEffect(() => {
    if (document) {
      setTitle(document.title || 'Untitled');
      setContent(document.content || '');
    }
  }, [document]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onTitleChange?.(newTitle);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave?.({ title, content });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    setShowFormatting(false);
  };

  const insertHeading = (level) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const headingText = `${'#'.repeat(level)} ${selectedText || 'Heading'}`;
      range.deleteContents();
      range.insertNode(document.createTextNode(headingText));
    }
  };

  const ToolbarButton = ({ icon: Icon, onClick, title, active = false }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
        active ? 'bg-gray-200' : ''
      }`}
    >
      <Icon size={16} />
    </button>
  );

  const FloatingToolbar = () => (
    <div className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-1">
      <ToolbarButton
        icon={Bold}
        onClick={() => formatText('bold')}
        title="Bold"
      />
      <ToolbarButton
        icon={Italic}
        onClick={() => formatText('italic')}
        title="Italic"
      />
      <ToolbarButton
        icon={Underline}
        onClick={() => formatText('underline')}
        title="Underline"
      />
      <ToolbarButton
        icon={Strikethrough}
        onClick={() => formatText('strikeThrough')}
        title="Strikethrough"
      />
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <ToolbarButton
        icon={Link}
        onClick={() => {
          const url = prompt('Enter URL:');
          if (url) formatText('createLink', url);
        }}
        title="Link"
      />
      <ToolbarButton
        icon={Code}
        onClick={() => formatText('formatBlock', 'pre')}
        title="Code"
      />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-2xl font-semibold bg-transparent border-none outline-none flex-1 text-gray-900 placeholder-gray-400"
            placeholder="Untitled"
          />
          <div className="flex items-center gap-2">
            {isEditing && (
              <span className="text-sm text-gray-500">Unsaved changes</span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Undo}
            onClick={() => formatText('undo')}
            title="Undo"
          />
          <ToolbarButton
            icon={Redo}
            onClick={() => formatText('redo')}
            title="Redo"
          />
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <ToolbarButton
            icon={Heading1}
            onClick={() => insertHeading(1)}
            title="Heading 1"
          />
          <ToolbarButton
            icon={Heading2}
            onClick={() => insertHeading(2)}
            title="Heading 2"
          />
          <ToolbarButton
            icon={Heading3}
            onClick={() => insertHeading(3)}
            title="Heading 3"
          />
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <ToolbarButton
            icon={Bold}
            onClick={() => formatText('bold')}
            title="Bold"
          />
          <ToolbarButton
            icon={Italic}
            onClick={() => formatText('italic')}
            title="Italic"
          />
          <ToolbarButton
            icon={Underline}
            onClick={() => formatText('underline')}
            title="Underline"
          />
          <ToolbarButton
            icon={Strikethrough}
            onClick={() => formatText('strikeThrough')}
            title="Strikethrough"
          />
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <ToolbarButton
            icon={List}
            onClick={() => formatText('insertUnorderedList')}
            title="Bullet List"
          />
          <ToolbarButton
            icon={ListOrdered}
            onClick={() => formatText('insertOrderedList')}
            title="Numbered List"
          />
          <ToolbarButton
            icon={Quote}
            onClick={() => formatText('formatBlock', 'blockquote')}
            title="Quote"
          />
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <ToolbarButton
            icon={AlignLeft}
            onClick={() => formatText('justifyLeft')}
            title="Align Left"
          />
          <ToolbarButton
            icon={AlignCenter}
            onClick={() => formatText('justifyCenter')}
            title="Align Center"
          />
          <ToolbarButton
            icon={AlignRight}
            onClick={() => formatText('justifyRight')}
            title="Align Right"
          />
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <ToolbarButton
            icon={Link}
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) formatText('createLink', url);
            }}
            title="Link"
          />
          <ToolbarButton
            icon={Code}
            onClick={() => formatText('formatBlock', 'pre')}
            title="Code Block"
          />
          <ToolbarButton
            icon={Palette}
            onClick={() => {
              const color = prompt('Enter color (hex):');
              if (color) formatText('foreColor', color);
            }}
            title="Text Color"
          />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          <div
            contentEditable
            className="w-full h-full min-h-[500px] outline-none text-gray-900 leading-relaxed"
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif'
            }}
            onInput={(e) => {
              setContent(e.target.innerHTML);
              setIsEditing(true);
            }}
            onKeyDown={handleKeyDown}
            onMouseUp={() => {
              const selection = window.getSelection();
              const text = selection.toString();
              setSelectedText(text);
              setShowFormatting(text.length > 0);
            }}
            dangerouslySetInnerHTML={{ __html: content }}
            data-placeholder="Start writing..."
          />
        </div>
      </div>

      {/* Floating formatting toolbar */}
      {showFormatting && selectedText && <FloatingToolbar />}

      {/* Status bar */}
      <div className="border-t border-gray-200 px-6 py-2 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>{content.replace(/<[^>]*>/g, '').length} characters</span>
            <span>{content.split(/\s+/).filter(word => word.length > 0).length} words</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Last saved: {isEditing ? 'Unsaved' : 'Just now'}</span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isEditing ? 'bg-yellow-400' : 'bg-green-400'}`} />
              <span>{isEditing ? 'Editing' : 'Saved'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;