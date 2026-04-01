import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Layout({ children, title, subtitle, actions }) {
  const { displayName, studentId, authUser, isTeacher, authLoading } = useAuth();

  const hasTeacherIdentity = !!authUser && !authUser.isAnonymous;
  const hasStudentIdentity = !!studentId;
  const showProfilePill = !authLoading && (hasTeacherIdentity || hasStudentIdentity);

  const isTeacherView = hasTeacherIdentity && isTeacher;
  const name = isTeacherView
    ? authUser?.displayName || 'Teacher'
    : displayName || 'My profile';
  const secondaryLabel = isTeacherView
    ? authUser?.email || 'Teacher account'
    : hasStudentIdentity
      ? `ID ${studentId}`
      : '';
  const initials = (name || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
  const profileHref = isTeacherView ? '/teacher/profile' : '/me';

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
            {showProfilePill ? (
              <Link to={profileHref} className="qp-profile-pill" aria-label="My profile">
                <span className="qp-profile-pill__avatar">{initials || 'U'}</span>
                <span className="qp-profile-pill__text">
                  <span className="qp-profile-pill__name">
                    {name}
                  </span>
                  {secondaryLabel ? (
                    <span className="qp-profile-pill__id">
                      {secondaryLabel}
                    </span>
                  ) : null}
                </span>
              </Link>
            ) : null}
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
