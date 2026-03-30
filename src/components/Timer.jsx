import { useEffect, useState } from 'react';
import { formatSeconds } from '../utils/time.js';

export function Timer({ startedAt }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!startedAt?.toMillis) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, [startedAt, tick]);

  if (!startedAt?.toMillis) {
    return <span className="qp-timer qp-timer--idle">Waiting…</span>;
  }

  const elapsed = (Date.now() - startedAt.toMillis()) / 1000;
  return <span className="qp-timer">{formatSeconds(elapsed)}</span>;
}
