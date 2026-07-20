import api from '../../../utilities/api/apiClient';

export const offtakeService = {
    async getKodeTransaksi() {
        try {
            const response = await api.get('/transaksi/offtake/getKodeTransaksi');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeProdukToOfftakeDetail(payload) {
        try {
            const response = await api.post('/transaksi/offtake/storeProdukToOfftakeDetail', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getOfftakeDetail(payload) {
        try {
            const response = await api.get('/transaksi/offtake/getOfftakeDetail', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async batalOfftakeDetail(payload) {
        try {
            const response = await api.post('/transaksi/offtake/batalOfftakeDetail', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async paymentOfftake(payload) {
        try {
            const response = await api.post('transaksi/offtake/paymentOfftake', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getOfftake() {
        try {
            const response = await api.get('transaksi/offtake/getOfftake');
            return response.data;
        } catch(error) {
            throw error;
        }
    },


};
