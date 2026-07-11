import api from '../../../utilities/api/apiClient';

export const roleService = {
    async getRole() {
        try {
            const response = await api.get('/master/role');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeRole(payload) {
        try {
            const response = await api.post('/master/role/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateRole(payload) {
        try {
            const response = await api.post('/master/role/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteRole(payload) {
        try {
            const response = await api.post('/master/role/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
