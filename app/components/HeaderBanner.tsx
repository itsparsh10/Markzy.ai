import React from 'react';

interface HeaderBannerProps {
  username: string;
}

export default function HeaderBanner({ username }: HeaderBannerProps) {
  return (
    <div className="bg-gradient-to-r from-[#1d1f89] to-[#2a2cb6] text-white rounded-lg p-3 shadow-md mb-3 border border-[#1d1f89]/20 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-10 -mb-10"></div>
      </div>
      
      <div className="flex items-start gap-3 relative z-10">
        {/* Logo Badge */}
        <div className="bg-white rounded-lg shadow-md w-10 h-10 flex items-center justify-center flex-shrink-0 border-2 border-[#46adb6]">
          <span className="text-[#1d1f89] text-xl font-bold">M</span>
        </div>
        
        {/* Content */}
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            Let&apos;s train your tone of voice, {username}! 
            <span className="animate-pulse">✨</span>
          </h2>
          <p className="text-white/90 text-sm mt-1 max-w-lg">The next step is to add some samples of your writing so we can train your very own Markzy voice.</p>
        </div>
      </div>
    </div>
  );
}
