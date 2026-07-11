import api from '../../../utilities/api/apiClient';

export const jabatanService = {
    async getJabatan() {
        try {
            const response = await api.get('/master/jabatan');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeJabatan(payload) {
        try {
            const response = await api.post('/master/jabatan/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateJabatan(payload) {
        try {
            const response = await api.post('/master/jabatan/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteJabatan(payload) {
        try {
            const response = await api.post('/master/jabatan/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
