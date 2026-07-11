import api from '../../../utilities/api/apiClient';

export const karatService = {
    async getKarat() {
        try {
            const response = await api.get('/produk/karat');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeKarat(payload) {
        try {
            const response = await api.post('/produk/karat/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateKarat(payload) {
        try {
            const response = await api.post('/produk/karat/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteKarat(payload) {
        try {
            const response = await api.post('/produk/karat/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
