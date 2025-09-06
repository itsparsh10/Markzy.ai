"use client";
import Footer from "./Footer";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* This will contain the sidebar from the child components */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
