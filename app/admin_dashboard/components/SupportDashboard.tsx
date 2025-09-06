'use client';

import React, { useState, useEffect, useRef } from 'react';

interface HelpTicket {
  _id: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'rejected';
  userEmail: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

interface ToolSuggestion {
  _id: string;
  userId: string;
  toolName: string;
  description: string;
  category: string;
  useCase: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  userEmail: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

interface Rating {
  _id: string;
  userId: string;
  overallRating: number;
  easeOfUse: number;
  features: number;
  support: number;
  valueForMoney: number;
  feedback: string;
  recommendation: boolean;
  userEmail: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

// Professional Text Editor Component
interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, placeholder = "Start typing...", className = "" }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
      updateCharCount();
      
      // Ensure proper text direction
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.style.unicodeBidi = 'embed';
      
      // Set cursor to end of content
      setTimeout(() => {
        if (editorRef.current) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false); // collapse to end
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  }, [value]);

  const updateCharCount = () => {
    if (editorRef.current) {
      const textContent = editorRef.current.textContent || '';
      setCharCount(textContent.length);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      // Ensure proper text direction during typing
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.style.unicodeBidi = 'embed';
      
      // Force cursor to end of text for proper LTR typing
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textNode = range.endContainer;
        if (textNode.nodeType === Node.TEXT_NODE) {
          range.setStart(textNode, textNode.textContent?.length || 0);
          range.setEnd(textNode, textNode.textContent?.length || 0);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateCharCount();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    
    // Ensure proper text direction when focused
    if (editorRef.current) {
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.style.unicodeBidi = 'embed';
      
      // Move cursor to end of content for proper LTR typing
      setTimeout(() => {
        if (editorRef.current) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false); // false = collapse to end
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value || '');
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleInput();
  };

  const insertText = (text: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, text);
      handleInput();
    }
  };

  const getSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  const isFormatActive = (format: string) => {
    return document.queryCommandState(format);
  };

  const toolbarButtons: Array<{
    type?: 'separator';
    icon?: string;
    command?: string;
    value?: string;
    title?: string;
    shortcut?: string;
  }> = [
    {
      icon: 'bold',
      command: 'bold',
      title: 'Bold (Ctrl+B)',
      shortcut: 'Ctrl+B'
    },
    {
      icon: 'italic',
      command: 'italic',
      title: 'Italic (Ctrl+I)',
      shortcut: 'Ctrl+I'
    },
    {
      icon: 'underline',
      command: 'underline',
      title: 'Underline (Ctrl+U)',
      shortcut: 'Ctrl+U'
    },
    { type: 'separator' },
    {
      icon: 'list-ul',
      command: 'insertUnorderedList',
      title: 'Bullet List',
      shortcut: 'Ctrl+Shift+L'
    },
    {
      icon: 'list-ol',
      command: 'insertOrderedList',
      title: 'Numbered List',
      shortcut: 'Ctrl+Shift+O'
    },
    { type: 'separator' },
    {
      icon: 'align-left',
      command: 'justifyLeft',
      title: 'Align Left',
      shortcut: 'Ctrl+Shift+L'
    },
    {
      icon: 'align-center',
      command: 'justifyCenter',
      title: 'Align Center',
      shortcut: 'Ctrl+Shift+E'
    },
    {
      icon: 'align-right',
      command: 'justifyRight',
      title: 'Align Right',
      shortcut: 'Ctrl+Shift+R'
    },
    { type: 'separator' },
    {
      icon: 'quote-left',
      command: 'formatBlock',
      value: 'blockquote',
      title: 'Quote Block',
      shortcut: 'Ctrl+Q'
    },
    {
      icon: 'code',
      command: 'formatBlock',
      value: 'pre',
      title: 'Code Block',
      shortcut: 'Ctrl+K'
    }
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'l':
          e.preventDefault();
          execCommand('justifyLeft');
          break;
        case 'e':
          e.preventDefault();
          execCommand('justifyCenter');
          break;
        case 'r':
          e.preventDefault();
          execCommand('justifyRight');
          break;
        case 'q':
          e.preventDefault();
          execCommand('formatBlock', 'blockquote');
          break;
        case 'k':
          e.preventDefault();
          execCommand('formatBlock', 'pre');
          break;
      }
    }
    
    // Ensure proper cursor position for regular typing
    if (!e.ctrlKey && !e.metaKey && e.key.length === 1) {
      setTimeout(() => {
        if (editorRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const textNode = range.endContainer;
            if (textNode.nodeType === Node.TEXT_NODE) {
              range.setStart(textNode, textNode.textContent?.length || 0);
              range.setEnd(textNode, textNode.textContent?.length || 0);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }
      }, 0);
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center gap-1 flex-wrap">
        {toolbarButtons.map((button, index) => (
          <React.Fragment key={index}>
            {button.type === 'separator' ? (
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
            ) : (
              <button
                type="button"
                onClick={() => button.command && execCommand(button.command, button.value || '')}
                className={`p-1.5 hover:bg-gray-200 rounded text-gray-700 hover:text-gray-900 transition-colors relative group ${
                  button.command && isFormatActive(button.command) ? 'bg-blue-100 text-blue-700' : ''
                }`}
                title={`${button.title} (${button.shortcut})`}
              >
                <i className={`fas fa-${button.icon} text-sm`}></i>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {button.title}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </button>
            )}
          </React.Fragment>
        ))}
        
        {/* Quick Actions */}
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertText('✅ Issue resolved')}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700 hover:text-gray-900 transition-colors text-xs"
            title="Insert resolution template"
          >
            ✅ Resolved
          </button>
          <button
            type="button"
            onClick={() => insertText('❌ Request rejected')}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700 hover:text-gray-900 transition-colors text-xs"
            title="Insert rejection template"
          >
            ❌ Rejected
          </button>
          <button
            type="button"
            onClick={() => insertText('📞 Contact support for further assistance')}
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700 hover:text-gray-900 transition-colors text-xs"
            title="Insert support contact template"
          >
            📞 Support
          </button>
        </div>
      </div>
      
      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 py-2 focus:outline-none min-h-[120px] max-h-[300px] overflow-y-auto text-left ${
          isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}
        data-placeholder={placeholder}
        style={{
          minHeight: '120px',
          maxHeight: '300px',
          overflowY: 'auto',
          direction: 'ltr',
          textAlign: 'left',
          unicodeBidi: 'embed'
        }}
      />
      
      {/* Character Count and Status */}
      <div className="bg-gray-50 border-t border-gray-300 px-3 py-1 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>{charCount} characters</span>
          {charCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              charCount < 50 ? 'bg-yellow-100 text-yellow-700' :
              charCount < 200 ? 'bg-green-100 text-green-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {charCount < 50 ? 'Short' : charCount < 200 ? 'Good' : 'Detailed'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            isFocused ? 'bg-green-500' : 'bg-gray-300'
          }`}></span>
          <span>{isFocused ? 'Editing' : 'Ready'}</span>
        </div>
      </div>
    </div>
  );
};

export default function SupportDashboard() {
  // Add styles for the rich text editor
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      [data-placeholder]:empty:before {
        content: attr(data-placeholder);
        color: #9ca3af;
        pointer-events: none;
        position: absolute;
        top: 0.5rem;
        left: 0.75rem;
      }
      [data-placeholder] {
        position: relative;
      }
      .text-editor blockquote {
        border-left: 4px solid #e5e7eb;
        padding-left: 1rem;
        margin: 1rem 0;
        font-style: italic;
        color: #6b7280;
      }
      .text-editor pre {
        background-color: #f3f4f6;
        padding: 1rem;
        border-radius: 0.375rem;
        font-family: 'Courier New', monospace;
        white-space: pre-wrap;
        margin: 1rem 0;
      }
      .text-editor ul, .text-editor ol {
        padding-left: 1.5rem;
        margin: 0.5rem 0;
      }
      .text-editor li {
        margin: 0.25rem 0;
      }
      .text-editor [contenteditable] {
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: embed !important;
      }
      .text-editor [contenteditable]:focus {
        direction: ltr !important;
        text-align: left !important;
      }
      .text-editor [contenteditable] * {
        direction: ltr !important;
        text-align: inherit !important;
      }
      .text-editor [contenteditable] {
        caret-color: #3b82f6 !important;
        caret-shape: block !important;
      }
      .text-editor [contenteditable]:focus {
        outline: none !important;
        caret-color: #3b82f6 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [suggestions, setSuggestions] = useState<ToolSuggestion[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'tickets' | 'suggestions' | 'ratings'>('tickets');
  const [updatingTickets, setUpdatingTickets] = useState<Set<string>>(new Set());
  const [selectedTicket, setSelectedTicket] = useState<HelpTicket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ticketId: string, action: 'resolved' | 'rejected'} | null>(null);
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    try {
      const response = await fetch('/api/admin/support');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Sort tickets by creation date (earliest first)
          const sortedTickets = (data.data.tickets || []).sort((a: HelpTicket, b: HelpTicket) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setTickets(sortedTickets);
          setSuggestions(data.data.suggestions || []);
          setRatings(data.data.ratings || []);
        } else {
          console.error('Failed to fetch support data:', data.message);
        }
      } else {
        console.error('Failed to fetch support data');
      }
    } catch (error) {
      console.error('Error fetching support data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveRejectClick = (ticketId: string, action: 'resolved' | 'rejected') => {
    setPendingAction({ ticketId, action });
    setAdminComment('');
    setShowCommentModal(true);
  };

  const updateTicketStatus = async (ticketId: string, status: 'resolved' | 'rejected', comment?: string) => {
    try {
      setUpdatingTickets(prev => new Set(prev).add(ticketId));
      
      const response = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId,
          status,
          adminComment: comment || ''
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Remove the ticket from the list since it's now resolved/rejected
          setTickets(prev => prev.filter(ticket => ticket._id !== ticketId));
          
          // Close modals if they're open
          if (selectedTicket && selectedTicket._id === ticketId) {
            setShowModal(false);
            setSelectedTicket(null);
          }
          setShowCommentModal(false);
          setPendingAction(null);
          setAdminComment('');
          
          // Show success message
          alert(`Ticket ${status === 'resolved' ? 'resolved' : 'rejected'} successfully!`);
        } else {
          alert(`Failed to ${status} ticket: ${data.message}`);
        }
      } else {
        alert(`Failed to ${status} ticket`);
      }
    } catch (error) {
      console.error(`Error ${status}ing ticket:`, error);
      alert(`Error ${status}ing ticket`);
    } finally {
      setUpdatingTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }
  };

  const handleCommentSubmit = () => {
    if (pendingAction) {
      updateTicketStatus(pendingAction.ticketId, pendingAction.action, adminComment);
    }
  };

  const handleCommentCancel = () => {
    setShowCommentModal(false);
    setPendingAction(null);
    setAdminComment('');
  };

  const openTicketModal = (ticket: HelpTicket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'reviewed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'implemented': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isWithin24Hours = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  const getHighPriorityTickets = () => {
    return tickets
      .filter(ticket => ticket.priority === 'high' && isWithin24Hours(ticket.createdAt))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading support data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full overflow-y-auto pb-6">
      {/* Ticket Detail Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Ticket Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{selectedTicket.subject}</h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>

                {/* User Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedTicket.userName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedTicket.userEmail}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedTicket.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ticket ID:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedTicket._id}</span>
                    </div>
                  </div>
                </div>

                {/* Issue Description */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Issue Description</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium text-gray-900">{formatDate(selectedTicket.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="font-medium text-gray-900">{formatDate(selectedTicket.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleResolveRejectClick(selectedTicket._id, 'resolved')}
                    disabled={updatingTickets.has(selectedTicket._id)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    {updatingTickets.has(selectedTicket._id) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                    ) : (
                      <i className="fas fa-check"></i>
                    )}
                    Resolve Ticket
                  </button>
                  <button
                    onClick={() => handleResolveRejectClick(selectedTicket._id, 'rejected')}
                    disabled={updatingTickets.has(selectedTicket._id)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    {updatingTickets.has(selectedTicket._id) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                    ) : (
                      <i className="fas fa-times"></i>
                    )}
                    Reject Ticket
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition-colors shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Comment Modal */}
      {showCommentModal && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {pendingAction.action === 'resolved' ? 'Resolve Ticket' : 'Reject Ticket'}
                </h2>
                <button
                  onClick={handleCommentCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Comment {pendingAction.action === 'resolved' ? '(Optional)' : '(Required)'}
                  </label>
                  
                  {/* Professional Text Editor */}
                  <TextEditor
                    value={adminComment}
                    onChange={setAdminComment}
                    placeholder="Add a comment explaining the resolution or reason for rejection..."
                    className="text-editor"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={updatingTickets.has(pendingAction.ticketId) || (pendingAction.action === 'rejected' && !adminComment.trim())}
                    className={`flex-1 px-4 py-2 text-white rounded-md transition-colors shadow-sm flex items-center justify-center gap-2 ${
                      pendingAction.action === 'resolved' 
                        ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400' 
                        : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                    }`}
                  >
                    {updatingTickets.has(pendingAction.ticketId) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                    ) : (
                      <i className={`fas ${pendingAction.action === 'resolved' ? 'fa-check' : 'fa-times'}`}></i>
                    )}
                    {pendingAction.action === 'resolved' ? 'Resolve' : 'Reject'}
                  </button>
                  <button
                    onClick={handleCommentCancel}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High Priority Tickets Timeline */}
      {getHighPriorityTickets().length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-red-800">High Priority Tickets (Last 24 Hours)</h3>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {getHighPriorityTickets().map((ticket) => (
              <div key={ticket._id} className="bg-white border border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => openTicketModal(ticket)}>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>By: {ticket.userName} ({ticket.userEmail})</span>
                      <span>Category: {ticket.category}</span>
                      <span>Created: {formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolveRejectClick(ticket._id, 'resolved');
                      }}
                      disabled={updatingTickets.has(ticket._id)}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs rounded-md transition-colors shadow-sm flex items-center gap-1"
                    >
                      {updatingTickets.has(ticket._id) ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                      ) : (
                        <i className="fas fa-check"></i>
                      )}
                      Resolve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolveRejectClick(ticket._id, 'rejected');
                      }}
                      disabled={updatingTickets.has(ticket._id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs rounded-md transition-colors shadow-sm flex items-center gap-1"
                    >
                      {updatingTickets.has(ticket._id) ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                      ) : (
                        <i className="fas fa-times"></i>
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveSection('tickets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'tickets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Help Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setActiveSection('suggestions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'suggestions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tool Suggestions ({suggestions.length})
            </button>
            <button
              onClick={() => setActiveSection('ratings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'ratings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Ratings ({ratings.length})
            </button>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="p-6">
          {activeSection === 'tickets' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Help Tickets</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Total: {tickets.length}</span>
                </div>
              </div>
              
              {tickets.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">All tickets resolved!</h4>
                  <p className="text-gray-500">No open tickets to display.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 cursor-pointer" onClick={() => openTicketModal(ticket)}>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>By: {ticket.userName} ({ticket.userEmail})</span>
                            <span>Category: {ticket.category}</span>
                            <span>Created: {formatDate(ticket.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveRejectClick(ticket._id, 'resolved');
                            }}
                            disabled={updatingTickets.has(ticket._id)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xs rounded-md transition-colors shadow-sm flex items-center gap-1"
                          >
                            {updatingTickets.has(ticket._id) ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                            ) : (
                              <i className="fas fa-check"></i>
                            )}
                            Resolve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveRejectClick(ticket._id, 'rejected');
                            }}
                            disabled={updatingTickets.has(ticket._id)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs rounded-md transition-colors shadow-sm flex items-center gap-1"
                          >
                            {updatingTickets.has(ticket._id) ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                            ) : (
                              <i className="fas fa-times"></i>
                            )}
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'suggestions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tool Suggestions</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Total: {suggestions.length}</span>
                </div>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {suggestions.map((suggestion) => (
                  <div key={suggestion._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">{suggestion.toolName}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(suggestion.status)}`}>
                            {suggestion.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                        <p className="text-sm text-gray-600 mb-2"><strong>Use Case:</strong> {suggestion.useCase}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>By: {suggestion.userName} ({suggestion.userEmail})</span>
                          <span>Category: {suggestion.category}</span>
                          <span>Created: {formatDate(suggestion.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'ratings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">User Ratings</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Total: {ratings.length}</span>
                </div>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {ratings.map((rating) => (
                  <div key={rating._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">Rating by {rating.userName}</h4>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className={`fas fa-star text-sm ${
                                  star <= rating.overallRating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              ></i>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">({rating.overallRating}/5)</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rating.feedback}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 mb-2">
                          <div>
                            <span className="font-medium">Ease of Use:</span> {rating.easeOfUse}/5
                          </div>
                          <div>
                            <span className="font-medium">Features:</span> {rating.features}/5
                          </div>
                          <div>
                            <span className="font-medium">Support:</span> {rating.support}/5
                          </div>
                          <div>
                            <span className="font-medium">Value:</span> {rating.valueForMoney}/5
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>By: {rating.userName} ({rating.userEmail})</span>
                          <span>Created: {formatDate(rating.createdAt)}</span>
                          <span className={`px-2 py-1 rounded-full ${
                            rating.recommendation ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {rating.recommendation ? 'Would Recommend' : 'Would Not Recommend'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 