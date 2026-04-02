import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../services/firebase.js';

const STUDENTS_COLLECTION = 'students';

/**
 * One canonical form per student so `@test` and `test` map to the same profile and player row.
 * Trims whitespace and strips a single leading `@` (common handle-style IDs).
 */
export function normalizeStudentId(raw) {
  let s = String(raw || '').trim();
  if (!s) return '';
  if (s.startsWith('@')) s = s.slice(1).trim();
  return s;
}

export async function getStudent(studentId) {
  const id = normalizeStudentId(studentId);
  if (!id) return null;
  const ref = doc(db, STUDENTS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Create or update a student profile document and link it to the current auth uid.
 * This is intentionally forgiving: if a studentId already exists, we merge displayName and track lastSeenAt.
 */
export async function linkAuthUserToStudent({ studentId, uid, displayName }) {
  const id = normalizeStudentId(studentId);
  if (!id) {
    throw new Error('Student ID is required.');
  }
  if (!uid) {
    throw new Error('Missing signed-in user id.');
  }

  const ref = doc(db, STUDENTS_COLLECTION, id);
  const snap = await getDoc(ref);

  const trimmedName = String(displayName || '').trim() || 'Student';

  if (!snap.exists()) {
    const now = serverTimestamp();
    await setDoc(ref, {
      studentId: id,
      displayName: trimmedName,
      primaryUid: uid,
      uids: [uid],
      totalScore: 0,
      sessionsPlayed: 0,
      createdAt: now,
      updatedAt: now,
      lastSeenAt: now,
    });
    return {
      id,
      studentId: id,
      displayName: trimmedName,
      primaryUid: uid,
      totalScore: 0,
      sessionsPlayed: 0,
    };
  }

  const data = snap.data();
  const uids = Array.isArray(data.uids) ? data.uids : [];
  if (!uids.includes(uid)) {
    uids.push(uid);
  }

  await setDoc(
    ref,
    {
      displayName: trimmedName,
      primaryUid: data.primaryUid || uid,
      uids,
      updatedAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
    },
    { merge: true }
  );

  return {
    id,
    ...data,
    displayName: trimmedName,
  };
}

