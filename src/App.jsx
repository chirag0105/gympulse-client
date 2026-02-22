import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui';

import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import AppLayout from './components/layout/AppLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PtDashboard from './pages/PtDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutBuilder from './pages/WorkoutBuilder';
import ActiveWorkout from './pages/ActiveWorkout';
import ProgressTracking from './pages/ProgressTracking';
import AuthSuccess from './pages/AuthSuccess';

// Redirect authenticated users away from auth pages
function AuthRedirect({ children }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    if (isLoading) return null;
    if (isAuthenticated) {
        const dashboards = {
            super_admin: '/admin',
            pt: '/pt/dashboard',
            client: '/dashboard',
        };
        return <Navigate to={dashboards[user?.role] || '/dashboard'} replace />;
    }
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Landing />} />
                        <Route
                            path="/login"
                            element={
                                <AuthRedirect>
                                    <Login />
                                </AuthRedirect>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <AuthRedirect>
                                    <Register />
                                </AuthRedirect>
                            }
                        />

                        {/* Protected routes with app shell */}
                        <Route
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        >
                            {/* Shared Protected Routes */}
                            <Route
                                path="/exercises"
                                element={
                                    <RoleRoute roles={['pt', 'client', 'super_admin']}>
                                        <ExerciseLibrary />
                                    </RoleRoute>
                                }
                            />

                            {/* PT routes */}
                            <Route
                                path="/pt/dashboard"
                                element={
                                    <RoleRoute roles={['pt']}>
                                        <PtDashboard />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/pt/clients"
                                element={
                                    <RoleRoute roles={['pt']}>
                                        <PtDashboard />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/pt/workouts"
                                element={
                                    <RoleRoute roles={['pt', 'super_admin']}>
                                        <PtDashboard />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/pt/workouts/new"
                                element={
                                    <RoleRoute roles={['pt', 'super_admin']}>
                                        <WorkoutBuilder />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/pt/workouts/:id/edit"
                                element={
                                    <RoleRoute roles={['pt', 'super_admin']}>
                                        <WorkoutBuilder />
                                    </RoleRoute>
                                }
                            />

                            {/* Client routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <RoleRoute roles={['client']}>
                                        <ClientDashboard />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/workouts/:scheduledId/start"
                                element={
                                    <RoleRoute roles={['client']}>
                                        <ActiveWorkout />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/workouts"
                                element={
                                    <RoleRoute roles={['client']}>
                                        <ClientDashboard />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/progress"
                                element={
                                    <RoleRoute roles={['client', 'pt']}>
                                        <ProgressTracking />
                                    </RoleRoute>
                                }
                            />

                            {/* Admin routes */}
                            <Route
                                path="/admin"
                                element={
                                    <RoleRoute roles={['super_admin']}>
                                        <AdminDashboard />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/admin/trainers"
                                element={
                                    <RoleRoute roles={['super_admin']}>
                                        <AdminDashboard />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/admin/clients"
                                element={
                                    <RoleRoute roles={['super_admin']}>
                                        <AdminDashboard />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/admin/exercises"
                                element={
                                    <RoleRoute roles={['super_admin']}>
                                        <AdminDashboard />
                                    </RoleRoute>
                                }
                            />
                            <Route
                                path="/admin/settings"
                                element={
                                    <RoleRoute roles={['super_admin']}>
                                        <AdminDashboard />
                                    </RoleRoute>
                                }
                            />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
