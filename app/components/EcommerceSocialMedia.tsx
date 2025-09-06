'use client';

import React, { useState } from 'react';
import { ArrowLeft, X, ShoppingBag, Tag, Camera, Instagram, Twitter, Clock, Wand2, Layers, History as HistoryIcon, FileText } from 'lucide-react';
import { saveToolHistorySilent } from '../../services/toolHistoryService_global.js';
import History from './History/History';

export default function EcommerceSocialMedia({ onBackClick }: { onBackClick: () => void }) {
	const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'history'>('generate');
	
	// State for form inputs
	const [formData, setFormData] = useState({
		brandName: '',
		productName: '',
		productCategory: '',
		keyFeatures: '',
		platform: '',
		contentType: '',
		tone: 'professional',
		callToAction: '',
		includeEmojis: false,
		includeHashtags: false,
		additionalNotes: '',
		targetAudience: '' // Added missing field
	});

	// State for generated content
	const [generatedContent, setGeneratedContent] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);

	// Templates for quick selection with content-specific icons
	const templates = [
		{
			id: 1,
			title: 'Product Launch',
			description: 'Announce new products with compelling visuals and copy.',
			icon: <ShoppingBag className="text-blue-600" size={24} />,
		},
		{
			id: 2,
			title: 'Flash Sale',
			description: 'Create urgency with limited-time promotional offers.',
			icon: <Tag className="text-blue-600" size={24} />,
		},
		{
			id: 3,
			title: 'Product Feature',
			description: 'Highlight specific features and benefits of your products.',
			icon: <Camera className="text-blue-600" size={24} />,
		},
		{
			id: 4,
			title: 'Instagram Story',
			description: 'Create engaging content for Instagram story format.',
			icon: <Instagram className="text-blue-600" size={24} />,
		},
	];

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;

		if (type === 'checkbox') {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData((prev) => ({ ...prev, [name]: checked }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsGenerating(true);

		try {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Generate sample content based on inputs
			const sample = generateSamplePost(formData);
			setGeneratedContent(sample);
			
			// Save tool history silently
			try {
				await saveToolHistorySilent({
					toolName: 'Ecommerce Social Media',
					toolId: 'ecommerce-social-media',
					outputResult: sample,
					prompt: JSON.stringify(formData)
				});
				console.log('✅ Ecommerce social media content saved to history');
			} catch (historyError) {
				console.warn('⚠️ Failed to save to history:', historyError);
			}
		} catch (error) {
			console.error('Error generating content:', error);
		} finally {
			setIsGenerating(false);
		}
	};

	// Function to generate a sample post based on inputs
	const generateSamplePost = (data: any) => {
		const { brandName, productName, keyFeatures, platform, includeHashtags, includeEmojis } = data;

		let emoji = includeEmojis ? '✨ ' : '';
		let post = `${emoji}Introducing ${productName} from ${brandName}!\n\n${keyFeatures}\n\n`;
		
		if (includeHashtags) {
			post += `\n#${brandName.replace(/\s+/g, '')} #${productName.replace(/\s+/g, '')} #ShopNow`;
		}

		return post;
	};

	const renderGenerateTab = () => {
		if (activeTab !== 'generate') return null;

		// Directly show the form instead of templates
		return (
			<div className="p-6">
				<div className="bg-blue-50 rounded-lg p-6 border border-blue-100 shadow-sm">
					<h2 className="text-lg font-medium text-blue-900 mb-5">Social Media Content Details</h2>
					
					<div className="space-y-5">
						<div className="grid grid-cols-2 gap-5">
							<div>
								<label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
									Brand Name
								</label>
								<input
									type="text"
									id="brandName"
									name="brandName"
									value={formData.brandName}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white"
									placeholder="Enter your brand name"
								/>
							</div>

							<div>
								<label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">
									Product Category
								</label>
								<select
									id="productCategory"
									name="productCategory"
									value={formData.productCategory}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white"
								>
									<option value="">Select a category</option>
									<option value="fashion">Fashion & Apparel</option>
									<option value="beauty">Beauty & Cosmetics</option>
									<option value="home">Home & Decor</option>
									<option value="electronics">Electronics</option>
									<option value="food">Food & Beverage</option>
									<option value="health">Health & Wellness</option>
									<option value="other">Other</option>
								</select>
							</div>
						</div>

						<div>
							<label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
								Product Name or Description
							</label>
							<input
								type="text"
								id="productName"
								name="productName"
								value={formData.productName}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white"
								placeholder="What product are you promoting?"
							/>
						</div>

						<div>
							<label htmlFor="keyFeatures" className="block text-sm font-medium text-gray-700 mb-1">
								Key Product Features & Benefits
							</label>
							<textarea
								id="keyFeatures"
								name="keyFeatures"
								value={formData.keyFeatures}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white"
								placeholder="List the main selling points of your product"
								rows={3}
							/>
						</div>

						<div className="grid grid-cols-2 gap-5">
							<div>
								<label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
									Social Platform
								</label>
								<select
									id="platform"
									name="platform"
									value={formData.platform}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white"
								>
									<option value="">Select platform</option>
									<option value="instagram">Instagram</option>
									<option value="facebook">Facebook</option>
									<option value="twitter">Twitter</option>
									<option value="pinterest">Pinterest</option>
									<option value="tiktok">TikTok</option>
								</select>
							</div>

							<div>
								<label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">
									Content Type
								</label>
								<select
									id="contentType"
									name="contentType"
									value={formData.contentType}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white"
								>
									<option value="">Select content type</option>
									<option value="product_showcase">Product Showcase</option>
									<option value="promotional">Promotional Offer</option>
									<option value="educational">Educational Content</option>
									<option value="user_generated">User-Generated Content</option>
									<option value="behind_scenes">Behind-the-Scenes</option>
								</select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-5">
							<div>
								<label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
									Tone & Style
								</label>
								<select
									id="tone"
									name="tone"
									value={formData.tone}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white"
								>
									<option value="">Select tone</option>
									<option value="professional">Professional</option>
									<option value="casual">Casual & Friendly</option>
									<option value="humorous">Humorous</option>
									<option value="luxury">Luxury & Exclusive</option>
									<option value="urgent">Urgent & FOMO</option>
									<option value="informative">Informative</option>
								</select>
							</div>

							<div>
								<label htmlFor="callToAction" className="block text-sm font-medium text-gray-700 mb-1">
									Call to Action
								</label>
								<select
									id="callToAction"
									name="callToAction"
									value={formData.callToAction}
									onChange={handleInputChange}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white"
								>
									<option value="">Select CTA</option>
									<option value="shop_now">Shop Now</option>
									<option value="learn_more">Learn More</option>
									<option value="limited_offer">Limited Time Offer</option>
									<option value="swipe_up">Swipe Up</option>
									<option value="link_in_bio">Link in Bio</option>
								</select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-5">
							<div className="flex items-center">
								<input
									type="checkbox"
									id="includeHashtags"
									name="includeHashtags"
									checked={formData.includeHashtags}
									onChange={handleInputChange}
									className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
								/>
								<label htmlFor="includeHashtags" className="text-sm font-medium text-gray-700">
									Include relevant hashtags
								</label>
							</div>

							<div className="flex items-center">
								<input
									type="checkbox"
									id="includeEmojis"
									name="includeEmojis"
									checked={formData.includeEmojis}
									onChange={handleInputChange}
									className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
								/>
								<label htmlFor="includeEmojis" className="text-sm font-medium text-gray-700">
									Include emojis in content
								</label>
							</div>
						</div>

						<div>
							<label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
								Additional Instructions (Optional)
							</label>
							<textarea
								id="additionalNotes"
								name="additionalNotes"
								value={formData.additionalNotes}
								onChange={handleInputChange}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white"
								placeholder="Any specific instructions or details you want to include"
								rows={2}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderTemplatesTab = () => {
		if (activeTab !== 'templates') return null;

		return (
			<div className="p-6">
				<div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
					<h3 className="font-medium text-blue-900 px-2">Template Categories</h3>
					{templates.map((template) => (
						<div key={template.id} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
										{template.icon}
									</div>
									<div>
										<h4 className="font-medium text-blue-900">{template.title}</h4>
										<p className="text-xs text-blue-600">{template.description}</p>
									</div>
								</div>
								<button 
									onClick={() => {
										setFormData(prev => ({...prev, contentType: template.title}));
										setActiveTab('generate');
									}}
									className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
								>
									Create
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderHistoryTab = () => {
		if (activeTab !== 'history') return null;
		
		return (
			<div className="py-4">
				<History toolName="Ecommerce Social Media" />
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
							<ShoppingBag className="text-blue-100 text-3xl" />
						</div>
						<div className="flex-1 z-10">
							<h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">Ecommerce Social Media Posts</h3>
							<p className="text-base text-blue-100/90 mt-1 font-medium">Create engaging posts to showcase your products</p>
						</div>
						<div className="flex items-center gap-3 z-10">
							<span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
								<Clock className="mr-1" size={14} /> 5 min
							</span>
							<button 
								className="rounded-full transition-all duration-200 border-2 border-white bg-gradient-to-br from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-200 z-20"
								style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
								aria-label="Close"
								onClick={onBackClick}
							>
								<X size={20} />
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
										<Wand2 size={14} />
										Generate
									</span>
									{activeTab === 'generate' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
								</button>
								<button 
									onClick={() => setActiveTab('templates')}
									className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'templates' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
								>
									<span className="flex items-center gap-2">
										<Layers size={14} />
										Templates
									</span>
									{activeTab === 'templates' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
								</button>
								<button 
									onClick={() => setActiveTab('history')}
									className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${activeTab === 'history' ? 'text-blue-700 bg-blue-50/70' : 'text-blue-500 hover:text-blue-600'}`}
								>
									<span className="flex items-center gap-2">
										<HistoryIcon size={14} />
										History
									</span>
									{activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
								</button>
							</div>
							<button className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100">
								<FileText size={14} /> Save as Template
							</button>
						</div>
						
						{/* Tab Content */}
						<div className="p-4 pt-3">
							{activeTab === 'generate' && (
								<div className="space-y-3 mt-2 pb-20">
									<div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
										<h3 className="text-lg font-medium text-blue-800 mb-2">Product Details</h3>
										<div className="space-y-3">
											<input
												type="text"
												id="productName"
												name="productName"
												value={formData.productName}
												onChange={handleInputChange}
												className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
												placeholder="Enter your product name"
											/>
											
											<select
												id="productCategory"
												name="productCategory"
												value={formData.productCategory}
												onChange={handleInputChange}
												className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
											>
												<option value="">Select product type</option>
												<option value="Clothing">Clothing</option>
												<option value="Electronics">Electronics</option>
												<option value="Home & Garden">Home & Garden</option>
												<option value="Beauty">Beauty</option>
												<option value="Sports">Sports</option>
												<option value="Toys">Toys</option>
												<option value="Books">Books</option>
												<option value="Other">Other</option>
											</select>
											
											<textarea
												id="productDescription"
												name="keyFeatures"
												value={formData.keyFeatures}
												onChange={handleInputChange}
												className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base h-20"
												placeholder="Describe your product briefly (key features, benefits, target audience)"
											/>
										</div>
									</div>
									
									<div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
										<h3 className="text-lg font-medium text-blue-800 mb-2">Content Details</h3>
										<div className="space-y-3">
											<input
												type="text"
												id="targetAudience"
												name="targetAudience"
												value={formData.targetAudience}
												onChange={handleInputChange}
												className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
												placeholder="Who is your target audience?"
											/>
											
											<textarea
												id="additionalNotes" // Fixed ID to match the field name
												name="additionalNotes"
												value={formData.additionalNotes}
												onChange={handleInputChange}
												className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base h-20"
												placeholder="List key features and benefits to highlight"
											/>
											
											<select
												id="tone"
												name="tone"
												value={formData.tone}
												onChange={handleInputChange}
												className="w-full p-2.5 bg-white border border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-base"
											>
												<option value="">Select content tone</option>
												<option value="Professional">Professional</option>
												<option value="Casual">Casual</option>
												<option value="Humorous">Humorous</option>
												<option value="Inspirational">Inspirational</option>
												<option value="Educational">Educational</option>
											</select>
										</div>
									</div>
								</div>
							)}
							
							{activeTab === 'templates' && (
								<div className="p-6">
									<div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
										<h3 className="font-medium text-blue-900 px-2">Template Categories</h3>
										{templates.map((template) => (
											<div key={template.id} className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
															{template.icon}
														</div>
														<div>
															<h4 className="font-medium text-blue-900">{template.title}</h4>
															<p className="text-xs text-blue-600">{template.description}</p>
														</div>
													</div>
													<button 
														onClick={() => {
															setFormData(prev => ({...prev, contentType: template.title}));
															setActiveTab('generate');
														}}
														className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
													>
														Create
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
							
							{activeTab === 'history' && (
								<div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
									<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
										<HistoryIcon className="text-blue-500 text-xl" />
									</div>
									<h3 className="text-blue-900 font-medium">Generation History</h3>
									<p className="text-sm text-blue-700 max-w-md">View your previously generated social media posts and reuse or modify as needed.</p>
									<button className="mt-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-all duration-200 text-sm">
										<Clock className="mr-2 inline" size={14} /> View History
									</button>
								</div>
							)}
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
								<button className="px-4 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow">
									Save Draft
								</button>
								<button 
									onClick={handleSubmit}
									className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
								>
									<span>Generate Post</span>
									<ArrowLeft size={14} className="rotate-180 group-hover:translate-x-0.5 transition-transform" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}