"use client";

import CreditCardsDisplay from "../components/CreditCardsDisplay";
import Link from "next/link";

export default function CardsPage() {
	return (
		<div className="min-h-screen">
			{/* Navigation Back */}
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<Link
						href="/"
						className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
					>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to Query
					</Link>
				</div>
			</div>

			{/* Cards Display */}
			<CreditCardsDisplay />
		</div>
	);
}
