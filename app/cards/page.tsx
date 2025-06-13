"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, DollarSign, Gift, CreditCard, Star } from "lucide-react";

interface CardsData {
	matches: Array<{
		card_name: string;
		bank: string;
		reward_rate: string;
		annual_fee_display: string;
		summary: string;
		relevantFeatures: string[];
		welcome_offer?: string;
		annual_fee: number;
		card_type: string;
		features: string[];
	}>;
}

export default function CardsPage() {
	const [cardsData, setCardsData] = useState<CardsData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Load cards data from localStorage
		const savedCardsData = localStorage.getItem("current-cards-data");
		if (savedCardsData) {
			try {
				const parsedData = JSON.parse(savedCardsData);
				setCardsData(parsedData);
			} catch (error) {
				console.error("Error loading cards data:", error);
			}
		}
		setLoading(false);
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading cards...</p>
				</div>
			</div>
		);
	}

	if (!cardsData || !cardsData.matches || cardsData.matches.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50">
				{/* Navigation Back */}
				<div className="bg-white shadow-sm">
					<div className="max-w-7xl mx-auto px-4 py-4">
						<Link
							href="/"
							className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Chat
						</Link>
					</div>
				</div>

				{/* No Cards Message */}
				<div className="max-w-4xl mx-auto px-4 py-12 text-center">
					<div className="bg-white rounded-lg shadow-sm p-8">
						<CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h2 className="text-2xl font-semibold text-gray-900 mb-2">
							No Cards Found
						</h2>
						<p className="text-gray-600 mb-6">
							It looks like you haven't searched for any credit cards yet. Go
							back to the chat and ask for recommendations!
						</p>
						<Link
							href="/"
							className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Start Searching
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation Back */}
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link
							href="/"
							className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Chat
						</Link>
						<div className="text-sm text-gray-600">
							{cardsData.matches.length} card
							{cardsData.matches.length !== 1 ? "s" : ""} found
						</div>
					</div>
				</div>
			</div>

			{/* Header */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Your Credit Card Recommendations
					</h1>
					<p className="text-gray-600">
						Based on your search criteria, here are the best matches for you
					</p>
				</div>

				{/* Cards Grid */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{cardsData.matches.map((card, index) => (
						<div
							key={index}
							className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
						>
							{/* Card Header */}
							<div className="flex justify-between items-start mb-4">
								<div className="flex-1">
									<h3 className="font-bold text-xl text-gray-900 mb-1">
										{card.card_name}
									</h3>
									<p className="text-sm text-gray-600 font-medium">
										{card.bank}
									</p>
								</div>
								<div className="text-right">
									<div className="flex items-center gap-1 font-bold text-green-600 text-lg">
										<Star className="w-4 h-4 fill-current" />
										{card.reward_rate}
									</div>
									<div className="text-sm text-gray-500">
										{card.annual_fee_display}
									</div>
								</div>
							</div>

							{/* Card Type Badge */}
							<div className="mb-4">
								<span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
									{card.card_type}
								</span>
							</div>

							{/* Summary */}
							<p className="text-gray-700 text-sm mb-4 leading-relaxed">
								{card.summary}
							</p>

							{/* Features */}
							<div className="mb-4">
								<h4 className="font-semibold text-gray-900 mb-2 text-sm">
									Key Features:
								</h4>
								<div className="flex flex-wrap gap-1">
									{card.relevantFeatures.slice(0, 4).map((feature, idx) => (
										<span
											key={idx}
											className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
										>
											{feature}
										</span>
									))}
									{card.relevantFeatures.length > 4 && (
										<span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
											+{card.relevantFeatures.length - 4} more
										</span>
									)}
								</div>
							</div>

							{/* Welcome Offer */}
							{card.welcome_offer && (
								<div className="border-t border-gray-100 pt-4">
									<div className="flex items-start gap-2 text-sm">
										<Gift className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										<div>
											<p className="font-semibold text-green-600 mb-1">
												Welcome Offer:
											</p>
											<p className="text-gray-700 text-xs">
												{card.welcome_offer}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Annual Fee */}
							<div className="border-t border-gray-100 pt-4 mt-4">
								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-600">Annual Fee:</span>
									<span className="font-semibold text-gray-900">
										₹{card.annual_fee.toLocaleString()}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Action Buttons */}
				<div className="mt-12 text-center">
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="/"
							className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
						>
							Ask Another Question
						</Link>
						<button
							onClick={() => window.print()}
							className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg transition-colors font-medium"
						>
							Print Recommendations
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
