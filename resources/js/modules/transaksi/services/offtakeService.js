import api from '../../../utilities/api/apiClient';

export const offtakeService = {
    async getTransaksiOfftake() {
        try {
            const response = await api.get('/transaksi/offtake/getTransaksiOfftake');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getNotaData(payload) {
        try {
            // 🌟 Tambahkan { params: payload } agar Axios mengirimnya sebagai query String (?kode=...)
            const response = await api.get('/transaksi/offtake/nota-data', {
                params: payload
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async batalTransaksiOfftake(payload) {
        try {
            const response = await api.post('/transaksi/offtake/batalTransaksi', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
