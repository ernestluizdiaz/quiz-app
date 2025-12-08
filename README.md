# 🎯 Full-Stack Quiz Application

A complete quiz platform built with **Next.js 14** and **Hono** on **Cloudflare Workers**, featuring real-time grading, strong validation, and a clean UI.

## 🌍 Live Links

-   **Frontend**: [https://quiz-app-nu-cyan-69.vercel.app](https://quiz-app-nu-cyan-69.vercel.app)
-   **Backend API**: [https://backend.ernestquiz.workers.dev](https://backend.ernestquiz.workers.dev)
-   **Loom Video**: [https://www.loom.com/share/6af47a9b66214920ade5732b295c4012](https://www.loom.com/share/6af47a9b66214920ade5732b295c4012)

## ✨ Features

-   10 quiz questions, covering:

    -   Text input
    -   Single-choice (radio)
    -   Multi-select (checkbox)

-   Real-time UI validation + server-side grading
-   Comprehensive API error handling
-   Type-safe communication with **Zod** & **TypeScript**
-   Fully responsive design
-   Deployed on global edge infrastructure
-   Extremely fast API (<10 ms typical)

## 🧱 Tech Stack

### Frontend

-   **Next.js 14** (App Router)
-   **React**
-   **TailwindCSS**
-   **TypeScript**

### Backend

-   **Hono** (lightweight web framework)
-   **Cloudflare Workers** (Edge Runtime)
-   **Zod** (runtime validation)
-   **TypeScript**

## ⚙️ Quick Start

### 1️⃣ Backend

```bash
cd backend
npm install
npm run dev
```

Runs on:
`http://localhost:8787`

Build & Deploy:

```bash
npm run build
npx wrangler deploy
```

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:
`http://localhost:3000`

Build for production:

```bash
npm run build
npm start
```

Deploy:

```bash
vercel --prod
```

## 🏗️ Architecture Overview

### 🌐 Runtime: Node vs Edge

| Layer    | Runtime                       | Why                                                   |
| -------- | ----------------------------- | ----------------------------------------------------- |
| Backend  | **Cloudflare Workers (Edge)** | Near-zero cold starts, global routing, ideal for APIs |
| Frontend | **Vercel (Node + Edge mix)**  | Best deployment experience for Next.js                |

This combination optimizes speed without adding complexity.

### 📁 Frontend Architecture: App Router

The project uses **Next.js App Router**, not Pages Router.

### ⚙️ Tools:

-   VsCode
-   Github
-   ClaudeAI
-   Terminal

#### Benefits:

-   Server Components by default
-   Cleaner layout organization
-   Better performance for modern React
-   Easier data fetching & caching

### ⚙️ Backend Architecture: Hono + Workers

**Hono** was chosen because:

-   Extremely tiny footprint (~1kb)
-   Designed for Edge runtimes
-   Cleaner and faster than Express
-   Built-in utilities (CORS, routing)

## 🔒 Validation Approach

The backend uses **Zod** for strict, runtime-safe request validation.

#### Why Validate?

-   Ensures only correct data enters grading logic
-   Protects API from malformed requests
-   Prevents app crashes
-   Provides clear error messages to frontend

### Validation Flow in `/api/grade`:

1. Parse JSON
2. `safeParse()` with Zod schema
3. If invalid → return 400 + detailed validation issues
4. If valid → grade answers
5. Return score + per-question results

#### Example Schema

```typescript
export const answerSchema = z.object({
	id: z.union([z.string(), z.number()]),
	value: z.union([z.string(), z.number(), z.array(z.number())]),
});
```

This schema supports all question types while preventing invalid structures.

## 📚 Libraries & Rationale

### Backend

| Library                | Purpose           | Reason                            |
| ---------------------- | ----------------- | --------------------------------- |
| **Hono**               | API routing       | Fast & edge-native                |
| **Cloudflare Workers** | Deployment        | Global speed                      |
| **Zod**                | Schema validation | Precise, safe, developer-friendly |
| **TypeScript**         | Type safety       | Prevents runtime bugs             |

### Frontend

| Library         | Purpose            | Reason                   |
| --------------- | ------------------ | ------------------------ |
| **Next.js 14**  | Frontend framework | Best DX + App Router     |
| **React**       | UI                 | Component-based          |
| **TailwindCSS** | Styling            | Fast + scalable          |
| **TypeScript**  | Type safety        | Consistency with backend |

## ⚖️ Trade-offs & Shortcuts Taken

-   **No database**: Quiz data is static and loaded from a file for simplicity.
-   **Minimalistic UI**: Focused on clarity over aesthetics.
-   **Single backend endpoint** (`/api/grade`): Good for scope, but not modular for large apps.
-   **Client doesn't use Zod**: Validation only on backend; avoids duplicate schemas.
-   **Static quiz content**: Quick to implement but requires redeploy to edit.

## ⏱️ Time Spent (Honest)

| Task                                 | Duration    |
| ------------------------------------ | ----------- |
| Backend API + validation             | ~1 hour     |
| Grading logic for all question types | ~1 hour     |
| Frontend UI + quiz form              | ~2 hours    |
| Loading states + error states        | ~1 hour     |
| CORS + deployment debugging          | ~45 minutes |
| Final documentation + polish         | ~20 minutes |
| **Total**                            | ~6 hours    |
