import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { listTopStudents } from '../features/leaderboard/studentsLeaderboardService.js';
import { Layout } from '../components/Layout.jsx';
import { Leaderboard } from '../components/Leaderboard.jsx';

export function GlobalLeaderboard() {
  const { playerId } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const rows = await listTopStudents(50);
        if (!cancelled) setStudents(rows);
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Could not load leaderboard.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ranked = useMemo(
    () =>
      students.map((s, index) => ({
        id: s.studentId || s.id,
        displayName: s.displayName || s.studentId || 'Student',
        totalScore: s.totalScore || 0,
        totalResponseTimeSeconds: s.totalResponseTimeSeconds ?? null,
        rank: index + 1,
      })),
    [students]
  );

  if (loading) {
    return (
      <Layout title="Global leaderboard">
        <p className="qp-muted">Loading…</p>
      </Layout>
    );
  }

  return (
    <Layout
      title="Global leaderboard"
      subtitle="Cumulative scores across all sessions for all registered students."
    >
      {err ? (
        <div className="qp-banner qp-banner--error" role="alert">
          {err}
        </div>
      ) : null}
      <Leaderboard ranked={ranked} highlightPlayerId={playerId} title="Top students" />
    </Layout>
  );
}

