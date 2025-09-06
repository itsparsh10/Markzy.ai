'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/Sidebar';

// Notification Types
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
  category: string;
}

// Context Types
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllRead: () => void;
}

// Create Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Custom Hook
const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Provider Component
const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert timestamp strings back to Date objects
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    } else {

      // Initialize with empty notifications array - no hardcoded sample notifications
      setNotifications([]);

    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const deleteAllRead = () => {
    setNotifications(prev => prev.filter(notification => !notification.isRead));
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Main Notifications Page Component
function NotificationsPageContent() {
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteAllRead,
    addNotification
  } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch user data and check for welcome message
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
          
          // Check if user is new (created within last 24 hours)
          const userCreatedAt = new Date(data.user.createdAt || data.user.created_at);
          const now = new Date();
          const hoursSinceCreation = (now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60);
          
          // Check for logout/login cycle
          const lastLoginTime = localStorage.getItem('lastLoginTime');
          const lastLogoutTime = localStorage.getItem('lastLogoutTime');
          const currentTime = Date.now();
          
          // Show welcome message if:
          // 1. First time login (no lastLoginTime)
          // 2. User logged out and logged back in (lastLogoutTime exists and is after lastLoginTime)
          // 3. More than 1 hour has passed since last login
          const shouldShowWelcome = !lastLoginTime || 
            (lastLogoutTime && parseInt(lastLogoutTime) > parseInt(lastLoginTime)) ||
            (currentTime - parseInt(lastLoginTime)) > 1000 * 60 * 60; // 1 hour
          
          // Check if welcome message already exists in notifications (within last 30 minutes)
          const existingWelcomeMessage = notifications.find(n => 
            n.title.includes('Welcome') && n.category === 'Welcome' && 
            new Date(n.timestamp).getTime() > currentTime - 1000 * 60 * 30 // Within last 30 minutes
          );

          if (shouldShowWelcome && !existingWelcomeMessage) {
            if (hoursSinceCreation < 24) {
              // New user - add welcome message
              addNotification({
                title: 'Welcome to Markzy!',
                message: `Hi ${data.user.name || data.user.username || 'there'}! Welcome to Markzy. We're excited to help you grow your business with our AI-powered tools.`,
                type: 'success',
                isRead: false,
                category: 'Welcome'
              });
            } else {
              // Existing user - add welcome back message
              addNotification({
                title: 'Welcome Back!',
                message: `Welcome back, ${data.user.name || data.user.username || 'there'}! We're glad to see you again. Ready to create some amazing content?`,
                type: 'info',
                isRead: false,
                category: 'Welcome'
              });
            }
            
            // Update last login time and clear logout time
            localStorage.setItem('lastLoginTime', currentTime.toString());
            localStorage.removeItem('lastLogoutTime'); // Clear logout time on successful login
          }
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [addNotification, notifications, router]);

  // Wrapper functions to add toast notifications
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
    toast.success('Notification deleted');
  };

  const handleDeleteAllRead = () => {
    deleteAllRead();
    toast.success('All read notifications deleted');
  };

  // Function to handle logout (call this when user logs out)
  const handleLogout = () => {
    localStorage.setItem('lastLogoutTime', Date.now().toString());
    toast.success('Logout simulated! Now login again to see welcome back message.');
  };

  // Function to manually trigger welcome notification (for testing)


  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'read':
        return notifications.filter(n => n.isRead);
      default:
        return notifications;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-green-500';
      case 'info':
        return 'fas fa-info-circle text-blue-500';
      case 'warning':
        return 'fas fa-exclamation-triangle text-yellow-500';
      case 'error':
        return 'fas fa-times-circle text-red-500';
      default:
        return 'fas fa-bell text-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/95 shadow-lg border-b border-blue-100">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-3 rounded-lg shadow-md">
                  <i className="fas fa-bell text-white text-lg"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600 text-sm">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    {userData && (
                      <span className="ml-2 text-blue-600">
                        • Welcome, {userData.name || userData.username || 'User'}!
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/all-tools')}
                  className="bg-white hover:bg-blue-50 p-2.5 rounded-full transition-colors text-blue-500 shadow-sm border border-blue-100 hover:border-blue-200"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-b from-blue-50 to-white p-6">
          {loading || userLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Filter and Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        filter === 'all' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                      }`}
                      onClick={() => setFilter('all')}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        filter === 'unread' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                      }`}
                      onClick={() => setFilter('unread')}
                    >
                      Unread ({unreadCount})
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        filter === 'read' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                      }`}
                      onClick={() => setFilter('read')}
                    >
                      Read ({notifications.filter(n => n.isRead).length})
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors shadow-sm whitespace-nowrap"
                    >
                      <i className="fas fa-check mr-2"></i>
                      Mark All as Read
                    </button>
                    <button
                      onClick={handleDeleteAllRead}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors shadow-sm whitespace-nowrap"
                    >
                      <i className="fas fa-trash mr-2"></i>
                      Delete Read
                    </button>

                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {getFilteredNotifications().length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-8 text-center">
                    <i className="fas fa-bell-slash text-4xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No notifications</h3>
                    <p className="text-gray-500">You're all caught up!</p>
                  </div>
                ) : (
                  getFilteredNotifications().map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
                        notification.isRead 
                          ? 'border-gray-200 opacity-75' 
                          : 'border-blue-200 bg-blue-50/30'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex-shrink-0 mt-1">
                              <i className={`${getTypeIcon(notification.type)} text-lg`}></i>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold text-sm ${
                                  notification.isRead ? 'text-gray-600' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              
                              <p className={`text-sm mb-2 ${
                                notification.isRead ? 'text-gray-500' : 'text-gray-700'
                              }`}>
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <i className="fas fa-clock"></i>
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <i className="fas fa-tag"></i>
                                  {notification.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Mark as read"
                              >
                                <i className="fas fa-check text-sm"></i>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete notification"
                            >
                              <i className="fas fa-trash text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

// Export the main component wrapped with the provider
export default function NotificationsPage() {
  return (
    <NotificationProvider>
      <NotificationsPageContent />
    </NotificationProvider>
  );
} 