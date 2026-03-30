import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuiz } from '../context/QuizContext.jsx';
import { submitAnswer } from '../features/leaderboard/leaderboardService.js';
import { subscribeResponsesForQuestion } from '../features/quiz/quizService.js';
import { QUESTION_STATE, SESSION_STATUS } from '../utils/constants.js';
import { Button } from '../components/Button.jsx';
import { Layout } from '../components/Layout.jsx';
import { Leaderboard } from '../components/Leaderboard.jsx';
import { QuestionCard } from '../components/QuestionCard.jsx';
import { Timer } from '../components/Timer.jsx';
import { useActiveQuestion } from '../hooks/useQuestions.js';
import { useLeaderboard } from '../hooks/useLeaderboard.js';
import { useSession } from '../hooks/useSession.js';

export function QuizSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { playerId, displayName, activeSessionId, authLoading } = useAuth();
  const { setLastResult } = useQuiz();
  const { session, loading: sLoading } = useSession(sessionId);
  const { ranked } = useLeaderboard(sessionId);
  const qid = session?.currentQuestionId;
  const { question, loading: qLoading } = useActiveQuestion(sessionId, qid);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    if (!sessionId || !activeSessionId || activeSessionId !== sessionId) {
      navigate('/join', { replace: true });
    }
  }, [sessionId, activeSessionId, navigate]);

  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
    setFeedback(null);
  }, [qid]);

  useEffect(() => {
    if (!sessionId || !qid) {
      setResponseCount(0);
      return undefined;
    }
    const unsub = subscribeResponsesForQuestion(
      sessionId,
      qid,
      (rows) => setResponseCount(rows.length),
      () => {}
    );
    return () => unsub();
  }, [sessionId, qid]);

  useEffect(() => {
    if (!session || session.status !== SESSION_STATUS.ENDED) return;
    navigate(`/play/${sessionId}/results`, { replace: true });
  }, [session, sessionId, navigate]);

  const onSubmit = async () => {
    if (selected == null || !qid || submitted) return;
    if (!playerId || authLoading) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const result = await submitAnswer({
        sessionId,
        questionId: qid,
        playerId,
        choiceIndex: selected,
      });
      setSubmitted(true);
      setLastResult(result);
      setFeedback({
        ok: true,
        text: result.isCorrect
          ? `Correct · +${result.points} pts${result.isFirstCorrect ? ' (first correct bonus)' : ''}${result.responseTimeSeconds < 5 ? ' · speed bonus' : ''}`
          : 'Not quite — wait for the next question.',
      });
    } catch (e) {
      setFeedback({ ok: false, text: e?.message || 'Could not submit.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !playerId || sLoading || qLoading) {
    return (
      <Layout title="Live quiz">
        <p className="qp-muted">Loading session…</p>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout title="Session missing">
        <p className="qp-muted">This session could not be loaded.</p>
        <Link to="/join">Back to join</Link>
      </Layout>
    );
  }

  const active =
    question && question.state === QUESTION_STATE.ACTIVE && session.currentQuestionId === question.id;

  return (
    <Layout
      title={`Hello, ${displayName || 'student'}`}
      subtitle={`Join code ${session.joinCode} · ${responseCount} answer${responseCount === 1 ? '' : 's'} on this question`}
      actions={
        <Button type="button" variant="ghost" onClick={() => navigate(`/play/${sessionId}/results`)}>
          Results
        </Button>
      }
    >
      {feedback ? (
        <div
          className={`qp-banner ${feedback.ok ? 'qp-banner--success' : 'qp-banner--error'}`}
          role="status"
        >
          {feedback.text}
        </div>
      ) : null}
      <div className="qp-grid-2">
        <div className="qp-stack">
          {!qid || !active ? (
            <div className="qp-card qp-stack" style={{ padding: '1.5rem' }}>
              <p className="qp-muted" style={{ margin: 0 }}>
                Waiting for the teacher to send a question…
              </p>
              <p style={{ margin: 0 }} className="qp-row">
                <span className="qp-muted">Timer:</span> <Timer startedAt={session.currentQuestionStartedAt} />
              </p>
            </div>
          ) : (
            <>
              <p className="qp-row" style={{ margin: 0 }}>
                <span className="qp-muted">Time on question:</span>{' '}
                <Timer startedAt={session.currentQuestionStartedAt} />
              </p>
              <QuestionCard
                prompt={question.prompt}
                choices={question.choices}
                selectedIndex={selected}
                onSelect={submitted ? undefined : setSelected}
                disabled={submitted}
                showCorrect={submitted}
                correctIndex={question.correctIndex}
              />
              <Button
                type="button"
                onClick={onSubmit}
                disabled={selected == null || submitted || submitting}
              >
                {submitted ? 'Answer locked in' : submitting ? 'Submitting…' : 'Submit answer'}
              </Button>
            </>
          )}
        </div>
        <Leaderboard ranked={ranked} highlightPlayerId={playerId} />
      </div>
    </Layout>
  );
}
