"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, User, Bot, DollarSign, Gift, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
// Types
interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
	isStreaming?: boolean;
	cardsData?: CardsData;
}

interface CardsData {
	matches: Array<{
		card_name: string;
		bank: string;
		reward_rate: string;
		annual_fee_display: string;
		summary: string;
		relevantFeatures: string[];
		welcome_offer?: string;
		// Add other card properties as needed
		annual_fee: number;
		card_type: string;
		features: string[];
	}>;
}

interface StreamResponse {
	type: "status" | "message" | "cards" | "error";
	content: any;
}
const MarkdownRenderer = ({ content }: { content: string }) => {
	const components: Components = {
		h1: ({ ...props }) => (
			<h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2" {...props} />
		),
		h2: ({ ...props }) => (
			<h2
				className="text-xl font-semibold text-gray-900 mt-4 mb-2"
				{...props}
			/>
		),
		h3: ({ ...props }) => (
			<h3
				className="text-lg font-semibold text-gray-900 mt-4 mb-2"
				{...props}
			/>
		),
		p: ({ ...props }) => (
			<p className="text-gray-700 leading-relaxed my-2" {...props} />
		),
		ul: ({ ...props }) => (
			<ul className="list-disc list-inside space-y-1 my-3 ml-4" {...props} />
		),
		ol: ({ ...props }) => (
			<ol className="list-decimal list-inside space-y-1 my-3 ml-4" {...props} />
		),
		li: ({ ...props }) => <li className="text-gray-700" {...props} />,
		blockquote: ({ ...props }) => (
			<blockquote
				className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-3"
				{...props}
			/>
		),
		code(props) {
			const { inline, children, ...rest } =
				props as React.ComponentProps<"code"> & { inline?: boolean };
			if (inline) {
				return (
					<code
						className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
						{...rest}
					>
						{children}
					</code>
				);
			}
			return (
				<pre className="bg-gray-100 rounded-lg p-3 my-3 overflow-x-auto">
					<code className="text-sm text-gray-800" {...rest}>
						{children}
					</code>
				</pre>
			);
		},
		strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
		em: ({ ...props }) => <em className="italic text-blue-600" {...props} />,
		a: ({ ...props }) => (
			<a
				className="text-blue-600 hover:underline"
				target="_blank"
				rel="noopener noreferrer"
				{...props}
			/>
		),
	};

	return (
		<div className="prose prose-sm max-w-none">
			<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
				{content}
			</ReactMarkdown>
		</div>
	);
};

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			role: "assistant",
			content:
				"Hi! I'm your Credit Card Advisor. I can help you find the perfect credit card based on your needs, spending habits, and preferences. What kind of credit card are you looking for?",
			timestamp: new Date(),
		},
	]);
	const [currentInput, setCurrentInput] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(
		null
	);
	const [cardsData, setCardsData] = useState<CardsData | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);
	const router = useRouter();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	// Save and restore chat state
	useEffect(() => {
		// Load saved messages from localStorage when component mounts
		const savedMessages = localStorage.getItem("chat-messages");
		if (savedMessages) {
			try {
				const parsedMessages = JSON.parse(savedMessages);
				// Convert timestamp strings back to Date objects
				const messagesWithDates = parsedMessages.map((msg: any) => ({
					...msg,
					timestamp: new Date(msg.timestamp),
				}));
				setMessages(messagesWithDates);
			} catch (error) {
				console.error("Error loading saved messages:", error);
			}
		}
	}, []);

	// Save messages to localStorage whenever messages change
	useEffect(() => {
		if (messages.length > 1) {
			// Don't save just the initial message
			localStorage.setItem("chat-messages", JSON.stringify(messages));
		}
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleViewCards = (cardsData: CardsData) => {
		// Save cards data to localStorage for the cards page to access
		localStorage.setItem("current-cards-data", JSON.stringify(cardsData));
		router.push("/cards");
	};

	const clearChatHistory = () => {
		localStorage.removeItem("chat-messages");
		setMessages([
			{
				id: "1",
				role: "assistant",
				content:
					"Hi! I'm your Credit Card Advisor. I can help you find the perfect credit card based on your needs, spending habits, and preferences. What kind of credit card are you looking for?",
				timestamp: new Date(),
			},
		]);
	};

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!currentInput.trim() || isStreaming) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: currentInput.trim(),
			timestamp: new Date(),
		};

		const assistantMessage: Message = {
			id: (Date.now() + 1).toString(),
			role: "assistant",
			content: "",
			timestamp: new Date(),
			isStreaming: true,
		};

		setMessages((prev) => [...prev, userMessage, assistantMessage]);
		setCurrentInput("");
		setIsStreaming(true);
		setCurrentStreamingId(assistantMessage.id);

		abortControllerRef.current = new AbortController();

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_NODE_BACKEND_URL}/api/query`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ query: userMessage.content }),
					signal: abortControllerRef.current.signal,
				}
			);

			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
			if (!res.body) throw new Error("No response body");

			const reader = res.body.getReader();
			const decoder = new TextDecoder("utf-8");
			let accumulatedContent = "";
			let cardsData: CardsData | undefined;

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				const lines = chunk.split("\n");

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						const content = line.slice(6).trim();
						if (content === "[DONE]") {
							setIsStreaming(false);
							setCurrentStreamingId(null);
							setMessages((prev) =>
								prev.map((msg) =>
									msg.id === assistantMessage.id
										? {
												...msg,
												isStreaming: false,
												content: accumulatedContent,
												cardsData,
										  }
										: msg
								)
							);
							return;
						}

						try {
							const parsed: StreamResponse = JSON.parse(content);

							switch (parsed.type) {
								case "status":
									accumulatedContent += `*${parsed.content}*\n\n`;
									break;
								case "message":
									accumulatedContent += parsed.content;
									break;
								case "cards":
									cardsData = parsed.content;
									accumulatedContent +=
										"\n\n✨ Here are your personalized credit card recommendations:";
									break;
								case "error":
									accumulatedContent += `\n\n❌ Error: ${parsed.content}`;
									setIsStreaming(false);
									setCurrentStreamingId(null);
									break;
							}

							setMessages((prev) =>
								prev.map((msg) =>
									msg.id === assistantMessage.id
										? {
												...msg,
												content: accumulatedContent,
												cardsData,
												isStreaming: parsed.type !== "error",
										  }
										: msg
								)
							);
						} catch {
							console.warn("Failed to parse chunk:", content);
						}
					}
				}
			}
		} catch (error: any) {
			console.error("Error during streaming:", error);
			const fallbackContent =
				error.name === "AbortError"
					? "Request cancelled"
					: "❌ Something went wrong. Please try again.";
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === assistantMessage.id
						? { ...msg, content: fallbackContent, isStreaming: false }
						: msg
				)
			);
		} finally {
			setIsStreaming(false);
			setCurrentStreamingId(null);
		}
	};

	const handleCancel = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const formatTimestamp = (date: Date) =>
		date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

	return (
		<div className="flex flex-col h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
							<CreditCard className="w-4 h-4 text-white" />
						</div>
						<div>
							<h1 className="text-lg font-semibold text-gray-900">
								Credit Card Advisor
							</h1>
							<p className="text-sm text-gray-500">
								AI-powered credit card recommendations
							</p>
						</div>
					</div>
					<button
						onClick={clearChatHistory}
						className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
					>
						Clear Chat
					</button>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto px-4 py-6">
				<div className="max-w-3xl mx-auto space-y-6">
					{messages.map((message) => (
						<div key={message.id} className="flex gap-4">
							{/* Avatar */}
							<div className="flex-shrink-0">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center ${
										message.role === "user" ? "bg-gray-600" : "bg-blue-600"
									}`}
								>
									{message.role === "user" ? (
										<User className="w-4 h-4 text-white" />
									) : (
										<Bot className="w-4 h-4 text-white" />
									)}
								</div>
							</div>

							{/* Content */}
							<div className="flex-1 space-y-2">
								<div className="flex items-center gap-2">
									<span className="font-medium text-gray-900">
										{message.role === "user" ? "You" : "Credit Card Advisor"}
									</span>
									<span className="text-xs text-gray-500">
										{formatTimestamp(message.timestamp)}
									</span>
								</div>

								<MarkdownRenderer content={message.content} />

								{message.isStreaming && (
									<div className="flex items-center gap-2 text-gray-500">
										<div className="flex gap-1">
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{ animationDelay: "0.1s" }}
											></div>
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{ animationDelay: "0.2s" }}
											></div>
										</div>
										<span className="text-sm">Analyzing...</span>
									</div>
								)}

								{message.cardsData && (
									<div className="mt-4 space-y-4">
										<div className="grid gap-4">
											{message.cardsData.matches.map((card, index) => (
												<div
													key={index}
													className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
												>
													<div className="flex justify-between items-start mb-3">
														<div>
															<h4 className="font-semibold text-lg text-gray-900">
																{card.card_name}
															</h4>
															<p className="text-sm text-gray-600">
																{card.bank}
															</p>
														</div>
														<div className="text-right">
															<div className="flex items-center gap-1 font-semibold text-green-600">
																<DollarSign className="w-4 h-4" />
																{card.reward_rate}
															</div>
															<div className="text-sm text-gray-500">
																{card.annual_fee_display}
															</div>
														</div>
													</div>
													<p className="text-gray-700 mb-3 text-sm">
														{card.summary}
													</p>
													<div className="flex flex-wrap gap-2 mb-3">
														{card.relevantFeatures.map((feature, idx) => (
															<span
																key={idx}
																className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
															>
																{feature}
															</span>
														))}
													</div>
													{card.welcome_offer && (
														<div className="flex items-center gap-2 text-sm text-green-600">
															<Gift className="w-4 h-4" />
															<span>Welcome Offer: {card.welcome_offer}</span>
														</div>
													)}
												</div>
											))}
										</div>
										<div className="flex gap-3 pt-2">
											<button
												onClick={() => handleViewCards(message.cardsData!)}
												className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
											>
												View All Cards
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Area */}
			<div className="bg-white border-t border-gray-200 px-4 py-4">
				<div className="max-w-3xl mx-auto">
					<div className="flex gap-3 items-end">
						<div className="flex-1">
							<textarea
								ref={inputRef}
								rows={1}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
								placeholder="Ask about credit cards, rewards, fees, or describe what you're looking for..."
								value={currentInput}
								onChange={(e) => setCurrentInput(e.target.value)}
								onKeyDown={handleKeyDown}
								disabled={isStreaming}
								style={{ minHeight: "48px" }}
							/>
						</div>
						<div className="flex gap-2">
							{isStreaming && (
								<button
									onClick={handleCancel}
									className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
								>
									Stop
								</button>
							)}
							<button
								onClick={handleSubmit}
								disabled={isStreaming || !currentInput.trim()}
								className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors flex items-center justify-center"
							>
								<Send className="w-4 h-4" />
							</button>
						</div>
					</div>
					<div className="text-xs text-gray-500 mt-2 text-center">
						Press Enter to send, Shift+Enter for new line
					</div>
				</div>
			</div>
		</div>
	);
}
