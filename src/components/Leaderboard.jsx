export function Leaderboard({ ranked = [], highlightPlayerId, title = 'Live leaderboard' }) {
  return (
    <div className="qp-leaderboard qp-card">
      <h3 className="qp-leaderboard__title">{title}</h3>
      {ranked.length === 0 ? (
        <p className="qp-muted">No players yet. Share the join code.</p>
      ) : (
        <ol className="qp-leaderboard__list">
          {ranked.map((p) => (
            <li
              key={p.id}
              className={`qp-leaderboard__row ${p.id === highlightPlayerId ? 'is-me' : ''}`.trim()}
            >
              <span className="qp-leaderboard__rank">{p.rank}</span>
              <span className="qp-leaderboard__name">{p.displayName || 'Player'}</span>
              <span className="qp-leaderboard__score">{p.totalScore ?? 0} pts</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
