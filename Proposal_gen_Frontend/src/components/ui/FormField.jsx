import './FormField.css';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  hint = '',
  error = '',
  as = 'input',   // input | textarea | select
  options = [],   // [{ label, value }] for select
  rows = 4,
}) {
  const handleChange = (e) => onChange(name, e.target.value);

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label className="field__label" htmlFor={name}>
        {label}
        {required && <span className="field__required" aria-hidden="true">*</span>}
      </label>

      {as === 'textarea' && (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className="field__control field__control--textarea"
          required={required}
        />
      )}

      {as === 'select' && (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className="field__control field__control--select"
        >
          <option value="">— Select —</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {as === 'input' && (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="field__control"
          required={required}
        />
      )}

      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && <p className="field__error-msg">{error}</p>}
    </div>
  );
}
