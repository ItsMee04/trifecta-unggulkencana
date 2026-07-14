import api from '../../../utilities/api/apiClient';

export const suplierService = {
    async getSuplier() {
        try {
            const response = await api.get('/pelanggan/suplier');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeSuplier(payload) {
        try {
            const response = await api.post('/pelanggan/suplier/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateSuplier(payload) {
        try {
            const response = await api.post('/pelanggan/suplier/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteSuplier(payload) {
        try {
            const response = await api.post('/pelanggan/suplier/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
