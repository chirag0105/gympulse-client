import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('gympulse_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('gympulse_token');
            // Only redirect if not already on auth pages
            if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// --- API Modules ---

// Exercises
export const getExercises = async (filters) => {
    const response = await api.get('/exercises', { params: filters });
    return response.data;
};

// Workouts
export const getWorkouts = async () => {
    const response = await api.get('/workouts');
    return response.data;
};

export const getWorkoutById = async (id) => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
};

export const createWorkout = async (workoutData) => {
    const response = await api.post('/workouts', workoutData);
    return response.data;
};

export const updateWorkout = async (id, workoutData) => {
    const response = await api.put(`/workouts/${id}`, workoutData);
    return response.data;
};

export const deleteWorkout = async (id) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
};

// PT Clients
export const getClients = async () => {
    const response = await api.get('/pt-clients');
    return response.data;
};

export const inviteClient = async (clientEmail) => {
    const response = await api.post('/pt-clients/invite', { clientEmail });
    return response.data;
};

export const removeClient = async (id) => {
    const response = await api.delete(`/pt-clients/${id}`);
    return response.data;
};

// Schedules
export const getSchedules = async (params) => {
    const response = await api.get('/schedules', { params });
    return response.data;
};

export const scheduleWorkout = async (payload) => {
    const response = await api.post('/schedules', payload);
    return response.data;
};

export const deleteSchedule = async (id) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
};

// Logs
export const startWorkoutSession = async (scheduledWorkoutId) => {
    const response = await api.post('/logs/start', { scheduledWorkoutId });
    return response.data;
};

export const updateExerciseLog = async (logId, exerciseLogId, payload) => {
    const response = await api.put(`/logs/${logId}/exercise/${exerciseLogId}`, payload);
    return response.data;
};

export const finishWorkoutSession = async (logId) => {
    const response = await api.put(`/logs/${logId}/finish`);
    return response.data;
};

export const getWorkoutSession = async (scheduledId) => {
    const response = await api.get(`/logs/${scheduledId}`);
    return response.data;
};

export const getExerciseHistory = async (exerciseId, clientId) => {
    const params = clientId ? { clientId } : {};
    const response = await api.get(`/logs/history/exercise/${exerciseId}`, { params });
    return response.data;
};

// Measurements
export const getMeasurements = async (clientId) => {
    const params = clientId ? { clientId } : {};
    const response = await api.get('/measurements', { params });
    return response.data;
};

export const addMeasurement = async (payload) => {
    const response = await api.post('/measurements', payload);
    return response.data;
};

export const deleteMeasurement = async (id) => {
    const response = await api.delete(`/measurements/${id}`);
    return response.data;
};

// Admin
export const getAdminUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const toggleUserStatus = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
};

// Notifications
export const getNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};

export default api;
