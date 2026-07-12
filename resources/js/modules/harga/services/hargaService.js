import api from '../../../utilities/api/apiClient';

export const hargaService = {
    async getHarga() {
        try {
            const response = await api.get('/produk/harga');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeHarga(payload) {
        try {
            const response = await api.post('/produk/harga/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateHarga(payload) {
        try {
            const response = await api.post('/produk/harga/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteHarga(payload) {
        try {
            const response = await api.post('/produk/harga/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
