"use client";

import React, { useState, useCallback } from "react";
import { saveToolHistorySilent } from "../../services/toolHistoryService_global.js";
import History from "./History/History";

interface AbandonedCartSequenceProps {
	onBackClick: () => void;
}

interface EmailSequence {
	subject: string;
	content: string;
	timing: string;
}

interface GeneratedSequenceResponse {
	emails?: EmailSequence[];
	sequence?: any[];
	strategy?: string;
	notes?: string;
}

interface HistoryItem {
	_id: string;
	toolName: string;
	toolId: string;
	outputResult: any;
	generatedDate: string;
	userId: string;
}

export default function AbandonedCartSequence({
	onBackClick,
}: AbandonedCartSequenceProps) {
	const [activeTab, setActiveTab] = useState<
		"generate" | "templates" | "history" | "result"
	>("generate");
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedSequence, setGeneratedSequence] =
		useState<GeneratedSequenceResponse | null>(null);
	const [historySaved, setHistorySaved] = useState(false);
	const [inputs, setInputs] = useState({
		businessType: "",
		productType: "",
		productName: "",
		averageOrderValue: "",
		targetAudience: "",
		brandPersonality: "",
		urgencyFactors: "",
		incentiveOffers: "",
		email1Timing: "1-hour",
		email2Timing: "24-hours",
		email3Timing: "72-hours",
	});

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setInputs((prev) => ({ ...prev, [name]: value }));
	};

	const handleGenerateSequence = async () => {
		// Enhanced validation for required fields
		const requiredFields = {
			"Business Type": inputs.businessType,
			"Product Name": inputs.productName,
			"Target Audience": inputs.targetAudience,
			"Brand Personality": inputs.brandPersonality,
		};

		const missingFields = Object.entries(requiredFields)
			.filter(([_, value]) => !value)
			.map(([key]) => key);

		if (missingFields.length > 0) {
			alert(`Please fill in the required fields: ${missingFields.join(", ")}`);
			return;
		}

		setIsGenerating(true);
		setGeneratedSequence(null);
		setHistorySaved(false);

		try {
			// Dynamic import for the service to handle ES modules in client component
			const { aiToolsService } = await import("../../services/aiTools.js");

			// Map UI values to API expected format with defaults for optional fields
			const sequenceData = {
				business_type: getBusinessTypeValue(inputs.businessType),
				product_service_name: inputs.productName,
				product_category:
					getProductCategoryValue(inputs.productType) || "General",
				average_order_value:
					getOrderValueRange(inputs.averageOrderValue) || "$30 - $50",
				target_audience: inputs.targetAudience,
				brand_personality_tone: getBrandToneValue(inputs.brandPersonality),
				urgency_scarcity_factors: inputs.urgencyFactors || "Limited time offer",
				incentives_special_offers:
					inputs.incentiveOffers ||
					"Special discount for completing your purchase",
				email_1_timing: getTimingValue(inputs.email1Timing),
				email_2_timing: getTimingValue(inputs.email2Timing),
				email_3_timing: getTimingValue(inputs.email3Timing),
			};

			console.log("Sending abandoned cart sequence request:", sequenceData);
			const response = await aiToolsService.generateAbandonedCartSequence(
				sequenceData
			);
			console.log("Abandoned cart sequence response:", response);
			setGeneratedSequence(response);

			// Save to tool history
			try {
				await saveToolHistorySilent({
					toolName: "Abandoned Cart Sequence",
					toolId: "abandoned-cart-sequence",
					outputResult: response,
					prompt: JSON.stringify(sequenceData),
				});
				console.log("✅ Abandoned cart sequence saved to history");
				setHistorySaved(true);
			} catch (historyError) {
				console.warn("⚠️ Failed to save to history:", historyError);
				setHistorySaved(false);
			}
		} catch (error: any) {
			console.error("Error generating abandoned cart sequence:", error);

			// Extract meaningful error message to show to user
			let errorMessage = "Failed to generate sequence. Please try again.";

			if (error.response?.data?.detail) {
				errorMessage = `API Error: ${error.response.data.detail}`;
			} else if (
				error.message &&
				error.message.includes("Missing required fields")
			) {
				errorMessage = error.message;
			} else if (error.response?.status === 400) {
				errorMessage =
					"The request was invalid. Please check all required fields are filled correctly.";
			} else if (error.response?.status === 401) {
				errorMessage =
					"Authentication error. Please try logging out and back in.";
			}

			console.error(
				"Error details:",
				error.response?.data || error.message || "Unknown error"
			);
			alert(errorMessage);
		} finally {
			setIsGenerating(false);
		}
	};

	// Helper functions to map UI values to API format
	const getBusinessTypeValue = (value: string) => {
		const mapping: Record<string, string> = {
			ecommerce: "E-commerce Store",
			saas: "SaaS Platform",
			"digital-products": "Digital Products",
			subscription: "Subscription Service",
			b2b: "B2B Service",
			retail: "Retail Store",
		};
		return mapping[value] || value;
	};

	const getProductCategoryValue = (value: string) => {
		const mapping: Record<string, string> = {
			clothing: "Fashion & Apparel",
			electronics: "Electronics",
			software: "Software",
			courses: "Education & Training",
			food: "Food & Beverage",
			beauty: "Beauty & Skincare",
			home: "Home & Garden",
		};
		return mapping[value] || value;
	};

	const getOrderValueRange = (value: string) => {
		const mapping: Record<string, string> = {
			"under-25": "Under $25",
			"25-100": "$25 - $100",
			"100-500": "$100 - $500",
			"500-1000": "$500 - $1,000",
			"over-1000": "Over $1,000",
		};
		return mapping[value] || value;
	};

	const getBrandToneValue = (value: string) => {
		const mapping: Record<string, string> = {
			friendly: "Friendly and Casual",
			professional: "Professional and Trustworthy",
			urgent: "Urgent and Direct",
			luxury: "Luxury and Premium",
			playful: "Playful and Fun",
			helpful: "Helpful and Reassuring",
		};
		return mapping[value] || value;
	};

	const getTimingValue = (value: string) => {
		const mapping: Record<string, string> = {
			"1-hour": "1 Hour",
			"3-hours": "3 Hours",
			"6-hours": "6 Hours",
			"24-hours": "24 Hours",
			"48-hours": "48 Hours",
			"72-hours": "72 Hours",
			"1-week": "1 Week",
			"2-weeks": "2 Weeks",
		};
		return mapping[value] || value;
	};

	const cartSequenceTemplates = [
		{
			name: "E-commerce Standard",
			icon: "fas fa-shopping-cart",
			description: "Standard abandoned cart sequence for e-commerce stores.",
		},
		{
			name: "Subscription Service",
			icon: "fas fa-sync-alt",
			description:
				"Cart recovery for subscription-based products and services.",
		},
		{
			name: "Digital Products",
			icon: "fas fa-download",
			description: "Sequence optimized for digital product sales.",
		},
		{
			name: "High-Value Items",
			icon: "fas fa-gem",
			description: "Recovery sequence for expensive or luxury products.",
		},
		{
			name: "B2B Services",
			icon: "fas fa-briefcase",
			description: "Professional cart abandonment sequence for B2B.",
		},
		{
			name: "SaaS Trial",
			icon: "fas fa-laptop-code",
			description: "Software trial to paid conversion sequence.",
		},
	];

	return (
		<div className="w-full h-full max-h-[calc(100vh-120px)] min-h-[700px] overflow-y-auto">
			<div className="bg-white/80 rounded-2xl border border-blue-200 overflow-hidden h-full w-full backdrop-blur-xl">
				<div className="flex flex-col h-full w-full">
					{/* Glassmorphic Header with blue gradient */}
					<div className="flex items-center px-8 py-6 text-white bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 relative overflow-hidden">
						<div className="absolute inset-0 w-full h-full bg-[url('/noise.png')] bg-cover bg-center opacity-10 pointer-events-none z-[-1]"></div>
						<div className="mr-6 p-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/30 z-10 flex items-center justify-center">
							<i className="fas fa-shopping-cart text-blue-100 text-3xl"></i>
						</div>
						<div className="flex-1 z-10">
							<h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">
								Abandoned Cart Sequence
							</h3>
							<p className="text-base text-blue-100/90 mt-1 font-medium">
								Create a sequence of emails to recover abandoned carts and boost
								sales
							</p>
						</div>
						<div className="flex items-center gap-3 z-10">
							<span className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 flex items-center font-semibold text-white/90">
								<i className="fas fa-clock mr-1"></i> 4 min
							</span>
							<button
								className="rounded-full transition-all duration-200 border-2 border-white bg-gradient-to-br from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-200 z-20"
								style={{
									width: 40,
									height: 40,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
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
									onClick={() => setActiveTab("generate")}
									className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${
										activeTab === "generate"
											? "text-blue-700 bg-blue-50/70"
											: "text-blue-500 hover:text-blue-600"
									}`}
								>
									<span className="flex items-center gap-2">
										<i className="fas fa-magic text-xs"></i>
										Generate
									</span>
									{activeTab === "generate" && (
										<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
									)}
								</button>
								{generatedSequence && (
									<button
										onClick={() => setActiveTab("result")}
										className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${
											activeTab === "result"
												? "text-blue-700 bg-blue-50/70"
												: "text-blue-500 hover:text-blue-600"
										}`}
									>
										<span className="flex items-center gap-2">
											<i className="fas fa-check-circle text-xs"></i>
											Generated Sequence
										</span>
										{activeTab === "result" && (
											<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
										)}
									</button>
								)}
								<button
									onClick={() => setActiveTab("templates")}
									className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${
										activeTab === "templates"
											? "text-blue-700 bg-blue-50/70"
											: "text-blue-500 hover:text-blue-600"
									}`}
								>
									<span className="flex items-center gap-2">
										<i className="fas fa-layer-group text-xs"></i>
										Templates
									</span>
									{activeTab === "templates" && (
										<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
									)}
								</button>
								<button
									onClick={() => setActiveTab("history")}
									className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${
										activeTab === "history"
											? "text-blue-700 bg-blue-50/70"
											: "text-blue-500 hover:text-blue-600"
									}`}
								>
									<span className="flex items-center gap-2">
										<i className="fas fa-history text-xs"></i>
										History
									</span>
									{activeTab === "history" && (
										<span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
									)}
								</button>
							</div>
							<button className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all flex items-center gap-1 border border-blue-100">
								<i className="fas fa-save text-xs"></i> Save as Template
							</button>
						</div>

						{/* Tab Content */}
						<div className="p-4 pt-3">
							{/* Success notification - only show briefly after generation */}
							{generatedSequence && activeTab === "generate" && (
								<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
												<i className="fas fa-check text-green-600 text-sm"></i>
											</div>
											<div>
												<h4 className="text-sm font-medium text-green-900">Sequence Generated Successfully!</h4>
												<p className="text-xs text-green-700 mt-1">Your abandoned cart email sequence is ready to view.</p>
											</div>
										</div>
										<button 
											onClick={() => setActiveTab("result")}
											className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
										>
											View Sequence
											<i className="fas fa-arrow-right text-xs"></i>
										</button>
									</div>
									{historySaved && (
										<div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
											<p className="text-xs text-blue-700 flex items-center gap-1">
												<i className="fas fa-save text-blue-500"></i>
												Sequence saved to history
											</p>
										</div>
									)}
								</div>
							)}

							{activeTab === "generate" && (
								<div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
									{/* Business & Product Information */}
									<div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
										<h4 className="text-base font-medium text-blue-900 mb-3">
											Business & Product Information
										</h4>
										<div className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<label
														className="block text-xs font-semibold text-blue-900"
														htmlFor="businessType"
													>
														Business Type
													</label>
													<select
														id="businessType"
														name="businessType"
														value={inputs.businessType}
														onChange={handleInputChange}
														className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
													>
														<option value="">Select your business type</option>
														<option value="ecommerce">E-commerce</option>
														<option value="saas">SaaS</option>
														<option value="digital-products">
															Digital Products
														</option>
														<option value="subscription">
															Subscription Service
														</option>
														<option value="b2b">B2B Service</option>
														<option value="retail">Retail</option>
													</select>
												</div>
												<div className="space-y-2">
													<label
														className="block text-xs font-semibold text-blue-900"
														htmlFor="productType"
													>
														Product Category
													</label>
													<select
														id="productType"
														name="productType"
														value={inputs.productType}
														onChange={handleInputChange}
														className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
													>
														<option value="">Choose a product category</option>
														<option value="clothing">
															Clothing & Accessories
														</option>
														<option value="electronics">Electronics</option>
														<option value="software">Software/Apps</option>
														<option value="courses">Courses/Training</option>
														<option value="food">Food & Beverage</option>
														<option value="beauty">Beauty & Health</option>
														<option value="home">Home & Garden</option>
													</select>
												</div>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<label
														className="block text-xs font-semibold text-blue-900"
														htmlFor="productName"
													>
														Product/Service Name
													</label>
													<input
														id="productName"
														name="productName"
														type="text"
														value={inputs.productName}
														onChange={handleInputChange}
														placeholder="Enter your product name"
														className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all"
													/>
												</div>
												<div className="space-y-2">
													<label
														className="block text-xs font-semibold text-blue-900"
														htmlFor="averageOrderValue"
													>
														Average Order Value
													</label>
													<select
														id="averageOrderValue"
														name="averageOrderValue"
														value={inputs.averageOrderValue}
														onChange={handleInputChange}
														className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
													>
														<option value="">Select price range</option>
														<option value="under-25">Under $25</option>
														<option value="25-100">$25 - $100</option>
														<option value="100-500">$100 - $500</option>
														<option value="500-1000">$500 - $1,000</option>
														<option value="over-1000">Over $1,000</option>
													</select>
												</div>
											</div>
										</div>
									</div>

									{/* Customer & Brand Information */}
									<div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
										<h4 className="text-base font-medium text-blue-900 mb-3">
											Customer & Brand Information
										</h4>
										<div className="space-y-4">
											<div className="space-y-2">
												<label
													className="block text-xs font-semibold text-blue-900"
													htmlFor="targetAudience"
												>
													Target Audience
												</label>
												<textarea
													id="targetAudience"
													name="targetAudience"
													value={inputs.targetAudience}
													onChange={handleInputChange}
													className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20"
													placeholder="Describe your typical customer (demographics, interests, shopping behavior)..."
												></textarea>
											</div>
											<div className="space-y-2">
												<label
													className="block text-xs font-semibold text-blue-900"
													htmlFor="brandPersonality"
												>
													Brand Personality & Tone
												</label>
												<select
													id="brandPersonality"
													name="brandPersonality"
													value={inputs.brandPersonality}
													onChange={handleInputChange}
													className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
												>
													<option value="">Select brand tone</option>
													<option value="friendly">Friendly & Casual</option>
													<option value="professional">Professional</option>
													<option value="urgent">Urgent & Direct</option>
													<option value="luxury">Luxury & Premium</option>
													<option value="playful">Playful & Fun</option>
													<option value="helpful">Helpful & Supportive</option>
												</select>
											</div>
										</div>
									</div>

									{/* Email Sequence Strategy */}
									<div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
										<h4 className="text-base font-medium text-blue-900 mb-3">
											Email Sequence Strategy
										</h4>
										<div className="space-y-4">
											<div className="space-y-2">
												<label
													className="block text-xs font-semibold text-blue-900"
													htmlFor="urgencyFactors"
												>
													Urgency & Scarcity Factors
												</label>
												<textarea
													id="urgencyFactors"
													name="urgencyFactors"
													value={inputs.urgencyFactors}
													onChange={handleInputChange}
													className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20"
													placeholder="Limited stock, time-sensitive offers, seasonal availability, etc."
												></textarea>
											</div>
											<div className="space-y-2">
												<label
													className="block text-xs font-semibold text-blue-900"
													htmlFor="incentiveOffers"
												>
													Incentives & Special Offers
												</label>
												<textarea
													id="incentiveOffers"
													name="incentiveOffers"
													value={inputs.incentiveOffers}
													onChange={handleInputChange}
													className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all h-20"
													placeholder="Discounts, free shipping, bonuses, or other incentives to complete purchase..."
												></textarea>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
												<div className="space-y-2">
													<label
														className="block text-xs font-semibold text-blue-900"
														htmlFor="email1Timing"
													>
														Email 1 Timing
													</label>
													<select
														id="email1Timing"
														name="email1Timing"
														value={inputs.email1Timing}
														onChange={handleInputChange}
														className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
													>
														<option value="1-hour">1 Hour</option>
														<option value="3-hours">3 Hours</option>
														<option value="6-hours">6 Hours</option>
														<option value="24-hours">24 Hours</option>
													</select>
												</div>
												<div className="space-y-2">
													<label
														className="block text-xs font-semibold text-blue-900"
														htmlFor="email2Timing"
													>
														Email 2 Timing
													</label>
													<select
														id="email2Timing"
														name="email2Timing"
														value={inputs.email2Timing}
														onChange={handleInputChange}
														className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
													>
														<option value="24-hours">24 Hours</option>
														<option value="48-hours">48 Hours</option>
														<option value="72-hours">72 Hours</option>
													</select>
												</div>
												<div className="space-y-2">
													<label
														className="block text-xs font-semibold text-blue-900"
														htmlFor="email3Timing"
													>
														Email 3 Timing
													</label>
													<select
														id="email3Timing"
														name="email3Timing"
														value={inputs.email3Timing}
														onChange={handleInputChange}
														className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white transition-all appearance-none"
													>
														<option value="72-hours">72 Hours</option>
														<option value="1-week">1 Week</option>
														<option value="2-weeks">2 Weeks</option>
													</select>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{activeTab === "templates" && (
								<div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
									{cartSequenceTemplates.map((template, index) => (
										<div
											key={index}
											className="p-3 border border-blue-200 rounded-lg bg-white hover:shadow-md transition-all duration-200 cursor-pointer group"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-all">
														<i className={`${template.icon} text-blue-600`}></i>
													</div>
													<div>
														<h4 className="font-medium text-blue-900">
															{template.name}
														</h4>
														<p className="text-xs text-blue-600">
															{template.description}
														</p>
													</div>
												</div>
												<button
													onClick={() => setActiveTab("generate")}
													className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1"
												>
													Create
												</button>
											</div>
										</div>
									))}
								</div>
							)}

							{activeTab === "result" && generatedSequence && (
								<div className="space-y-4 max-h-[65vh] overflow-y-auto">
									{/* Header Section */}
									<div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
												<i className="fas fa-shopping-cart text-blue-600 text-lg"></i>
											</div>
											<div>
												<h4 className="text-lg font-semibold text-gray-900">Abandoned Cart Email Sequence</h4>
												<p className="text-sm text-gray-600">Ready to recover lost sales</p>
											</div>
										</div>
										<div className="flex gap-2">
											<button 
												onClick={() => {
													const sequenceText = JSON.stringify(generatedSequence, null, 2);
													navigator.clipboard.writeText(sequenceText);
												}}
												className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
											>
												<i className="fas fa-copy text-xs"></i>
												Copy All
											</button>
											<button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
												<i className="fas fa-download text-xs"></i>
												Export
											</button>
										</div>
									</div>
									
									{historySaved && (
										<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
											<p className="text-sm text-blue-700 flex items-center gap-2">
												<i className="fas fa-save text-blue-500"></i>
												Sequence saved to history
											</p>
										</div>
									)}
									
									{/* Email Sequence Content */}
									<div className="space-y-3">
										{generatedSequence?.sequence && Array.isArray(generatedSequence.sequence) ? (
											generatedSequence.sequence.map((email: any, index: number) => (
												<div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
													<div className="flex items-center justify-between mb-3">
														<div className="flex items-center gap-2">
															<span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
																{email.email_number || index + 1}
															</span>
															<span className="font-medium text-gray-900">Email {email.email_number || index + 1}</span>
														</div>
														<span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
															{email.timing || "Timing not specified"}
														</span>
													</div>
													
													<div className="space-y-3">
														{email.subject && (
															<div>
																<div className="flex items-center justify-between mb-1">
																	<span className="text-sm font-medium text-gray-700">Subject Line</span>
																	<button 
																		onClick={() => navigator.clipboard.writeText(email.subject)}
																		className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
																	>
																		<i className="fas fa-copy"></i>
																	</button>
																</div>
																<p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg font-medium">
																	{email.subject}
																</p>
															</div>
														)}
														
														{email.preview_text && (
															<div>
																<div className="flex items-center justify-between mb-1">
																	<span className="text-sm font-medium text-gray-700">Preview Text</span>
																	<button 
																		onClick={() => navigator.clipboard.writeText(email.preview_text)}
																		className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
																	>
																		<i className="fas fa-copy"></i>
																	</button>
																</div>
																<p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic">
																	"{email.preview_text}"
																</p>
															</div>
														)}
														
														{email.body && (
															<div>
																<div className="flex items-center justify-between mb-1">
																	<span className="text-sm font-medium text-gray-700">Email Body</span>
																	<button 
																		onClick={() => navigator.clipboard.writeText(email.body)}
																		className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
																	>
																		<i className="fas fa-copy"></i>
																	</button>
																</div>
																<div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
																	{email.body}
																</div>
															</div>
														)}
														
														{email.call_to_action && (
															<div>
																<div className="flex items-center justify-between mb-1">
																	<span className="text-sm font-medium text-gray-700">Call to Action</span>
																	<button 
																		onClick={() => navigator.clipboard.writeText(email.call_to_action)}
																		className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
																	>
																		<i className="fas fa-copy"></i>
																	</button>
																</div>
																<p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
																	{email.call_to_action}
																</p>
															</div>
														)}
													</div>
												</div>
											))
										) : (
											<div className="bg-white border border-gray-200 rounded-lg p-4">
												<div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
													{JSON.stringify(generatedSequence, null, 2)}
												</div>
											</div>
										)}
									</div>
								</div>
							)}

{activeTab === "history" && (
								<History toolName="Abandoned Cart Sequence" />
							)}
						</div>

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
									onClick={handleGenerateSequence}
									disabled={isGenerating}
									className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<span>
										{isGenerating ? "Generating..." : "Generate Sequence"}
									</span>
									{isGenerating ? (
										<i className="fas fa-spinner fa-spin text-xs"></i>
									) : (
										<i className="fas fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform"></i>
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
