import api from '../../../utilities/api/apiClient';

export const permissionService = {
    async getPermission(payload) {
        try {
            const response = await api.post('/master/permission',payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updatePermission(payload) {
        try {
            const response = await api.post('/master/permission/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
