import React from "react";
import "../globals.scss"; // Import global styles

// Placeholder interfaces for TypeScript
interface CreditCard {
	id: number;
	name: string;
	bank: string;
	keyFeatures: string[];
	annualFee: string;
	joiningFee: string;
	llmSummary: string;
}

// Icons as simple SVG components (since we can't use lucide-react in Next.js without additional setup)
const CreditCardIcon = () => (
	<svg
		className="w-8 h-8"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
		<line x1="1" y1="10" x2="23" y2="10" />
	</svg>
);

const StarIcon = () => (
	<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
	</svg>
);

const DollarIcon = () => (
	<svg
		className="w-5 h-5"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<line x1="12" y1="1" x2="12" y2="23" />
		<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
	</svg>
);

const CreditCardsDisplay: React.FC = () => {
	// Placeholder data - this will be replaced with actual data from your API
	const cardsData: CreditCard[] = [
		{
			id: 1,
			name: "HDFC Bank Regalia Credit Card",
			bank: "HDFC Bank",
			keyFeatures: [
				"4 reward points per ₹150 spent",
				"Complimentary airport lounge access",
				"Fuel surcharge waiver",
				"Insurance coverage up to ₹1 crore",
			],
			annualFee: "₹2,500",
			joiningFee: "₹2,500",
			llmSummary:
				"Premium lifestyle card offering excellent rewards on dining and shopping with comprehensive travel benefits and insurance coverage.",
		},
		{
			id: 2,
			name: "SBI SimplyCLICK Credit Card",
			bank: "State Bank of India",
			keyFeatures: [
				"10X reward points on online spends",
				"5X points on dining & entertainment",
				"1% fuel surcharge waiver",
				"Welcome bonus of 1,000 points",
			],
			annualFee: "₹499",
			joiningFee: "₹499",
			llmSummary:
				"Digital-first card perfect for online shoppers with accelerated rewards on e-commerce and entertainment platforms.",
		},
		{
			id: 3,
			name: "ICICI Bank Amazon Pay Credit Card",
			bank: "ICICI Bank",
			keyFeatures: [
				"5% cashback on Amazon purchases",
				"2% cashback on bill payments",
				"1% cashback on other purchases",
				"No joining fee for Prime members",
			],
			annualFee: "₹500",
			joiningFee: "₹0",
			llmSummary:
				"Cashback-focused card designed for Amazon ecosystem users with excellent rewards on online shopping and bill payments.",
		},
		{
			id: 4,
			name: "Axis Bank Flipkart Credit Card",
			bank: "Axis Bank",
			keyFeatures: [
				"5% cashback on Flipkart purchases",
				"4% cashback on Myntra & 2GUD",
				"1.5% cashback on all other spends",
				"Unlimited cashback potential",
			],
			annualFee: "₹500",
			joiningFee: "₹500",
			llmSummary:
				"E-commerce focused card offering substantial cashback on Flipkart group companies with competitive rates on general spending.",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Credit Cards Recommendations
					</h1>
					<p className="text-gray-600">
						Based on your query, here are the recommended credit cards
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{cardsData.map((card) => (
						<div
							key={card.id}
							className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
						>
							{/* Card Header */}
							<div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
								<div className="flex items-center justify-between mb-2">
									<CreditCardIcon />
									<StarIcon />
								</div>
								<h2 className="text-xl font-bold mb-1">{card.name}</h2>
								<p className="text-blue-100 font-medium">{card.bank}</p>
							</div>

							{/* Card Body */}
							<div className="p-6">
								{/* Key Features */}
								<div className="mb-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-3">
										Key Features
									</h3>
									<ul className="space-y-2">
										{card.keyFeatures.map((feature, index) => (
											<li key={index} className="flex items-start">
												<div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
												<span className="text-gray-600 text-sm leading-relaxed">
													{feature}
												</span>
											</li>
										))}
									</ul>
								</div>

								{/* Fees */}
								<div className="mb-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
										<DollarIcon />
										<span className="ml-2">Fees</span>
									</h3>
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="flex justify-between items-center mb-2">
											<span className="text-gray-600 text-sm">Annual Fee:</span>
											<span className="font-semibold text-gray-800">
												{card.annualFee}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600 text-sm">
												Joining Fee:
											</span>
											<span className="font-semibold text-gray-800">
												{card.joiningFee === "₹0" ? (
													<span className="text-green-600 font-bold">FREE</span>
												) : (
													card.joiningFee
												)}
											</span>
										</div>
									</div>
								</div>

								{/* LLM Summary */}
								<div className="mb-4">
									<h3 className="text-lg font-semibold text-gray-800 mb-3">
										AI Summary
									</h3>
									<div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
										<p className="text-gray-700 text-sm leading-relaxed italic">
											{card.llmSummary}
										</p>
									</div>
								</div>

								{/* Action Button */}
								<button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
									Learn More
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CreditCardsDisplay;
