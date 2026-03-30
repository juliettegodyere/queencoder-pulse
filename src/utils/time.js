export function secondsSince(timestamp) {
  if (!timestamp?.toMillis) return 0;
  return (Date.now() - timestamp.toMillis()) / 1000;
}

export function formatSeconds(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}:${String(r).padStart(2, '0')}` : `${r}s`;
}
