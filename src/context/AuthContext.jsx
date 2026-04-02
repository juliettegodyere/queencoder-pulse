import { createContext, useCallback, useContext, useMemo, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  getIdTokenResult,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../services/firebase.js';
import { clearStudentLocalDeviceData } from '../utils/studentLocalHistory.js';
import { markPlayerInactive } from '../features/leaderboard/leaderboardService.js';

const AuthContext = createContext(null);

const STORAGE_DISPLAY_NAME = 'qp_display_name';
const STORAGE_ACTIVE_SESSION_ID = 'qp_session_id';
const STORAGE_STUDENT_ID = 'qp_student_id';

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [displayName, setDisplayName] = useState(
    () => localStorage.getItem(STORAGE_DISPLAY_NAME) || ''
  );
  const [activeSessionId, setActiveSessionId] = useState(
    () => localStorage.getItem(STORAGE_ACTIVE_SESSION_ID) || null
  );
  const [studentId, setStudentId] = useState(
    () => localStorage.getItem(STORAGE_STUDENT_ID) || ''
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Only auto-create an anonymous identity when the device already has student context.
  // This prevents creating anonymous users for casual visitors, while still restoring access
  // for returning students.
  useEffect(() => {
    if (authLoading) return;
    if (authUser) return;
    if (!studentId && !activeSessionId) return;
    signInAnonymously(auth).catch(() => {});
  }, [authLoading, authUser, studentId, activeSessionId]);

  const refreshAdminFlag = useCallback(async (user) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    try {
      const result = await getIdTokenResult(user, true);
      const claims = result?.claims || {};
      const roleClaim = claims.role;
      const adminClaim = claims.admin;
      setIsAdmin(roleClaim === 'admin' || adminClaim === true);
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (!authUser) return;
    refreshAdminFlag(authUser);
  }, [authUser, refreshAdminFlag]);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await refreshAdminFlag(result.user);
    return result.user.uid;
  }, [refreshAdminFlag]);

  const setStudentProfile = useCallback((sessionId, name, sid) => {
    const trimmed = String(name || '').trim();
    setDisplayName(trimmed);
    setActiveSessionId(sessionId);
    if (trimmed) localStorage.setItem(STORAGE_DISPLAY_NAME, trimmed);
    localStorage.setItem(STORAGE_ACTIVE_SESSION_ID, sessionId);
    if (sid) {
      const normalized = String(sid || '').trim();
      setStudentId(normalized);
      if (normalized) localStorage.setItem(STORAGE_STUDENT_ID, normalized);
    }
  }, []);

  const clearStudentSession = useCallback(() => {
    setActiveSessionId(null);
    localStorage.removeItem(STORAGE_ACTIVE_SESSION_ID);
  }, []);

  const ensureStudentAuth = useCallback(async () => {
    // Reuse any existing Firebase Auth identity (teacher or anonymous).
    if (auth.currentUser) return auth.currentUser.uid;
    const result = await signInAnonymously(auth);
    return result.user.uid;
  }, []);

  const logoutEverywhere = useCallback(async () => {
    try {
      const uid = auth.currentUser?.uid;
      const sessionId = activeSessionId;
      if (sessionId && uid) {
        try {
          await markPlayerInactive(sessionId, uid);
        } catch {
          // still sign out locally if Firestore write fails
        }
      }
      await signOut(auth);
    } catch {
      // ignore sign-out errors; we still clear local state
    } finally {
      setAuthUser(null);
      setIsAdmin(false);
      setDisplayName('');
      setActiveSessionId(null);
      setStudentId('');
      localStorage.removeItem(STORAGE_DISPLAY_NAME);
      localStorage.removeItem(STORAGE_ACTIVE_SESSION_ID);
      localStorage.removeItem(STORAGE_STUDENT_ID);
      // Join history + name suggestions live in separate keys; clear them on logout.
      clearStudentLocalDeviceData();
    }
  }, [activeSessionId]);

  const value = useMemo(
    () => ({
      authUser,
      authLoading,
      playerId: authUser?.uid || null,
      isTeacher: !!authUser && !authUser.isAnonymous,
      displayName,
      setDisplayName,
      activeSessionId,
      studentId,
      isAdmin,
      signInWithGoogle,
      setStudentProfile,
      clearStudentSession,
      ensureStudentAuth,
      logoutEverywhere,
    }),
    [
      authUser,
      authLoading,
      displayName,
      activeSessionId,
      studentId,
      isAdmin,
      signInWithGoogle,
      setStudentProfile,
      clearStudentSession,
      ensureStudentAuth,
      logoutEverywhere,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
