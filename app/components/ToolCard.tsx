import { useState } from 'react';

interface ToolCardProps {
  toolId: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  category: string;
  timeToComplete: string;
  onClick: (toolId: string) => void;
}

export default function ToolCard({ 
  toolId, 
  title, 
  description, 
  icon, 
  iconColor, 
  category, 
  timeToComplete, 
  onClick 
}: ToolCardProps) {
  // Get proper color classes based on iconColor
  const getColorClasses = (iconColor: string) => {
    if (iconColor.includes('blue')) {
      return {
        bgBase: 'bg-blue-100',
        bgHover: 'group-hover:bg-blue-200',
        textBase: 'text-blue-600',
        textHover: 'group-hover:text-blue-700',
        titleHover: 'group-hover:text-blue-600'
      };
    } else if (iconColor.includes('purple')) {
      return {
        bgBase: 'bg-purple-100',
        bgHover: 'group-hover:bg-purple-200',
        textBase: 'text-purple-600',
        textHover: 'group-hover:text-purple-700',
        titleHover: 'group-hover:text-purple-600'
      };
    } else if (iconColor.includes('green')) {
      return {
        bgBase: 'bg-green-100',
        bgHover: 'group-hover:bg-green-200',
        textBase: 'text-green-600',
        textHover: 'group-hover:text-green-700',
        titleHover: 'group-hover:text-green-600'
      };
    } else if (iconColor.includes('red')) {
      return {
        bgBase: 'bg-red-100',
        bgHover: 'group-hover:bg-red-200',
        textBase: 'text-red-600',
        textHover: 'group-hover:text-red-700',
        titleHover: 'group-hover:text-red-600'
      };
    } else if (iconColor.includes('orange')) {
      return {
        bgBase: 'bg-orange-100',
        bgHover: 'group-hover:bg-orange-200',
        textBase: 'text-orange-600',
        textHover: 'group-hover:text-orange-700',
        titleHover: 'group-hover:text-orange-600'
      };
    } else if (iconColor.includes('yellow')) {
      return {
        bgBase: 'bg-yellow-100',
        bgHover: 'group-hover:bg-yellow-200',
        textBase: 'text-yellow-600',
        textHover: 'group-hover:text-yellow-700',
        titleHover: 'group-hover:text-yellow-600'
      };
    } else if (iconColor.includes('indigo')) {
      return {
        bgBase: 'bg-indigo-100',
        bgHover: 'group-hover:bg-indigo-200',
        textBase: 'text-indigo-600',
        textHover: 'group-hover:text-indigo-700',
        titleHover: 'group-hover:text-indigo-600'
      };
    } else if (iconColor.includes('pink')) {
      return {
        bgBase: 'bg-pink-100',
        bgHover: 'group-hover:bg-pink-200',
        textBase: 'text-pink-600',
        textHover: 'group-hover:text-pink-700',
        titleHover: 'group-hover:text-pink-600'
      };
    } else {
      // Default to blue
      return {
        bgBase: 'bg-blue-100',
        bgHover: 'group-hover:bg-blue-200',
        textBase: 'text-blue-600',
        textHover: 'group-hover:text-blue-700',
        titleHover: 'group-hover:text-blue-600'
      };
    }
  };

  const colorClasses = getColorClasses(iconColor);
  
  return (
    <div 
      className="relative flex flex-col bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full w-full min-h-[280px] md:min-w-[250px] md:max-w-[350px]"
      onClick={() => onClick(toolId)}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-out"></div>
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-gradient-to-b from-blue-400 to-blue-600 transition-all duration-500 ease-out"></div>
      
      {/* Hover background effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-blue-400 to-blue-600 transition-opacity duration-300"></div>
      
      {/* Card content */}
      <div className="flex flex-col p-6 h-full  relative">
        {/* Icon and title header - Fixed height */}
        <div className="flex items-center mb-4 min-h-[60px]">
          <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${colorClasses.bgBase} ${colorClasses.bgHover} group-hover:scale-105 transition-all duration-300 flex-shrink-0`}>
            <i className={`fas ${icon} ${colorClasses.textBase} ${colorClasses.textHover} text-xl transition-colors duration-300`}></i>
          </div>
          <h3 className="ml-3 font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-base leading-tight flex items-center">
            <span className="line-clamp-3">{title}</span>
          </h3>
        </div>
        
        {/* Description with fixed height */}
        <div className="flex-grow mb-4 pr-1">
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-4" style={{ minHeight: '80px' }}>
            {description}
          </p>
        </div>
        
        {/* Footer with time and button - Fixed at bottom */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 shadow-sm">
            <i className="far fa-clock mr-1.5 text-blue-500"></i>
            {timeToComplete}
          </span>
          
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center shadow-md"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onClick(toolId);
            }}
          >
            <span>Use Tool</span>
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
