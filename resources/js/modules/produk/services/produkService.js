import api from '../../../utilities/api/apiClient';

export const produkService = {
    async getProduk() {
        try {
            const response = await api.get('/produk/produk');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeProduk(payload) {
        try {
            const response = await api.post('/produk/produk/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateProduk(payload) {
        try {
            const response = await api.post('/produk/produk/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteProduk(payload) {
        try {
            const response = await api.post('/produk/produk/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
