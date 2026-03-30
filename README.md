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
