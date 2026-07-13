import api from '../../../utilities/api/apiClient';

export const pelangganService = {
    async getPelanggan() {
        try {
            const response = await api.get('/pelanggan/pelanggan');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storePelanggan(payload) {
        try {
            const response = await api.post('/pelanggan/pelanggan/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updatePelanggan(payload) {
        try {
            const response = await api.post('/pelanggan/pelanggan/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deletePelanggan(payload) {
        try {
            const response = await api.post('/pelanggan/pelanggan/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
