export default function Field({ label, id, error, hint, icon, className = '', ...inputProps }) {
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}
      {icon ? (
        <div className="field__input-wrap">
          <span className="field__icon" aria-hidden="true">
            {icon}
          </span>
          <input
            id={id}
            className="field__input field__input--icon"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            {...inputProps}
          />
        </div>
      ) : (
        <input
          id={id}
          className="field__input"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
      )}
      {error ? (
        <span className="field__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : (
        hint && <span className="field__error">{hint}</span>
      )}
    </div>
  )
}
