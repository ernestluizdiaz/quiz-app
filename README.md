# quiz-app# Full-Stack Quiz Application

A complete quiz application built with Hono (Cloudflare Workers) and Next.js 14.

## 🚀 Live Demo

-   **Frontend**: [https://quiz-app-nu-cyan-69.vercel.app/]
-   **Backend API**: [https://backend.ernestquiz.workers.dev]
-   **Loom Video**: [Your video link here]

## 📋 Features

-   10 quiz questions with 3 question types (text input, radio buttons, checkboxes)
-   Real-time validation and grading
-   Comprehensive error handling with user-friendly messages
-   Loading states for all async operations
-   Responsive UI with TailwindCSS
-   Edge-deployed API for global low-latency responses
-   Type-safe implementation with TypeScript
-   Runtime validation with Zod

## 🛠️ Tech Stack

**Backend**

-   Hono - Web framework
-   Cloudflare Workers - Edge runtime
-   Zod - Validation
-   TypeScript

**Frontend**

-   Next.js 14 - React framework
-   TailwindCSS - Styling
-   TypeScript

## 📦 Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🚢 Deployment

### Backend (Cloudflare)

```bash
cd backend
npx wrangler deploy
```

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

## 📁Folder Structure

QUIZ-APP
├── 📄 README.md
├── 📁 backend
└── 📁 frontend
