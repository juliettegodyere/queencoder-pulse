export function Textarea({
  label,
  id,
  className = '',
  error,
  monospace = false,
  rows = 6,
  ...rest
}) {
  const inputId = id || rest.name;
  return (
    <label className={`qp-field ${className}`.trim()} htmlFor={inputId}>
      {label ? <span className="qp-field__label">{label}</span> : null}
      <textarea
        id={inputId}
        rows={rows}
        spellCheck="true"
        className={`qp-textarea ${monospace ? 'qp-textarea--code' : ''} ${error ? 'qp-input--error' : ''}`.trim()}
        {...rest}
      />
      {error ? <span className="qp-field__error">{error}</span> : null}
    </label>
  );
}
