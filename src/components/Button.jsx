export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  className = '',
  ...rest
}) {
  const base = 'qp-btn';
  const variants = {
    primary: 'qp-btn--primary',
    ghost: 'qp-btn--ghost',
    danger: 'qp-btn--danger',
  };
  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${className}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
