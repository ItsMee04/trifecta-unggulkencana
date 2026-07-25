import api from '../../../utilities/api/apiClient';

export const pembelianService = {
    async getTransaksiPembelian() {
        try {
            const response = await api.get('/transaksi/pembelian/getTransaksiPembelian');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getNotaData(payload) {
        try {
            // 🌟 Tambahkan { params: payload } agar Axios mengirimnya sebagai query String (?kode=...)
            const response = await api.get('/transaksi/pembelian/pembeliandaritoko/nota-data', {
                params: payload
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async batalTransaksiPembelian(payload) {
        try {
            const response = await api.post('/transaksi/pembelian/batalTransaksi', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
