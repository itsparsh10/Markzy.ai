'use client';

import React, { useState, useEffect } from 'react';

interface ToolDetailProps {
  toolId: number | string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  onBack: () => void;
  isOpen: boolean;
}

// Timeframe component for abandoned cart emails
interface TimeframeItemProps {
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const TimeframeItem: React.FC<TimeframeItemProps> = ({ value, label, isSelected, onClick }) => {
  return (
    <div 
      className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

const CartTimeframeInput: React.FC = () => {
  const [selected, setSelected] = useState('24h');
  
  return (
    <div className="flex space-x-2 mb-2">
      <TimeframeItem 
        value="24h" 
        label="24 Hours" 
        isSelected={selected === '24h'}
        onClick={() => setSelected('24h')} 
      />
      <TimeframeItem 
        value="48h" 
        label="48 Hours" 
        isSelected={selected === '48h'}
        onClick={() => setSelected('48h')} 
      />
      <TimeframeItem 
        value="72h" 
        label="72 Hours" 
        isSelected={selected === '72h'}
        onClick={() => setSelected('72h')} 
      />
    </div>
  );
};

// Email Type components
interface EmailTypeItemProps {
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const EmailTypeItem: React.FC<EmailTypeItemProps> = ({ value, label, isSelected, onClick }) => {
  return (
    <div 
      className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

const EmailTypeInput: React.FC = () => {
  const [selected, setSelected] = useState('promotional');
  
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <EmailTypeItem 
        value="promotional" 
        label="Promotional" 
        isSelected={selected === 'promotional'}
        onClick={() => setSelected('promotional')} 
      />
      <EmailTypeItem 
        value="educational" 
        label="Educational" 
        isSelected={selected === 'educational'}
        onClick={() => setSelected('educational')} 
      />
      <EmailTypeItem 
        value="reviews" 
        label="Social Proof" 
        isSelected={selected === 'reviews'}
        onClick={() => setSelected('reviews')} 
      />
      <EmailTypeItem 
        value="announcement" 
        label="Announcement" 
        isSelected={selected === 'announcement'}
        onClick={() => setSelected('announcement')} 
      />
      <EmailTypeItem 
        value="discount" 
        label="Discount" 
        isSelected={selected === 'discount'}
        onClick={() => setSelected('discount')} 
      />
    </div>
  );
};

// Product Summary component
interface ProductSummaryItemProps {
  title: string;
  onRemove: () => void;
}

const ProductSummaryItem: React.FC<ProductSummaryItemProps> = ({ title, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`flex items-center justify-between px-3 py-1.5 mb-2 rounded-lg text-sm ${
        isHovered ? 'bg-red-50' : 'bg-gray-50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="truncate">{title}</span>
      <button 
        className={`text-xs px-2 py-0.5 rounded transition-colors ml-2 ${
          isHovered ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  );
};

// Promo Ideas component
interface PromoIdeasItemProps {
  title: string;
  onUse: () => void;
}

const PromoIdeasItem: React.FC<PromoIdeasItemProps> = ({ title, onUse }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`flex items-center justify-between px-3 py-1.5 mb-2 rounded-lg text-sm ${
        isHovered ? 'bg-blue-50' : 'bg-gray-50'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="truncate">{title}</span>
      <button 
        className={`text-xs px-2 py-0.5 rounded transition-colors ml-2 ${
          isHovered ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        onClick={onUse}
      >
        Use
      </button>
    </div>
  );
};

export default function ToolDetail({ toolId, title, description, icon, iconColor, bgColor, onBack, isOpen }: ToolDetailProps) {
  const [animationClass, setAnimationClass] = useState('');
  const [selectedTab, setSelectedTab] = useState('generate');
  const [brandName, setBrandName] = useState('');
  const [productName, setProductName] = useState('');
  
  // Control animation classes for entrance and exit
  useEffect(() => {
    if (isOpen) {
      setAnimationClass('translate-y-0 opacity-100');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      setAnimationClass('translate-y-full opacity-0');
      document.body.style.overflow = ''; // Re-enable scrolling when modal is closed
    }
    
    return () => {
      document.body.style.overflow = ''; // Clean up on unmount
    };
  }, [isOpen]);
  
  // Custom content for specific tools
  const isAbandonedCartTool = title.toLowerCase().includes('abandoned cart');
  const isAffiliateEmailSwipes = title.toLowerCase().includes('affiliate email');
  const isAffiliateMessaging = title.toLowerCase().includes('messaging');
  const isAffiliateProduct = title.toLowerCase().includes('product details');
  const isAffiliatePromo = title.toLowerCase().includes('promo ideas');
  
  // Extract color for consistent styling
  const colorBase = iconColor.split('-')[1] || 'blue';
  
  // Handle creation actions
  const handleCreate = () => {
    console.log('Creating content for', title, 'with brand:', brandName, 'and product:', productName);
    // API calls would go here
  };
  
  // Handle removing a product from the list
  const handleRemoveProduct = (productTitle: string) => {
    console.log('Removing product:', productTitle);
  };
  
  // Handle using a promo idea
  const handleUsePromo = (promoTitle: string) => {
    console.log('Using promo idea:', promoTitle);
  };
  
  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onBack}
    >
      <div 
        className={`relative max-w-2xl w-full mx-4 max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 transform ${animationClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient and icon */}
        <div 
          className={`flex items-center px-4 py-2 text-white bg-gradient-to-r from-${colorBase}-600 to-${colorBase}-500`}
        >
          <div className="mr-3 p-1.5 rounded-full bg-white/20 backdrop-blur">
            <i className={`${icon} text-white text-lg`}></i>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs text-white/80 line-clamp-1">{description}</p>
          </div>
          <button 
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            onClick={onBack}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Content area with scrolling */}
        <div className="p-3 max-h-[calc(90vh-60px)] overflow-y-auto">
          {/* Tab navigation for Generate/Template/History */}
          <div className="flex space-x-4 mb-3 border-b">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                selectedTab === 'generate' 
                  ? `text-${colorBase}-600 border-b-2 border-${colorBase}-600` 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedTab('generate')}
            >
              Generate
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                selectedTab === 'template' 
                  ? `text-${colorBase}-600 border-b-2 border-${colorBase}-600` 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedTab('template')}
            >
              Templates
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                selectedTab === 'history' 
                  ? `text-${colorBase}-600 border-b-2 border-${colorBase}-600` 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedTab('history')}
            >
              History
            </button>
          </div>
          
          {/* Form inputs for all tools */}
          <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-md space-y-5 min-h-[220px] mb-3">
  <div className="flex items-center gap-3 mb-2">
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M19 20V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/><rect width="13" height="8" x="5" y="8" rx="1"/></svg>
    </span>
    <h2 className="text-lg font-semibold text-blue-700">Content Repurposer</h2>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="brand-name" className="block text-sm font-medium text-blue-700 mb-1">Brand Name</label>
      <input
        id="brand-name"
        type="text"
        className="w-full p-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm bg-white"
        placeholder="Enter your brand name"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
      />
      <p className="text-xs text-blue-400 mt-1">Enter your brand or company name.</p>
    </div>
    <div>
      <label htmlFor="product-name" className="block text-sm font-medium text-blue-700 mb-1">Product Name</label>
      <input
        id="product-name"
        type="text"
        className="w-full p-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm bg-white"
        placeholder="Enter your product name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <p className="text-xs text-blue-400 mt-1">Enter your product or service name.</p>
    </div>
  </div>
</div>
          
          {/* Tool-specific content */}
          {isAbandonedCartTool && (
            <div className="p-2 bg-gray-50 rounded-lg mb-3">
              <h4 className="text-xs font-medium text-gray-700 mb-1.5">Cart Abandonment Timeframe</h4>
              <CartTimeframeInput />
            </div>
          )}
          
          {isAffiliateEmailSwipes && (
            <div className="p-2 bg-gray-50 rounded-lg mb-3">
              <h4 className="text-xs font-medium text-gray-700 mb-1.5">Email Type</h4>
              <EmailTypeInput />
            </div>
          )}
          
          {isAffiliateProduct && (
            <div className="p-2 bg-gray-50 rounded-lg mb-3">
              <h4 className="text-xs font-medium text-gray-700 mb-1.5">Product Summary</h4>
              <div className="max-h-28 overflow-y-auto">
                <ProductSummaryItem 
                  title="Acme Pro Wireless Headphones" 
                  onRemove={() => handleRemoveProduct('Acme Pro Wireless Headphones')} 
                />
                <ProductSummaryItem 
                  title="Super Boost Energy Drink" 
                  onRemove={() => handleRemoveProduct('Super Boost Energy Drink')} 
                />
                <ProductSummaryItem 
                  title="Elite Fitness Tracker" 
                  onRemove={() => handleRemoveProduct('Elite Fitness Tracker')} 
                />
              </div>
            </div>
          )}
          
          {isAffiliatePromo && (
            <div className="p-2 bg-gray-50 rounded-lg mb-3">
              <h4 className="text-xs font-medium text-gray-700 mb-1.5">Promotional Ideas</h4>
              <div className="max-h-28 overflow-y-auto">
                <PromoIdeasItem 
                  title="Summer Sale: 30% Off Everything" 
                  onUse={() => handleUsePromo('Summer Sale: 30% Off Everything')} 
                />
                <PromoIdeasItem 
                  title="Buy One Get One Free - Limited Time" 
                  onUse={() => handleUsePromo('Buy One Get One Free - Limited Time')} 
                />
                <PromoIdeasItem 
                  title="Free Shipping on Orders Over $50" 
                  onUse={() => handleUsePromo('Free Shipping on Orders Over $50')} 
                />
              </div>
            </div>
          )}
          
          {/* Generated content area */}
          <div className="mb-3">
  <label className="block text-sm font-medium text-blue-700 mb-1" htmlFor="generated-content">
    Generated Content
  </label>
  <textarea
    id="generated-content"
    className="w-full p-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm min-h-[60px] max-h-[120px] resize-vertical bg-blue-50"
    placeholder="Your generated content will appear here..."
    readOnly
  ></textarea>
  <p className="text-xs text-blue-400 mt-1">Results will show here after you create content.</p>
</div>
          
          {/* Action buttons */}
          <div className="flex space-x-3">
            <button 
              className={`flex-1 px-4 py-1.5 text-sm text-white bg-gradient-to-r from-${colorBase}-600 to-${colorBase}-500 rounded-lg hover:from-${colorBase}-700 hover:to-${colorBase}-600 transition-all shadow-sm`}
              onClick={handleCreate}
            >
              Create
            </button>
            <button 
              className="flex-1 px-4 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              onClick={onBack}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
