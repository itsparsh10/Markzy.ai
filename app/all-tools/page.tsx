'use client';

import { useState, useEffect, useRef } from "react";

import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import ToolsGrid from "../components/ToolsGrid";
import Footer from "../components/Footer";

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

// Custom hook for notifications
const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage
  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
  };

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    saveNotifications(updatedNotifications);
  };

  // Mark as read
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    saveNotifications(updatedNotifications);
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Get recent notifications (last 3)
  const recentNotifications = notifications.slice(0, 3);

  return {
    notifications,
    recentNotifications,
    unreadCount,
    addNotification,
    markAsRead
  };
};

// Helper function to format time ago
const getTimeAgo = (timestamp: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
};

export default function AllTools() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showNotifications, setShowNotifications] = useState(false);

  const [userData, setUserData] = useState<any>(null);
  
  // Use notification system
  const { recentNotifications, unreadCount, addNotification, markAsRead } = useNotificationSystem();
  const hasInitNotifications = useRef(false);

  // Check for user login and add welcome notification
  useEffect(() => {
    if (hasInitNotifications.current) return;
    hasInitNotifications.current = true;
    const checkUserLogin = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      const lastLogin = localStorage.getItem('lastLogin');
      const lastLogout = localStorage.getItem('lastLogout');
      const currentTime = Date.now();
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setUserData(user);
          
          // Only show welcome back notification if:
          // 1. User has logged out before (lastLogout exists)
          // 2. Current login is after the last logout
          // 3. This is not a page refresh (lastLogin doesn't exist or is old)
          const hasLoggedOutBefore = lastLogout && parseInt(lastLogout) > 0;
          const isLoginAfterLogout = hasLoggedOutBefore && parseInt(lastLogout || '0') > (parseInt(lastLogin || '0'));
          const isNotPageRefresh = !lastLogin || (currentTime - parseInt(lastLogin || '0')) > 30000; // 30 seconds threshold
          
          if (hasLoggedOutBefore && isLoginAfterLogout && isNotPageRefresh) {
            // Add welcome back notification
            addNotification({
              title: "Welcome Back! 👋",
              message: `Great to see you again, ${user.name || user.email || 'User'}! Ready to create some amazing content?`,
              type: 'success',
              isRead: false,
              category: 'login'
            });
          }
          
          // Update last login time
          localStorage.setItem('lastLogin', currentTime.toString());
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    checkUserLogin();
  }, []); // Empty dependency array to run only once on mount

  // Add welcome notification for new users only
  useEffect(() => {
    const addWelcomeNotification = () => {
      const hasWelcomeNotification = localStorage.getItem('hasWelcomeNotification');
      
      if (!hasWelcomeNotification) {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            addNotification({
              title: "Welcome to Markzy! 🎉",
              message: `Hi ${user.name || user.email || 'there'}! Welcome to Markzy. We're excited to help you grow your business with our AI-powered tools.`,
              type: 'success',
              isRead: false,
              category: 'welcome'
            });
            localStorage.setItem('hasWelcomeNotification', 'true');
          } catch (error) {
            console.error('Error parsing user data for welcome notification:', error);
          }
        }
      }
    };

    addWelcomeNotification();
  }, []); // Empty dependency array to run only once on mount

  // Function to add logout notification (can be called from other components)
  const addLogoutNotification = () => {
    if (userData) {
      // Set logout timestamp for login detection
      localStorage.setItem('lastLogout', Date.now().toString());
      
      addNotification({
        title: "Logged Out Successfully 👋",
        message: `Thanks for using Markzy, ${userData.name || userData.email || 'User'}! Your session has been ended securely.`,
        type: 'info',
        isRead: false,
        category: 'logout'
      });
    }
  };

  // Function to add account creation notification
  const addAccountCreatedNotification = (userName: string) => {
    addNotification({
      title: "Account Created Successfully! 🎉",
      message: `Welcome to Markzy, ${userName}! Your account has been created and you're ready to start creating amazing content.`,
      type: 'success',
      isRead: false,
      category: 'account'
    });
  };

  // Function to add subscription notification
  const addSubscriptionNotification = (planName: string) => {
    addNotification({
      title: "Subscription Activated! ✨",
      message: `Congratulations! Your ${planName} subscription is now active. Enjoy unlimited access to all premium features!`,
      type: 'success',
      isRead: false,
      category: 'subscription'
    });
  };

  // Expose functions globally for use in other components
  useEffect(() => {
    (window as any).addLogoutNotification = addLogoutNotification;
    (window as any).addAccountCreatedNotification = addAccountCreatedNotification;
    (window as any).addSubscriptionNotification = addSubscriptionNotification;
  }, []); // Empty dependency array to run only once on mount

  const handleSubscribe = () => {
    // Simulate subscription process
    toast.success(
      "🎉 Successfully subscribed! You'll be notified when we add new tools.",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "subscribe-success",
      }
    );
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  // Helper function to get notification icon and color
  const getNotificationIcon = (type: string, category: string) => {
    switch (type) {
      case 'success':
        return { icon: 'fas fa-check-circle', bgColor: 'bg-green-100', iconColor: 'text-green-600' };
      case 'warning':
        return { icon: 'fas fa-exclamation-triangle', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' };
      case 'error':
        return { icon: 'fas fa-exclamation-circle', bgColor: 'bg-red-100', iconColor: 'text-red-600' };
      default:
        switch (category) {
          case 'Tools':
            return { icon: 'fas fa-plus', bgColor: 'bg-green-100', iconColor: 'text-green-600' };
          case 'Features':
            return { icon: 'fas fa-star', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' };
          case 'System':
            return { icon: 'fas fa-sync', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
          case 'Security':
            return { icon: 'fas fa-shield-alt', bgColor: 'bg-red-100', iconColor: 'text-red-600' };
          case 'Analytics':
            return { icon: 'fas fa-chart-line', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' };
          case 'Welcome':
            return { icon: 'fas fa-heart', bgColor: 'bg-pink-100', iconColor: 'text-pink-600' };
          default:
            return { icon: 'fas fa-info-circle', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
        }
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Modern floating header with elegant glass effect */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/95 shadow-lg border-b border-blue-100 w-full">
          <div className="w-full px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-3 rounded-lg shadow-md">
                  <i className="fas fa-tools text-white text-lg"></i>
                </div>
              </div>

              {/* Enhanced search bar with animation */}
              <div className="relative flex-1 max-w-md hidden md:block group">
                <input
                  type="text"
                  placeholder="Find the perfect tool..."
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
                  <i className="fas fa-search text-blue-300"></i>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                )}
              </div>

              <div className="flex gap-4 items-center">
                {/* Menu toggle for mobile */}
                {/* Redesigned action buttons */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative hidden md:inline-flex bg-white hover:bg-blue-50 p-2.5 rounded-full transition-colors text-blue-500 shadow-sm border border-blue-100 hover:border-blue-200"
                    >
                      <i className="fas fa-bell"></i>
                      {/* Notification badge */}
                      {unreadCount > 0 && (

                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {unreadCount > 9 ? '9+' : unreadCount}

                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <>
                        {/* Backdrop to close dropdown */}
                        <div
                          className="fixed inset-0 z-[999]"
                          onClick={() => setShowNotifications(false)}
                        ></div>

                        {/* Dropdown Panel */}
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-[110] overflow-hidden">
                          {/* Header */}
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-white font-semibold text-sm">
                                Notifications
                              </h3>
                              <button
                                onClick={() => setShowNotifications(false)}
                                className="text-white/80 hover:text-white transition-colors"
                              >
                                <i className="fas fa-times text-sm"></i>
                              </button>
                            </div>
                          </div>

                          {/* Notifications List */}
                          <div className="max-h-96 overflow-y-auto">
                            {recentNotifications.length > 0 ? (
                              recentNotifications.map((notification) => {
                                const getIconAndColor = (type: string, category: string) => {
                                  if (category === 'login') {
                                    return { icon: 'fas fa-user-check', bgColor: 'bg-green-100', iconColor: 'text-green-600' };
                                  } else if (category === 'account') {
                                    return { icon: 'fas fa-user-plus', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
                                  } else if (category === 'welcome') {
                                    return { icon: 'fas fa-party-horn', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' };
                                  } else if (category === 'tool') {
                                    return { icon: 'fas fa-plus', bgColor: 'bg-green-100', iconColor: 'text-green-600' };
                                  } else if (category === 'feature') {
                                    return { icon: 'fas fa-star', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' };
                                  } else if (category === 'logout') {
                                    return { icon: 'fas fa-sign-out-alt', bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
                                  } else if (category === 'subscription') {
                                    return { icon: 'fas fa-crown', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' };
                                  } else if (type === 'success') {
                                    return { icon: 'fas fa-check-circle', bgColor: 'bg-green-100', iconColor: 'text-green-600' };
                                  } else if (type === 'warning') {
                                    return { icon: 'fas fa-exclamation-triangle', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' };
                                  } else if (type === 'error') {
                                    return { icon: 'fas fa-times-circle', bgColor: 'bg-red-100', iconColor: 'text-red-600' };
                                  } else {
                                    return { icon: 'fas fa-info-circle', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
                                  }
                                };

                                const { icon, bgColor, iconColor } = getIconAndColor(notification.type, notification.category);
                                const timeAgo = getTimeAgo(notification.timestamp);

                                return (
                                  <div 
                                    key={notification.id}
                                    className="p-4 border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <i className={`${icon} ${iconColor} text-sm`}></i>
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                          {notification.title}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                          {notification.message}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                          {timeAgo}
                                        </p>
                                      </div>
                                      {!notification.isRead && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                <i className="fas fa-bell-slash text-2xl mb-2"></i>
                                <p className="text-sm">No notifications yet</p>
                              </div>

                            )}
                          </div>

                          {/* Footer */}
                          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setShowNotifications(false);
                                router.push("/notifications");
                              }}
                              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                              View All Notifications
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {/* <button className="bg-white hover:bg-blue-50 p-2.5 rounded-full transition-colors text-blue-500 shadow-sm border border-blue-100 hover:border-blue-200">
                  <i className="fas fa-sliders-h"></i>
                </button> */}
                </div>
              </div>
            </div>

            {/* Enhanced view controls with modern styling */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mt-4">
              {/* Mobile search */}
              <div className="relative w-full md:hidden mb-2">
                <input
                  type="text"
                  placeholder="Find the perfect tool..."
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
                  <i className="fas fa-search text-blue-300"></i>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times-circle"></i>
                  </button>
                )}
              </div>

              {/* Modern filter buttons with active states */}
              <div className="w-full overflow-x-auto pb-1 md:overflow-visible">
                <div className="flex items-center gap-2 sm:gap-3 flex-nowrap md:flex-wrap min-w-max md:min-w-0 [&>button]:shrink-0">
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "all"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("all")}
                >
                  <i className="fas fa-th-large text-sm mr-2"></i>All
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "digitalshop"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("digitalshop")}
                >
                  <i className="fas fa-shopping-cart text-sm mr-2"></i>Digital
                  Shop
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "funnel"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("funnel")}
                >
                  <i className="fas fa-filter text-sm mr-2"></i>Funnel
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "ecommerce"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("ecommerce")}
                >
                  <i className="fas fa-store text-sm mr-2"></i>Ecommerce
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "brand"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("brand")}
                >
                  <i className="fas fa-copyright text-sm mr-2"></i>Brand
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "email"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("email")}
                >
                  <i className="fas fa-envelope text-sm mr-2"></i>Email
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "guest"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("guest")}
                >
                  <i className="fas fa-user-friends text-sm mr-2"></i>Guest
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "product"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("product")}
                >
                  <i className="fas fa-box text-sm mr-2"></i>Product
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "social"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("social")}
                >
                  <i className="fas fa-share-alt text-sm mr-2"></i>Social
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "video"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("video")}
                >
                  <i className="fas fa-video text-sm mr-2"></i>Transcript
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "salespage"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("salespage")}
                >
                  <i className="fas fa-file-invoice-dollar text-sm mr-2"></i>
                  Sales
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "website"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("website")}
                >
                  <i className="fas fa-globe text-sm mr-2"></i>Website
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "Affiliate"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("Affiliate")}
                >
                  <i className="fas fa-handshake text-sm mr-2"></i>Affiliate
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "Blog"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("Blog")}
                >
                  <i className="fas fa-blog text-sm mr-2"></i>Blog
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "Content"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("Content")}
                >
                  <i className="fas fa-file-alt text-sm mr-2"></i>Content
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "customerx"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("customerx")}
                >
                  <i className="fas fa-user text-sm mr-2"></i>Customer
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "seo"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("seo")}
                >
                  <i className="fas fa-search-dollar text-sm mr-2"></i>SEO
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "lead"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("lead")}
                >
                  <i className="fas fa-user-plus text-sm mr-2"></i>Lead
                </button>
                <button
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all h-9 flex items-center justify-center ${
                    activeCategory === "freestyle"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => handleCategoryChange("freestyle")}
                >
                  <i className="fas fa-magic text-sm mr-2"></i>Freestyle
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area with cards grid or tool detail */}
        <div
          className="flex-1 overflow-auto bg-gradient-to-b from-blue-50 to-white w-full p-4"
          data-component-name="AllTools"
        >
          {/* Tools grid with proper spacing */}
          <div id="AllTools" className="w-full">
            <ToolsGrid
              onToolSelected={setSelectedTool}
              searchTerm={searchTerm}
              activeCategory={activeCategory}
            />
          </div>
        </div>

        {/* Footer positioned after main content */}
        <Footer />
      </div>
    </div>
  );
}
