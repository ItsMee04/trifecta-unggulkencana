import api from '../../../utilities/api/apiClient';

export const mutasisaldoService = {
    async getMutasiSaldo() {
        try {
            const response = await api.get('/keuangan/mutasisaldo');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeMutasiSaldo(payload) {
        try {
            const response = await api.post('/keuangan/mutasisaldo/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateMutasiSaldo(payload) {
        try {
            const response = await api.post('/keuangan/mutasisaldo/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteMutasiSaldo(payload) {
        try {
            const response = await api.post('/keuangan/mutasisaldo/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
