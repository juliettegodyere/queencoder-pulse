import { useEffect, useState } from 'react';
import { subscribeSession } from '../features/session/sessionService.js';

export function useSession(sessionId) {
  const [session, setSession] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setSession(null);
      return undefined;
    }
    setError(null);
    const unsub = subscribeSession(
      sessionId,
      (data) => setSession(data ?? null),
      (err) => setError(err)
    );
    return () => unsub();
  }, [sessionId]);

  const loading = session === undefined;
  return { session, loading, error };
}
