export function Leaderboard({ ranked = [], highlightPlayerId, title = 'Live leaderboard' }) {
  return (
    <div className="qp-leaderboard qp-card">
      <h3 className="qp-leaderboard__title">{title}</h3>
      {ranked.length === 0 ? (
        <p className="qp-muted">No players yet. Share the join code.</p>
      ) : (
        <ol className="qp-leaderboard__list">
          {ranked.map((p) => {
            const inactive = p.active === false;
            return (
            <li
              key={p.id}
              className={`qp-leaderboard__row ${p.id === highlightPlayerId ? 'is-me' : ''} ${inactive ? 'is-inactive' : ''}`.trim()}
            >
              <span className="qp-leaderboard__rank">{p.rank}</span>
              <span className="qp-leaderboard__name">
                {p.displayName || 'Player'}
                {inactive ? (
                  <span className="qp-leaderboard__badge" title="Signed out or left this session">
                    {' '}
                    · inactive
                  </span>
                ) : null}
              </span>
              <span className="qp-leaderboard__score">
                {p.totalScore ?? 0} pts
                {p.totalResponseTimeSeconds != null &&
                  ` · ${Math.round(p.totalResponseTimeSeconds)}s`}
              </span>
            </li>
          );
          })}
        </ol>
      )}
    </div>
  );
}
