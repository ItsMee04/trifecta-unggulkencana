import api from '../../../utilities/api/apiClient';

export const authenticationService = {
    async login(payload) {
        try {
            const response = await api.post('/login', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            const response = await api.post('/logout');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
