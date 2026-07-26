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
};
