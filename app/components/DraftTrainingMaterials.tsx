import React, { useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { aiToolsService } from '../../services/aiTools.js';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: 'text' | 'textarea' | 'select';
  options?: string[];
  placeholder?: string;
  Icon?: React.ElementType;
  rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, type = 'text', options, placeholder, Icon, rows = 3 }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
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

export default function DraftTrainingMaterials({ onBackClick }: { onBackClick: () => void }) {
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
  const [inputs, setInputs] = useState({
    trainingTopic: '',
    targetAudience: '',
    learningObjectives: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedMaterials, setGeneratedMaterials] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const generateTrainingMaterials = async () => {
    // Validate required fields
    if (!inputs.trainingTopic || !inputs.targetAudience || !inputs.learningObjectives) {
      setError('Please fill in all required fields: Training Topic, Target Audience, and Learning Objectives');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedMaterials(null);

    try {
      const requestData = {
        training_topic: inputs.trainingTopic,
        target_audience: inputs.targetAudience,
        learning_objectives: inputs.learningObjectives
      };

      console.log('🚀 Sending training materials request:', requestData);
      
      const response = await aiToolsService.generateTrainingMaterials(requestData);
      
      console.log('✅ Training materials API response:', response);
      setGeneratedMaterials(response);
      
      // Save tool history silently
      try {
        await saveToolHistorySilent({
          toolName: 'Draft Training Materials',
          toolId: 'draft-training-materials',
          outputResult: response,
          prompt: JSON.stringify(requestData)
        });
        console.log('✅ Training materials saved to history');
      } catch (historyError) {
        console.warn('⚠️ Failed to save to history:', historyError);
      }
      setActiveTab('generate'); // Stay on generate tab to show results
      
    } catch (error: any) {
      console.error('❌ Training materials API error:', error);
      setError(error?.message || 'Failed to generate training materials');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setGeneratedMaterials(null);
    setError('');
  };

  const resetForm = () => {
    setInputs({
      trainingTopic: '',
      targetAudience: '',
      learningObjectives: '',
    });
    setGeneratedMaterials(null);
    setError('');
  };

  const renderTemplatesTab = () => (
    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
      {/* Course Outline Template */}
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-list-ol text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Course Outline</h4>
            <p className="text-xs text-blue-600">Generate a structured outline for your training</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>

      {/* Introduction Module Template */}
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-door-open text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Introduction Module</h4>
            <p className="text-xs text-blue-600">Generate an engaging introduction to your course</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>

      {/* Key Concepts Template */}
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-lightbulb text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Key Concepts</h4>
            <p className="text-xs text-blue-600">Generate explanations of key concepts and terminology</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>

      {/* Practical Examples Template */}
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-tasks text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Practical Examples</h4>
            <p className="text-xs text-blue-600">Generate real-world examples and case studies</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>

      {/* Practice Exercises Template */}
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-dumbbell text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Practice Exercises</h4>
            <p className="text-xs text-blue-600">Generate hands-on exercises for participants</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>

      {/* Discussion Questions Template */}
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-comments text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Discussion Questions</h4>
            <p className="text-xs text-blue-600">Generate thought-provoking questions for group discussions</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>

      {/* Assessment Quiz Template */}
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-question-circle text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Assessment Quiz</h4>
            <p className="text-xs text-blue-600">Generate quiz questions to test knowledge retention</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>

      {/* Handout Materials Template */}
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-file-alt text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Handout Materials</h4>
            <p className="text-xs text-blue-600">Generate handouts and reference materials</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>

      {/* Instructor Notes Template */}
      <div className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
            <i className="fas fa-user-tie text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Instructor Notes</h4>
            <p className="text-xs text-blue-600">Generate detailed instructor guidance and notes</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1">Create</button>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="py-4">
      <History toolName="Draft Training Materials" />
    </div>
  );

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <SectionCard title="Training Details">
        <InputField
          label="Training Topic"
          id="trainingTopic"
          value={inputs.trainingTopic}
          onChange={handleInputChange}
          placeholder="Enter the main topic of your training"
        />
        <InputField
          label="Target Audience"
          id="targetAudience"
          value={inputs.targetAudience}
          onChange={handleInputChange}
          placeholder="Who is this training for? (e.g., beginners, professionals, etc.)"
        />
        <InputField
          label="Learning Objectives"
          id="learningObjectives"
          value={inputs.learningObjectives}
          onChange={handleInputChange}
          type="textarea"
          placeholder="What should participants learn from this training? (List key objectives)"
          rows={4}
        />
      </SectionCard>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
            <span className="text-red-800 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Generated Materials */}
      {generatedMaterials && (
        <SectionCard title="Generated Training Materials" icon={FileText}>
          <div className="bg-white rounded-lg border border-blue-200 p-4">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                {generatedMaterials.training_materials}
              </pre>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={clearResults}
                className="px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all"
              >
                <i className="fas fa-times mr-1"></i>
                Clear Results
              </button>
              <button 
                onClick={resetForm}
                className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                <i className="fas fa-refresh mr-1"></i>
                Reset Form
              </button>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );

  return (
    <div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
      <div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
        <div className="flex flex-col h-full w-full">
          {/* Glassmorphic Header with blue gradient */}
          <div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
            <div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
              <i className="fas fa-chalkboard-teacher text-blue-100 text-3xl"></i>
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Draft Training Materials</h3>
              <p className="text-base text-blue-100/90 mt-1 font-medium">Create educational content for courses and workshops</p>
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
              {activeTab === 'generate' && renderGenerateTab()}
              
              {activeTab === 'templates' && renderTemplatesTab()}
              
              {activeTab === 'history' && renderHistoryTab()}
            </div>
            {/* Action buttons */}
            <div className="mt-auto flex justify-between items-center px-4 py-3 border-t border-blue-100">
              <button 
                className="group flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-all px-3 py-1.5 rounded-lg hover:bg-blue-50/50" 
                onClick={onBackClick}
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to All Tools</span>
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={resetForm}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow"
                >
                  <i className="fas fa-refresh mr-1"></i>
                  Reset
                </button>
                <button className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow">
                  Save Draft
                </button>
                <button 
                  onClick={generateTrainingMaterials}
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
                      <span>Generate Materials</span>
                      <ArrowLeft size={14} className="rotate-180 group-hover:translate-x-0.5 transition-transform" />
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
