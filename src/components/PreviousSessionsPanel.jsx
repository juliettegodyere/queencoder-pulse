import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { listTeacherSessions } from '../features/session/sessionService.js';
import { getStudentSessionHistory } from '../utils/studentLocalHistory.js';
import { SESSION_STATUS } from '../utils/constants.js';
import { Button } from './Button.jsx';

function formatWhen(ts) {
  if (!ts?.toDate) return '';
  try {
    return ts.toDate().toLocaleString();
  } catch {
    return '';
  }
}

function formatJoined(ms) {
  if (!ms) return '';
  return new Date(ms).toLocaleString();
}

export function PreviousSessionsPanel() {
  const navigate = useNavigate();
  const { authUser, signInWithGoogle, setStudentProfile } = useAuth();
  const isGoogleUser = useMemo(
    () => authUser?.providerData?.some((p) => p.providerId === 'google.com') ?? false,
    [authUser]
  );

  const [teacherSessions, setTeacherSessions] = useState([]);
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherErr, setTeacherErr] = useState(null);
  const [busyGoogle, setBusyGoogle] = useState(false);

  const [studentSessions, setStudentSessions] = useState(() => getStudentSessionHistory());

  useEffect(() => {
    setStudentSessions(getStudentSessionHistory());
  }, []);

  useEffect(() => {
    if (!isGoogleUser || !authUser?.uid) {
      setTeacherSessions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setTeacherLoading(true);
      setTeacherErr(null);
      try {
        const rows = await listTeacherSessions(authUser.uid);
        if (!cancelled) setTeacherSessions(rows);
      } catch (e) {
        if (!cancelled) {
          setTeacherErr(e?.message || 'Could not load teacher sessions.');
        }
      } finally {
        if (!cancelled) setTeacherLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isGoogleUser, authUser?.uid]);

  const openStudentSession = (entry) => {
    const name = entry.lastDisplayName || 'Student';
    // We don't persist studentId in local history yet; pass undefined for now.
    setStudentProfile(entry.sessionId, name, undefined);
    const ended = entry.status === SESSION_STATUS.ENDED;
    navigate(ended ? `/play/${entry.sessionId}/results` : `/play/${entry.sessionId}`);
  };

  return (
    <div className="qp-previous qp-stack">
      <section className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Teacher — your sessions</h2>
        <p className="qp-muted" style={{ margin: 0 }}>
          Sessions you created while signed in with Google. Open the dashboard to review questions
          and results.
        </p>
        {!isGoogleUser ? (
          <div className="qp-row" style={{ flexWrap: 'wrap' }}>
            <Button
              type="button"
              onClick={async () => {
                setBusyGoogle(true);
                setTeacherErr(null);
                try {
                  await signInWithGoogle();
                } catch (e) {
                  setTeacherErr(e?.message || 'Google sign-in failed.');
                } finally {
                  setBusyGoogle(false);
                }
              }}
              disabled={busyGoogle}
            >
              {busyGoogle ? 'Signing in…' : 'Sign in with Google'}
            </Button>
          </div>
        ) : null}
        {teacherErr ? (
          <div className="qp-banner qp-banner--error" role="alert">
            {teacherErr}
          </div>
        ) : null}
        {isGoogleUser && teacherLoading ? (
          <p className="qp-muted" style={{ margin: 0 }}>
            Loading…
          </p>
        ) : null}
        {isGoogleUser && !teacherLoading && teacherSessions.length === 0 && !teacherErr ? (
          <p className="qp-muted" style={{ margin: 0 }}>
            No sessions yet. Start one from the Home tab.
          </p>
        ) : null}
        {isGoogleUser && teacherSessions.length > 0 ? (
          <ul className="qp-previous__list">
            {teacherSessions.map((s) => (
              <li key={s.id} className="qp-previous__item">
                <div>
                  <strong>{s.title || 'Session'}</strong>
                  <span className="qp-muted" style={{ display: 'block', fontSize: '0.85rem' }}>
                    Code {s.joinCode} · {s.status === SESSION_STATUS.ENDED ? 'Ended' : 'Open'}
                    {formatWhen(s.createdAt) ? ` · ${formatWhen(s.createdAt)}` : ''}
                  </span>
                </div>
                <Link to={`/teacher/${s.id}`} className="qp-previous__open">
                  Open
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Student — this device</h2>
        <p className="qp-muted" style={{ margin: 0 }}>
          Rooms you joined on this browser (stored locally). Open to continue or view results if the
          session ended.
        </p>
        {studentSessions.length === 0 ? (
          <p className="qp-muted" style={{ margin: 0 }}>
            No history yet. Join a session from the Home tab.
          </p>
        ) : (
          <ul className="qp-previous__list">
            {studentSessions.map((entry) => (
              <li key={entry.sessionId} className="qp-previous__item">
                <div>
                  <strong>{entry.title || 'Session'}</strong>
                  <span className="qp-muted" style={{ display: 'block', fontSize: '0.85rem' }}>
                    Code {entry.joinCode} · {entry.lastDisplayName ? `${entry.lastDisplayName} · ` : ''}
                    {formatJoined(entry.joinedAt)}
                  </span>
                  <div className="qp-previous__sub">
                    <Link to={`/join?code=${encodeURIComponent(entry.joinCode)}`}>Prefill join code</Link>
                  </div>
                </div>
                <Button type="button" variant="ghost" onClick={() => openStudentSession(entry)} style={{ width: 'auto', padding: '0.45rem 0.85rem' }}>
                  Open
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
