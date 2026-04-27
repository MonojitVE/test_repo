import './Button.css';

export default function Button({
  children,
  variant = 'primary',  // primary | secondary | ghost | danger
  size = 'md',          // sm | md | lg
  loading = false,
  disabled = false,
  icon = null,
  iconRight = null,
  fullWidth = false,
  onClick,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={[
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        loading ? 'btn--loading' : '',
        fullWidth ? 'btn--full' : '',
      ].join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {!loading && icon && <span className="btn__icon btn__icon--left">{icon}</span>}
      <span className="btn__label">{children}</span>
      {!loading && iconRight && <span className="btn__icon btn__icon--right">{iconRight}</span>}
    </button>
  );
}
