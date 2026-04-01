import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getStudent } from '../features/students/studentService.js';
import { getStudentSessionHistory } from '../utils/studentLocalHistory.js';
import { Layout } from '../components/Layout.jsx';

export function MyProfile() {
  const navigate = useNavigate();
  const { studentId, displayName, authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [sessions, setSessions] = useState([]);

  const goldCount =
    profile?.sessionMedals?.filter((m) => m.type === 'gold')?.length || 0;
  const silverCount =
    profile?.sessionMedals?.filter((m) => m.type === 'silver')?.length || 0;
  const bronzeCount =
    profile?.sessionMedals?.filter((m) => m.type === 'bronze')?.length || 0;
  const thresholdCount = profile?.medalThresholds?.length || 0;

  useEffect(() => {
    setSessions(getStudentSessionHistory());
  }, []);

  useEffect(() => {
    if (!studentId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await getStudent(studentId);
        if (!cancelled) setProfile(data);
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Could not load profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  if (authLoading) {
    return (
      <Layout title="My profile">
        <p className="qp-muted">Loading…</p>
      </Layout>
    );
  }

  if (!studentId) {
    return (
      <Layout
        title="My profile"
        subtitle="Join a session with your student ID first so we can create your profile."
        actions={
          <button type="button" className="qp-btn qp-btn--ghost" onClick={() => navigate('/join')}>
            Join a session
          </button>
        }
      >
        <p className="qp-muted">
          No student ID is stored for this device yet. After you join a session with your student ID,
          your profile will appear here.
        </p>
      </Layout>
    );
  }

  return (
    <Layout
      title="My profile"
      subtitle={`Student ID ${studentId}`}
      actions={
        <div className="qp-row">
          <button type="button" className="qp-btn qp-btn--ghost" onClick={() => navigate('/')}>
            Home
          </button>
          <button
            type="button"
            className="qp-btn qp-btn--ghost"
            onClick={() => navigate('/leaderboard/global')}
          >
            Global leaderboard
          </button>
        </div>
      }
    >
      {err ? (
        <div className="qp-banner qp-banner--error" role="alert">
          {err}
        </div>
      ) : null}

      <div className="qp-grid-2">
        <div className="qp-stack">
          <div className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
            <div className="qp-profile-header">
              <div className="qp-profile-avatar">
                <span>
                  {(displayName || profile?.displayName || 'Student')
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((p) => p[0].toUpperCase())
                    .join('')}
                </span>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>
                  {profile?.displayName || displayName || 'Student'}
                </h2>
                <p className="qp-muted" style={{ margin: '0.15rem 0 0', fontSize: '0.9rem' }}>
                  Student ID {studentId}
                </p>
              </div>
            </div>

            <div className="qp-row" style={{ marginTop: '1rem' }}>
              <div className="qp-profile-stat">
                <span className="qp-profile-stat-label">Total score</span>
                <span className="qp-profile-stat-value">
                  {profile?.totalScore != null ? profile.totalScore : '—'}
                </span>
              </div>
              <div className="qp-profile-stat">
                <span className="qp-profile-stat-label">Sessions played</span>
                <span className="qp-profile-stat-value">
                  {profile?.sessionsPlayed != null ? profile.sessionsPlayed : '—'}
                </span>
              </div>
              <div className="qp-profile-stat">
                <span className="qp-profile-stat-label">Medals</span>
                <span className="qp-profile-stat-value">
                  {profile?.medalCount != null ? profile.medalCount : 0}
                </span>
              </div>
            </div>

            <div className="qp-row" style={{ marginTop: '0.5rem' }}>
              <span className="qp-profile-medal-chip">
                Gold: <strong>{goldCount}</strong>
              </span>
              <span className="qp-profile-medal-chip">
                Silver: <strong>{silverCount}</strong>
              </span>
              <span className="qp-profile-medal-chip">
                Bronze: <strong>{bronzeCount}</strong>
              </span>
              <span className="qp-profile-medal-chip">
                Milestones: <strong>{thresholdCount}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="qp-stack">
          <div className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Recent sessions (this device)</h2>
            <p className="qp-muted" style={{ margin: 0 }}>
              These are sessions joined from this browser. Your teacher may have more history in
              their dashboard.
            </p>
            {sessions.length === 0 ? (
              <p className="qp-muted" style={{ marginTop: '0.75rem' }}>
                No sessions yet. Join a session to see it here.
              </p>
            ) : (
              <ul className="qp-previous__list" style={{ marginTop: '0.75rem' }}>
                {sessions.slice(0, 10).map((entry) => (
                  <li key={entry.sessionId} className="qp-previous__item">
                    <div>
                      <strong>{entry.title || 'Session'}</strong>
                      <span className="qp-muted" style={{ display: 'block', fontSize: '0.85rem' }}>
                        Code {entry.joinCode} · {entry.lastDisplayName ? `${entry.lastDisplayName} · ` : ''}
                        {new Date(entry.joinedAt).toLocaleString()}
                      </span>
                    </div>
                    <Link
                      to={`/play/${entry.sessionId}/results`}
                      className="qp-previous__open"
                    >
                      View results
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

