'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleLogout = async () => {
    try {
      // Call logout API to track session
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error calling logout API:', error);
      // Continue with logout even if API call fails
    }
    
    // Add logout notification before clearing data
    if (typeof window !== 'undefined' && (window as any).addLogoutNotification) {
      (window as any).addLogoutNotification();
    }
    
    // Set logout timestamp for login detection
    localStorage.setItem('lastLogout', Date.now().toString());
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Clear cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Show success notification
    toast.success('👋 Logged out successfully! See you soon.', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      toastId: 'logout-success',
    });
    
    // Redirect to login page after a short delay to show the toast
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };
  
  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed top-3 right-3 z-30">
        <button 
          className="bg-[#1d1f89] text-white p-2 rounded-md shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      
      {/* Sidebar Container */}
      <div 
        className={`${
          isCollapsed ? 'w-16' : 'w-64'
        } h-full bg-[#1d1f89]  flex flex-col overflow-hidden z-20 transition-all duration-300 ease-in-out hidden md:flex relative`} 
        id="sidebar"
      >
        {/* Desktop Collapse Toggle Button - Right Edge, Middle */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-30">
          <button 
            className="bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 hover:text-gray-800 p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-sm`}></i>
          </button>
        </div>

        {/* Logo */}
        <div className={ `  ${isCollapsed ? 'py-4' : 'p-6'}`}>
          <Link href="/all-tools">
            <h1 className={`text-2xl font-bold p-3 rounded-md logo-bg transition-all duration-300 cursor-pointer hover:opacity-80 ${
              isCollapsed ? 'text-center' : ''
            }`}>
              <span className="text-white font-extrabold text-shadow-sm">
                {isCollapsed ? (
                  <Image 
                    src='/assets/images/icon.png' 
                    alt='Markzy' 
                    width={32} 
                    height={32} 
                    className='invert brightness-0'
                  />
                ) : (
                  <Image 
                    src='/assets/images/logo.png' 
                    alt='Markzy' 
                    width={180} 
                    height={32} 
                    className='invert brightness-0'
                  />
                )}
              </span>
            </h1>
          </Link>
        </div>
        
        {/* Main Navigation */}
        <div className="flex-1 flex flex-col gap-1 p-2 fade-in">
          {/* Start Here */}
          {/* <Link 
            href="/start-here" 
            className={`flex items-center gap-2 ${pathname === '/start-here' ? 'bg-[#46adb6]/70' : 'hover:bg-[#46adb6]/30'} text-white rounded-md px-4 py-2 font-medium button-hover transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Start Here' : ''}
          >
            <i className="fas fa-wand-magic-sparkles text-white w-5"></i>
            {!isCollapsed && <span>Start Here</span>}
          </Link> */}
          
          {/* All Tools */}
          <Link 
            href="/all-tools" 
            className={`flex items-center gap-2 ${pathname.startsWith('/all-tools') ? 'bg-[#46adb6]/70' : 'hover:bg-[#46adb6]/30'} rounded-md px-4 py-2 text-white/90 transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'All Tools' : ''}
          >
            <i className="fas fa-tools text-[#46adb6] w-5"></i>
            {!isCollapsed && <span>All Tools</span>}
          </Link>
          
          {/* Story Magic */}
          {/* <Link 
            href="/story-magic" 
            className={`flex items-center gap-2 ${pathname === '/story-magic' ? 'bg-[#46adb6]/70' : 'hover:bg-[#46adb6]/30'} rounded-md px-4 py-2 text-white/90 transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Story Magic' : ''}
          >
            <i className="fas fa-wand-magic text-[#46adb6] w-5"></i>
            {!isCollapsed && <span>Story Magic</span>}
          </Link> */}
          
          {/* Workflows */}
          {/* <Link 
            href="/workflows" 
            className={`flex items-center gap-2 ${pathname === '/workflows' ? 'bg-[#46adb6]/70' : 'hover:bg-[#46adb6]/30'} rounded-md px-4 py-2 text-white/90 transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Workflows' : ''}
          >
            <i className="fas fa-list-check text-[#46adb6] w-5"></i>
            {!isCollapsed && <span>Workflows</span>}
          </Link>
           */}
          {/* Commercial */}
          {/* <Link 
            href="/commercial" 
            className={`flex items-center gap-2 ${pathname === '/commercial' ? 'bg-[#46adb6]/70' : 'hover:bg-[#46adb6]/30'} rounded-md px-4 py-2 text-white/90 transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Commercial' : ''}
          >
            <i className="fas fa-user text-[#46adb6] w-5"></i>
            {!isCollapsed && <span>Commercial</span>}
          </Link>
           */}
          {/* Help Center */}
          <Link 
            href="/support-calls" 
            className={`flex items-center gap-2 ${pathname === '/support-calls' ? 'bg-[#46adb6]/70' : 'hover:bg-[#46adb6]/30'} rounded-md px-4 py-2 text-white/90 transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Help Center' : ''}
          >
            <i className="fas fa-calendar text-[#46adb6] w-5"></i>
            {!isCollapsed && <span>Help Center</span>}
          </Link>
          
          {/* Knowledge Base */}
          <Link 
            href="/knowledge-base" 
            className={`flex items-center gap-2 ${pathname === '/knowledge-base' ? 'bg-[#46adb6]/70' : 'hover:bg-[#46adb6]/30'} rounded-md px-4 py-2 text-white/90 transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Knowledge Base' : ''}
          >
            <i className="fas fa-question-circle text-[#46adb6] w-5"></i>
            {!isCollapsed && <span>Knowledge Base</span>}
          </Link>
          
          {/* Upgrade Button */}
          <Link 
            href="/upgrade-account" 
            className={`flex items-center gap-2 premium-gold text-white rounded-md px-4 py-2 mt-2 font-medium transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Upgrade Your Account' : ''}
          >
            <i className="fas fa-crown text-white w-5 opacity-90"></i>
            {!isCollapsed && <span className="whitespace-nowrap">Upgrade Your Account</span>}
          </Link>
        </div>
        
        {/* Footer Items */}
        <div className="p-2 border-t border-white/10">
          <Link 
            href="/account" 
            className={`flex items-center gap-2 hover:bg-[#46adb6]/30 rounded-md px-4 py-2 text-white/90 transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'My Account' : ''}
          >
            <i className="fas fa-user-circle text-[#46adb6] w-5"></i>
            {!isCollapsed && <span>My Account</span>}
          </Link>
          <Link 
            href="/share" 
            className={`flex items-center gap-2 hover:bg-[#46adb6]/30 rounded-md px-4 py-2 text-white/90 transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Share the Magic' : ''}
          >
            <i className="fas fa-share-alt text-[#46adb6] w-5"></i>
            {!isCollapsed && <span>Share the Magic</span>}
          </Link>
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-2 hover:bg-red-500/30 rounded-md px-4 py-2 text-white/90 w-full text-left transition-all duration-200 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <i className="fas fa-sign-out-alt text-red-400 w-5"></i>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div 
        className={`w-full h-full bg-[#1d1f89] border-r border-[#1d1f89]/30 flex flex-col overflow-y-auto z-20 md:hidden ${
          isMobileMenuOpen ? 'fixed inset-0' : 'hidden'
        }`} 
      >
        {/* Mobile Logo */}
        <div className="p-6">
          <Link href="/all-tools">
            <h1 className="text-2xl font-bold p-3 rounded-md logo-bg cursor-pointer hover:opacity-80 flex items-center justify-start">
              <Image 
                src='/assets/images/logo.png' 
                alt='Markzy' 
                width={180} 
                height={32} 
                className='invert brightness-0 h-8 w-auto'
              />
            </h1>
          </Link>
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex-1 flex flex-col gap-1 p-2 fade-in">
          {/* Hidden: Start Here */}
          <Link 
            href="/all-tools" 
            className={`flex items-center gap-2 ${pathname.startsWith('/all-tools') ? 'bg-[#46adb6]/70' : 'hover:bg-[#46adb6]/30'} rounded-md px-4 py-2 text-white/90`}
          >
            <i className="fas fa-tools text-[#46adb6] w-5"></i>
            <span>All Tools</span>
          </Link>
          {/* Hidden: Story Magic */}
          {/* Hidden: Workflows */}
          {/* Hidden: Commercial */}
          <Link href="/support-calls" className={`flex items-center gap-2 ${pathname === '/support-calls' ? 'bg-[#46adb6]/70' : 'hover:bg-[#46adb6]/30'} rounded-md px-4 py-2 text-white/90`}>
            <i className="fas fa-calendar text-[#46adb6] w-5"></i>
            <span>Help Center</span>
          </Link>
          <Link href="/knowledge-base" className={`flex items-center gap-2 ${pathname === '/knowledge-base' ? 'bg-[#46adb6]/70' : 'hover:bg-[#46adb6]/30'} rounded-md px-4 py-2 text-white/90`}>
            <i className="fas fa-question-circle text-[#46adb6] w-5"></i>
            <span>Knowledge Base</span>
          </Link>
          <Link href="/upgrade-account" className="flex items-center gap-2 premium-gold text-white rounded-md px-4 py-2 mt-2 font-medium">
            <i className="fas fa-crown text-white w-5 opacity-90"></i>
            <span className="whitespace-nowrap">Upgrade Your Account</span>
          </Link>
        </div>
        
        {/* Mobile Footer Items */}
        <div className="p-2 border-t border-white/10">
          <Link href="/account" className="flex items-center gap-2 hover:bg-[#46adb6]/30 rounded-md px-4 py-2 text-white/90">
            <i className="fas fa-user-circle text-[#46adb6] w-5"></i>
            <span>My Account</span>
          </Link>
          <Link href="/share" className="flex items-center gap-2 hover:bg-[#46adb6]/30 rounded-md px-4 py-2 text-white/90">
            <i className="fas fa-share-alt text-[#46adb6] w-5"></i>
            <span>Share the Magic</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-red-500/30 rounded-md px-4 py-2 text-white/90 w-full text-left"
          >
            <i className="fas fa-sign-out-alt text-red-400 w-5"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
