import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../services/firebase.js';
import { computeScore } from '../../utils/scoring.js';
import { secondsSince } from '../../utils/time.js';

export async function joinSessionAsPlayer(sessionId, playerId, displayName) {
  const ref = doc(db, 'sessions', sessionId, 'players', playerId);
  await setDoc(
    ref,
    {
      displayName: String(displayName).trim(),
      totalScore: 0,
      correctCount: 0,
      totalAnswers: 0,
      joinedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function subscribePlayers(sessionId, onData, onError) {
  const col = collection(db, 'sessions', sessionId, 'players');
  return onSnapshot(
    col,
    (snap) => {
      onData(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    },
    onError
  );
}

function responseDocId(playerId, questionId) {
  return `${playerId}_${questionId}`;
}

export async function submitAnswer({
  sessionId,
  questionId,
  playerId,
  choiceIndex,
}) {
  const sessionRef = doc(db, 'sessions', sessionId);
  const questionRef = doc(db, 'sessions', sessionId, 'questions', questionId);
  const responseRef = doc(
    db,
    'sessions',
    sessionId,
    'responses',
    responseDocId(playerId, questionId)
  );
  const playerRef = doc(db, 'sessions', sessionId, 'players', playerId);

  return runTransaction(db, async (tx) => {
    const [existing, sessionSnap, questionSnap, playerSnap] = await Promise.all([
      tx.get(responseRef),
      tx.get(sessionRef),
      tx.get(questionRef),
      tx.get(playerRef),
    ]);

    if (existing.exists()) {
      throw new Error('You already answered this question.');
    }
    if (!sessionSnap.exists() || !questionSnap.exists()) {
      throw new Error('Session or question not found.');
    }

    const session = sessionSnap.data();
    if (session.currentQuestionId !== questionId) {
      throw new Error('That question is not active.');
    }

    const q = questionSnap.data();
    const isCorrect = choiceIndex === q.correctIndex;
    const firstTaken = q.firstCorrectAwardedTo != null && q.firstCorrectAwardedTo !== '';
    const isFirstCorrect = isCorrect && !firstTaken;

    if (isFirstCorrect) {
      tx.update(questionRef, { firstCorrectAwardedTo: playerId });
    }

    const startedAt = session.currentQuestionStartedAt;
    const responseTimeSeconds = startedAt ? secondsSince(startedAt) : 0;
    const points = computeScore({ isCorrect, isFirstCorrect, responseTimeSeconds });

    tx.set(responseRef, {
      questionId,
      playerId,
      choiceIndex,
      isCorrect,
      isFirstCorrect,
      responseTimeSeconds,
      points,
      submittedAt: serverTimestamp(),
    });

    const prev = playerSnap.exists()
      ? playerSnap.data()
      : { totalScore: 0, correctCount: 0, totalAnswers: 0 };

    tx.set(
      playerRef,
      {
        totalScore: (prev.totalScore || 0) + points,
        correctCount: (prev.correctCount || 0) + (isCorrect ? 1 : 0),
        totalAnswers: (prev.totalAnswers || 0) + 1,
      },
      { merge: true }
    );

    return {
      isCorrect,
      isFirstCorrect,
      points,
      responseTimeSeconds,
    };
  });
}
