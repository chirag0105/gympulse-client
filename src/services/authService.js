import api from './api';

const TOKEN_KEY = 'gympulse_token';

export const authService = {
    async register(data) {
        const response = await api.post('/auth/register', data);
        const { token } = response.data.data;
        localStorage.setItem(TOKEN_KEY, token);
        return response.data.data;
    },

    async login(data) {
        const response = await api.post('/auth/login', data);
        const { token } = response.data.data;
        localStorage.setItem(TOKEN_KEY, token);
        return response.data.data;
    },

    async getMe() {
        const response = await api.get('/auth/me');
        return response.data.data.user;
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },
};

export default authService;
