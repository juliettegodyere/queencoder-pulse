import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Layout } from '../components/Layout.jsx';
import pulseGuideMd from '../content/revision/pulseGuide.md?raw';
import pythonGuideMd from '../content/revision/pythonGuide.md?raw';

const GUIDES = {
  pulse: {
    title: 'Revision guide — Scratch & Pulse',
    subtitle: 'Lecture notes · use with your session’s Revision & report',
    markdown: pulseGuideMd,
  },
  python: {
    title: 'Revision guide — Python introduction',
    subtitle: 'Lecture notes · use with your session’s Revision & report',
    markdown: pythonGuideMd,
  },
};

const mdComponents = {
  h2: ({ children }) => <h2 className="qp-revision-guide__h2">{children}</h2>,
  h3: ({ children }) => <h3 className="qp-revision-guide__h3">{children}</h3>,
  p: ({ children }) => <p className="qp-revision-guide__p">{children}</p>,
  ul: ({ children }) => <ul className="qp-revision-guide__list">{children}</ul>,
  li: ({ children }) => <li className="qp-revision-guide__li">{children}</li>,
  hr: () => <hr className="qp-revision-guide__hr" />,
  strong: ({ children }) => <strong className="qp-revision-guide__strong">{children}</strong>,
  table: ({ children }) => (
    <div className="qp-revision__table-wrap">
      <table className="qp-revision__table qp-revision-guide__table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th>{children}</th>,
  td: ({ children }) => <td>{children}</td>,
  code: ({ children }) => <code className="qp-revision-guide__code">{children}</code>,
};

export function CurriculumRevisionGuide() {
  const { track } = useParams();
  const config = GUIDES[track];

  if (!config) {
    return (
      <Layout title="Guide not found">
        <p className="qp-muted">No revision guide for “{track}”. Use pulse or python.</p>
        <Link to="/" className="qp-btn qp-btn--ghost" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Home
        </Link>
      </Layout>
    );
  }

  return (
    <Layout
      title={config.title}
      subtitle={config.subtitle}
      actions={
        <div className="qp-row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          {track !== 'pulse' ? (
            <Link to="/teacher/revision-notes/pulse" className="qp-btn qp-btn--ghost">
              Scratch guide
            </Link>
          ) : null}
          {track !== 'python' ? (
            <Link to="/teacher/revision-notes/python" className="qp-btn qp-btn--ghost">
              Python guide
            </Link>
          ) : null}
          <Link to="/" className="qp-btn qp-btn--ghost">
            Home
          </Link>
        </div>
      }
    >
      <article className="qp-revision-guide">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {config.markdown}
        </ReactMarkdown>
      </article>
    </Layout>
  );
}
