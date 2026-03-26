"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('User');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'brands', 'products'
  const [unreadCount, setUnreadCount] = useState(2); // Default count
  
  // Get user data from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.name) {
        setUsername(userData.name);
      }
    }
  }, []);


  
  return (
    <div className="h-full w-full flex overflow-hidden bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <i className="fas fa-tachometer-alt text-white"></i>
            </div>
            <span className="font-semibold text-gray-800 text-lg">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-blue-600 font-medium">Welcome back, {username}</span>
              <div className="h-4 w-px bg-gray-300 mx-2"></div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Pro Plan</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/notifications')}
                className="relative bg-white hover:bg-blue-50 p-2.5 rounded-full transition-colors text-blue-500 shadow-sm border border-blue-100 hover:border-blue-200"
              >
                <i className="fas fa-bell"></i>
              </button>
              
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
                  <i className="fas fa-plus text-xs"></i>
                  <span className="font-medium">New Project</span>
                </button>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`px-4 py-2 font-medium text-sm mr-4 ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('brands')} 
              className={`px-4 py-2 font-medium text-sm mr-4 ${activeTab === 'brands' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Brands
            </button>
            <button 
              onClick={() => setActiveTab('products')} 
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Products
            </button>
          </div>
          
          {/* Tab Content Based on Active Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Brands</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">1</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <i className="fas fa-building text-blue-600"></i>
                    </div>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-green-500 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i> 100%
                    </span>
                    <span className="text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Active Products</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">1</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <i className="fas fa-box text-blue-600"></i>
                    </div>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-gray-500">No change from last month</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Content Pieces</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">0</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <i className="fas fa-file-alt text-blue-600"></i>
                    </div>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-blue-600 flex items-center font-medium cursor-pointer">
                      <i className="fas fa-plus-circle mr-1"></i> Create content
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                  <button className="text-blue-600 text-sm hover:text-blue-700">
                    View all
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="bg-blue-100 rounded-full p-2 mt-1">
                      <i className="fas fa-plus text-blue-600 text-xs"></i>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">AI Services product created</p>
                      <p className="text-sm text-gray-500">You created a new product under Code n Creative brand</p>
                      <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="bg-green-100 rounded-full p-2 mt-1">
                      <i className="fas fa-check text-green-600 text-xs"></i>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">Brand setup completed</p>
                      <p className="text-sm text-gray-500">You completed the initial setup for Code n Creative</p>
                      <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2 mt-1">
                      <i className="fas fa-user text-blue-600 text-xs"></i>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">Account created</p>
                      <p className="text-sm text-gray-500">Welcome to Markzy!</p>
                      <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions & Brands */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => toast.success('Brand creation initiated!')}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <i className="fas fa-plus text-blue-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Create Brand</p>
                        <p className="text-xs text-gray-500">Add a new brand to your account</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => toast.info('Product creation started!')}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <i className="fas fa-box text-blue-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Add Product</p>
                        <p className="text-xs text-gray-500">Create a new product offering</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => toast.warning('Content generation in progress...')}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <i className="fas fa-magic text-blue-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Generate Content</p>
                        <p className="text-xs text-gray-500">Create AI-assisted content</p>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Brand Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">Brand Overview</h3>
                    <button className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm flex items-center gap-1">
                      <i className="fas fa-plus text-xs"></i>
                      <span>Add Brand</span>
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            CC
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">Code n Creative</h4>
                            <p className="text-xs text-gray-500">Tech Services • Created 3 days ago</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-500">Products:</span>
                        <span className="font-medium text-gray-800">1</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-500">Content Pieces:</span>
                        <span className="font-medium text-gray-800">0</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Last Updated:</span>
                        <span className="font-medium text-gray-800">2 days ago</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 p-3 bg-gray-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <div className="text-gray-300">|</div>
                        <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <i className="fas fa-eye"></i> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Brands Tab Content */}
          {activeTab === 'brands' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Your Brands</h2>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-2">
                  <i className="fas fa-plus text-xs"></i>
                  <span>Add New Brand</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Brand Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        CC
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">Code n Creative</h3>
                        <p className="text-sm text-gray-500">Tech Services</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Products:</span>
                        <span className="font-medium text-gray-800">1</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Content Pieces:</span>
                        <span className="font-medium text-gray-800">0</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium text-gray-800">3 days ago</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Primary</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Manage Products
                    </button>
                    <button className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm">
                      Edit Brand
                    </button>
                  </div>
                </div>
                
                {/* Add Brand Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-plus text-blue-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">Add New Brand</h3>
                  <p className="text-sm text-gray-500 mb-6">Create a new brand to organize your products and content</p>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
                    Create Brand
                  </button>
                </div>
              </div>
            </>
          )}
          
          {/* Products Tab Content */}
          {activeTab === 'products' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Your Products</h2>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-2">
                  <i className="fas fa-plus text-xs"></i>
                  <span>Add New Product</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Product Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Code n Creative</span>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">AI Services</h3>
                    <p className="text-sm text-gray-500 mb-4">Custom AI solutions for businesses</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium text-gray-800">$1,999+</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Content Pieces:</span>
                        <span className="font-medium text-gray-800">0</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium text-gray-800">2 days ago</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Create Content
                    </button>
                    <button className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm">
                      Edit Product
                    </button>
                  </div>
                </div>
                
                {/* Add Product Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-box text-blue-600 text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">Add New Product</h3>
                  <p className="text-sm text-gray-500 mb-6">Create a new product or service offering</p>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
                    Create Product
                  </button>
                </div>
              </div>
            </>
          )}
          

        </div>
        </main>

        {/* Footer positioned after main content */}
        <Footer />
      </div>
    </div>
  );
}
