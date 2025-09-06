"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

interface Rating {
  id: string;
  overallRating: number;
  easeOfUse: number;
  features: number;
  support: number;
  valueForMoney: number;
  feedback: string;
  recommendation: boolean;
  createdAt: Date;
  userEmail: string;
  userName: string;
}

export default function RateUs() {
  const [ratingForm, setRatingForm] = useState({
    overallRating: 0,
    easeOfUse: 0,
    features: 0,
    support: 0,
    valueForMoney: 0,
    feedback: '',
    recommendation: true,
    userEmail: '',
    userName: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [ratedUsers, setRatedUsers] = useState<string[]>([]);

  // Simple check if user has already rated
  useEffect(() => {
    const checkUserRating = () => {
      try {
        const userData = localStorage.getItem('userData');
        const user = userData ? JSON.parse(userData) : null;

        // Get rated users from localStorage
        const storedRatedUsers = localStorage.getItem('ratedUsers');
        const ratedUsersList = storedRatedUsers ? JSON.parse(storedRatedUsers) : [];
        
        // Check if current user has rated (only if user is logged in)
        if (user && user.email) {
          const userHasRated = ratedUsersList.includes(user.email);
          
          if (userHasRated) {
            setHasRated(true);
            // Get user's rating data
            const userRatingData = localStorage.getItem(`rating_${user.email}`);
            if (userRatingData) {
              setExistingRating(JSON.parse(userRatingData));
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking user rating:', error);
        setLoading(false);
      }
    };

    checkUserRating();
  }, []);

  // Pre-fill user data when component loads
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    
    if (user) {
      setRatingForm(prev => ({
        ...prev,
        userEmail: user.email || '',
        userName: user.name || ''
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userData = localStorage.getItem('userData');
      const user = userData ? JSON.parse(userData) : null;

      // Check if user has already rated
      const storedRatedUsers = localStorage.getItem('ratedUsers');
      const ratedUsersList = storedRatedUsers ? JSON.parse(storedRatedUsers) : [];
      
      if (ratedUsersList.includes(user.email)) {
        alert('You have already submitted a rating. Thank you for your feedback!');
        setHasRated(true);
        return;
      }

      // Submit rating to backend
      const token = localStorage.getItem('authToken');
      const ratingData = {
        ...ratingForm,
        userEmail: user.email,
        userName: user.name,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/help-center/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ratingData)
      });

      if (response.ok) {
        // Add user to rated users list
        const newRatedUsers = [...ratedUsersList, user.email];
        localStorage.setItem('ratedUsers', JSON.stringify(newRatedUsers));
        
        // Store rating data locally
        localStorage.setItem(`rating_${user.email}`, JSON.stringify(ratingData));
        
        setSubmitted(true);
        setHasRated(true);
        setExistingRating(ratingData);
        
        // Reset form
        setRatingForm({
          overallRating: 0,
          easeOfUse: 0,
          features: 0,
          support: 0,
          valueForMoney: 0,
          feedback: '',
          recommendation: true,
          userEmail: '',
          userName: ''
        });
      } else {
        alert('Failed to submit rating. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const renderStars = (rating: number, onChange: (rating: number) => void, label: string) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        {rating === 0 && 'Click to rate'}
        {rating === 1 && 'Poor'}
        {rating === 2 && 'Fair'}
        {rating === 3 && 'Good'}
        {rating === 4 && 'Very Good'}
        {rating === 5 && 'Excellent'}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-full bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasRated) {
    return (
      <div className="flex h-full bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">Rate Us</h1>
              <p className="text-green-100">Your feedback helps us improve</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-green-600 text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You for Rating Us!</h2>
              <p className="text-gray-600 mb-6">We appreciate your valuable feedback.</p>
              
              {existingRating && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Your Rating</h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-2xl ${star <= existingRating.overallRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Overall Rating: {existingRating.overallRating}/5
                    {existingRating.feedback && (
                      <span className="block mt-2">"{existingRating.feedback}"</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex h-full bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">Rate Us</h1>
              <p className="text-green-100">Your feedback helps us improve</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-green-600 text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-4">Your rating has been submitted successfully. We appreciate your feedback!</p>
              <div className="text-sm text-gray-500">
                <p>You have submitted your rating. Thank you for your valuable feedback!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-slate-50/30">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200/50 px-8 py-6">
          <div className="w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                <i className="fas fa-star text-slate-600 text-xl"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Rate Markzy</h1>
                <p className="text-slate-600">Your feedback helps us improve and serve you better</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full p-8">
          {/* Info Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-star text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Share Your Markzy Experience</h2>
                <p className="text-slate-600">Your honest feedback helps us make Markzy the best AI marketing platform</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/80 rounded-2xl border border-blue-200/50 shadow-sm">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-chart-line text-white text-lg"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">We Improve</h3>
                <p className="text-sm text-slate-600">Your feedback drives Markzy's development and new features</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/80 rounded-2xl border border-emerald-200/50 shadow-sm">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-white text-lg"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">We Listen</h3>
                <p className="text-sm text-slate-600">Every rating is carefully reviewed by our team</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/80 rounded-2xl border border-purple-200/50 shadow-sm">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-white text-lg"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">We Care</h3>
                <p className="text-sm text-slate-600">Your satisfaction with Markzy is our top priority</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100/80 rounded-2xl border border-amber-200/50 shadow-sm">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightbulb text-white text-lg"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">We Innovate</h3>
                <p className="text-sm text-slate-600">Your suggestions help shape Markzy's future</p>
              </div>
            </div>
          </div>

          {/* Rating Form */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-8 mb-8 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-edit text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Rate Your Markzy Experience</h2>
                <p className="text-slate-600">Help us understand how we're doing and where we can improve</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Overall Rating */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl p-6 border border-slate-200/50">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-star text-amber-500"></i>
                  Overall Experience with Markzy
                </h3>
                {renderStars(
                  ratingForm.overallRating,
                  (rating) => setRatingForm({...ratingForm, overallRating: rating}),
                  'How would you rate your overall experience with Markzy? *'
                )}
              </div>

              {/* Specific Ratings */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl p-6 border border-slate-200/50">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <i className="fas fa-sliders-h text-blue-500"></i>
                  Rate Specific Aspects of Markzy
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
                    {renderStars(
                      ratingForm.easeOfUse,
                      (rating) => setRatingForm({...ratingForm, easeOfUse: rating}),
                      'Ease of Use'
                    )}
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50">
                    {renderStars(
                      ratingForm.features,
                      (rating) => setRatingForm({...ratingForm, features: rating}),
                      'Features & AI Tools'
                    )}
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50">
                    {renderStars(
                      ratingForm.support,
                      (rating) => setRatingForm({...ratingForm, support: rating}),
                      'Customer Support'
                    )}
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50">
                    {renderStars(
                      ratingForm.valueForMoney,
                      (rating) => setRatingForm({...ratingForm, valueForMoney: rating}),
                      'Value for Money'
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl p-6 border border-slate-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                    <i className="fas fa-comment text-white"></i>
                  </div>
                  <div>
                    <label className="text-lg font-bold text-slate-800">Tell Us More About Markzy</label>
                    <p className="text-sm text-slate-600">Share your thoughts, suggestions, or what you love about Markzy</p>
                  </div>
                </div>
                <textarea
                  rows={5}
                  value={ratingForm.feedback}
                  onChange={(e) => setRatingForm({...ratingForm, feedback: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none shadow-sm"
                  placeholder="What do you love about Markzy? What could we improve? Any features you'd like to see? Share your thoughts..."
                />
              </div>

              {/* Recommendation */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl p-6 border border-slate-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                    <i className="fas fa-heart text-white"></i>
                  </div>
                  <label className="text-lg font-bold text-slate-800">Would you recommend Markzy?</label>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 cursor-pointer hover:bg-emerald-50/50 transition-all duration-200 flex-1">
                    <input
                      type="radio"
                      name="recommendation"
                      checked={ratingForm.recommendation === true}
                      onChange={() => setRatingForm({...ratingForm, recommendation: true})}
                      className="mr-3 w-4 h-4 text-emerald-600"
                    />
                    <div className="flex items-center gap-2">
                      <i className="fas fa-thumbs-up text-emerald-600"></i>
                      <span className="font-medium text-slate-800">Yes, I'd recommend Markzy</span>
                    </div>
                  </label>
                  <label className="flex items-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-rose-200/50 cursor-pointer hover:bg-rose-50/50 transition-all duration-200 flex-1">
                    <input
                      type="radio"
                      name="recommendation"
                      checked={ratingForm.recommendation === false}
                      onChange={() => setRatingForm({...ratingForm, recommendation: false})}
                      className="mr-3 w-4 h-4 text-rose-600"
                    />
                    <div className="flex items-center gap-2">
                      <i className="fas fa-thumbs-down text-rose-600"></i>
                      <span className="font-medium text-slate-800">No, I wouldn't recommend it</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-2xl p-6 border border-slate-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <i className="fas fa-envelope text-white"></i>
                  </div>
                  <div>
                    <label className="text-lg font-bold text-slate-800">Your Email (Optional)</label>
                    <p className="text-sm text-slate-600">We'll only use this to follow up on your Markzy feedback if needed</p>
                  </div>
                </div>
                <input
                  type="email"
                  value={ratingForm.userEmail}
                  onChange={(e) => setRatingForm({...ratingForm, userEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
                <p className="text-sm text-gray-500 mt-1">We'll only use this to follow up on your feedback if needed.</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={ratingForm.overallRating === 0}
                  className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">- Sarah M.</span>
                </div>
                <p className="text-sm text-gray-700">"Markzy has completely transformed my content creation process. The AI tools are incredibly powerful and easy to use."</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">- Mike R.</span>
                </div>
                <p className="text-sm text-gray-700">"The customer support is outstanding. They helped me set up my first campaign and I've been growing ever since."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 