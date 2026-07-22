import api from '../../../utilities/api/apiClient';

export const pembeliandaritokoService = {
    async getKodeTransaksi() {
        try {
            const response = await api.get('/transaksi/pembelian/pembeliandaritoko/getKodeTransaksi');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getTransaksiByKode(payload) {
        try {
            const response = await api.post('/transaksi/pembelian/pembeliandaritoko/getTransaksiByKode', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeProdukToPembelianDetail(payload) {
        try {
            const response = await api.post('/transaksi/pembelian/pembeliandaritoko/storeProdukToPembelianDetail', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getPembelianDetail() {
        try {
            const response = await api.get('/transaksi/pembelian/pembeliandaritoko/getPembelianDetail');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updatePembelianDetail(payload) {
        try {
            const response = await api.post('/transaksi/pembelian/pembeliandaritoko/updatePembelianDetail', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async batalPembelianDetail(payload) {
        try {
            const response = await api.post('/transaksi/pembelian/pembeliandaritoko/batalPembelianDetail', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async paymentPembelian(payload) {
        try {
            const response = await api.post('/transaksi/pembelian/pembeliandaritoko/paymentPembelian', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
