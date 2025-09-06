"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface HelpTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: Date;
  userEmail: string;
  userName: string;
}

export default function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    userEmail: '',
    userName: ''
  });

  // Ticket History Component
  const TicketHistory: React.FC = () => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
      fetchTickets();
    }, []);

    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        const user = userData ? JSON.parse(userData) : null;

        const queryParams = new URLSearchParams();
        if (user?.email) queryParams.append('userEmail', user.email);

        const response = await fetch(`/api/help-center/tickets?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTickets(data.tickets || data);
        } else {
          throw new Error('Failed to fetch tickets');
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to load ticket history');
        toast.error('❌ Failed to load ticket history');
      } finally {
        setLoading(false);
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'open':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'in-progress':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'resolved':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'closed':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'medium':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'low':
          return 'bg-green-100 text-green-800 border-green-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getCategoryIcon = (category: string) => {
      const icons: Record<string, string> = {
        account: 'fas fa-user-circle',
        tools: 'fas fa-tools',
        technical: 'fas fa-cog',
        content: 'fas fa-edit',
        integration: 'fas fa-plug',
        billing: 'fas fa-credit-card',
        security: 'fas fa-shield-alt',
        general: 'fas fa-question-circle',
      };
      return icons[category] || 'fas fa-ticket-alt';
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'open':
          return 'fas fa-clock';
        case 'in-progress':
          return 'fas fa-spinner fa-spin';
        case 'resolved':
          return 'fas fa-check-circle';
        case 'closed':
          return 'fas fa-times-circle';
        default:
          return 'fas fa-circle';
      }
    };

    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading ticket history...</p>
              <p className="text-sm text-gray-400 mt-1">Please wait while we fetch your tickets</p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600"></i>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchTickets}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (tickets.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="fas fa-ticket-alt text-gray-400"></i>
            </div>
            <p className="text-gray-500 font-medium">No tickets found</p>
            <p className="text-sm text-gray-400 mt-1">You haven't submitted any help tickets yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Ticket History</h2>
          <button
            onClick={fetchTickets}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <i className="fas fa-sync-alt mr-1"></i>
            Refresh
          </button>
        </div>

        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <div
              key={ticket._id || `ticket-${index}`}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                setSelectedTicket(ticket);
                setShowDetails(true);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className={`${getCategoryIcon(ticket.category || 'general')} text-blue-600 text-sm`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{ticket.subject || 'No Subject'}</h3>
                      <p className="text-sm text-gray-500">
                        {ticket.description && ticket.description.length > 100 
                          ? `${ticket.description.substring(0, 100)}...` 
                          : ticket.description || 'No description available'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status || 'open')}`}>
                      <i className={`${getStatusIcon(ticket.status || 'open')} mr-1`}></i>
                      {(ticket.status || 'open').charAt(0).toUpperCase() + (ticket.status || 'open').slice(1)}
                    </span>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority || 'medium')}`}>
                      <i className="fas fa-flag mr-1"></i>
                      {(ticket.priority || 'medium').charAt(0).toUpperCase() + (ticket.priority || 'medium').slice(1)} Priority
                    </span>

                    <span className="text-xs text-gray-500">
                      <i className="fas fa-calendar mr-1"></i>
                      {ticket.createdAt ? formatDate(ticket.createdAt) : 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Details Modal */}
        {showDetails && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ticket Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Ticket Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className={`${getCategoryIcon(selectedTicket.category)} text-blue-600`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{selectedTicket.subject || 'No Subject'}</h4>
                      <p className="text-sm text-gray-500">
                        Ticket #{selectedTicket._id ? selectedTicket._id.slice(-8) : 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {/* Status and Priority */}
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedTicket.status || 'open')}`}>
                      <i className={`${getStatusIcon(selectedTicket.status || 'open')} mr-2`}></i>
                      {(selectedTicket.status || 'open').charAt(0).toUpperCase() + (selectedTicket.status || 'open').slice(1)}
                    </span>
                    
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedTicket.priority || 'medium')}`}>
                      <i className="fas fa-flag mr-2"></i>
                      {(selectedTicket.priority || 'medium').charAt(0).toUpperCase() + (selectedTicket.priority || 'medium').slice(1)} Priority
                    </span>
                  </div>

                  {/* Ticket Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <p className="text-gray-900 capitalize">{selectedTicket.category || 'General'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Created:</span>
                      <p className="text-gray-900">{selectedTicket.createdAt ? formatDate(selectedTicket.createdAt) : 'Unknown'}</p>
                    </div>
                    {selectedTicket.updatedAt && (
                      <div>
                        <span className="font-medium text-gray-700">Last Updated:</span>
                        <p className="text-gray-900">{formatDate(selectedTicket.updatedAt)}</p>
                      </div>
                    )}
                    {selectedTicket.resolvedAt && (
                      <div>
                        <span className="font-medium text-gray-700">Resolved:</span>
                        <p className="text-gray-900">{formatDate(selectedTicket.resolvedAt)}</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedTicket.description || 'No description available'}
                      </p>
                    </div>
                  </div>

                  {/* Admin Response */}
                  {selectedTicket.adminResponse && (
                    <div>
                      <span className="font-medium text-gray-700">Admin Response:</span>
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedTicket.adminResponse}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const helpCategories = [
    {
      id: 'account',
      title: 'Account & Billing',
      icon: 'fas fa-user-circle',
      description: 'Account management, billing issues, and subscription questions'
    },
    {
      id: 'tools',
      title: 'Tools & Features',
      icon: 'fas fa-tools',
      description: 'How to use our AI tools and features effectively'
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: 'fas fa-cog',
      description: 'Technical issues, bugs, and platform problems'
    },
    {
      id: 'content',
      title: 'Content Creation',
      icon: 'fas fa-edit',
      description: 'Help with creating marketing content and strategies'
    },
    {
      id: 'integration',
      title: 'Integrations',
      icon: 'fas fa-plug',
      description: 'Third-party integrations and API usage'
    },
    {
      id: 'billing',
      title: 'Payment & Plans',
      icon: 'fas fa-credit-card',
      description: 'Payment methods, plan upgrades, and billing history'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: 'fas fa-shield-alt',
      description: 'Account security, data privacy, and safety concerns'
    },
    {
      id: 'general',
      title: 'General Questions',
      icon: 'fas fa-question-circle',
      description: 'General inquiries and other support needs'
    }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;

      const ticketData = {
        ...contactForm,
        userEmail: user?.email || contactForm.userEmail,
        userName: user?.name || contactForm.userName,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/help-center/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ticketData)
      });

      if (response.ok) {
        // Show success toast notification
        toast.success('🎉 Ticket submitted successfully! Our team will get back to you soon.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Reset form
        setContactForm({
          subject: '',
          description: '',
          category: '',
          priority: 'medium',
          userEmail: '',
          userName: ''
        });
        setShowContactForm(false);
      } else {
        // Show error toast notification
        toast.error('❌ Failed to submit ticket. Please try again.', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      // Show error toast notification
      toast.error('❌ An error occurred. Please try again.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full flex overflow-hidden bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Help Center Page Content */}
        <div className="py-4 px-6 overflow-y-auto">
          {/* Header */}
          <header className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md transition-all hover:shadow-lg">
                <i className="fas fa-headset text-white text-xl"></i>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-800">Help Center</h1>
                <p className="text-sm text-gray-500">Get support and find answers to your questions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowContactForm(!showContactForm)}
                className="px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-1.5"
              >
                <i className="fas fa-ticket-alt"></i>
                <span>Submit Ticket</span>
              </button>
              <button 
                onClick={() => window.open('mailto:hello@markzy.ai', '_blank')}
                className="px-3 py-1.5 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <i className="fas fa-envelope"></i>
                <span>Email Support</span>
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-md">
            <div className="flex flex-col items-center text-center py-4">
              <h2 className="font-bold text-2xl text-gray-800 mb-2">How Can We Help You Today?</h2>
              <p className="text-gray-600 max-w-2xl mb-4">
                Our support team is here to help you get the most out of Markzy. Browse our help categories below or submit a ticket for personalized assistance.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="px-4 py-2 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span>Get Help Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </section>

          {/* Help Categories */}
          <section className="w-full bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6 mb-4 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                <i className="fas fa-question-circle text-white"></i>
              </div>
              <h3 className="font-bold text-xl text-gray-800">Browse Help Categories</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {helpCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-all duration-300`}>
                      <i className={`${category.icon} text-white text-2xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors duration-300 mb-1">{category.title}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form Section */}
          {showContactForm && (
            <section className="w-full bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shadow-md">
                  <i className="fas fa-ticket-alt text-white"></i>
                </div>
                <h3 className="font-bold text-xl text-gray-800">Submit a Support Ticket</h3>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.userName}
                      onChange={(e) => setContactForm({ ...contactForm, userName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.userEmail}
                      onChange={(e) => setContactForm({ ...contactForm, userEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={contactForm.category}
                      onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {helpCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.description}
                    onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Please provide detailed information about your issue or question"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Submit Ticket
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Quick Support Options */}
          <section className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-md">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">Quick Support Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                  <i className="fas fa-envelope text-white"></i>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-800">Email Support</span>
                  </div>
                  <p className="text-sm text-gray-600">hello@marky.ai</p>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <i className="fas fa-clock text-white"></i>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-800">Response Time</span>
                  </div>
                  <p className="text-sm text-gray-600">Usually within 24 hours</p>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <i className="fas fa-book text-white"></i>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-800">Knowledge Base</span>
                  </div>
                  <p className="text-sm text-gray-600">Self-help articles & guides</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-md">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                    ?
                  </div>
                  <span className="font-medium text-gray-800">How do I upgrade my subscription?</span>
                </div>
                <p className="text-sm text-gray-600 ml-8">You can upgrade your subscription by visiting the Upgrade Account page in your dashboard or contacting our support team.</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                    ?
                  </div>
                  <span className="font-medium text-gray-800">How do I export my content?</span>
                </div>
                <p className="text-sm text-gray-600 ml-8">You can export your content by using the export feature in each tool or by integrating with Google Drive or Notion.</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                    ?
                  </div>
                  <span className="font-medium text-gray-800">What payment methods do you accept?</span>
                </div>
                <p className="text-sm text-gray-600 ml-8">We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through Stripe.</p>
              </div>
            </div>
          </section>

          {/* Ticket History */}
          <section className="w-full mb-4">
            <TicketHistory />
          </section>

        </div>
      </main>
      <ToastContainer />
    </div>
  );
} 