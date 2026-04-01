import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Layout({ children, title, subtitle, actions }) {
  const { displayName, studentId } = useAuth();
  const initials = (displayName || 'Student')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  return (
    <div className="qp-layout">
      <header className="qp-header">
        <div className="qp-header__inner">
          <Link to="/" className="qp-logo">
            <span className="qp-logo__mark">QP</span>
            <span className="qp-logo__text">Queencoder Pulse</span>
          </Link>
          <div className="qp-header__right">
            {actions ? <div className="qp-header__actions">{actions}</div> : null}
            <Link to="/me" className="qp-profile-pill" aria-label="My profile">
              <span className="qp-profile-pill__avatar">{initials || 'S'}</span>
              <span className="qp-profile-pill__text">
                <span className="qp-profile-pill__name">
                  {displayName || 'Student'}
                </span>
                <span className="qp-profile-pill__id">
                  {studentId ? `ID ${studentId}` : 'Set ID'}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </header>
      <main className="qp-main">
        {title ? <h1 className="qp-page-title">{title}</h1> : null}
        {subtitle ? <p className="qp-page-subtitle">{subtitle}</p> : null}
        {children}
      </main>
    </div>
  );
}
