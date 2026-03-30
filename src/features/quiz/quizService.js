import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../services/firebase.js';
import { QUESTION_STATE } from '../../utils/constants.js';

export async function addQuestion(sessionId, { prompt, choices, correctIndex }) {
  const questionsRef = collection(db, 'sessions', sessionId, 'questions');
  const ref = await addDoc(questionsRef, {
    prompt: String(prompt).trim(),
    choices,
    correctIndex,
    state: QUESTION_STATE.DRAFT,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeQuestions(sessionId, onData, onError) {
  const q = query(
    collection(db, 'sessions', sessionId, 'questions'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
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

export function subscribeQuestion(sessionId, questionId, onData, onError) {
  if (!questionId) {
    onData(null);
    return () => {};
  }
  const ref = doc(db, 'sessions', sessionId, 'questions', questionId);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData({ id: snap.id, ...snap.data() });
    },
    onError
  );
}

export function subscribeResponsesForQuestion(sessionId, questionId, onData, onError) {
  const q = query(
    collection(db, 'sessions', sessionId, 'responses'),
    orderBy('submittedAt', 'asc')
  );
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((r) => r.questionId === questionId);
      onData(rows);
    },
    onError
  );
}
