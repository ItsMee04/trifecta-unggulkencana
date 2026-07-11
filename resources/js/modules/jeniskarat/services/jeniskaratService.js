import api from '../../../utilities/api/apiClient';

export const jeniskaratService = {
    async getJenisKarat() {
        try {
            const response = await api.get('/produk/jeniskarat');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeJenisKarat(payload) {
        try {
            const response = await api.post('/produk/jeniskarat/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateJenisKarat(payload) {
        try {
            const response = await api.post('/produk/jeniskarat/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteJenisKarat(payload) {
        try {
            const response = await api.post('/produk/jeniskarat/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
