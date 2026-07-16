import api from '../../../utilities/api/apiClient';

export const transaksiService = {
    async getKodeTransaksi() {
        try {
            const response = await api.get('/transaksi/transaksi/getKodeTransaksi');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeProdukToTransaksiDetail(payload) {
        try {
            const response = await api.post('/transaksi/transaksi/storeProdukToTransaksiDetail', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getTransaksiDetail(payload) {
        try {
            const response = await api.get('/transaksi/transaksi/getTransaksiDetail', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async batalTransaksiDetail(payload) {
        try {
            const response = await api.post('/transaksi/transaksi/batalTransaksiDetail', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async paymentTransaksi(payload) {
        try {
            const response = await api.post('/transaksi/transaksi/paymentTransaksi', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async CetakNotaPenjulan(payload) {
        try {
            const response = await api.post('/transaksi/transaksi/getSignedNotaPenjualanUrl', payload);
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
            const response = await api.post('/transaksi/transaksi/sendnotification', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getNotaData(payload) {
        try {
            const response = await api.get('/transaksi/transaksi/nota-data', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
