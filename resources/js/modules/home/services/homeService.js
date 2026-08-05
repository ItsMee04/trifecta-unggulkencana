import api from '../../../utilities/api/apiClient';

export const homeService = {
    async getTotalProduk() {
        try {
            const response = await api.get('/home/getTotalProduk');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getTotalPenjualanHariIni() {
        try {
            const response = await api.get('/home/getTotalPenjualanHariIni');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
