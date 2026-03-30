export function sortLeaderboard(players) {
  return [...players].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
    return String(a.displayName).localeCompare(String(b.displayName));
  });
}

export function rankPlayers(sorted) {
  return sorted.map((p, i) => ({ ...p, rank: i + 1 }));
}
