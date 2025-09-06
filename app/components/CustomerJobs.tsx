'use client';

import React, { useState } from 'react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface CustomerJobsProps {
  onBackClick: () => void;
}

export default function CustomerJobs({ onBackClick }: CustomerJobsProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history' | 'result'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [inputs, setInputs] = useState({
    industry: '',
    productServiceType: '',
    productServiceDescription: '',
    targetCustomer: '',
    customerGoals: '',
    customerChallenges: '',
    jobsContext: '',
    functionalJobs: '',
    emotionalJobs: '',
    socialJobs: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateJobs = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Validate required fields
      const requiredFields = [
        'industry', 'productServiceType', 'productServiceDescription', 'targetCustomer',
        'customerGoals', 'customerChallenges', 'jobsContext', 'functionalJobs', 'emotionalJobs', 'socialJobs'
      ];
      
      const missingFields = requiredFields.filter(field => !inputs[field as keyof typeof inputs]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const requestData = {
        industry: inputs.industry,
        product_service_type: inputs.productServiceType,
        product_service_description: inputs.productServiceDescription,
        target_customer: inputs.targetCustomer,
        customer_goals: inputs.customerGoals,
        customer_challenges: inputs.customerChallenges,
        jobs_context: inputs.jobsContext,
        functional_jobs: inputs.functionalJobs,
        emotional_jobs: inputs.emotionalJobs,
        social_jobs: inputs.socialJobs
      };

      const response = await aiToolsService.generateCustomerJobs(requestData);
      setResults(response);
      setActiveTab('result'); // Auto-redirect to results tab
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Customer Jobs',
          toolId: 'customer-jobs',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Customer jobs saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (err: any) {
      console.error('Error generating customer jobs:', err);
      setError(err.message || 'Failed to generate customer jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportResults = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customer-jobs.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const jobTemplates = [
    { name: "Functional Jobs", icon: "fas fa-tools", description: "Jobs related to specific tasks customers need to accomplish." },
    { name: "Emotional Jobs", icon: "fas fa-heart", description: "Jobs related to how customers want to feel or be perceived." },
    { name: "Social Jobs", icon: "fas fa-users", description: "Jobs related to how customers want to be seen by others." },
    { name: "Customer Context", icon: "fas fa-sitemap", description: "Understanding the context in which customers hire your product." },
    { name: "Job Prioritization", icon: "fas fa-sort-amount-up", description: "Prioritize jobs based on importance and satisfaction." },
    { name: "Job Mapping", icon: "fas fa-map", description: "Map customer jobs to your product features and benefits." }
  ];

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-briefcase text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Customer Jobs</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Understand what your customers are trying to accomplish</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 4 min
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
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Business & Product Information</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="industry">Industry</label>
                          <select
                            id="industry"
                            name="industry"
                            value={inputs.industry}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select your industry</option>
                            <option value="health">Health & Wellness</option>
                            <option value="finance">Finance & Banking</option>
                            <option value="ecommerce">E-commerce & Retail</option>
                            <option value="education">Education & Training</option>
                            <option value="technology">Technology & Software</option>
                            <option value="creative">Creative & Design</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="productServiceType">Product/Service Type</label>
                          <select
                            id="productServiceType"
                            name="productServiceType"
                            value={inputs.productServiceType}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                          >
                            <option value="">Select product/service type</option>
                            <option value="physical">Physical Product</option>
                            <option value="digital">Digital Product</option>
                            <option value="subscription">Subscription Service</option>
                            <option value="consulting">Consulting/Coaching</option>
                            <option value="saas">Software as a Service</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="productServiceDescription">Product/Service Description</label>
                        <textarea 
                          id="productServiceDescription"
                          name="productServiceDescription"
                          value={inputs.productServiceDescription}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Briefly describe what your product or service does and its main features..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Customer Context</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="targetCustomer">Target Customer</label>
                        <textarea 
                          id="targetCustomer"
                          name="targetCustomer"
                          value={inputs.targetCustomer}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="Describe your target customer (demographics, role, situation)..."
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="customerGoals">Customer Goals</label>
                        <textarea 
                          id="customerGoals"
                          name="customerGoals"
                          value={inputs.customerGoals}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What are your customers trying to achieve? What are their main objectives?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="customerChallenges">Customer Challenges</label>
                        <textarea 
                          id="customerChallenges"
                          name="customerChallenges"
                          value={inputs.customerChallenges}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What challenges or obstacles do they face in achieving their goals?"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-base font-medium text-blue-900 mb-3">Jobs to be Done Analysis</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="jobsContext">Jobs Context</label>
                        <textarea 
                          id="jobsContext"
                          name="jobsContext"
                          value={inputs.jobsContext}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="In what situation or context do customers hire your product/service?"
                        ></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="functionalJobs">Functional Jobs</label>
                        <textarea 
                          id="functionalJobs"
                          name="functionalJobs"
                          value={inputs.functionalJobs}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                          placeholder="What practical tasks do customers need to accomplish?"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="emotionalJobs">Emotional Jobs</label>
                          <textarea 
                            id="emotionalJobs"
                            name="emotionalJobs"
                            value={inputs.emotionalJobs}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="How do customers want to feel when using your product?"
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="socialJobs">Social Jobs</label>
                          <textarea 
                            id="socialJobs"
                            name="socialJobs"
                            value={inputs.socialJobs}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-16" 
                            placeholder="How do customers want to be perceived by others?"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {jobTemplates.map((template, index) => (
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
                  <History toolName="Customer Jobs" />
                </div>
              )}
            </div>
            
            {/* Results Display */}
            {error && (
              <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <i className="fas fa-exclamation-circle text-sm"></i>
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}

            {results && (
              <div className="mx-4 mb-4">
                <div className="bg-white rounded-xl border border-blue-200 shadow-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <i className="fas fa-briefcase text-white text-lg"></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Customer Jobs Analysis</h3>
                          <p className="text-blue-100 text-sm">Jobs to be done framework analysis</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={exportResults}
                          className="px-3 py-1.5 text-xs text-white bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-1 backdrop-blur-sm"
                        >
                          <i className="fas fa-download text-xs"></i>
                          Export
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {results.summary && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <i className="fas fa-chart-line text-blue-600 text-sm"></i>
                          <h4 className="text-sm font-semibold text-blue-900">Analysis Summary</h4>
                        </div>
                        <p className="text-sm text-blue-800 leading-relaxed">{results.summary}</p>
                      </div>
                    )}

                    {results.jobs && Array.isArray(results.jobs) && results.jobs.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <i className="fas fa-tasks text-blue-600 text-sm"></i>
                          <h4 className="text-base font-semibold text-gray-900">Customer Jobs</h4>
                        </div>
                        
                        {results.jobs.map((job: any, index: number) => (
                          job && (
                            <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="p-5">
                                {/* Job Header */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                                        job.job_type === 'functional' 
                                          ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                          : job.job_type === 'emotional'
                                          ? 'bg-pink-100 text-pink-700 border-pink-200'
                                          : 'bg-green-100 text-green-700 border-green-200'
                                      }`}>
                                        {job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(job.description)}
                                    className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1 border border-blue-200"
                                  >
                                    <i className="fas fa-copy text-xs"></i>
                                    Copy
                                  </button>
                                </div>
                                
                                {/* Job Content */}
                                <div className="space-y-4">
                                  <div className="bg-white rounded-lg border border-gray-100 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <i className="fas fa-file-alt text-gray-500 text-sm"></i>
                                      <h5 className="text-sm font-semibold text-gray-900">Job Description</h5>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
                                  </div>
                                  
                                  {job.context && (
                                    <div className="bg-white rounded-lg border border-gray-100 p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-clock text-gray-500 text-sm"></i>
                                        <h5 className="text-sm font-semibold text-gray-900">Context</h5>
                                      </div>
                                      <p className="text-sm text-gray-700 leading-relaxed">{job.context}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
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
                <button className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow">
                  Save Draft
                </button>
                <button 
                  onClick={handleGenerateJobs}
                  disabled={isLoading}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xs"></i>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Jobs</span>
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
