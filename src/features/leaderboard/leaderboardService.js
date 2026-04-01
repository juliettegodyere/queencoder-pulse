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

export async function joinSessionAsPlayer(sessionId, playerId, displayName, studentId) {
  const ref = doc(db, 'sessions', sessionId, 'players', playerId);
  await setDoc(
    ref,
    {
      displayName: String(displayName).trim(),
      studentId: studentId ? String(studentId).trim() : null,
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

    const startedAt = session.currentQuestionStartedAt;
    const responseTimeSeconds = startedAt ? secondsSince(startedAt) : 0;
    const points = computeScore({ isCorrect, isFirstCorrect, responseTimeSeconds });

    const prev = playerSnap.exists()
      ? playerSnap.data()
      : { totalScore: 0, correctCount: 0, totalAnswers: 0, totalResponseTimeSeconds: 0 };

    const newTotalScore = (prev.totalScore || 0) + points;
    const newTotalAnswers = (prev.totalAnswers || 0) + 1;
    const newTotalResponseTimeSeconds =
      (prev.totalResponseTimeSeconds || 0) + responseTimeSeconds;
    const incSessionsPlayed = (prev.totalAnswers || 0) === 0 && newTotalAnswers > 0;

    // Precompute student stats BEFORE any writes, using only reads above and an extra student read.
    const studentId = prev.studentId;
    let studentRef = null;
    let studentPrev = null;
    let prevStudentScore = null;
    let newStudentScore = null;
    let updatedThresholds = null;
    let newlyAwardedCount = 0;

    if (studentId) {
      studentRef = doc(db, 'students', String(studentId));
      const studentSnap = await tx.get(studentRef);
      studentPrev = studentSnap.exists()
        ? studentSnap.data()
        : { totalScore: 0, sessionsPlayed: 0, medalThresholds: [], medalCount: 0 };

      prevStudentScore = studentPrev.totalScore || 0;
      newStudentScore = prevStudentScore + points;

      const thresholds = [1000, 5000, 10000];
      const existingThresholds = new Set(studentPrev.medalThresholds || []);
      const newlyAwarded = [];
      for (const t of thresholds) {
        if (!existingThresholds.has(t) && prevStudentScore < t && newStudentScore >= t) {
          newlyAwarded.push(t);
        }
      }
      updatedThresholds = [
        ...(studentPrev.medalThresholds || []),
        ...newlyAwarded,
      ];
      newlyAwardedCount = newlyAwarded.length;
    }

    // Now perform all writes after all reads.

    if (isFirstCorrect) {
      tx.update(questionRef, { firstCorrectAwardedTo: playerId });
    }

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
    tx.set(
      playerRef,
      {
        totalScore: newTotalScore,
        correctCount: (prev.correctCount || 0) + (isCorrect ? 1 : 0),
        totalAnswers: newTotalAnswers,
        totalResponseTimeSeconds: newTotalResponseTimeSeconds,
      },
      { merge: true }
    );

    if (studentRef) {
      tx.set(
        studentRef,
        {
          totalScore: newStudentScore,
          sessionsPlayed: (studentPrev.sessionsPlayed || 0) + (incSessionsPlayed ? 1 : 0),
          medalThresholds: updatedThresholds,
          medalCount: (studentPrev.medalCount || 0) + newlyAwardedCount,
        },
        { merge: true }
      );
    }

    return {
      isCorrect,
      isFirstCorrect,
      points,
      responseTimeSeconds,
    };
  });
}
