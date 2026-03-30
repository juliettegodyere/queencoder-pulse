# Queencoder Pulse
A real-time classroom interaction system built with React and Firebase, designed for an interactive learning and assessment platform designed to enhance coding education through live participation, instant feedback, and performance tracking.

## Overview

Queencoder Live is a real-time classroom engagement platform built to transform how coding is taught and assessed.

It enables instructors to deliver questions during live sessions while students respond instantly from their devices. Responses are processed in real time, allowing for immediate feedback, gamified scoring, and dynamic leaderboards.

This project is part of the broader Queencoder Tech School initiative, focused on building structured and scalable early-stage technology education.

## Key Features
- Real-time Question Delivery
  Teachers can send questions instantly to all connected students.
- Interactive Student Participation
  Students receive and respond to questions live during sessions.
- Gamified Scoring System
  Points awarded based on correctness, speed, and response order.
- Live Leaderboard
  Rankings update in real time to encourage engagement and competition.
- Session-Based Learning
  Structured sessions allow controlled classroom interaction.

## System Architecture
Teacher → Firebase → Students  
Students → Firebase → Leaderboard  

Flow:
1. Teacher sends a question
2. Question is stored in Firebase
3. Students receive it instantly
4. Students submit answers
5. System evaluates responses
6. Leaderboard updates in real time

## Tech Stack
- Frontend: React
- Backend / Real-time Engine: Firebase (Firestore)
- Hosting: Firebase Hosting / Vercel

## Local development

1. Copy `.env.example` to `.env` and fill in your Firebase web app config (`VITE_FIREBASE_*`).
2. In Firebase Console: enable **Firestore**, **Authentication** (Anonymous + Google), and deploy `firestore.rules`.
3. Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

4. Open the URL shown in the terminal (usually `http://localhost:5173`).

## Deploy to Vercel

This app is a **Vite** single-page app. Vercel serves the `dist` output; `vercel.json` rewrites routes so React Router works on refresh.

### Option A — Git integration (recommended)

1. Push the project to **GitHub** (or GitLab / Bitbucket).
2. Go to [vercel.com](https://vercel.com), sign in, and click **Add New… → Project**.
3. **Import** your repository. Vercel should detect **Vite** automatically.
4. Confirm settings:
   - **Framework Preset:** Vite (or Other if needed)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Under **Environment Variables**, add every key from your local `.env` (same names), for example:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
6. Click **Deploy**. After the first deploy, open the production URL Vercel assigns (e.g. `https://your-app.vercel.app`).
7. In **Firebase Console → Authentication → Settings → Authorized domains**, add your Vercel hostname (e.g. `your-app.vercel.app`) so Google sign-in and auth work on production.
8. Redeploy if you change env vars (Vercel → Project → Settings → Environment Variables → redeploy).

### Option B — Vercel CLI

1. Install the CLI: `npm i -g vercel`
2. From the project root, run `vercel` and follow the prompts (link to your Vercel account).
3. Add the same `VITE_FIREBASE_*` variables when prompted or in the Vercel dashboard under the project’s **Environment Variables**.
4. Production deploy: `vercel --prod`

### Notes

- Do **not** commit `.env`; store secrets only in Vercel (or your CI) environment variables.
- If routes return 404 on refresh, ensure `vercel.json` is present and redeploy.

## Project Structure
queencoder-pulse/
│
├── public/
│   ├── index.html
│   └── assets/
│       └── (images, icons, logos)
│
├── src/
│   ├── assets/                # Static files (images, icons)
│   │
│   ├── components/            # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Timer.jsx
│   │   └── Layout.jsx
│   │
│   ├── pages/                 # Application pages (routes)
│   │   ├── Home.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── StudentJoin.jsx
│   │   ├── QuizSession.jsx
│   │   └── Results.jsx
│   │
│   ├── features/              # Feature-based modules
│   │   ├── quiz/
│   │   │   ├── quizService.js
│   │   │   ├── quizUtils.js
│   │   │
│   │   ├── session/
│   │   │   ├── sessionService.js
│   │   │   ├── sessionUtils.js
│   │   │
│   │   ├── leaderboard/
│   │   │   ├── leaderboardService.js
│   │   │   ├── leaderboardUtils.js
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useSession.js
│   │   ├── useQuestions.js
│   │   ├── useLeaderboard.js
│   │
│   ├── context/               # Global state management
│   │   ├── AuthContext.jsx
│   │   └── QuizContext.jsx
│   │
│   ├── services/              # External services (Firebase)
│   │   ├── firebase.js
│   │   └── db.js
│   │
│   ├── utils/                 # Utility functions
│   │   ├── scoring.js
│   │   ├── time.js
│   │   └── constants.js
│   │
│   ├── routes/                # Routing configuration
│   │   └── AppRoutes.jsx
│   │
│   ├── styles/                # Global styles
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env                       # Environment variables (Firebase config)
├── package.json
└── README.md

## How It Works
### Teacher
- Creates a question
- Sends it to students in real time
- Monitors responses

### Student
- Joins a session
- Receives questions instantly
- Submits answers
- Views results and ranking

## Scoring Logic
``Correct Answer = +10 points  
First Correct Answer = +5 bonus  
Fast Response (< 5 seconds) = +3 bonus `` 

## Data Tracking

The platform tracks:
- Participation rate
- Accuracy of responses
- Response time
- Student performance over sessions

This data supports continuous improvement in learning outcomes.
