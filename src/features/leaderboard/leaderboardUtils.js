export function sortLeaderboard(players) {
  return [...players].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;

    // Tie-breaker 1: more correct answers
    if ((b.correctCount || 0) !== (a.correctCount || 0)) {
      return (b.correctCount || 0) - (a.correctCount || 0);
    }

    // Tie-breaker 2: faster total response time
    const aTime = a.totalResponseTimeSeconds || 0;
    const bTime = b.totalResponseTimeSeconds || 0;
    if (aTime !== bTime) return aTime - bTime;

    // Final tie-breaker: alphabetical name
    return String(a.displayName).localeCompare(String(b.displayName));
  });
}

export function rankPlayers(sorted) {
  return sorted.map((p, i) => ({ ...p, rank: i + 1 }));
}
