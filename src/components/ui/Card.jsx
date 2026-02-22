import './Card.css';

function Card({ children, variant = 'default', hover = false, className = '', onClick, ...props }) {
    return (
        <div
            className={`card card-${variant} ${hover ? 'card-hover' : ''} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            {...props}
        >
            {children}
        </div>
    );
}

function CardHeader({ children, className = '' }) {
    return <div className={`card-header ${className}`}>{children}</div>;
}

function CardBody({ children, className = '' }) {
    return <div className={`card-body ${className}`}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
    return <div className={`card-footer ${className}`}>{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
