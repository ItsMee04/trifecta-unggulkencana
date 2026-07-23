import api from '../../../utilities/api/apiClient';

export const perbaikanService = {
    async getPerbaikan() {
        try {
            const response = await api.get('/transaksi/perbaikan/getPerbaikan');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async finalPerbaikan(payload) {
        try {
            const response = await api.post('/transaksi/perbaikan/final', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async batalPerbaikan(payload) {
        try {
            const response = await api.post('/transaksi/perbaikan/batal', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
