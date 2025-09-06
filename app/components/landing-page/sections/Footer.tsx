'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Team', href: '#team' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'API', href: '/api-docs' },
    { name: 'Integrations', href: '/integrations' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
  ],
  resources: [
    { name: 'Knowledge Base', href: '/knowledge-base' },
    { name: 'Help Center', href: '/help-center' },
    { name: 'Community', href: '/community' },
    { name: 'Templates', href: '/templates' },
    { name: 'Webinars', href: '/webinars' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
    { name: 'Security', href: '/security' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white overscroll-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
          <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src='/assets/images/logo.png' 
                  alt='Markzy' 
                  width={170} 
                  height={60} 
                  className='h-12 invert brightness-0 mb-3'
                />
          </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Transform your marketing with AI-powered tools that generate high-converting content and boost your business growth.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>

            {/* Link Columns */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold text-white mb-2">Stay updated with marketing tips</h4>
              <p className="text-gray-400 text-sm">Get the latest AI marketing insights delivered to your inbox.</p>
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <button 
                className="px-6 py-2 text-white rounded-lg transition-all duration-200 font-medium whitespace-nowrap hover:shadow-lg hover:scale-105"
                style={{
                  background: 'linear-gradient(45deg, rgb(29, 31, 137) 0%, rgb(70, 173, 182) 100%)'
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
