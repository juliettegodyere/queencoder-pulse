import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { findSessionByJoinCode } from '../features/session/sessionService.js';
import { joinSessionAsPlayer } from '../features/leaderboard/leaderboardService.js';
import { linkAuthUserToStudent, normalizeStudentId } from '../features/students/studentService.js';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { Layout } from '../components/Layout.jsx';
import { SESSION_STATUS } from '../utils/constants.js';
import {
  getDisplayNameSuggestions,
  recordStudentSessionEntry,
  rememberDisplayName,
} from '../utils/studentLocalHistory.js';

export function StudentJoin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { playerId, setStudentProfile, authLoading, studentId: storedStudentId } = useAuth();
  const [code, setCode] = useState(() => searchParams.get('code')?.toUpperCase() || '');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState(() => storedStudentId || '');
  const nameSuggestions = useMemo(() => getDisplayNameSuggestions(), []);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const normalizedId = normalizeStudentId(studentId);
      if (!normalizedId) {
        setErr('Enter your student ID.');
        return;
      }
      const session = await findSessionByJoinCode(code);
      if (!session) {
        setErr('No session found for that code.');
        return;
      }
      if (session.status === SESSION_STATUS.ENDED) {
        setErr('This session has ended.');
        return;
      }
      const displayName = name.trim() || 'Student';
      // Link auth user to a persistent student profile.
      await linkAuthUserToStudent({
        studentId: normalizedId,
        uid: playerId,
        displayName,
      });

      await joinSessionAsPlayer(session.id, playerId, displayName, normalizedId);
      rememberDisplayName(displayName);
      recordStudentSessionEntry({
        sessionId: session.id,
        joinCode: session.joinCode,
        title: session.title,
        displayName,
        status: session.status,
      });
      setStudentProfile(session.id, displayName, normalizedId);
      navigate(`/play/${session.id}`);
    } catch (e2) {
      setErr(e2?.message || 'Could not join.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout
      title="Join session"
      subtitle="Enter the code your teacher shared and pick a display name."
      actions={
        <Button type="button" variant="ghost" onClick={() => navigate('/')}>
          Home
        </Button>
      }
    >
      {authLoading || !playerId ? (
        <p className="qp-muted" style={{ marginTop: 0 }}>
          Signing you in…
        </p>
      ) : null}
      {err ? (
        <div className="qp-banner qp-banner--error" role="alert">
          {err}
        </div>
      ) : null}
      <form className="qp-card qp-stack" style={{ padding: '1.5rem', maxWidth: '420px' }} onSubmit={onSubmit}>
        <Input
          label="Join code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. ABC12X"
          autoComplete="off"
          required
        />
        <Input
          label="Student ID"
          name="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="e.g. 24-CS-005"
          autoComplete="off"
          required
        />
        <label className="qp-field" htmlFor="join-name">
          <span className="qp-field__label">Display name</span>
          <input
            id="join-name"
            name="name"
            className="qp-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name or ID"
            autoComplete="off"
            list="qp-name-suggestions"
          />
          <datalist id="qp-name-suggestions">
            {nameSuggestions.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </label>
        <Button type="submit" disabled={busy || !playerId || authLoading}>
          {busy ? 'Joining…' : 'Enter room'}
        </Button>
      </form>
    </Layout>
  );
}
