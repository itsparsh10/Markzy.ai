'use client';
import React, { useEffect } from 'react';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Pricing from './sections/Pricing';
import CallToAction from './sections/CallToAction';
import Footer from './sections/Footer';
import AIToolsShowcase from './sections/AIToolsShowcase';


export default function LandingPageLayout() {
  useEffect(() => {
    // Enable scrolling for landing page
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.width = 'auto';
    
    // Cleanup - restore original styles when leaving the page
    return () => {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.width = '100vw';
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-x-hidden">
      {/* Sticky Promotional Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#1d1f89] text-white">
        <div className="flex items-center justify-center px-3 py-1.5 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 text-center">
            <i className="fas fa-gift text-sm sm:text-base md:text-lg"></i>
            <span className="font-medium text-xs sm:text-sm md:text-base leading-tight">
              🎉 Limited Time: Access ALL Premium Features FREE for 14 Days
            </span>
          </div>
        </div>
      </div>
      
      {/* Add top padding to account for the sticky banner */}
      <div className="pt-14 sm:pt-12">
        <Header />
        <main className="relative">
          <Hero />
          <Features />
          <AIToolsShowcase/>
          <Pricing />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  );
}
