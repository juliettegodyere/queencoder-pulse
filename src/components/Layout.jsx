import { Link } from 'react-router-dom';

export function Layout({ children, title, subtitle, actions }) {
  return (
    <div className="qp-layout">
      <header className="qp-header">
        <div className="qp-header__inner">
          <Link to="/" className="qp-logo">
            <span className="qp-logo__mark">QP</span>
            <span className="qp-logo__text">Queencoder Pulse</span>
          </Link>
          {actions ? <div className="qp-header__actions">{actions}</div> : null}
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
