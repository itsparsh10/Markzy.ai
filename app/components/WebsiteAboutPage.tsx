
'use client'

import { Check, Copy } from 'lucide-react';

import { useState } from 'react';
import { ArrowLeft, Briefcase, Users, Footprints, Lightbulb, Target, Search, ShoppingBag, MessageSquare, ThumbsUp, FileText, History as HistoryIcon, Route, Clock, X, Save, Wand2 } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: 'text' | 'textarea' | 'select' | 'number';
  options?: string[];
  placeholder?: string;
  Icon?: React.ElementType;
  rows?: number;
}

interface AboutPageResult {
  about_page_title: string;
  about_page_intro: string;
  company_story: string;
  mission_section: string;
  call_to_action: string;
  notes: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, type = 'text', options, placeholder, Icon, rows = 3 }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {Icon && <Icon className="inline-block w-4 h-4 mr-2 text-blue-600" />} {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    ) : type === 'select' ? (
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options?.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    )}
  </div>
);

const SectionCard: React.FC<{ title: string; icon?: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 mb-6">
    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
      {Icon && <Icon className="w-6 h-6 mr-3 text-blue-600" />}
      {title}
    </h3>
    {children}
  </div>
);

export default function WebsiteAboutPage({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    companyName: '',
    foundingYear: '',
    companyMission: '',
    companyValues: '',
    brandStory: '',
    teamSize: '',
    keyAchievements: '',
    targetAudience: '',
    uniqueSellingPoints: '',
    companyGoals: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AboutPageResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateAboutPage = async () => {
    if (!inputs.companyName || !inputs.foundingYear || !inputs.companyMission) {
      alert('Please fill in all required fields: Company Name, Founding Year, and Company Mission');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const requestData = {
        company_name: inputs.companyName,
        founding_year: inputs.foundingYear,
        company_mission: inputs.companyMission,
        company_values: inputs.companyValues,
        brand_story: inputs.brandStory,
        team_size: inputs.teamSize,
        key_achievements: inputs.keyAchievements,
        target_audience: inputs.targetAudience,
        unique_selling_points: inputs.uniqueSellingPoints,
        company_goals: inputs.companyGoals,
      };

      const response = await aiToolsService.generateWebsiteAboutPage(requestData);
      setResult(response);
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Website About Page',
          toolId: 'website-about-page',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Website about page saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
    } catch (error) {
      console.error('Error generating about page:', error);
      alert('Error generating about page. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <SectionCard title="Company Foundation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="companyName">Company Name</label>
            <input
              id="companyName"
              name="companyName"
              value={inputs.companyName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
              placeholder="Your company name"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-900" htmlFor="foundingYear">Founding Year</label>
            <input
              id="foundingYear"
              name="foundingYear"
              value={inputs.foundingYear}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
              placeholder="2020"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-blue-900" htmlFor="companyMission">Company Mission</label>
          <textarea 
            id="companyMission"
            name="companyMission"
            value={inputs.companyMission}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
            placeholder="What is your company's mission? What do you aim to achieve?"
          ></textarea>
        </div>
      </SectionCard>

      <SectionCard title="Brand Story & Values">
        <InputField
          label="Brand Story"
          id="brandStory"
          value={inputs.brandStory}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Tell the story of how your company started. What inspired you to create this business?"
        />
        <InputField
          label="Company Values"
          id="companyValues"
          value={inputs.companyValues}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What core values drive your company? What principles guide your decisions?"
        />
        <InputField
          label="Unique Selling Points"
          id="uniqueSellingPoints"
          value={inputs.uniqueSellingPoints}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What makes your company different from competitors? What unique value do you provide?"
        />
      </SectionCard>

      <SectionCard title="Team & Achievements">
        <p className="text-sm text-gray-600 mb-4">Share information about your team and notable accomplishments.</p>
        <InputField
          label="Team Size & Structure"
          id="teamSize"
          value={inputs.teamSize}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Describe your team size, key roles, and what makes your team special..."
        />
        <InputField
          label="Key Achievements"
          id="keyAchievements"
          value={inputs.keyAchievements}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What are your company's major achievements, milestones, or awards?"
        />
        <InputField
          label="Target Audience"
          id="targetAudience"
          value={inputs.targetAudience}
          onChange={handleInputChange}
          type="textarea"
          placeholder="Who do you serve? Describe your ideal customers and clients..."
        />
        <InputField
          label="Future Goals"
          id="companyGoals"
          value={inputs.companyGoals}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What are your company's future goals and vision for growth?"
        />
      </SectionCard>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleGenerateAboutPage}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center text-sm"
        >
          <i className="fas fa-magic mr-2"></i>
          Generate About Page
        </button>
      </div>
    </div>
  );

  const renderTemplatesTab = () => {
    return (
      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-building text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Corporate About Page</h4>
              <p className="text-xs text-blue-600">Template for established businesses and corporations.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-rocket text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Startup About Page</h4>
              <p className="text-xs text-blue-600">Template focused on innovation and growth story.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-heart text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Personal Brand About</h4>
              <p className="text-xs text-blue-600">Template for personal brands and individual professionals.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
        <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
              <i className="fas fa-handshake text-blue-600"></i>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Service-Based About</h4>
              <p className="text-xs text-blue-600">Template for service providers and consultants.</p>
            </div>
          </div>
          <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <i className="fas fa-history text-blue-500 text-xl"></i>
        </div>
        <h3 className="text-blue-900 font-medium">History</h3>
        <p className="text-sm text-blue-700 max-w-md">View your previously generated about pages.</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-file-alt text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Website About Page</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Tell your business story and build trust with visitors</p>
            </div>
            <div className="flex items-center gap-3 z-10">
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
                <i className="fas fa-clock mr-1"></i> 6 min
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
                    <h4 className="text-base font-medium text-blue-900 mb-3">Company Foundation</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="companyName">Company Name</label>
                          <input
                            id="companyName"
                            name="companyName"
                            value={inputs.companyName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            placeholder="Your company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-blue-900" htmlFor="foundingYear">Founding Year</label>
                          <input
                            id="foundingYear"
                            name="foundingYear"
                            value={inputs.foundingYear}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
                            placeholder="2020"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-blue-900" htmlFor="companyMission">Company Mission</label>
                        <textarea 
                          id="companyMission"
                          name="companyMission"
                          value={inputs.companyMission}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20" 
                          placeholder="What is your company's mission? What do you aim to achieve?"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'templates' && renderTemplatesTab()}
              {activeTab === 'history' && (
                <div className="py-4">
                  <History toolName="Website About Page" />
                </div>
              )}
            </div>
            
            {/* Results Section */}
            {result && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-600"></i>
                    About Page Generated
                  </h4>
                  <button
                    onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All
                      </>
                    )}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Page Title</h5>
                    <p className="text-green-800">{result.about_page_title}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Introduction</h5>
                    <p className="text-green-800">{result.about_page_intro}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Company Story</h5>
                    <p className="text-green-800">{result.company_story}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Mission Section</h5>
                    <p className="text-green-800">{result.mission_section}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Call to Action</h5>
                    <p className="text-green-800">{result.call_to_action}</p>
                  </div>
                  
                  {result.notes && (
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-900 mb-2">Notes</h5>
                      <p className="text-green-800">{result.notes}</p>
                    </div>
                  )}
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
                  className={`px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleGenerateAboutPage}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate About Page</span>
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
