export function Input({ label, id, className = '', error, ...rest }) {
  const inputId = id || rest.name;
  return (
    <label className={`qp-field ${className}`.trim()} htmlFor={inputId}>
      {label ? <span className="qp-field__label">{label}</span> : null}
      <input id={inputId} className={`qp-input ${error ? 'qp-input--error' : ''}`.trim()} {...rest} />
      {error ? <span className="qp-field__error">{error}</span> : null}
    </label>
  );
}
