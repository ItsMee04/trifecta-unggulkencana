import api from '../../../utilities/api/apiClient';

export const jenisprodukService = {
    async getJenisProduk() {
        try {
            const response = await api.get('/produk/jenisproduk');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeJenisProduk(payload) {
        try {
            const response = await api.post('/produk/jenisproduk/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateJenisProduk(payload) {
        try {
            const response = await api.post('/produk/jenisproduk/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteJenisProduk(payload) {
        try {
            const response = await api.post('/produk/jenisproduk/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
