# Queencoder Pulse — User Guide

This document explains what Queencoder Pulse does, its key features, and how to use it as a **Teacher** or **Student**.

## Roles (Teacher vs Student)

- **Teacher**
  - Signs in with a **Google account**.
  - Can create and run live quiz sessions.
  - Has a teacher profile page at `/teacher/profile`.
- **Student**
  - Joins with a **Join code**, **Student ID**, and **Display name**.
  - Answers questions live; scoring is based on **accuracy and speed**.
  - Has a student profile page at `/me` (only shown after a Student ID is set on the device).

## Core Features

- **Session presence**
  - When a student uses **Log out on this device** while a session is still running, their row is marked **inactive** on the leaderboard (dimmed styling) and sorted below active players.
  - Rejoining the same session with the same **student ID** removes the duplicate leaderboard row (only the latest connection stays). Firebase may still list old anonymous auth users until you clean them up in the console; that does not affect scores.

- **Live sessions**
  - Teachers create sessions and share a **Join code**.
  - Students join from any device using the Join code.
- **Real-time questions**
  - Teachers publish questions to the session.
  - Students see the active question immediately.
- **Auto-submit answers**
  - Student answers are **submitted immediately when an option is selected** (no separate “submit” required).
- **Gamified scoring**
  - Points are awarded for correct answers, with bonuses for “first correct” and “fast” answers.
- **Speed + tie-breakers**
  - When scores are tied, ranking is decided by:
    1. **More correct answers**
    2. **Faster total time** (lower total response time wins)
    3. Alphabetical display name (final tie-breaker)
- **Leaderboards**
  - **Live leaderboard** during a session.
  - **Results** page at the end of a session.
  - **Global leaderboard** across all students at `/leaderboard/global`, showing cumulative **points and speed**.
- **Student profiles (persistent progress)**
  - Student stats persist across sessions by **Student ID**.
  - Profile shows cumulative score, sessions played, and medals.
- **Rewards (medals)**
  - **Per-session medals**: Gold / Silver / Bronze for the top 3 at session end.
  - **Milestone medals**: awarded when total score crosses thresholds (e.g. 1000 / 5000 / 10000).
- **Security: logout + clear local data**
  - Teacher and student profile pages include **“Log out on this device”** which signs out and clears app data stored in the browser.

## How to Use (Students)

### Join a session

1. Open the app.
2. Go to **Join**.
3. Enter:
   - **Join code** (from your teacher)
   - **Student ID** (your school/student identifier). A leading `@` is ignored so `@test` and `test` are treated as the same ID.
   - **Display name**
4. Join the session.

### Answer questions

- When a question is active, tap/click an option.
- Your answer is **submitted immediately on selection**.
- The **Time on question** timer stops as soon as your answer is submitted.

### View results

- Use the **Results** button to view standings.
- The leaderboard shows:
  - **Points**
  - **Total answer time** (speed) next to points (e.g. `30 pts · 42s`)

### View your student profile

- Click the profile pill in the header (visible after a Student ID is set), or visit `/me`.
- Your profile includes:
  - Total score
  - Sessions played
  - Medal counts (Gold/Silver/Bronze + Milestones)
  - Recent sessions joined from this browser

### Log out and clear this device (important on shared computers)

- Go to `/me`
- Click **Log out on this device**
- This clears the locally stored session/profile info for the app in this browser.

## How to Use (Teachers)

### Sign in (Google)

- Teachers sign in with Google (Gmail / Google Workspace).
- After signing in, the header profile pill shows your **name and email** and links to `/teacher/profile`.

### Start a live session

1. On Home, choose the teacher action to start a session (Google sign-in may be required).
2. Share the **Join code** with students.

### Create and publish questions

1. Open your session dashboard (teacher view).
2. Create one or more questions (prompt + multiple choices + correct answer).
3. Publish a question to start the timer for students.

### Monitor responses + leaderboard

- Teacher can see response counts and live leaderboard updates.

### End a session (awards medals)

- Ending a session:
  - Marks the session ended
  - Awards **Gold/Silver/Bronze** to the top 3 players based on points and speed tie-breakers

### Teacher profile and tools

- Visit `/teacher/profile` to access:
  - Global leaderboard
  - Shortcuts back to session management
  - A clear indicator if your account has **admin** access (if custom claims are configured)

### Log out and clear this device (important on shared computers)

- Visit `/teacher/profile`
- Click **Log out on this device**
- This signs out your Google account from Firebase in the app and clears app data stored in this browser.

## Scoring Rules (Summary)

- **Correct answer**: +10 points
- **First correct**: +5 bonus (awarded once per question)
- **Fast response**: +3 bonus (under the configured speed threshold)

## Data and Persistence (What is stored where)

- **Firestore (cloud)**
  - Sessions, questions, players, responses
  - Student profiles and cumulative progress
- **Browser storage (local to the device)**
  - Display name used on this device
  - Most recent joined session (for convenience)
  - Student ID for this device
  - “Recent sessions (this device)” history
  - Saved display-name suggestions for the join form

**Important:** Deleting data in **Firebase Console** (Firestore + Authentication) does **not** erase anything stored in the browser. Old profile text and “recent sessions” can still appear until you clear local data on that device.

Use **Log out on this device** (student or teacher profile) to sign out and remove **all** Queencoder Pulse data from this browser: display name, student ID, active session, join history, and name suggestions.

To fully reset a machine without using the app, use the browser’s **Clear site data / cookies** for your app’s URL (same effect as clearing storage for that origin).

## Common Troubleshooting

### “Missing or insufficient permissions”

This typically means the Firestore security rules deployed in Firebase do not match the rules expected by the app, or the user is not signed in correctly.

- Deploy the project’s `firestore.rules` to Firebase.
- Confirm **Authentication** providers are enabled:
  - **Anonymous** (students)
  - **Google** (teachers)

### “The query requires an index”

Some leaderboard queries require composite indexes (for example, sorting by score and speed).

- Follow the link in the Firestore error message to create the index, or create it manually in the Firestore console.

### Google sign-in errors on localhost

If you see errors like `auth/invalid-credential` after logging out/in repeatedly:

- Clear site data for `localhost`
- Retry in an incognito/private window

## Quick Links (Routes)

- `/` — Home
- `/join` — Student join
- `/play/:sessionId` — Student live play
- `/play/:sessionId/results` — Session results
- `/me` — Student profile
- `/leaderboard/global` — Global student leaderboard
- `/teacher/:sessionId` — Teacher dashboard for a session
- `/teacher/profile` — Teacher profile/tools

