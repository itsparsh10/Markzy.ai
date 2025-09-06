'use client';

import React from 'react';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'brand', name: 'Brand Story' },
    { id: 'business', name: 'Business Journey' },
    { id: 'vision', name: 'Vision & Goals' },
    { id: 'personal', name: 'Personal Experience' },
    { id: 'products', name: 'Products & Services' },
    { id: 'industry', name: 'Industry & Influences' },
    { id: 'customers', name: 'Customers & Feedback' },
    { id: 'product-magic', name: 'Product Magic' },
    { id: 'social-magic', name: 'Social Magic' },
    { id: 'seo', name: 'SEO Magic' },
    { id: 'sales', name: 'Sales Page Magic' },
    { id: 'website', name: 'Website Magic' },
    { id: 'transcript', name: 'Transcript Magic' },
    { id: 'lead', name: 'Lead Magic' },
    { id: 'freebie', name: 'Freebie' }
  ];

  return (
    <div className="bg-gray-50 p-3 border-b border-gray-200 mb-3 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <i className="fas fa-filter text-[#46adb6] w-5"></i>
          <span className="text-gray-600 font-medium">Filter Tools</span>
        </div>
        <div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Categories</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button 
            key={category.id}
            className={`${
              activeCategory === category.id 
                ? 'bg-[#46adb6] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } text-xs font-medium px-3 py-1 rounded-full transition-colors shadow-sm flex items-center gap-1`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.id === 'all' && <i className="fas fa-filter text-xs"></i>}
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
