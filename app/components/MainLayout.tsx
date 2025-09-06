'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';

interface MainLayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: MainLayoutProps) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      
      {/* Main Content Area */}
      <main 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-0' : 'ml-0'
        }`}
        style={{
          marginLeft: isCollapsed ? '0' : '0' // Let sidebar handle its own width
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
}
