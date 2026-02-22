import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAuthenticated = !!user;

    // Check for existing token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = authService.getToken();
            if (token) {
                try {
                    const userData = await authService.getMe();
                    setUser(userData);
                } catch (err) {
                    // Token invalid — clean up
                    authService.logout();
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        setError(null);
        try {
            const { user: userData } = await authService.login(credentials);
            setUser(userData);
            return userData;
        } catch (err) {
            const message = err.response?.data?.error?.message || 'Login failed';
            setError(message);
            throw err;
        }
    };

    const register = async (data) => {
        setError(null);
        try {
            const { user: userData } = await authService.register(data);
            setUser(userData);
            return userData;
        } catch (err) {
            const message = err.response?.data?.error?.message || 'Registration failed';
            setError(message);
            throw err;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        error,
        login,
        register,
        logout,
        setError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
