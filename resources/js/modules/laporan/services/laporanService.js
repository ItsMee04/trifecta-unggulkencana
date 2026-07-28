import api from '../../../utilities/api/apiClient';

export const laporanService = {
    async getLaporanPenjualan(payload) {
        try {
            const response = await api.post('/laporan/getLaporanPenjualan', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getLaporanPembelian(payload) {
        try {
            const response = await api.post('/laporan/getLaporanPembelian', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getLaporanOfftake(payload) {
        try {
            const response = await api.post('/laporan/getLaporanOfftake', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getLaporanPerbaikan(payload) {
        try {
            const response = await api.post('/laporan/getLaporanPerbaikan', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getLaporanMutasiSaldo(payload) {
        try {
            const response = await api.post('/laporan/getLaporanMutasiSaldo', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
