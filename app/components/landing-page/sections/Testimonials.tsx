'use client';
import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    content: 'Markzy transformed our marketing workflow. We now create campaigns 5x faster with better results.',
    avatar: '👩‍💼',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Founder',
    company: 'GrowthLab',
    content: 'The AI-powered tools are incredible. Our conversion rates increased by 40% in just 2 months.',
    avatar: '👨‍💻',
    rating: 5
  },
  {
    name: 'Emily Davis',
    role: 'Content Manager',
    company: 'BrandFlow',
    content: 'Best investment we made this year. The content quality is consistently excellent.',
    avatar: '👩‍🎨',
    rating: 5
  },
  {
    name: 'David Rodriguez',
    role: 'CEO',
    company: 'StartupHub',
    content: 'Markzy helped us scale our content marketing without hiring additional team members.',
    avatar: '👨‍💼',
    rating: 5
  },
  {
    name: 'Lisa Thompson',
    role: 'Social Media Manager',
    company: 'CreativeStudio',
    content: 'The social media tools are game-changers. Our engagement rates have never been higher.',
    avatar: '👩‍💻',
    rating: 5
  }
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="audiowide-regular text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Loved by 50,000+
            <span 
              className="audiowide-regular bg-clip-text text-transparent block"
              style={{
                background: 'linear-gradient(to right, #1d1f89, #46adb6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Marketing Professionals
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers say about their experience with Markzy
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 relative">
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <i className="fas fa-quote-left text-white text-xl"></i>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star text-yellow-400 text-xl mr-1"></i>
                ))}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 mb-8 leading-relaxed">
                &ldquo;{testimonials[currentTestimonial].content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star text-yellow-400 text-sm mr-1"></i>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <i className="fas fa-shield-check text-green-500"></i>
              <span className="text-sm">Trusted by 50k+ users</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-star text-yellow-400"></i>
              <span className="text-sm">4.9/5 average rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-thumbs-up text-blue-500"></i>
              <span className="text-sm">99% satisfaction rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
