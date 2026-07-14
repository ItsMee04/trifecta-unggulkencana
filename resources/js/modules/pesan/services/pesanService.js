import api from '../../../utilities/api/apiClient';

export const pesanService = {
    async getPesan() {
        try {
            const response = await api.get('/pelanggan/pesan');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storePesan(payload) {
        try {
            const response = await api.post('/pelanggan/pesan/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updatePesan(payload) {
        try {
            const response = await api.post('/pelanggan/pesan/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deletePesan(payload) {
        try {
            const response = await api.post('/pelanggan/pesan/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
