
'use client';
import React, { useState } from 'react';
import Button from '../ui/Button';

export default function CallToAction() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/form-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          industry: '',
          message: ''
        });
        
        console.log('Form submitted successfully:', result);
      } else {
        // Error handling
        console.error('Form submission error:', result);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const industries = [
    'Select...',
    'Technology & Software',
    'E-commerce & Retail',
    'Healthcare & Wellness',
    'Finance & Banking',
    'Education & Training',
    'Real Estate',
    'Marketing & Advertising',
    'Consulting & Services',
    'Manufacturing',
    'Other'
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-sky-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 opacity-10" style={{background: 'linear-gradient(to right, #1d1f89, #46adb6)'}}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231d1f89' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Side - Content */}
            <div className="p-8 lg:p-12 text-white relative" style={{background: 'linear-gradient(135deg, #1d1f89 0%, #46adb6 100%)'}}>
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                    WE&apos;RE HERE TO HELP YOU
                  </span>
                </div>

                <h2 className="audiowide-regular text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                  Transform Your
                  <span className="block text-sky-100">Marketing Strategy</span>
                  <span className="block">Today</span>
                </h2>

                <p className="text-lg text-sky-100 mb-8 leading-relaxed">
                  Ready to revolutionize your marketing with AI? Get personalized recommendations 
                  and see how our platform can boost your conversions by 40%.
                </p>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <i className="fas fa-envelope text-white text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm text-sky-100 mb-1">Email</p>
                      <p className="font-semibold">hello@markzy.ai</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <i className="fas fa-phone text-white text-lg"></i>
                    </div>
                    <div>
                      <p className="text-sm text-sky-100 mb-1">Phone</p>
                      <p className="font-semibold">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      style={{'--tw-ring-color': '#46adb6'} as React.CSSProperties}
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      style={{'--tw-ring-color': '#46adb6'} as React.CSSProperties}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      style={{'--tw-ring-color': '#46adb6'} as React.CSSProperties}
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none"
                      style={{'--tw-ring-color': '#46adb6'} as React.CSSProperties}
                    >
                      {industries.map((industry, index) => (
                        <option key={index} value={industry === 'Select...' ? '' : industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
                    style={{'--tw-ring-color': '#46adb6'} as React.CSSProperties}
                    placeholder="Tell us about your marketing goals and challenges..."
                  />
                </div>

                <Button 
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <span className="flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        Get My Marketing Strategy
                        <i className="fas fa-arrow-right ml-2"></i>
                      </>
                    )}
                  </span>
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  We&apos;ll respond within 24 hours with a personalized marketing plan
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
