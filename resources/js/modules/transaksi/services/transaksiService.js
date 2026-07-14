import api from '../../../utilities/api/apiClient';

export const transaksiService = {
    async getKodeTransaksi() {
        try {
            const response = await api.get('/transaksi/transaksi');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeProdukToTransaksiDetail(payload) {
        try {
            const response = await api.post('/transaksi/transaksi/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getTransaksiDetail(payload) {
        try {
            const response = await api.get('/transaksi/transaksi/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async batalTransaksiDetail(payload) {
        try {
            const response = await api.post('/transaksi/transaksi/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async paymentTransaksi(payload) {
        try {
            const response = await api.post('/transaksi/transaksi/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async CetakNotaPenjulan(payload) {
        try {
            const response = await api.post('/transaksi/transaksi/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getTransaksiPenjualan(payload) {
        try {
            const response = await api.get('/transaksi/transaksi/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async batalTransaksi(payload) {
        try {
            const response = await api.post('/transaksi/transaksi/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async sendTelegramNotification(payload) {
        try {
            const response = await api.post('/transaksi/transaksi/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
