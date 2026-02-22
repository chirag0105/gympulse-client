import './Input.css';

function Input({
    label,
    type = 'text',
    error,
    helperText,
    className = '',
    id,
    ...props
}) {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    if (type === 'textarea') {
        return (
            <div className={`input-group ${error ? 'input-error' : ''} ${className}`}>
                {label && <label htmlFor={inputId}>{label}</label>}
                <textarea id={inputId} className="input-field textarea" {...props} />
                {error && <span className="input-error-text">{error}</span>}
                {helperText && !error && <span className="input-helper">{helperText}</span>}
            </div>
        );
    }

    if (type === 'select') {
        return (
            <div className={`input-group ${error ? 'input-error' : ''} ${className}`}>
                {label && <label htmlFor={inputId}>{label}</label>}
                <select id={inputId} className="input-field select" {...props} />
                {error && <span className="input-error-text">{error}</span>}
                {helperText && !error && <span className="input-helper">{helperText}</span>}
            </div>
        );
    }

    return (
        <div className={`input-group ${error ? 'input-error' : ''} ${className}`}>
            {label && <label htmlFor={inputId}>{label}</label>}
            <input id={inputId} type={type} className="input-field" {...props} />
            {error && <span className="input-error-text">{error}</span>}
            {helperText && !error && <span className="input-helper">{helperText}</span>}
        </div>
    );
}

export default Input;
