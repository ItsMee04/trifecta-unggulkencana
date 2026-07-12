import api from '../../../utilities/api/apiClient';

export const diskonService = {
    async getDiskon() {
        try {
            const response = await api.get('/produk/diskon');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeDiskon(payload) {
        try {
            const response = await api.post('/produk/diskon/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateDiskon(payload) {
        try {
            const response = await api.post('/produk/diskon/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteDiskon(payload) {
        try {
            const response = await api.post('/produk/diskon/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
