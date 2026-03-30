import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Layout } from '../components/Layout.jsx';
import { Leaderboard } from '../components/Leaderboard.jsx';
import { Button } from '../components/Button.jsx';
import { useLeaderboard } from '../hooks/useLeaderboard.js';
import { useSession } from '../hooks/useSession.js';

export function Results() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { playerId, activeSessionId, authLoading } = useAuth();
  const { session, loading } = useSession(sessionId);
  const { ranked, players } = useLeaderboard(sessionId);

  useEffect(() => {
    if (!sessionId || !activeSessionId || activeSessionId !== sessionId) {
      navigate('/join', { replace: true });
    }
  }, [sessionId, activeSessionId, navigate]);

  const stats = useMemo(() => {
    const total = players.length;
    const withAnswers = players.filter((p) => (p.totalAnswers || 0) > 0).length;
    const avgAccuracy =
      total > 0
        ? Math.round(
            (players.reduce((acc, p) => {
              const a = p.totalAnswers || 0;
              const c = p.correctCount || 0;
              return acc + (a ? c / a : 0);
            }, 0) /
              total) *
              100
          )
        : 0;
    return {
      total,
      withAnswers,
      participationRate: total ? Math.round((withAnswers / total) * 100) : 0,
      avgAccuracy,
    };
  }, [players]);

  if (loading || authLoading || !playerId) {
    return (
      <Layout title="Results">
        <p className="qp-muted">Loading…</p>
      </Layout>
    );
  }

  return (
    <Layout
      title="Session results"
      subtitle={session ? `Join code ${session.joinCode}` : 'Performance snapshot'}
      actions={
        <Button type="button" variant="ghost" onClick={() => navigate(`/play/${sessionId}`)}>
          Back to live
        </Button>
      }
    >
      <div className="qp-grid-2">
        <div className="qp-stack">
          <div className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Cohort stats</h2>
            <ul className="qp-muted" style={{ margin: 0, paddingLeft: '1.1rem' }}>
              <li>Players: {stats.total}</li>
              <li>Participation: {stats.participationRate}% answered at least once</li>
              <li>Approx. avg accuracy: {stats.avgAccuracy}% (correct ÷ attempts, averaged per player)</li>
            </ul>
          </div>
          <p className="qp-muted" style={{ margin: 0 }}>
            Data tracked: participation, accuracy, response timing, and scores feed the leaderboard in
            real time.
          </p>
          <Link to="/" style={{ color: 'var(--qp-accent)' }}>
            Start another session (teacher)
          </Link>
        </div>
        <Leaderboard ranked={ranked} highlightPlayerId={playerId} title="Final standings" />
      </div>
    </Layout>
  );
}
