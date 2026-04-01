import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSession } from '../features/session/sessionService.js';
import { Button } from '../components/Button.jsx';
import { Layout } from '../components/Layout.jsx';
import { PreviousSessionsPanel } from '../components/PreviousSessionsPanel.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithGoogle } = useAuth();
  const [tab, setTab] = useState(() =>
    searchParams.get('tab') === 'previous' ? 'previous' : 'home'
  );

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'previous') setTab('previous');
  }, [searchParams]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const startTeacher = async () => {
    setErr(null);
    setBusy(true);
    try {
      const teacherUid = await signInWithGoogle();
      const { sessionId, teacherToken } = await createSession({
        title: 'Coding session',
        teacherUid,
      });
      navigate(`/teacher/${sessionId}?t=${encodeURIComponent(teacherToken)}`);
    } catch (e) {
      setErr(e?.message || 'Could not create session. Check Firebase config.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout
      title="Live classroom pulse"
      subtitle="Send questions in real time, score answers with speed and first-correct bonuses, and keep a live leaderboard for your cohort."
    >
      <div className="qp-tabs" role="tablist" aria-label="Main">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'home'}
          className={tab === 'home' ? 'is-active' : ''}
          onClick={() => setTab('home')}
        >
          Home
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'previous'}
          className={tab === 'previous' ? 'is-active' : ''}
          onClick={() => setTab('previous')}
        >
          Previous sessions
        </button>
      </div>

      {tab === 'previous' ? (
        <PreviousSessionsPanel />
      ) : (
        <>
          {err ? (
            <div className="qp-banner qp-banner--error" role="alert">
              {err}
            </div>
          ) : null}
          <div className="qp-grid-2">
            <div className="qp-card qp-stack" style={{ padding: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Teacher</h2>
              <p className="qp-muted" style={{ margin: 0 }}>
                Create a session, share the join code, build questions, and push them live to every
                connected student.
              </p>
              <Button type="button" onClick={startTeacher} disabled={busy}>
                {busy ? 'Starting…' : 'Start a session'}
              </Button>
            </div>
            <div className="qp-card qp-stack" style={{ padding: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Student</h2>
              <p className="qp-muted" style={{ margin: 0 }}>
                Join with the code from your instructor, answer live questions, and climb the
                leaderboard.
              </p>
              <Button type="button" onClick={() => navigate('/join')}>
                Join a session
              </Button>
            </div>
          </div>
          <section style={{ marginTop: '2.5rem' }} className="qp-muted">
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
              <strong style={{ color: 'var(--qp-text)' }}>Scoring:</strong> +10 correct · +5 first
              correct · +3 if under 5 seconds.
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              When scores are tied, rankings and medals are decided by{' '}
              <strong>total answer time</strong> — faster students place higher.
            </p>
          </section>
        </>
      )}
    </Layout>
  );
}
