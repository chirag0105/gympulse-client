import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui';
import './Sidebar.css';

const NAV_ITEMS = {
    pt: [
        { path: '/pt/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/pt/clients', icon: '👥', label: 'My Clients' },
        { path: '/pt/workouts', icon: '🏋️', label: 'Workouts' },
        { path: '/exercises', icon: '💪', label: 'Exercise Library' },
    ],
    client: [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/workouts', icon: '🏋️', label: 'My Workouts' },
        { path: '/progress', icon: '📈', label: 'Progress' },
        { path: '/measurements', icon: '📏', label: 'Measurements' },
    ],
    super_admin: [
        { path: '/admin', icon: '📊', label: 'Dashboard' },
        { path: '/admin/trainers', icon: '🏋️', label: 'Personal Trainers' },
        { path: '/admin/clients', icon: '👥', label: 'Clients' },
        { path: '/exercises', icon: '💪', label: 'Exercises' },
        { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
    ],
};

function Sidebar({ isOpen, onToggle }) {
    const { user, logout } = useAuth();
    const items = NAV_ITEMS[user?.role] || [];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-logo">💪</span>
                    <span className="sidebar-brand">GymPulse</span>
                </div>

                <nav className="sidebar-nav">
                    {items.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                            onClick={() => window.innerWidth < 768 && onToggle()}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <Avatar name={`${user?.firstName} ${user?.lastName}`} size="sm" />
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{user?.firstName} {user?.lastName}</span>
                            <span className="sidebar-user-role">{user?.role === 'pt' ? 'Personal Trainer' : user?.role === 'super_admin' ? 'Admin' : 'Client'}</span>
                        </div>
                    </div>
                    <button className="sidebar-logout" onClick={logout} title="Logout">
                        🚪
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
