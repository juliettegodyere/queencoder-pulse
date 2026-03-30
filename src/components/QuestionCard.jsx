import { Button } from './Button.jsx';

export function QuestionCard({
  prompt,
  choices = [],
  selectedIndex,
  onSelect,
  disabled,
  showCorrect,
  correctIndex,
}) {
  return (
    <div className="qp-question qp-card">
      <h2 className="qp-question__prompt">{prompt}</h2>
      <ul className="qp-question__choices">
        {choices.map((text, i) => {
          let state = '';
          if (showCorrect) {
            if (i === correctIndex) state = 'is-correct';
            else if (i === selectedIndex && i !== correctIndex) state = 'is-wrong';
          } else if (i === selectedIndex) state = 'is-selected';
          return (
            <li key={i}>
              <Button
                type="button"
                variant="ghost"
                className={`qp-choice ${state}`.trim()}
                disabled={disabled}
                onClick={() => onSelect?.(i)}
              >
                <span className="qp-choice__idx">{String.fromCharCode(65 + i)}</span>
                <span className="qp-choice__text">{text}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
