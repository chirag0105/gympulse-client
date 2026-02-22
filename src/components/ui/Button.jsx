import './Button.css';

function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    type = 'button',
    onClick,
    ...props
}) {
    return (
        <button
            type={type}
            className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${className}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <span className="btn-spinner"></span>}
            <span className={loading ? 'btn-text-hidden' : ''}>{children}</span>
        </button>
    );
}

export default Button;
