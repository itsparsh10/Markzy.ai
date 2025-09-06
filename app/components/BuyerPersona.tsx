'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface BuyerPersonaProps {
  onBackClick: () => void;
}

export default function BuyerPersona({ onBackClick }: BuyerPersonaProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'result' | 'templates' | 'history'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPersona, setGeneratedPersona] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [toolHistory, setToolHistory] = useState<any[]>([]);
  const [inputs, setInputs] = useState({
    personaName: '',
    productService: '',
    demographics: '',
    psychographics: '',
    painPoints: '',
    goals: '',
    buyingBehavior: '',
    preferredChannels: '',
    objections: '',
    influences: ''
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setInputs({
      personaName: '',
      productService: '',
      demographics: '',
      psychographics: '',
      painPoints: '',
      goals: '',
      buyingBehavior: '',
      preferredChannels: '',
      objections: '',
      influences: ''
    });
    setGeneratedPersona(null);
    setError('');
    setShowSuccess(false);
  };

  const handleGeneratePersona = async () => {
    // Validate required fields
    const requiredFields = [
      'personaName',
      'productService',
      'demographics',
      'psychographics',
      'painPoints',
      'goals',
      'buyingBehavior',
      'preferredChannels',
      'objections',
      'influences'
    ];
    
    const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedPersona(null);

    try {
      // Map form inputs to API expected format
      const apiData = {
        persona_name: inputs.personaName,
        product_service: inputs.productService,
        demographics: inputs.demographics,
        psychographics: inputs.psychographics,
        goals_motivations: inputs.goals,
        pain_points: inputs.painPoints,
        buying_behavior: inputs.buyingBehavior,
        preferred_channels: inputs.preferredChannels,
        common_objections: inputs.objections,
        influences: inputs.influences
      };

      console.log('Sending buyer persona request with data:', apiData);
      const response = await aiToolsService.generateBuyerPersona(apiData);
      
      if (response) {
        setGeneratedPersona(response);
        
        // Save to tool history silently
        try {
          await saveToolHistorySilent({
            toolName: 'Buyer Persona',
            toolId: 'buyer-persona',
            outputResult: response,
            prompt: JSON.stringify(apiData)
          });
          console.log('✅ Buyer persona saved to history');
        } catch (historyError) {
          console.warn('⚠️ Failed to save to history:', historyError);
        }
        
        setShowSuccess(true);
        setActiveTab('result');
        console.log('Generated buyer persona:', response);
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err: any) {
      console.error('Error generating buyer persona:', err);
      setError(err.message || 'Failed to generate buyer persona. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };



  const personaTemplates = [
    { name: "B2B Decision Maker", icon: "fas fa-user-tie", description: "Create personas for business decision makers and executives." },
    { name: "E-commerce Shopper", icon: "fas fa-shopping-cart", description: "Build profiles for online retail customers and shoppers." },
    { name: "Service Seeker", icon: "fas fa-handshake", description: "Develop personas for service-based business clients." },
    { name: "Tech Early Adopter", icon: "fas fa-laptop-code", description: "Profile technology enthusiasts and early adopters." },
    { name: "Budget-Conscious Buyer", icon: "fas fa-piggy-bank", description: "Create personas for price-sensitive customers." },
    { name: "Premium Customer", icon: "fas fa-crown", description: "Build profiles for high-value, premium segment customers." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-user text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Buyer Persona</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create detailed buyer personas to understand your target customers</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 5 min
              </span>
              <button 
                className="rounded-full transition-all duration-200 border-2 border-white bg-gradient-to-br from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-200 z-20"
                style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Close"
                onClick={onBackClick}
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
          </div>
          
          {/* Content area with tabs */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/50 to-white">
            {/* Tabs navigation */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-blue-100 bg-white sticky top-0 z-20 shadow-sm">
              <div className="flex space-x-1 relative">
                <button 
                  onClick={() => setActiveTab('generate')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'generate' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-magic text-xs"></i>
                    Generate
                  </span>
                  {activeTab === 'generate' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
                {generatedPersona && !error && (
                  <button 
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'result' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    <span className="flex items-center gap-2">
                      <i className="fas fa-plus-circle text-xs"></i>
                      Generated Persona
                    </span>
                    {activeTab === 'result' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('templates')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'templates' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-layer-group text-xs"></i>
                    Templates
                  </span>
                  {activeTab === 'templates' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'history' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-history text-xs"></i>
                    History
                  </span>
                  {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
                </button>
              </div>
              <button className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100">
                <i className="fas fa-save text-xs"></i> Save as Template
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-4 pt-3">
              {activeTab === 'generate' && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {/* Success Banner */}
                  {generatedPersona && !error && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fas fa-check text-green-600 text-sm"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-green-800">Generated Successfully!</h4>
                            <p className="text-xs text-green-600 mt-0.5">Your buyer persona is ready to view.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('result')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          View Persona
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle text-red-500"></i>
                        <span className="text-sm text-red-700 font-medium">Error</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">{error}</p>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Persona Basics</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="personaName">Persona Name</label>
                          <input
                            id="personaName"
                            name="personaName"
                            type="text"
                            value={inputs.personaName}
                            onChange={handleInputChange}
                            placeholder="e.g., Sarah the Small Business Owner"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productService">Product/Service</label>
                          <input
                            id="productService"
                            name="productService"
                            type="text"
                            value={inputs.productService}
                            onChange={handleInputChange}
                            placeholder="What are you selling to this persona?"
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="demographics">Demographics</label>
                        <textarea 
                          id="demographics"
                          name="demographics"
                          value={inputs.demographics}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Age, gender, location, income, education, job title..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="psychographics">Psychographics</label>
                        <textarea 
                          id="psychographics"
                          name="psychographics"
                          value={inputs.psychographics}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Values, attitudes, lifestyle, interests, personality traits..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Goals & Pain Points</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="goals">Goals & Motivations</label>
                        <textarea 
                          id="goals"
                          name="goals"
                          value={inputs.goals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What are their main goals? What motivates them?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="painPoints">Pain Points & Challenges</label>
                        <textarea 
                          id="painPoints"
                          name="painPoints"
                          value={inputs.painPoints}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What problems do they face? What frustrates them?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Buying Behavior & Channels</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="buyingBehavior">Buying Behavior</label>
                        <textarea 
                          id="buyingBehavior"
                          name="buyingBehavior"
                          value={inputs.buyingBehavior}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="How do they make purchasing decisions? What's their process?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="preferredChannels">Preferred Channels</label>
                        <textarea 
                          id="preferredChannels"
                          name="preferredChannels"
                          value={inputs.preferredChannels}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Where do they spend time online? What platforms do they use?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Objections & Influences</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="objections">Common Objections</label>
                        <textarea 
                          id="objections"
                          name="objections"
                          value={inputs.objections}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What objections do they have? What holds them back?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="influences">Influences & Decision Makers</label>
                        <textarea 
                          id="influences"
                          name="influences"
                          value={inputs.influences}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="Who influences their decisions? Who else is involved?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'result' && generatedPersona && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-600"></i>
                        Generated Buyer Persona
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedPersona, null, 2))}
                          className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-copy text-xs"></i>
                          Copy
                        </button>
                        <button 
                          onClick={() => setGeneratedPersona(null)}
                          className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                        >
                          <i className="fas fa-times text-xs"></i>
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Persona Name</h4>
                            <p className="text-sm text-gray-600">{generatedPersona.persona_name || 'N/A'}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Demographics</h4>
                            <p className="text-sm text-gray-600">{generatedPersona.demographics || 'N/A'}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Pain Points</h4>
                            <p className="text-sm text-gray-600">{generatedPersona.pain_points || 'N/A'}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Goals & Motivations</h4>
                            <p className="text-sm text-gray-600">{generatedPersona.goals_motivations || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Buying Behavior</h4>
                            <p className="text-sm text-gray-600">{generatedPersona.buying_behavior || 'N/A'}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Preferred Channels</h4>
                            <p className="text-sm text-gray-600">{generatedPersona.preferred_channels || 'N/A'}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Common Objections</h4>
                            <p className="text-sm text-gray-600">{generatedPersona.common_objections || 'N/A'}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">Influences</h4>
                            <p className="text-sm text-gray-600">{generatedPersona.influences || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      {generatedPersona.persona_summary && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium text-gray-800 mb-2">Persona Summary</h4>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {generatedPersona.persona_summary}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {personaTemplates.map((template, index) => (
                    <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
                            <i className={`${template.icon} text-blue-600`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900">{template.name}</h4>
                            <p className="text-xs text-blue-600">{template.description}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('generate')}
                          className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Buyer Persona" />
                </div>
              )}
            </div>
            
            {/* Generated Persona Display */}
            {generatedPersona && (
              <div className="mt-4 px-4">
                <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <i className="fas fa-check-circle text-green-600"></i>
                      Generated Buyer Persona
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigator.clipboard.writeText(generatedPersona.persona || generatedPersona.content || JSON.stringify(generatedPersona))}
                        className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-copy text-xs"></i>
                        Copy
                      </button>
                      <button 
                        onClick={() => setGeneratedPersona(null)}
                        className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"
                      >
                        <i className="fas fa-times text-xs"></i>
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {(() => {
                      let dataToDisplay = generatedPersona;
                      
                      // If it's a string, try to parse as JSON
                      if (typeof generatedPersona === 'string') {
                        try {
                          dataToDisplay = JSON.parse(generatedPersona);
                        } catch (e) {
                          // If parsing fails, display as plain text
                          return (
                            <div className="prose prose-sm max-w-none">
                              <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                                {generatedPersona}
                              </div>
                            </div>
                          );
                        }
                      }
                      
                      // Handle persona or content fields
                      if (dataToDisplay.persona) {
                        return (
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                              {dataToDisplay.persona}
                            </div>
                          </div>
                        );
                      }
                      
                      if (dataToDisplay.content) {
                        return (
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                              {dataToDisplay.content}
                            </div>
                          </div>
                        );
                      }
                      
                      // Display as formatted sections
                      return (
                        <div className="space-y-6">
                          {Object.entries(dataToDisplay).map(([key, value]) => {
                            const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            
                            return (
                              <div key={key} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <h4 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                                  <i className="fas fa-user-circle text-blue-600"></i>
                                  {displayKey}
                                </h4>
                                <div className="text-sm text-gray-700 leading-relaxed">
                                  {typeof value === 'object' && value !== null ? (
                                    <div className="space-y-2">
                                      {Object.entries(value).map(([subKey, subValue]) => (
                                        <div key={subKey} className="flex">
                                          <span className="font-medium text-gray-800 min-w-[120px]">
                                            {subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                          </span>
                                          <span className="text-gray-700 ml-2">{subValue as string}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="whitespace-pre-wrap">{value as string}</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="mt-auto flex justify-between items-center px-4 py-3 border-t border-blue-100">
              <button 
                className="group flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-all px-3 py-1.5 rounded-lg hover:bg-blue-50/50" 
                onClick={onBackClick}
              >
                <i className="fas fa-arrow-left text-xs group-hover:-translate-x-0.5 transition-transform"></i>
                <span>Back to All Tools</span>
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleClearForm}
                  className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow"
                >
                  Clear Form
                </button>
                <button 
                  onClick={handleGeneratePersona}
                  disabled={isGenerating}
                  className={`px-5 py-2 text-sm text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${
                    isGenerating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Persona</span>
                      <i className="fas fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
