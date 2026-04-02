const STORAGE_SESSIONS = 'qp_student_sessions';
const STORAGE_NAMES = 'qp_display_name_history';

/** Clears join history and display-name suggestions stored on this device only. */
export function clearStudentLocalDeviceData() {
  try {
    localStorage.removeItem(STORAGE_SESSIONS);
    localStorage.removeItem(STORAGE_NAMES);
  } catch {
    // ignore
  }
}
const MAX_SESSIONS = 50;
const MAX_NAMES = 25;

function readSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSessions(list) {
  localStorage.setItem(STORAGE_SESSIONS, JSON.stringify(list.slice(0, MAX_SESSIONS)));
}

/**
 * @param {{ sessionId: string, joinCode: string, title?: string, displayName: string, status?: string }} entry
 */
export function recordStudentSessionEntry({ sessionId, joinCode, title, displayName, status }) {
  const list = readSessions();
  const idx = list.findIndex((x) => x.sessionId === sessionId);
  const next = {
    sessionId,
    joinCode: String(joinCode || '').toUpperCase(),
    title: title || 'Session',
    joinedAt: Date.now(),
    lastDisplayName: String(displayName || '').trim() || 'Student',
    status: status || 'open',
  };
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...next };
  } else {
    list.unshift(next);
  }
  list.sort((a, b) => (b.joinedAt || 0) - (a.joinedAt || 0));
  writeSessions(list);
}

export function getStudentSessionHistory() {
  return readSessions();
}

export function rememberDisplayName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return;
  let names = [];
  try {
    const raw = localStorage.getItem(STORAGE_NAMES);
    names = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(names)) names = [];
  } catch {
    names = [];
  }
  const lower = trimmed.toLowerCase();
  names = [trimmed, ...names.filter((n) => String(n).toLowerCase() !== lower)];
  localStorage.setItem(STORAGE_NAMES, JSON.stringify(names.slice(0, MAX_NAMES)));
}

export function getDisplayNameSuggestions() {
  try {
    const raw = localStorage.getItem(STORAGE_NAMES);
    if (!raw) return [];
    const names = JSON.parse(raw);
    return Array.isArray(names) ? names : [];
  } catch {
    return [];
  }
}
