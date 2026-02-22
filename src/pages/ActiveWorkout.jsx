import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    startWorkoutSession,
    getWorkoutSession,
    updateExerciseLog,
    finishWorkoutSession
} from '../services/api';
import { Card, Button, Input, useToast, Spinner, Modal } from '../components/ui';

function ActiveWorkout() {
    const { scheduledId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [workoutLog, setWorkoutLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [finishing, setFinishing] = useState(false);

    // Timer
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    // Summary Model
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        initSession();
    }, [scheduledId]);

    useEffect(() => {
        let interval = null;
        if (workoutLog && !summary) {
            // Re-calculate based on start time so it's accurate even if component re-renders
            const startTimestamp = new Date(workoutLog.startedAt).getTime();

            interval = setInterval(() => {
                const now = new Date().getTime();
                setElapsedSeconds(Math.floor((now - startTimestamp) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [workoutLog, summary]);

    const initSession = async () => {
        setLoading(true);
        try {
            // See if already started
            let res = await getWorkoutSession(scheduledId);
            if (!res.success) throw new Error();
            setWorkoutLog(res.data);
        } catch (err) {
            // Not started yet, attempt to start
            try {
                const startRes = await startWorkoutSession(scheduledId);
                if (startRes.success) {
                    setWorkoutLog(startRes.data);
                }
            } catch (startErr) {
                showToast('Failed to start workout session', 'error');
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogUpdate = async (exerciseLogId, field, value) => {
        // Optimistic UI update
        const updatedLogs = workoutLog.exerciseLogs.map(log =>
            log.id === exerciseLogId ? { ...log, [field]: value } : log
        );
        setWorkoutLog(prev => ({ ...prev, exerciseLogs: updatedLogs }));

        try {
            await updateExerciseLog(workoutLog.id, exerciseLogId, { [field]: value });
        } catch (err) {
            showToast('Failed to save progress', 'error');
        }
    };

    const handleFinish = async () => {
        if (!window.confirm("Are you sure you want to finish this session?")) return;
        setFinishing(true);
        try {
            const res = await finishWorkoutSession(workoutLog.id);
            if (res.success) {
                setSummary(res.data);
            }
        } catch (err) {
            showToast('Failed to finish workout', 'error');
        } finally {
            setFinishing(false);
        }
    };

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s].filter(Boolean).join(':');
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}><Spinner /></div>;
    if (!workoutLog) return <div>Workout Session Not Found</div>;

    // Group logs by exercise for rendering
    const exerciseGroups = workoutLog.exerciseLogs.reduce((acc, log) => {
        const exName = log.Exercise ? log.Exercise.name : 'Unknown Exercise';
        if (!acc[exName]) {
            acc[exName] = [];
        }
        acc[exName].push(log);
        return acc;
    }, {});

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem', paddingBottom: '6rem' }}>
            <div style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)', zIndex: 10, padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Active Workout</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#0369a1' }}>
                        {formatTime(elapsedSeconds)}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {Object.entries(exerciseGroups).map(([exName, logs]) => (
                    <Card key={exName} style={{ overflow: 'hidden' }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: 0, color: '#0f172a' }}>{exName}</h4>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 80px', gap: '1rem', marginBottom: '0.5rem', fontWeight: 'bold', color: '#64748b', fontSize: '0.85rem' }}>
                                <div>Set</div>
                                <div>kg</div>
                                <div>Reps</div>
                                <div style={{ textAlign: 'center' }}>Done</div>
                            </div>
                            {logs.map((log) => (
                                <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 80px', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem', opacity: log.isCompleted ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                                    <div style={{ fontWeight: 'bold', color: '#94a3b8' }}>{log.setNumber}</div>
                                    <Input
                                        type="number"
                                        value={log.weightUsed !== null ? Number(log.weightUsed) : ''}
                                        onChange={(e) => handleLogUpdate(log.id, 'weightUsed', parseFloat(e.target.value))}
                                        placeholder="0"
                                    />
                                    <Input
                                        type="number"
                                        value={log.repsCompleted !== null ? log.repsCompleted : ''}
                                        onChange={(e) => handleLogUpdate(log.id, 'repsCompleted', parseInt(e.target.value, 10))}
                                        placeholder="0"
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => handleLogUpdate(log.id, 'isCompleted', !log.isCompleted)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                backgroundColor: log.isCompleted ? '#22c55e' : '#e2e8f0',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            {log.isCompleted && '✓'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                <Button variant="primary" style={{ width: '100%', maxWidth: '800px', height: '50px', fontSize: '1.1rem' }} onClick={handleFinish} disabled={finishing}>
                    {finishing ? 'Finishing...' : 'Finish Workout'}
                </Button>
            </div>

            <Modal isOpen={!!summary} onClose={() => navigate('/')} title="Workout Complete! 🎉">
                {summary && (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
                        <h3>Great job!</h3>
                        <p style={{ color: '#64748b' }}>Here's what you accomplished:</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '2rem 0' }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1' }}>{formatTime(summary.durationSeconds)}</div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Duration</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1' }}>{summary.totalVolume} kg</div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Volume</div>
                            </div>
                        </div>

                        <Button variant="primary" onClick={() => navigate('/')} style={{ width: '100%' }}>
                            Return to Dashboard
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ActiveWorkout;
