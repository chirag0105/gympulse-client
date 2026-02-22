import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui';
import { getNotifications, markNotificationRead } from '../../services/api';
import './Topbar.css';

function Topbar({ title, onMenuToggle }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            if (res.success) {
                setNotifications(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            const res = await markNotificationRead(id);
            if (res.success) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="topbar-menu" onClick={onMenuToggle} aria-label="Toggle menu">
                    ☰
                </button>
                <h1 className="topbar-title">{title}</h1>
            </div>
            <div className="topbar-right">
                <div className="topbar-notif-container" ref={dropdownRef}>
                    <button
                        className="topbar-notif"
                        onClick={() => setShowDropdown(!showDropdown)}
                        title="Notifications"
                    >
                        🔔
                        {unreadCount > 0 && <span className="topbar-notif-badge">{unreadCount}</span>}
                    </button>
                    {showDropdown && (
                        <div className="notif-dropdown">
                            <h4 className="notif-header">Notifications</h4>
                            <div className="notif-list">
                                {notifications.length === 0 ? (
                                    <div className="notif-empty">No notifications yet.</div>
                                ) : (
                                    notifications.map(n => (
                                        <div
                                            key={n.id}
                                            className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                                            onClick={(e) => !n.isRead && handleMarkAsRead(n.id, e)}
                                        >
                                            <p className="notif-title">{n.title}</p>
                                            <p className="notif-message">{n.message}</p>
                                            <span className="notif-time">{new Date(n.createdAt).toLocaleString()}</span>
                                            {!n.isRead && <div className="notif-dot"></div>}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="topbar-user">
                    <Avatar name={`${user?.firstName} ${user?.lastName}`} size="sm" />
                    <span className="topbar-user-name">{user?.firstName}</span>
                </div>
            </div>
        </header>
    );
}

export default Topbar;
