import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addQuestion, subscribeQuestions, subscribeResponsesForQuestion } from '../features/quiz/quizService.js';
import {
  endSession,
  publishQuestionToSession,
} from '../features/session/sessionService.js';
import { normalizeChoices, validateQuestion } from '../features/quiz/quizUtils.js';
import { QUESTION_STATE } from '../utils/constants.js';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { Textarea } from '../components/Textarea.jsx';
import { Layout } from '../components/Layout.jsx';
import { Leaderboard } from '../components/Leaderboard.jsx';
import { Timer } from '../components/Timer.jsx';
import { useLeaderboard } from '../hooks/useLeaderboard.js';
import { useSession } from '../hooks/useSession.js';
import { useAuth } from '../context/AuthContext.jsx';

const DEFAULT_CHOICES = ['', '', '', ''];

export function TeacherDashboard() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { session, loading: sLoading } = useSession(sessionId);
  const { playerId, authLoading, isAdmin, signInWithGoogle } = useAuth();
  const [questions, setQuestions] = useState([]);
  const { ranked } = useLeaderboard(sessionId);
  const [prompt, setPrompt] = useState('');
  const [choices, setChoices] = useState(DEFAULT_CHOICES);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [formError, setFormError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [responses, setResponses] = useState([]);

  const isTeacherForSession = useMemo(() => {
    if (!session || !playerId) return false;
    return session.teacherUid === playerId || isAdmin;
  }, [session, playerId, isAdmin]);

  useEffect(() => {
    if (!sessionId || !isTeacherForSession) return undefined;
    const unsub = subscribeQuestions(sessionId, setQuestions, () => {});
    return () => unsub();
  }, [sessionId, isTeacherForSession]);

  const currentQid = session?.currentQuestionId;
  useEffect(() => {
    if (!sessionId || !currentQid || !isTeacherForSession) {
      setResponses([]);
      return undefined;
    }
    const unsub = subscribeResponsesForQuestion(sessionId, currentQid, setResponses, () => {});
    return () => unsub();
  }, [sessionId, currentQid, isTeacherForSession]);

  const participation = useMemo(() => {
    const total = ranked.length;
    const answered = ranked.filter((p) => (p.totalAnswers || 0) > 0).length;
    const rate = total ? Math.round((answered / total) * 100) : 0;
    return { total, answered, rate };
  }, [ranked]);

  const addQ = async (e) => {
    e.preventDefault();
    const normalized = normalizeChoices(choices);
    const err = validateQuestion({ prompt, choices: normalized, correctIndex });
    setFormError(err);
    if (err) return;
    setBusy(true);
    try {
      await addQuestion(sessionId, {
        prompt,
        choices: normalized,
        correctIndex,
      });
      setPrompt('');
      setChoices(DEFAULT_CHOICES);
      setCorrectIndex(0);
    } catch (e2) {
      setFormError(e2?.message || 'Could not save question.');
    } finally {
      setBusy(false);
    }
  };

  const sendLive = async (qid) => {
    setBusy(true);
    try {
      await publishQuestionToSession(sessionId, qid);
    } finally {
      setBusy(false);
    }
  };

  const finish = async () => {
    if (!window.confirm('End this session for everyone?')) return;
    setBusy(true);
    try {
      await endSession(sessionId);
      navigate('/');
    } catch (e) {
      setFormError(e?.message || 'Could not end session.');
    } finally {
      setBusy(false);
    }
  };

  if (authLoading || sLoading) {
    return (
      <Layout title="Teacher desk">
        <p className="qp-muted">Verifying…</p>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout title="Session missing">
        <p className="qp-muted">Session not found.</p>
      </Layout>
    );
  }

  if (!isTeacherForSession) {
    return (
      <Layout
        title="Teacher access required"
        subtitle="Sign in with Google (your Gmail account) to create and publish questions."
        actions={
          <Button type="button" variant="ghost" onClick={() => navigate('/')}>
            Home
          </Button>
        }
      >
        <div className="qp-card qp-stack" style={{ padding: '1.5rem' }}>
          <p className="qp-muted" style={{ margin: 0 }}>
            Join code: <span className="qp-code">{session.joinCode}</span>
          </p>
          <Button
            type="button"
            onClick={async () => {
              setFormError(null);
              setBusy(true);
              try {
                await signInWithGoogle();
              } catch (e) {
                setFormError(e?.message || 'Google sign-in failed.');
              } finally {
                setBusy(false);
              }
            }}
            disabled={busy}
            style={{ marginTop: '1rem' }}
          >
            {busy ? 'Signing in…' : 'Sign in with Google'}
          </Button>
          {formError ? (
            <div className="qp-banner qp-banner--error" role="alert" style={{ marginTop: '1rem' }}>
              {formError}
            </div>
          ) : null}
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={session.title || 'Teacher desk'}
      subtitle="Share the join code with students, queue questions, then push them live."
      actions={
        <Button type="button" variant="danger" onClick={finish} disabled={busy}>
          End session
        </Button>
      }
    >
      {formError ? (
        <div className="qp-banner qp-banner--error" role="alert">
          {formError}
        </div>
      ) : null}
      <p className="qp-row" style={{ marginTop: 0 }}>
        <span className="qp-muted">Join code</span>
        <span className="qp-code">{session.joinCode}</span>
      </p>
      <p className="qp-muted" style={{ marginTop: 0 }}>
        Participation: {participation.answered}/{participation.total} students answered at least once (
        {participation.rate}%).
      </p>

      <div className="qp-grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="qp-stack">
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Compose question</h2>
          <form className="qp-card qp-stack" style={{ padding: '1.25rem' }} onSubmit={addQ}>
            <Textarea
              label="Prompt"
              name="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your question. Use multiple lines for code snippets."
              rows={10}
              monospace
            />
            {choices.map((c, i) => (
              <Input
                key={i}
                label={`Choice ${String.fromCharCode(65 + i)}`}
                name={`c${i}`}
                value={c}
                onChange={(e) => {
                  const next = [...choices];
                  next[i] = e.target.value;
                  setChoices(next);
                }}
              />
            ))}
            <label className="qp-field">
              <span className="qp-field__label">Correct answer</span>
              <select
                className="qp-input"
                value={correctIndex}
                onChange={(e) => setCorrectIndex(Number(e.target.value))}
              >
                {choices.map((_, i) => (
                  <option key={i} value={i}>
                    {String.fromCharCode(65 + i)}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" disabled={busy}>
              Save to queue
            </Button>
          </form>

          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Queue</h2>
          <ul className="qp-stack" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {questions.map((q) => (
              <li key={q.id} className="qp-card" style={{ padding: '1rem' }}>
                <div className="qp-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="qp-queue-prompt">{q.prompt}</span>
                  <span className="qp-muted" style={{ fontSize: '0.85rem' }}>
                    {q.state}
                  </span>
                </div>
                {session.currentQuestionId === q.id ? (
                  <p className="qp-row qp-muted" style={{ margin: '0.75rem 0 0', fontSize: '0.9rem' }}>
                    Live · <Timer startedAt={session.currentQuestionStartedAt} /> · {responses.length}{' '}
                    responses
                  </p>
                ) : null}
                <Button
                  type="button"
                  style={{ marginTop: '0.75rem' }}
                  disabled={
                    busy ||
                    q.state === QUESTION_STATE.ACTIVE ||
                    q.state === QUESTION_STATE.CLOSED
                  }
                  onClick={() => sendLive(q.id)}
                >
                  {q.state === QUESTION_STATE.ACTIVE
                    ? 'Currently live'
                    : q.state === QUESTION_STATE.CLOSED
                      ? 'Closed'
                      : 'Send live'}
                </Button>
              </li>
            ))}
          </ul>
          {questions.length === 0 ? <p className="qp-muted">No questions yet.</p> : null}
        </div>
        <Leaderboard ranked={ranked} title="Leaderboard" />
      </div>
    </Layout>
  );
}
