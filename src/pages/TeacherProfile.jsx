import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Layout } from '../components/Layout.jsx';

export function TeacherProfile() {
  const navigate = useNavigate();
  const { authUser, authLoading, isTeacher, isAdmin, logoutEverywhere } = useAuth();

  if (authLoading) {
    return (
      <Layout title="Teacher profile">
        <p className="qp-muted">Loading…</p>
      </Layout>
    );
  }

  if (!authUser || !isTeacher) {
    return (
      <Layout
        title="Teacher profile"
        subtitle="Sign in with your Google account to access teacher tools."
        actions={
          <button
            type="button"
            className="qp-btn qp-btn--ghost"
            onClick={() => navigate('/')}
          >
            Home
          </button>
        }
      >
        <p className="qp-muted">
          This area is for teachers using their Google account. If you are a
          student, your profile is available from the student header pill instead.
        </p>
      </Layout>
    );
  }

  const name = authUser.displayName || 'Teacher';
  const email = authUser.email || 'Google account';

  return (
    <Layout
      title="Teacher profile"
      subtitle={email}
      actions={
        <div className="qp-row">
          <button
            type="button"
            className="qp-btn qp-btn--ghost"
            onClick={() => navigate('/')}
          >
            Start / manage sessions
          </button>
          <button
            type="button"
            className="qp-btn qp-btn--ghost"
            onClick={() => navigate('/leaderboard/global')}
          >
            Global leaderboard
          </button>
          <button
            type="button"
            className="qp-btn qp-btn--ghost"
            onClick={async () => {
              await logoutEverywhere();
              navigate('/', { replace: true });
            }}
          >
            Log out on this device
          </button>
        </div>
      }
    >
      <div className="qp-grid-2">
        <div className="qp-stack">
          <div className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
            <div className="qp-profile-header">
              <div className="qp-profile-avatar">
                <span>
                  {(name || 'T')
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((p) => p[0].toUpperCase())
                    .join('')}
                </span>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{name}</h2>
                <p className="qp-muted" style={{ margin: '0.15rem 0 0', fontSize: '0.9rem' }}>
                  {email}
                </p>
                {isAdmin ? (
                  <p className="qp-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                    Admin access enabled (can manage all sessions and students).
                  </p>
                ) : (
                  <p className="qp-muted" style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                    Teacher access (can manage your own sessions).
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="qp-stack">
          <div className="qp-card qp-stack" style={{ padding: '1.25rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Teacher tools</h2>
            <p className="qp-muted" style={{ margin: '0.35rem 0 0' }}>
              Use these links to explore performance across your classroom.
            </p>
            <ul className="qp-previous__list" style={{ marginTop: '0.75rem' }}>
              <li className="qp-previous__item">
                <div>
                  <strong>Global leaderboard</strong>
                  <span className="qp-muted" style={{ display: 'block', fontSize: '0.85rem' }}>
                    View top students across all sessions.
                  </span>
                </div>
                <Link to="/leaderboard/global" className="qp-previous__open">
                  Open
                </Link>
              </li>
              <li className="qp-previous__item">
                <div>
                  <strong>Your sessions</strong>
                  <span className="qp-muted" style={{ display: 'block', fontSize: '0.85rem' }}>
                    Go to the home page to browse and reopen sessions you have run.
                  </span>
                </div>
                <button
                  type="button"
                  className="qp-previous__open"
                  onClick={() => navigate('/?tab=previous')}
                >
                  View
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

