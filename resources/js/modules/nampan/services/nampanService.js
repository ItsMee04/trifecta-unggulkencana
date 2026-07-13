import api from '../../../utilities/api/apiClient';

export const nampanService = {
    async getNampan() {
        try {
            const response = await api.get('/nampan/nampan');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeNampan(payload) {
        try {
            const response = await api.post('/nampan/nampan/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateNampan(payload) {
        try {
            const response = await api.post('/nampan/nampan/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteNampan(payload) {
        try {
            const response = await api.post('/nampan/nampan/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
