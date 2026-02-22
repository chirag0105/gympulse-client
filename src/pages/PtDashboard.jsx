import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Table, Badge, useToast, Modal, Spinner } from '../components/ui';
import { getClients, inviteClient, removeClient } from '../services/api';
import WeeklyCalendar from '../components/calendar/WeeklyCalendar';
import ProgressTracking from './ProgressTracking';

function PtDashboard() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const { showToast } = useToast();

    // View state mappings
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        if (!selectedClient) {
            fetchClients();
        }
    }, [selectedClient]);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await getClients();
            if (res.success) {
                setClients(res.data);
            }
        } catch (err) {
            showToast('Failed to load clients', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviting(true);
        try {
            const res = await inviteClient(inviteEmail);
            if (res.success) {
                showToast('Client invited successfully', 'success');
                setInviteEmail('');
                fetchClients(); // Refresh list to get new invite
            } else {
                showToast(res.message || 'Error parsing invite', 'error');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                showToast(err.response.data.message, 'error');
            } else {
                showToast('Failed to invite client', 'error');
            }
        } finally {
            setInviting(false);
        }
    };

    const handleRemoveClient = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm("Are you sure you want to remove this client? This cannot be undone.")) return;
        try {
            const res = await removeClient(id);
            if (res.success) {
                showToast('Client removed', 'success');
                fetchClients();
            }
        } catch (err) {
            showToast('Failed to remove client', 'error');
        }
    };

    const activeOrInvitedCount = clients.filter(c => c.status === 'invited' || c.status === 'active').length;
    const canInvite = activeOrInvitedCount < 5;

    if (selectedClient) {
        return (
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <Button variant="secondary" onClick={() => setSelectedClient(null)} style={{ marginBottom: '1rem' }}>
                    &larr; Back to Clients
                </Button>
                <h2>Client Details: {selectedClient.client ? `${selectedClient.client.firstName} ${selectedClient.client.lastName}` : selectedClient.clientEmail}</h2>
                <div style={{ marginTop: '2rem' }}>
                    <WeeklyCalendar role="pt" clientId={selectedClient.clientId} />
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <ProgressTracking clientId={selectedClient.clientId} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Welcome, Trainer! 🏋️</h2>
                    <p style={{ color: '#666', margin: 0 }}>Here's your training overview</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <Card variant="glass">
                    <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>👥</span>
                        <div>
                            <h3 style={{ margin: 0 }}>{activeOrInvitedCount} / 5</h3>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>Active Clients</span>
                        </div>
                    </div>
                </Card>
                <Card variant="glass">
                    <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>🏋️</span>
                        <div>
                            <h3 style={{ margin: 0 }}>0</h3>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>Workout Plans</span>
                        </div>
                    </div>
                </Card>
                <Card variant="glass">
                    <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>📅</span>
                        <div>
                            <h3 style={{ margin: 0 }}>0</h3>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>Scheduled Today</span>
                        </div>
                    </div>
                </Card>
                <Card variant="glass">
                    <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>✅</span>
                        <div>
                            <h3 style={{ margin: 0 }}>0</h3>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>Completed This Week</span>
                        </div>
                    </div>
                </Card>
            </div>

            <Card style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>My Clients</h3>

                    <form onSubmit={handleInvite} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Input
                            type="email"
                            placeholder="Client Email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                            disabled={!canInvite || inviting}
                        />
                        <Button type="submit" disabled={!canInvite || inviting}>
                            {inviting ? "Inviting..." : "Invite Client"}
                        </Button>
                    </form>
                </div>
                {!canInvite && (
                    <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'right' }}>
                        You have reached the maximum limit of 5 clients.
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}><Spinner /></div>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                        No clients found. Invite your first client above!
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client.id} style={{ cursor: client.status === 'active' ? 'pointer' : 'default', backgroundColor: '#fff', transition: 'background-color 0.2s' }}
                                        onMouseEnter={(e) => { if (client.status === 'active') e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
                                        onClick={() => {
                                            if (client.status === 'active') {
                                                setSelectedClient(client);
                                            }
                                        }}>
                                        <td>{client.client ? `${client.client.firstName} ${client.client.lastName}` : '-'}</td>
                                        <td>{client.clientEmail}</td>
                                        <td>
                                            <Badge variant={client.status === 'active' ? 'success' : 'warning'}>
                                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                            </Badge>
                                        </td>
                                        <td>{client.joinedAt ? new Date(client.joinedAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {client.status === 'active' && (
                                                    <Button variant="secondary" size="small" onClick={(e) => { e.stopPropagation(); setSelectedClient(client); }}>
                                                        View Calendar
                                                    </Button>
                                                )}
                                                <Button variant="danger" size="small" onClick={(e) => handleRemoveClient(client.id, e)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
}

export default PtDashboard;
