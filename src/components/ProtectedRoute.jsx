import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui';

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <Spinner fullPage />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

export default ProtectedRoute;
