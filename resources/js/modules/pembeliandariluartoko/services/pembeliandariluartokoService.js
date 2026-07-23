import api from '../../../utilities/api/apiClient';

export const pembeliandariluartokoService = {
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
            const response = await api.post('/transaksi/pembelian/pembeliandariluartoko/getTransaksiByKode', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeProdukToPembelianDetail(payload) {
        try {
            const response = await api.post('/transaksi/pembelian/pembeliandariluartoko/storeProdukToPembelianDetailDariLuar', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getPembelianDetail() {
        try {
            const response = await api.get('/transaksi/pembelian/pembeliandariluartoko/getPembelianDetailDariLuar');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updatePembelianDetail(payload) {
        try {
            const response = await api.post('/transaksi/pembelian/pembeliandariluartoko/updatePembelianDetailDariLuar', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async batalPembelianDetail(payload) {
        try {
            const response = await api.post('/transaksi/pembelian/pembeliandariluartoko/batalPembelianDetailDariLuar', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async paymentPembelian(payload) {
        try {
            const response = await api.post('/transaksi/pembelian/pembeliandariluartoko/paymentPembelianDariLuar', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getNotaData(payload) {
        try {
            const response = await api.get('/transaksi/pembelian/pembeliandariluartoko/nota-data', {
                params: payload
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
