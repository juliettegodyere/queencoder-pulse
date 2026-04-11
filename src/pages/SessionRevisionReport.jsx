import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout.jsx';
import { Button } from '../components/Button.jsx';
import { useSession } from '../hooks/useSession.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  REVISION_MIN_ANSWERS,
  REVISION_WRONG_THRESHOLD,
  buildRevisionReportMarkdown,
  fetchRevisionReportData,
} from '../features/revision/revisionReportService.js';

export function SessionRevisionReport() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { session, loading: sLoading } = useSession(sessionId);
  const { playerId, authLoading, isAdmin, signInWithGoogle } = useAuth();
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [signInError, setSignInError] = useState(null);

  const isTeacherForSession = useMemo(() => {
    if (!session || !playerId) return false;
    return session.teacherUid === playerId || isAdmin;
  }, [session, playerId, isAdmin]);

  useEffect(() => {
    if (!sessionId || !isTeacherForSession) return undefined;
    let cancelled = false;
    setFetchError(null);
    fetchRevisionReportData(sessionId)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setFetchError(e?.message || 'Could not load revision data.');
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId, isTeacherForSession]);

  const downloadRevisionReport = async () => {
    if (!sessionId) return;
    setDownloadError(null);
    setBusy(true);
    try {
      const md = await buildRevisionReportMarkdown(sessionId, {
        sessionTitle: session?.title,
        joinCode: session?.joinCode,
      });
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safe = String(session?.joinCode || sessionId.slice(0, 8)).replace(/[^a-zA-Z0-9-_]/g, '');
      a.download = `pulse-revision-${safe}.md`;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e2) {
      setDownloadError(e2?.message || 'Could not build revision report.');
    } finally {
      setBusy(false);
    }
  };

  if (authLoading || sLoading) {
    return (
      <Layout title="Revision & report">
        <p className="qp-muted">Verifying…</p>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout title="Session missing">
        <p className="qp-muted">Session not found.</p>
        <Link to="/" className="qp-btn qp-btn--ghost" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Home
        </Link>
      </Layout>
    );
  }

  if (!isTeacherForSession) {
    return (
      <Layout
        title="Teacher access required"
        subtitle="Sign in with Google to view this session’s revision report."
        actions={
          <Button type="button" variant="ghost" onClick={() => navigate('/')}>
            Home
          </Button>
        }
      >
        <div className="qp-card qp-stack" style={{ padding: '1.5rem' }}>
          <p className="qp-muted" style={{ margin: 0 }}>
            Join code: <span className="qp-code">{session.joinCode}</span>
          </p>
          <Button
            type="button"
            onClick={async () => {
              setSignInError(null);
              setBusy(true);
              try {
                await signInWithGoogle();
              } catch (e) {
                setSignInError(e?.message || 'Google sign-in failed.');
              } finally {
                setBusy(false);
              }
            }}
            disabled={busy}
            style={{ marginTop: '1rem' }}
          >
            {busy ? 'Signing in…' : 'Sign in with Google'}
          </Button>
          {signInError ? (
            <div className="qp-banner qp-banner--error" role="alert" style={{ marginTop: '1rem' }}>
              {signInError}
            </div>
          ) : null}
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Revision & report"
      subtitle={
        session.title
          ? `${session.title} · join ${session.joinCode}`
          : `Join ${session.joinCode}`
      }
      actions={
        <div className="qp-row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <Link to={`/teacher/${sessionId}`} className="qp-btn qp-btn--ghost">
            Teacher desk
          </Link>
          <Button type="button" variant="primary" disabled={busy} onClick={downloadRevisionReport}>
            {busy ? 'Working…' : 'Download .md'}
          </Button>
        </div>
      }
    >
      {downloadError ? (
        <div className="qp-banner qp-banner--error" role="alert">
          {downloadError}
        </div>
      ) : null}
      {fetchError ? (
        <div className="qp-banner qp-banner--error" role="alert">
          {fetchError}
        </div>
      ) : null}

      <section className="qp-card qp-stack" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Curriculum revision guides</h2>
        <p className="qp-muted" style={{ margin: 0 }}>
          Syllabus-wide priorities (where classes often need more time) — same sections as this page.
          Pair with your session data above.
        </p>
        <div className="qp-row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <Link to="/teacher/revision-notes/pulse" className="qp-btn qp-btn--ghost">
            Scratch &amp; computational thinking
          </Link>
          <Link to="/teacher/revision-notes/python" className="qp-btn qp-btn--ghost">
            Python introduction
          </Link>
        </div>
      </section>

      {!data ? (
        <p className="qp-muted">Loading report…</p>
      ) : (
        <div className="qp-revision qp-stack">
          <p className="qp-muted" style={{ margin: 0 }}>
            Generated {new Date(data.generatedAt).toLocaleString()} · Session ID{' '}
            <code style={{ fontSize: '0.85em' }}>{data.sessionId}</code>
          </p>

          <section className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
            <h2 className="qp-revision__h2">Summary</h2>
            <div className="qp-revision__table-wrap">
              <table className="qp-revision__table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Questions in session</td>
                    <td>{data.summary.questionCount}</td>
                  </tr>
                  <tr>
                    <td>Answer submissions</td>
                    <td>{data.summary.responseCount}</td>
                  </tr>
                  <tr>
                    <td>Player rows</td>
                    <td>
                      {data.summary.playerTotal} total ({data.summary.playerActive} active)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {data.troubleshooting.length > 0 ? (
            <section className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
              <h2 className="qp-revision__h2">Why is this empty or incomplete?</h2>
              <ul className="qp-revision__list">
                {data.troubleshooting.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
            <h2 className="qp-revision__h2">Topic / area analysis</h2>
            <p className="qp-muted" style={{ margin: 0 }}>
              Topics come from <code>[Label]</code> at the start of preset questions. Custom questions
              appear under <strong>Custom / untagged</strong>.
            </p>
            {data.topicAnalysis.length === 0 ? (
              <p className="qp-muted" style={{ margin: 0 }}>
                No responses found yet — run a live quiz first.
              </p>
            ) : (
              <>
                <div className="qp-revision__table-wrap">
                  <table className="qp-revision__table">
                    <thead>
                      <tr>
                        <th>Topic / area</th>
                        <th>Answers</th>
                        <th>Wrong</th>
                        <th>% wrong</th>
                        <th>Avg time (wrong, s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topicAnalysis.map((row) => (
                        <tr key={row.tag}>
                          <td>{row.tag}</td>
                          <td>{row.responses}</td>
                          <td>{row.wrong}</td>
                          <td>{row.pctWrong}%</td>
                          <td>{row.avgWrong != null ? row.avgWrong : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="qp-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
                  <strong>Focus:</strong> prioritise revision on rows with higher % wrong (class-wide
                  difficulty).
                </p>
              </>
            )}
          </section>

          <section className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
            <h2 className="qp-revision__h2">Students who may need more focus</h2>
            <p className="qp-muted" style={{ margin: 0 }}>
              Wrong rate ≥ {Math.round(REVISION_WRONG_THRESHOLD * 100)}% with at least{' '}
              {REVISION_MIN_ANSWERS} answers (active players).
            </p>
            {data.flaggedStudents.length === 0 ? (
              <p className="qp-muted" style={{ margin: 0 }}>
                No players met the threshold (or not enough answers per player).
              </p>
            ) : (
              <div className="qp-revision__table-wrap">
                <table className="qp-revision__table">
                  <thead>
                    <tr>
                      <th>Display name</th>
                      <th>Student ID</th>
                      <th>Answers</th>
                      <th>Wrong</th>
                      <th>Wrong %</th>
                      <th>Avg time/answer (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.flaggedStudents.map((f) => (
                      <tr key={f.id}>
                        <td>{f.name}</td>
                        <td>{f.studentId}</td>
                        <td>{f.total}</td>
                        <td>{f.wrong}</td>
                        <td>{Math.round(f.wrongRate * 100)}%</td>
                        <td>{f.avgTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
            <h2 className="qp-revision__h2">Per-topic: who struggled (wrong answers)</h2>
            {data.topicStruggles.length === 0 ? (
              <p className="qp-muted" style={{ margin: 0 }}>No wrong answers by topic yet.</p>
            ) : (
              data.topicStruggles.map((block) => (
                <div key={block.tag} className="qp-stack" style={{ marginTop: '0.75rem' }}>
                  <h3 className="qp-revision__h3">{block.tag}</h3>
                  <ul className="qp-revision__list">
                    {block.rows.map((r) => (
                      <li key={r.playerId}>
                        <strong>{r.label}</strong> — {r.count} wrong in this area
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </section>
        </div>
      )}
    </Layout>
  );
}
