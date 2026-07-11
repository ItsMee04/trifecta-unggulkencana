import api from '../../../utilities/api/apiClient';

export const userService = {
    async getUser() {
        try {
            const response = await api.get('/master/user');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateUser(payload) {
        try {
            const response = await api.post('/master/user/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteUser(payload) {
        try {
            const response = await api.post('/master/user/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
