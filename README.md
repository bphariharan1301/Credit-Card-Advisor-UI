# 💳 Credit Card Advisor – Application Summary

An AI-powered web application that helps users find the best credit cards based on their preferences and spending habits. Built with **React**, **Next.js**, **TypeScript**, and a **streaming backend**, the app supports real-time LLM-based recommendations and interactive markdown-based responses.

---

## 🚀 Features

- ✅ Natural language query support for credit card recommendations
- ✅ Real-time streaming responses using Server-Sent Events (SSE)
- ✅ Markdown rendering with support for code, lists, and rich text
- ✅ Card recommendation cards with reward rates, fees, and features
- ✅ Cancel streaming in-progress queries
- ✅ Responsive chat-like UI

---

## 🧠 How It Works

1. **User asks a question** (e.g., "Best travel credit card with no annual fee?")
2. **App sends a request** to the backend using `fetch()`, with the query.
3. **Streaming backend** responds with chunks of JSON (SSE).
4. The client parses the stream and updates assistant's message in real time.
5. If card data is included in the stream, it’s rendered as styled card recommendations.
6. All messages are rendered using `ReactMarkdown` for rich formatting.

---

## 🗂️ Code Structure

### `Home` Component (`page.tsx`)

- Manages all app state:
  - `messages` – conversation history
  - `isStreaming`, `abortControllerRef`, etc.
- Handles:
  - Submitting queries
  - Receiving streaming responses
  - Rendering messages and UI

### `MarkdownRenderer`

- Custom component using `react-markdown` and `remark-gfm`
- Custom styles for:
  - Headings, lists, links, code blocks, etc.

### `Message` Interface

```ts
interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	cardsData?: CardsData;
	timestamp: Date;
	isStreaming?: boolean;
}
```

### `CardsData` Interface

- Contains:

  - `matches` – credit cards
  - `criteria` – why it was chosen
  - `explanation` – reasoning

---

## 🔧 Tech Stack

| Tech          | Purpose                  |
| ------------- | ------------------------ |
| React + Next  | Frontend UI & routing    |
| TypeScript    | Type safety              |
| TailwindCSS   | Styling                  |
| ReactMarkdown | Markdown rendering       |
| Lucide Icons  | Icons for user/bot/cards |

---

## 📌 Backend Integration

- Accepts POST request at `/api/query`
- Responds with Server-Sent Events (SSE) like:

```json
data: {"type": "message", "content": "Here are some options..."}
data: {"type": "cards", "content": { matches: [...], ... }}
data: [DONE]
```

---

## 📎 Example Query

> _"I want a cashback card with zero annual fees and great fuel benefits"_

- Returns streaming message
- Then 3-5 recommended credit cards
- Each card includes:

  - Name, bank, reward rate, annual fee
  - Summary and highlighted features

---

## 📱 UI Overview

- Header with app title and icon
- Scrollable message window
- Each message has:

  - Avatar
  - Timestamp
  - Markdown content

- Input box with:

  - Shift+Enter = newline
  - Enter = send
  - Cancel streaming with "Stop" button

---

## 🧩 What You Can Build Next

- 🧠 Integrate OpenAI/GPT backend
- 🛒 Save favorite cards
- 📊 Add comparison view
- 👤 Login and user history
- 📈 Analytics and filters

---
