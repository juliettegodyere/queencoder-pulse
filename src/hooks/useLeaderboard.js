import { useEffect, useMemo, useState } from 'react';
import { subscribePlayers } from '../features/leaderboard/leaderboardService.js';
import { rankPlayers, sortLeaderboard } from '../features/leaderboard/leaderboardUtils.js';

export function useLeaderboard(sessionId) {
  const [players, setPlayers] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setPlayers(null);
      return undefined;
    }
    setError(null);
    const unsub = subscribePlayers(
      sessionId,
      (list) => setPlayers(list),
      (err) => setError(err)
    );
    return () => unsub();
  }, [sessionId]);

  const ranked = useMemo(() => {
    const list = players || [];
    return rankPlayers(sortLeaderboard(list));
  }, [players]);

  const loading = players === undefined;
  return { players: players || [], ranked, loading, error };
}
