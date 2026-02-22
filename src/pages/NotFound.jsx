import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    return (
        <div className="not-found">
            <span className="not-found-code">404</span>
            <h1>Page Not Found</h1>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="not-found-link">← Go Home</Link>
        </div>
    );
}

export default NotFound;
