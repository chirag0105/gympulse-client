import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RoleRoute({ roles, children }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    // Super admin can access everything
    if (user.role === 'super_admin') return children;

    if (!roles.includes(user.role)) {
        // Redirect to their own dashboard
        const dashboards = { pt: '/pt/dashboard', client: '/dashboard' };
        return <Navigate to={dashboards[user.role] || '/'} replace />;
    }

    return children;
}

export default RoleRoute;
