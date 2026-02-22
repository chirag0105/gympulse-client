import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, useToast, Modal, Spinner } from '../ui';
import { getSchedules, getWorkouts, scheduleWorkout, deleteSchedule } from '../../services/api';

const WeeklyCalendar = ({ role, clientId }) => {
    const { showToast } = useToast();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    // Manage Schedule Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [loadingWorkouts, setLoadingWorkouts] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Get Start (Monday) and End (Sunday) of current week
    const weekBoundaries = useMemo(() => {
        const start = new Date(currentDate);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    }, [currentDate]);

    // Array of Date objects for the 7 days
    const weekDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekBoundaries.start);
            d.setDate(weekBoundaries.start.getDate() + i);
            days.push(d);
        }
        return days;
    }, [weekBoundaries]);

    useEffect(() => {
        if (!clientId && role === 'pt') return; // For PT, clientId should be provided to view the cal
        fetchSchedules();
    }, [weekBoundaries, clientId]);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const params = {
                startDate: weekBoundaries.start.toISOString().split('T')[0],
                endDate: weekBoundaries.end.toISOString().split('T')[0]
            };
            if (role === 'pt' && clientId) {
                params.clientId = clientId;
            }

            const res = await getSchedules(params);
            if (res.success) {
                setSchedules(res.data);
            }
        } catch (err) {
            showToast('Failed to load schedules', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePrevWeek = () => {
        setCurrentDate(prev => {
            const next = new Date(prev);
            next.setDate(prev.getDate() - 7);
            return next;
        });
    };

    const handleNextWeek = () => {
        setCurrentDate(prev => {
            const next = new Date(prev);
            next.setDate(prev.getDate() + 7);
            return next;
        });
    };

    const handleSlotClick = async (date) => {
        if (role !== 'pt') return; // Only PTs can schedule by clicking
        setSelectedDate(date);
        setIsModalOpen(true);
        if (workouts.length === 0) {
            setLoadingWorkouts(true);
            try {
                const res = await getWorkouts();
                if (res.success) {
                    setWorkouts(res.data);
                }
            } catch (err) {
                showToast('Failed to load workouts', 'error');
            } finally {
                setLoadingWorkouts(false);
            }
        }
    };

    const handleScheduleWorkout = async (workoutId) => {
        setSubmitting(true);
        try {
            const scheduledString = selectedDate.toISOString().split('T')[0];
            const payload = {
                clientId,
                workoutId,
                scheduledDate: scheduledString
            };
            const res = await scheduleWorkout(payload);
            if (res.success) {
                showToast('Workout scheduled successfully', 'success');
                setIsModalOpen(false);
                fetchSchedules();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                showToast(err.response.data.message, 'error');
            } else {
                showToast('Failed to schedule workout', 'error');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleUnassign = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to remove this assignment?")) return;
        try {
            const res = await deleteSchedule(id);
            if (res.success) {
                showToast('Schedule removed', 'success');
                fetchSchedules();
            }
        } catch (err) {
            showToast('Failed to remove schedule', 'error');
        }
    };

    const getMonthYearString = () => {
        return weekBoundaries.start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    };

    return (
        <Card style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Weekly Calendar</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Button variant="secondary" onClick={handlePrevWeek}>&larr; Prev Week</Button>
                    <span style={{ fontWeight: 'bold' }}>{getMonthYearString()}</span>
                    <Button variant="secondary" onClick={handleNextWeek}>Next Week &rarr;</Button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}><Spinner /></div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                    {weekDays.map((day, i) => {
                        const dateString = day.toISOString().split('T')[0];
                        const dayTasks = schedules.filter(s => s.scheduledDate === dateString);
                        const isToday = new Date().toISOString().split('T')[0] === dateString;

                        return (
                            <div
                                key={i}
                                style={{
                                    border: `1px solid ${isToday ? '#0ea5e9' : '#e2e8f0'}`,
                                    borderRadius: '8px',
                                    minHeight: '150px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: role === 'pt' ? 'pointer' : 'default',
                                    backgroundColor: isToday ? '#f0f9ff' : '#fff'
                                }}
                                onClick={() => handleSlotClick(day)}
                            >
                                <div style={{
                                    padding: '0.5rem',
                                    borderBottom: `1px solid ${isToday ? '#bae6fd' : '#e2e8f0'}`,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    backgroundColor: isToday ? '#e0f2fe' : '#f8fafc',
                                    borderTopLeftRadius: '7px',
                                    borderTopRightRadius: '7px'
                                }}>
                                    {day.toLocaleDateString(undefined, { weekday: 'short' })}<br />
                                    <span style={{ fontSize: '1.2rem' }}>{day.getDate()}</span>
                                </div>
                                <div style={{ padding: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {dayTasks.map(task => (
                                        <div
                                            key={task.id}
                                            style={{
                                                backgroundColor: '#e0f2fe',
                                                padding: '0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.25rem',
                                                cursor: role === 'client' ? 'pointer' : 'default'
                                            }}
                                            onClick={(e) => {
                                                if (role === 'client') {
                                                    e.stopPropagation();
                                                    window.location.href = `/workouts/${task.id}/start`;
                                                }
                                            }}
                                        >
                                            <strong style={{ color: '#0369a1' }}>{task.Workout ? task.Workout.name : 'Workout'}</strong>
                                            <Badge variant={
                                                task.status === 'completed' ? 'success' :
                                                    task.status === 'in_progress' ? 'warning' : 'primary'
                                            } style={{ alignSelf: 'flex-start', fontSize: '0.7rem' }}>
                                                {task.status.replace('_', ' ')}
                                            </Badge>

                                            {role === 'pt' && (
                                                <button
                                                    onClick={(e) => handleUnassign(task.id, e)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#dc2626',
                                                        fontSize: '0.75rem',
                                                        cursor: 'pointer',
                                                        alignSelf: 'flex-end',
                                                        marginTop: '0.25rem'
                                                    }}
                                                >
                                                    Unassign
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {role === 'pt' && dayTasks.length === 0 && (
                                        <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem' }}>
                                            + Add
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Schedule Workout (${selectedDate ? selectedDate.toLocaleDateString() : ''})`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                    {loadingWorkouts ? (
                        <div style={{ textAlign: 'center' }}><Spinner /></div>
                    ) : workouts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666' }}>No workouts found. Create plans first.</p>
                    ) : (
                        workouts.map(w => (
                            <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #eee', borderRadius: '4px' }}>
                                <div>
                                    <strong style={{ display: 'block' }}>{w.name}</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>{w.exercises ? w.exercises.length : 0} exercises</span>
                                </div>
                                <Button
                                    size="small"
                                    onClick={() => handleScheduleWorkout(w.id)}
                                    disabled={submitting}
                                >
                                    Assign
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </Card>
    );
};

export default WeeklyCalendar;
