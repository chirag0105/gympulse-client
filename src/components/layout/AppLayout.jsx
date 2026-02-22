import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './AppLayout.css';

const PAGE_TITLES = {
    '/pt/dashboard': 'Dashboard',
    '/pt/clients': 'My Clients',
    '/pt/workouts': 'Workouts',
    '/pt/exercises': 'Exercise Library',
    '/dashboard': 'Dashboard',
    '/workouts': 'My Workouts',
    '/progress': 'Progress',
    '/measurements': 'Measurements',
    '/admin': 'Admin Dashboard',
    '/admin/trainers': 'Personal Trainers',
    '/admin/clients': 'Clients',
    '/admin/exercises': 'Exercises',
    '/admin/settings': 'Settings',
};

function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const title = PAGE_TITLES[location.pathname] || 'GymPulse';

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <div className="app-main">
                <Topbar title={title} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
