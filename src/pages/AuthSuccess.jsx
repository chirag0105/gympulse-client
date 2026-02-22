import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui';

function AuthSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); // If AuthContext has a login trigger, otherwise we grab user directly

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');

        if (token) {
            // Usually AuthContext handles saving this
            localStorage.setItem('token', token);
            // Quick brute force reload to trigger the app's initial user fetch (getMe)
            window.location.href = '/dashboard';
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner />
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Authenticating...</p>
        </div>
    );
}

export default AuthSuccess;
