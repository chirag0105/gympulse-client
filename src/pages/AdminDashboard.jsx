import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, useToast } from '../components/ui';
import { getAdminUsers, toggleUserStatus } from '../services/api';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getAdminUsers();
            if (res.success) {
                setUsers(res.data);
            }
        } catch (err) {
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const res = await toggleUserStatus(userId);
            if (res.success) {
                // Update local state
                setUsers(users.map(u => u.id === userId ? { ...u, isActive: res.data.isActive } : u));
                showToast(`User marked as ${res.data.isActive ? 'Active' : 'Inactive'}`, 'success');
            }
        } catch (err) {
            showToast('Failed to toggle user status', 'error');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Super Admin Panel</h1>
                <p style={{ color: '#666', margin: 0 }}>System-wide user management and overrides.</p>
            </div>

            <Card style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>All Users</h3>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <Spinner />
                        <p style={{ color: '#666', marginTop: '1rem' }}>Loading user ecosystem...</p>
                    </div>
                ) : users.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b' }}>No normal users found in the system yet.</p>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ fontWeight: 'bold' }}>{user.firstName} {user.lastName}</div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Badge variant={user.role === 'pt' ? 'primary' : 'secondary'}>
                                            {user.role.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge variant={user.isActive ? 'success' : 'danger'}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <Button
                                            variant={user.isActive ? 'danger' : 'success'}
                                            size="small"
                                            onClick={() => handleToggleStatus(user.id)}
                                        >
                                            {user.isActive ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
}

export default AdminDashboard;
