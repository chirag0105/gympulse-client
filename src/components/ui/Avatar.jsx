import './Avatar.css';
function Avatar({ src, name, size = 'md', status, className = '' }) {
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
    return (
        <div className={`avatar avatar-${size} ${className}`}>
            {src ? <img src={src} alt={name} className="avatar-img" /> : <span className="avatar-initials">{initials}</span>}
            {status && <span className={`avatar-status avatar-status-${status}`} />}
        </div>
    );
}
export default Avatar;
