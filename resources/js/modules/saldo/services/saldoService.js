import api from '../../../utilities/api/apiClient';

export const saldoService = {
    async getSaldo() {
        try {
            const response = await api.get('/keuangan/saldo');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeSaldo(payload) {
        try {
            const response = await api.post('/keuangan/saldo/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateSaldo(payload) {
        try {
            const response = await api.post('/keuangan/saldo/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteSaldo(payload) {
        try {
            const response = await api.post('/keuangan/saldo/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
