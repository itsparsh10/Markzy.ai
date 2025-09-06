'use client';

import React, { useState } from 'react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

export default function AiTrainingForm() {
  const [inputs, setInputs] = useState({
    brandName: 'Code n Creative',
    tone: 'Professional',
    example: 'We believe in creating technology that empowers businesses to achieve their goals. Our solutions combine cutting-edge innovation with practical applications designed for real-world results.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate AI training response
      const trainingResponse = {
        brand_name: inputs.brandName,
        tone_analysis: inputs.tone,
        training_status: 'completed',
        recommendations: [
          'Use professional language consistently',
          'Focus on business outcomes and results',
          'Maintain a confident but approachable tone'
        ]
      };

      console.log('AI training completed:', trainingResponse);
      
      // Save to tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'AI Training Form',
          toolId: 'ai-training-form',
          outputResult: trainingResponse,
          prompt: JSON.stringify(inputs)
        });
        console.log('✅ AI training form saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      
      alert('AI training completed successfully!');
    } catch (error) {
      console.error('Error in AI training:', error);
      alert('Failed to complete AI training. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm mb-3">
      <h2 className="text-md font-bold text-gray-800 mb-2">Let&apos;s train your marketing assistant!</h2>
      <p className="text-xs text-gray-500 mb-3">We&apos;ll use AI to learn your brand tone, so your campaigns sound just like you wrote them yourself.</p>
      
      {/* Form Fields */}
      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* Brand Name */}
        <div>
          <label htmlFor="brand-name" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <i className="fas fa-building text-[#46adb6] text-xs"></i>
            What&apos;s your brand name?
          </label>
          <input 
            type="text" 
            id="brand-name" 
            name="brandName"
            value={inputs.brandName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md bg-white shadow-sm placeholder:text-gray-400 text-sm hover:border-[#46adb6] focus:border-[#46adb6] focus:ring-1 focus:ring-[#46adb6] transition-colors" 
            placeholder="e.g. Markzy" 
          />
        </div>
        
        {/* Tone Selector */}
        <div>
          <label htmlFor="tone" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <i className="fas fa-comment-dots text-[#46adb6] text-xs"></i>
            How would you describe your brand&apos;s tone?
          </label>
          <select 
            id="tone" 
            name="tone"
            value={inputs.tone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md bg-white shadow-sm text-sm hover:border-[#46adb6] focus:border-[#46adb6] focus:ring-1 focus:ring-[#46adb6] transition-colors"
          >
            <option>Professional</option>
            <option>Friendly</option>
            <option>Casual</option>
            <option>Authoritative</option>
            <option>Playful</option>
          </select>
        </div>
        
        {/* Example Text - Using h-20 instead of h-32 to make it more compact */}
        <div>
          <label htmlFor="example" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
            <i className="fas fa-pen-fancy text-[#46adb6] text-xs"></i>
            Paste in an example of your writing to train our AI:
          </label>
          <textarea 
            id="example" 
            name="example"
            value={inputs.example}
            onChange={handleInputChange}
            className="w-full h-20 p-2 border rounded-md bg-white shadow-sm placeholder:text-gray-400 text-sm hover:border-[#46adb6] focus:border-[#46adb6] focus:ring-1 focus:ring-[#46adb6] transition-colors" 
            placeholder="Paste some marketing text that you've written before, like a social post, email, or ad. The more, the better!"
          ></textarea>
        </div>
      
        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-[#46adb6] hover:bg-[#1d1f89] text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span>Train My Tone</span>
            <i className="fas fa-wand-magic-sparkles"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
