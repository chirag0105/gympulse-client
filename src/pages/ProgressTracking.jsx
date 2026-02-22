import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Table, useToast, Spinner } from '../components/ui';
import { getMeasurements, addMeasurement, deleteMeasurement } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProgressChart from '../components/charts/LineChart';

function ProgressTracking({ clientId }) {
    const { user } = useAuth();
    const { showToast } = useToast();

    // Props handling for nested display (PT) vs independent (Client)
    const activeClientId = clientId || user?.id;
    const isPt = user?.role === 'pt' || user?.role === 'super_admin';

    const [activeTab, setActiveTab] = useState('measurements');
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        measuredAt: new Date().toISOString().split('T')[0],
        weight: '',
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (activeClientId) {
            fetchMeasurements();
        }
    }, [activeClientId]);

    const fetchMeasurements = async () => {
        setLoading(true);
        try {
            const res = await getMeasurements(clientId); // pass clientId if PT
            if (res.success) {
                setMeasurements(res.data);
            }
        } catch (err) {
            showToast('Failed to load measurements', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Clean up empty strings to nulls
            const payload = { ...formData };
            ['weight', 'chest', 'waist', 'hips', 'arms', 'thighs'].forEach(key => {
                if (payload[key] === '') payload[key] = null;
            });

            const res = await addMeasurement(payload);
            if (res.success) {
                showToast('Measurement saved successfully', 'success');
                fetchMeasurements();
                // Reset form slightly
                setFormData(prev => ({
                    ...prev,
                    notes: ''
                }));
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                showToast(err.response.data.message, 'error');
            } else {
                showToast('Failed to save measurement', 'error');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this measurement?")) return;
        try {
            const res = await deleteMeasurement(id);
            if (res.success) {
                showToast('Measurement deleted', 'success');
                fetchMeasurements();
            }
        } catch (err) {
            showToast('Failed to delete measurement', 'error');
        }
    };

    return (
        <div style={{ padding: clientId ? '0' : '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {!clientId && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2>Progress Tracking 📈</h2>
                    <p style={{ color: '#666' }}>Track your body metrics and view historical data.</p>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('measurements')}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'measurements' ? '#0ea5e9' : '#64748b',
                        borderBottom: activeTab === 'measurements' ? '2px solid #0ea5e9' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer'
                    }}
                >
                    Measurements
                </button>
                <button
                    onClick={() => setActiveTab('photos')}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'photos' ? '#0ea5e9' : '#64748b',
                        borderBottom: activeTab === 'photos' ? '2px solid #0ea5e9' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer'
                    }}
                >
                    Progress Photos
                </button>
                <button
                    onClick={() => setActiveTab('charts')}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'charts' ? '#0ea5e9' : '#64748b',
                        borderBottom: activeTab === 'charts' ? '2px solid #0ea5e9' : 'none',
                        marginBottom: '-2px',
                        cursor: 'pointer'
                    }}
                >
                    Charts
                </button>
            </div>

            {activeTab === 'measurements' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {!isPt && (
                        <Card style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Log New Measurement</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Date</label>
                                    <Input type="date" name="measuredAt" value={formData.measuredAt} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Weight (kg)</label>
                                    <Input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Chest (cm)</label>
                                    <Input type="number" step="0.1" name="chest" value={formData.chest} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Waist (cm)</label>
                                    <Input type="number" step="0.1" name="waist" value={formData.waist} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hips (cm)</label>
                                    <Input type="number" step="0.1" name="hips" value={formData.hips} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Arms (cm)</label>
                                    <Input type="number" step="0.1" name="arms" value={formData.arms} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Thighs (cm)</label>
                                    <Input type="number" step="0.1" name="thighs" value={formData.thighs} onChange={handleInputChange} />
                                </div>
                                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <Button type="submit" disabled={submitting}>
                                        {submitting ? 'Saving...' : 'Save Measurement'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    <Card style={{ padding: '1.5rem', overflowX: 'auto' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>History</h3>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}><Spinner /></div>
                        ) : measurements.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No measurements logged yet.</p>
                        ) : (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Weight</th>
                                        <th>Chest</th>
                                        <th>Waist</th>
                                        <th>Hips</th>
                                        <th>Arms</th>
                                        <th>Thighs</th>
                                        {!isPt && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {measurements.map(m => (
                                        <tr key={m.id}>
                                            <td>{new Date(m.measuredAt).toLocaleDateString()}</td>
                                            <td>{m.weight ? `${m.weight} kg` : '-'}</td>
                                            <td>{m.chest ? `${m.chest} cm` : '-'}</td>
                                            <td>{m.waist ? `${m.waist} cm` : '-'}</td>
                                            <td>{m.hips ? `${m.hips} cm` : '-'}</td>
                                            <td>{m.arms ? `${m.arms} cm` : '-'}</td>
                                            <td>{m.thighs ? `${m.thighs} cm` : '-'}</td>
                                            {!isPt && (
                                                <td>
                                                    <Button variant="danger" size="small" onClick={() => handleDelete(m.id)}>Delete</Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card>
                </div>
            )}

            {activeTab === 'photos' && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                    <Card style={{ padding: '4rem', textAlign: 'center', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderStyle: 'dashed', borderWidth: '2px', borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }}>
                        <div style={{ fontSize: '4rem', opacity: 0.5 }}>📸</div>
                        <h3 style={{ color: '#334155', margin: 0 }}>Progress Photos</h3>
                        <div style={{ backgroundColor: '#0ea5e9', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Coming Soon</div>
                        <p style={{ color: '#64748b', margin: 0 }}>Visual tracking transforms are on their way! In a future update, you'll be able to upload, compare, and celebrate your physical progress visually right here.</p>
                    </Card>
                </div>
            )}

            {activeTab === 'charts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Card style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Weight Over Time</h3>
                        <ProgressChart
                            data={[...measurements].reverse().map(m => ({
                                measuredAt: new Date(m.measuredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                                weight: m.weight ? parseFloat(m.weight) : null
                            })).filter(m => m.weight !== null)}
                            dataKeyX="measuredAt"
                            dataKeyY="weight"
                            yLabel="kg"
                            color="#3b82f6"
                        />
                    </Card>

                    <Card style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Body Measurements (cm)</h3>
                        <ProgressChart
                            data={[...measurements].reverse().map(m => ({
                                measuredAt: new Date(m.measuredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                                waist: m.waist ? parseFloat(m.waist) : null
                            })).filter(m => m.waist !== null)}
                            dataKeyX="measuredAt"
                            dataKeyY="waist"
                            yLabel="cm"
                            color="#f59e0b"
                        />
                        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginTop: '1rem' }}>Showing Waist Measurement</p>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default ProgressTracking;
