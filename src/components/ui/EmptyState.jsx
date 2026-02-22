import Button from './Button';
import './EmptyState.css';

function EmptyState({ icon = '📭', title, description, actionLabel, onAction, className = '' }) {
    return (
        <div className={`empty-state ${className}`}>
            <span className="empty-state-icon">{icon}</span>
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-desc">{description}</p>}
            {actionLabel && onAction && (
                <Button variant="primary" size="sm" onClick={onAction}>{actionLabel}</Button>
            )}
        </div>
    );
}

export default EmptyState;
