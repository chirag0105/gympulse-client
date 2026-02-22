import React from 'react';
import { Card } from '../components/ui';
import WeeklyCalendar from '../components/calendar/WeeklyCalendar';
import './DashboardPlaceholder.css';

function ClientDashboard() {
    return (
        <div className="dashboard">
            <div className="dashboard-welcome">
                <h2>Welcome Back! 🏃</h2>
                <p>Ready for your next workout?</p>
            </div>
            <div className="dashboard-grid">
                <Card variant="glass">
                    <Card.Body>
                        <div className="stat-card">
                            <span className="stat-icon">📅</span>
                            <div className="stat-info">
                                <span className="stat-value">0</span>
                                <span className="stat-label">Workouts Today</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <Card variant="glass">
                    <Card.Body>
                        <div className="stat-card">
                            <span className="stat-icon">🔥</span>
                            <div className="stat-info">
                                <span className="stat-value">0</span>
                                <span className="stat-label">Day Streak</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <Card variant="glass">
                    <Card.Body>
                        <div className="stat-card">
                            <span className="stat-icon">⚡</span>
                            <div className="stat-info">
                                <span className="stat-value">0 kg</span>
                                <span className="stat-label">Total Lifted</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <Card variant="glass">
                    <Card.Body>
                        <div className="stat-card">
                            <span className="stat-icon">✅</span>
                            <div className="stat-info">
                                <span className="stat-value">0</span>
                                <span className="stat-label">Completed</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <WeeklyCalendar role="client" />
            </div>
        </div>
    );
}

export default ClientDashboard;
