'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2: Company Information
    companyName: '',
    jobTitle: '',
    companySize: '',
    industry: '',
    website: '',
    // Step 3: Marketing Preferences
    marketingGoals: [] as string[],
    monthlyBudget: '',
    marketingTools: [] as string[],
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  const marketingGoals = [
    'Brand Awareness',
    'Lead Generation',
    'Customer Retention',
    'Sales Growth',
    'Content Marketing',
    'Social Media Growth',
    'Email Marketing',
    'SEO Improvement'
  ];

  const marketingTools = [
    'HubSpot',
    'Mailchimp',
    'Salesforce',
    'Google Analytics',
    'Facebook Ads',
    'LinkedIn Ads',
    'Hootsuite',
    'Buffer'
  ];

  const budgetOptions = [
    'Under $1,000',
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    'Over $50,000'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'E-commerce',
    'Education',
    'Manufacturing',
    'Real Estate',
    'Consulting',
    'Other'
  ];

  const handleCheckboxChange = (category: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: (prev[category as keyof typeof prev] as string[]).includes(value)
        ? (prev[category as keyof typeof prev] as string[]).filter((item: string) => item !== value)
        : [...(prev[category as keyof typeof prev] as string[]), value]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && 
                 formData.password && formData.confirmPassword && 
                 formData.password === formData.confirmPassword);
      case 2:
        return !!(formData.companyName && formData.jobTitle && 
                 formData.companySize && formData.industry);
      case 3:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3 && validateStep(3)) {
      setIsLoading(true);
      
      try {
        // Prepare user data for registration
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          jobTitle: formData.jobTitle,
          companySize: formData.companySize,
          industry: formData.industry,
          website: formData.website,
          marketingGoals: formData.marketingGoals,
          monthlyBudget: formData.monthlyBudget,
          marketingTools: formData.marketingTools,
          subscribeNewsletter: formData.subscribeNewsletter
        };

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
          // Registration successful - redirect to login page
          toast.success('🎉 Registration successful! Please login to access your account.', {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            toastId: 'register-success',
          });
          
          // Redirect immediately for faster signup flow
          router.replace('/login');
        } else {
          // Registration failed
          const errorMessage = data.message || 'Registration failed. Please try again.';
          toast.error(`❌ ${errorMessage}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            toastId: 'register-error',
          });
        }
      } catch (error) {
        console.error('Registration error:', error);
        toast.error('❌ An error occurred during registration. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          toastId: 'register-error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStepProgress = () => {
    return (currentStep / 3) * 100;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
              <p className="text-blue-100">Let's start with your basic information</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="john.doe@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60 transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Confirm Password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60 transition-colors"
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-300 text-sm">Passwords do not match</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Company Information</h2>
              <p className="text-blue-100">Tell us about your business</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Company Name</label>
              <input
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Your Company Name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Job Title</label>
              <input
                name="jobTitle"
                type="text"
                required
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Marketing Manager"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Company Size</label>
                <select
                  name="companySize"
                  required
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                >
                  <option value="" className="bg-blue-800 text-white">Select size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size} className="bg-blue-800 text-white">{size}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Industry</label>
                <select
                  name="industry"
                  required
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                >
                  <option value="" className="bg-blue-800 text-white">Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry} className="bg-blue-800 text-white">{industry}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Website (Optional)</label>
              <input
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Marketing Preferences</h2>
              <p className="text-blue-100">Help us customize your experience</p>
            </div>

            {/* Marketing Goals */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Marketing Goals (Select all that apply)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {marketingGoals.map((goal) => (
                  <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.marketingGoals.includes(goal)}
                        onChange={() => handleCheckboxChange('marketingGoals', goal)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                        formData.marketingGoals.includes(goal)
                          ? 'bg-white border-white'
                          : 'bg-white/10 border-white/30'
                      }`}>
                        {formData.marketingGoals.includes(goal) && (
                          <i className="fas fa-check text-blue-700 text-xs"></i>
                        )}
                      </div>
                    </div>
                    <span className="text-white text-sm">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Monthly Budget */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Monthly Marketing Budget</h3>
              <select
                name="monthlyBudget"
                value={formData.monthlyBudget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all backdrop-blur-sm"
              >
                <option value="" className="bg-blue-800 text-white">Select budget range</option>
                {budgetOptions.map((budget) => (
                  <option key={budget} value={budget} className="bg-blue-800 text-white">
                    {budget}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Marketing Tools */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Current Marketing Tools (Select all that apply)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {marketingTools.map((tool) => (
                  <label key={tool} className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.marketingTools.includes(tool)}
                        onChange={() => handleCheckboxChange('marketingTools', tool)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                        formData.marketingTools.includes(tool)
                          ? 'bg-white border-white'
                          : 'bg-white/10 border-white/30'
                      }`}>
                        {formData.marketingTools.includes(tool) && (
                          <i className="fas fa-check text-blue-700 text-xs"></i>
                        )}
                      </div>
                    </div>
                    <span className="text-white text-sm">{tool}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Terms and Newsletter */}
            <div className="space-y-4 pt-4 border-t border-white/20">
              <label className="flex items-start space-x-3 cursor-pointer">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                    formData.agreeToTerms ? 'bg-white border-white' : 'bg-white/10 border-white/30'
                  }`}>
                    {formData.agreeToTerms && (
                      <i className="fas fa-check text-blue-700 text-xs"></i>
                    )}
                  </div>
                </div>
                <span className="text-white text-sm">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-200 underline hover:text-white">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-200 underline hover:text-white">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                    formData.subscribeNewsletter ? 'bg-white border-white' : 'bg-white/10 border-white/30'
                  }`}>
                    {formData.subscribeNewsletter && (
                      <i className="fas fa-check text-blue-700 text-xs"></i>
                    )}
                  </div>
                </div>
                <span className="text-white text-sm">
                  Subscribe to our newsletter for marketing tips and updates
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center relative overflow-hidden">
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 z-10">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200 group">
          <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform duration-200"></i>
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </Link>

      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl h-full flex flex-col relative px-6 py-8">
      {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/assets/images/logo2.png" 
              alt="Markzy Logo" 
              width={120}
              height={48}
              className="h-12 w-auto invert brightness-0" 
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-100">Sign in to your Markzy account</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Step {currentStep} of 3</span>
            <span className="text-white font-medium">{Math.round(getStepProgress())}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Form Container - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 h-full">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              <form onSubmit={handleSubmit}>
                {renderStep()}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <i className="fas fa-arrow-left"></i>
                      <span>Back</span>
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="flex-1 bg-white hover:bg-white/90 text-blue-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <span>Continue</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!validateStep(3) || isLoading}
                      className="flex-1 bg-white hover:bg-white/90 text-blue-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <i className="fas fa-check"></i>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6 pt-6 border-t border-white/20">
                <p className="text-white/80">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-200 hover:text-white font-medium transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
