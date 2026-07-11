import api from '../../../utilities/api/apiClient';

export const kondisiService = {
    async getKondisi() {
        try {
            const response = await api.get('/produk/kondisi');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeKondisi(payload) {
        try {
            const response = await api.post('/produk/kondisi/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateKondisi(payload) {
        try {
            const response = await api.post('/produk/kondisi/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteKondisi(payload) {
        try {
            const response = await api.post('/produk/kondisi/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
