# ChatGPT Web Application

A fullstack web application that allows users to interact with AI through a beautiful, minimalist interface.

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS 4
- **Backend**: Node.js + Express + Swagger API Documentation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API key from one of:
  - **Groq** (FREE): https://console.groq.com/keys
  - OpenAI: https://platform.openai.com/api-keys

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a `.env` file with your API key:
   
   **For Groq (FREE - Recommended):**
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   PORT=5000
   ```

   **For OpenAI:**
   ```env
   OPENAI_API_KEY=sk-your_openai_api_key_here
   API_URL=https://api.openai.com/v1/chat/completions
   MODEL=gpt-3.5-turbo
   PORT=5000
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`
Swagger documentation available at `http://localhost:5000/api-docs`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## API Endpoints

### POST /api/chat

Send a message to AI and receive a response.

**Request Body:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "reply": "I'm doing well, thank you for asking! How can I help you today?"
}
```

## Supported AI Providers

| Provider | Free Tier | API URL |
|----------|-----------|---------|
| **Groq** | ✅ Yes | `https://api.groq.com/openai/v1/chat/completions` |

## Project Structure

```
├── backend/
│   ├── index.js          # Express server with AI integration
│   ├── package.json
│   └── .env              # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css       # Component styles
│   │   ├── index.css     # Global styles + Tailwind
│   │   └── main.jsx      # React entry point
│   ├── index.html
│   └── package.json
└── README.md
```
