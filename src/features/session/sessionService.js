import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../services/firebase.js';
import { QUESTION_STATE, SESSION_STATUS } from '../../utils/constants.js';
import { generateJoinCode, randomToken } from './sessionUtils.js';

export async function createSession({ title = 'Live session', teacherUid } = {}) {
  const joinCode = generateJoinCode();
  const teacherToken = randomToken(32);
  const ref = await addDoc(collection(db, 'sessions'), {
    title,
    joinCode,
    teacherToken,
    teacherUid: teacherUid || null,
    status: SESSION_STATUS.OPEN,
    currentQuestionId: null,
    currentQuestionStartedAt: null,
    createdAt: serverTimestamp(),
  });
  return { sessionId: ref.id, joinCode, teacherToken };
}

export async function listTeacherSessions(teacherUid, max = 50) {
  if (!teacherUid) return [];
  // Equality-only query (no composite index). Sort by createdAt in memory.
  const q = query(collection(db, 'sessions'), where('teacherUid', '==', teacherUid));
  const snap = await getDocs(q);
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  rows.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return rows.slice(0, max);
}

export async function findSessionByJoinCode(joinCode) {
  const normalized = String(joinCode).trim().toUpperCase();
  const q = query(collection(db, 'sessions'), where('joinCode', '==', normalized));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export function subscribeSession(sessionId, onData, onError) {
  const ref = doc(db, 'sessions', sessionId);
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

export async function verifyTeacherToken(sessionId, teacherToken) {
  const snap = await getDoc(doc(db, 'sessions', sessionId));
  if (!snap.exists()) return false;
  return snap.data().teacherToken === teacherToken;
}

export async function endSession(sessionId) {
  await updateDoc(doc(db, 'sessions', sessionId), {
    status: SESSION_STATUS.ENDED,
    currentQuestionId: null,
    currentQuestionStartedAt: null,
  });
}

export async function publishQuestionToSession(sessionId, questionId) {
  const sessionRef = doc(db, 'sessions', sessionId);
  const newQRef = doc(db, 'sessions', sessionId, 'questions', questionId);
  const sessionSnap = await getDoc(sessionRef);
  const prevId = sessionSnap.data()?.currentQuestionId;

  const batch = writeBatch(db);
  if (prevId && prevId !== questionId) {
    batch.update(doc(db, 'sessions', sessionId, 'questions', prevId), {
      state: QUESTION_STATE.CLOSED,
    });
  }
  batch.update(newQRef, { state: QUESTION_STATE.ACTIVE });
  batch.update(sessionRef, {
    currentQuestionId: questionId,
    currentQuestionStartedAt: serverTimestamp(),
  });
  await batch.commit();
}
