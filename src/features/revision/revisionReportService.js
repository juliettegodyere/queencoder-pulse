import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase.js';
import { parseTopicTagFromPrompt } from '../../utils/parseQuestionTopic.js';

export const REVISION_WRONG_THRESHOLD = 0.4;
export const REVISION_MIN_ANSWERS = 3;

function questionSortKey(q) {
  const c = q.createdAt;
  if (c && typeof c.toMillis === 'function') return c.toMillis();
  if (c && typeof c.seconds === 'number') return c.seconds * 1000;
  return 0;
}

/**
 * Loads and aggregates all revision metrics for a session. Used by the report page and Markdown export.
 */
export async function fetchRevisionReportData(sessionId) {
  const questionsRef = collection(db, 'sessions', sessionId, 'questions');
  const [questionsSnap, responsesSnap, playersSnap] = await Promise.all([
    getDocs(questionsRef),
    getDocs(collection(db, 'sessions', sessionId, 'responses')),
    getDocs(collection(db, 'sessions', sessionId, 'players')),
  ]);

  const questions = questionsSnap.docs
    .map((d) => ({
      id: d.id,
      ...d.data(),
    }))
    .sort((a, b) => questionSortKey(b) - questionSortKey(a));

  const tagByQuestionId = new Map();
  for (const q of questions) {
    tagByQuestionId.set(q.id, parseTopicTagFromPrompt(q.prompt));
  }

  const players = playersSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
  const activePlayers = players.filter((p) => p.active !== false);
  const playerById = new Map(players.map((p) => [p.id, p]));

  const responses = responsesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const playerStats = new Map();
  function ensurePlayer(pid) {
    if (!playerStats.has(pid)) {
      playerStats.set(pid, {
        total: 0,
        correct: 0,
        wrong: 0,
        totalTimeSeconds: 0,
      });
    }
    return playerStats.get(pid);
  }

  const topicStats = new Map();
  function ensureTopic(tag) {
    if (!topicStats.has(tag)) {
      topicStats.set(tag, {
        responses: 0,
        correct: 0,
        wrong: 0,
        sumTimeWrong: 0,
        wrongByPlayer: new Map(),
      });
    }
    return topicStats.get(tag);
  }

  for (const r of responses) {
    const qid = r.questionId;
    const pid = r.playerId;
    if (!qid || !pid) continue;

    const tag = tagByQuestionId.get(qid) || 'Unknown question';
    const isCorrect = r.isCorrect === true;
    const t = Number(r.responseTimeSeconds) || 0;

    const ps = ensurePlayer(pid);
    ps.total += 1;
    if (isCorrect) ps.correct += 1;
    else ps.wrong += 1;
    ps.totalTimeSeconds += t;

    const ts = ensureTopic(tag);
    ts.responses += 1;
    if (isCorrect) ts.correct += 1;
    else {
      ts.wrong += 1;
      ts.sumTimeWrong += t;
      ts.wrongByPlayer.set(pid, (ts.wrongByPlayer.get(pid) || 0) + 1);
    }
  }

  const isEmpty =
    questions.length === 0 && responses.length === 0 && players.length === 0;
  const noActivity = responses.length === 0;

  const sortedTags = [...topicStats.entries()].sort((a, b) => b[1].wrong - a[1].wrong);

  const topicAnalysis = sortedTags.map(([tag, st]) => {
    const pct = st.responses > 0 ? Math.round((st.wrong / st.responses) * 100) : 0;
    const avgWrong =
      st.wrong > 0 ? Math.round((st.sumTimeWrong / st.wrong) * 10) / 10 : null;
    return { tag, responses: st.responses, wrong: st.wrong, pctWrong: pct, avgWrong };
  });

  const flagged = [];
  for (const p of players) {
    if (p.active === false) continue;
    const st = playerStats.get(p.id);
    if (!st || st.total < REVISION_MIN_ANSWERS) continue;
    const wrongRate = st.wrong / st.total;
    if (wrongRate >= REVISION_WRONG_THRESHOLD) {
      flagged.push({
        id: p.id,
        name: p.displayName || 'Player',
        studentId: p.studentId || '—',
        total: st.total,
        wrong: st.wrong,
        wrongRate,
        avgTime:
          st.total > 0 ? Math.round((st.totalTimeSeconds / st.total) * 10) / 10 : 0,
      });
    }
  }
  flagged.sort((a, b) => b.wrongRate - a.wrongRate);

  const topicStruggles = [];
  for (const [tag, st] of sortedTags) {
    if (st.wrong === 0) continue;
    const rows = [...st.wrongByPlayer.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([pid, count]) => {
        const pl = playerById.get(pid);
        const label = pl
          ? `${pl.displayName || 'Player'} (${pl.studentId || 'no ID'})`
          : pid;
        return { playerId: pid, label, count };
      });
    topicStruggles.push({ tag, rows });
  }

  const troubleshooting = [];
  if (isEmpty) {
    troubleshooting.push(
      'This session has no questions, responses, or players in the database.'
    );
    troubleshooting.push(
      'Open the session from Home → Previous sessions that used the real join code from class.'
    );
    troubleshooting.push(
      'Confirm questions were added and students joined that same join code.'
    );
  } else if (questions.length === 0 && responses.length > 0) {
    troubleshooting.push('Responses exist but no question documents (check Firestore).');
  }
  if (noActivity && !isEmpty) {
    troubleshooting.push(
      'No answer submissions — questions may not have been sent live, or nobody answered in this session.'
    );
  }

  return {
    sessionId,
    summary: {
      questionCount: questions.length,
      responseCount: responses.length,
      playerTotal: players.length,
      playerActive: activePlayers.length,
    },
    isEmpty,
    noActivity,
    topicAnalysis,
    flaggedStudents: flagged,
    topicStruggles,
    troubleshooting,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Markdown file for download (same data as the report page).
 */
export async function buildRevisionReportMarkdown(sessionId, meta = {}) {
  const { sessionTitle = '', joinCode = '' } = meta;
  const data = await fetchRevisionReportData(sessionId);
  const { summary, isEmpty, noActivity, topicAnalysis, flaggedStudents, topicStruggles, troubleshooting } =
    data;

  const lines = [];
  lines.push(`# Revision report (auto-generated)`);
  lines.push('');
  lines.push(`- **Session:** ${sessionTitle || '(no title)'}`);
  lines.push(`- **Join code:** ${joinCode || '—'}`);
  lines.push(`- **Session ID:** \`${sessionId}\``);
  lines.push(`- **Generated:** ${data.generatedAt}`);
  lines.push('');
  lines.push(`## Summary`);
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Questions in session | ${summary.questionCount} |`);
  lines.push(`| Answer submissions | ${summary.responseCount} |`);
  lines.push(
    `| Player rows | ${summary.playerTotal} total (${summary.playerActive} active) |`
  );
  lines.push('');

  if (troubleshooting.length > 0) {
    lines.push(`## Why is this empty or incomplete?`);
    lines.push('');
    troubleshooting.forEach((t) => lines.push(`- ${t}`));
    lines.push('');
  }

  lines.push(`## Topic / area analysis`);
  lines.push('');
  lines.push(
    'Topics are taken from `[Label]` at the start of preset questions. Custom questions appear under **Custom / untagged**.'
  );
  lines.push('');

  if (topicAnalysis.length === 0) {
    lines.push('_No responses found yet — run a live quiz first._');
    lines.push('');
  } else {
    lines.push(`| Topic / area | Answers | Wrong | % wrong | Avg time (wrong only, s) |`);
    lines.push(`|--------------|---------|-------|---------|---------------------------|`);
    for (const row of topicAnalysis) {
      const avg = row.avgWrong != null ? row.avgWrong : '—';
      lines.push(
        `| ${row.tag.replace(/\|/g, '/')} | ${row.responses} | ${row.wrong} | ${row.pctWrong}% | ${avg} |`
      );
    }
    lines.push('');
    lines.push(
      '**Focus suggestion:** prioritise revision on rows with **higher % wrong** (class-wide difficulty).'
    );
    lines.push('');
  }

  lines.push(`## Students who may need more focus`);
  lines.push('');
  lines.push(
    `Listed when **wrong rate ≥ ${Math.round(REVISION_WRONG_THRESHOLD * 100)}%** among players with **≥ ${REVISION_MIN_ANSWERS}** answers (active players).`
  );
  lines.push('');

  if (flaggedStudents.length === 0) {
    lines.push(
      `_No players met the threshold (or not enough answers per player)._`
    );
    lines.push('');
  } else {
    lines.push(`| Display name | Student ID | Answers | Wrong | Wrong % | Avg time/answer (s) |`);
    lines.push(`|--------------|------------|---------|-------|---------|---------------------|`);
    for (const f of flaggedStudents) {
      lines.push(
        `| ${String(f.name).replace(/\|/g, '/')} | ${f.studentId} | ${f.total} | ${f.wrong} | ${Math.round(f.wrongRate * 100)}% | ${f.avgTime} |`
      );
    }
    lines.push('');
  }

  lines.push(`## Per-topic: who struggled (wrong answers)`);
  lines.push('');
  for (const block of topicStruggles) {
    lines.push(`### ${block.tag}`);
    lines.push('');
    for (const r of block.rows) {
      lines.push(`- **${r.label}** — ${r.count} wrong in this area`);
    }
    lines.push('');
  }

  lines.push(`---`);
  lines.push(`*Generated by Queencoder Pulse · attach this file to your manual \`REVISION_NOTES.md\` if useful.*`);
  lines.push('');

  return lines.join('\n');
}
