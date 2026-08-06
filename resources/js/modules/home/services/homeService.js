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

    async getTotalPembelianHariIni() {
        try {
            const response = await api.get('/home/getTotalPembelianHariIni');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getTotalPelanggan() {
        try {
            const response = await api.get('/home/getTotalPelanggan');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getTotalPemasukanHariIni() {
        try {
            const response = await api.get('/home/getTotalPemasukanHariIni');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getTotalPengeluaranHariIni() {
        try {
            const response = await api.get('/home/getTotalPengeluaranHariIni');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getTransaksiChart() {
        try {
            const response = await api.get('/home/getTransaksiChart');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getProdukTerlarisChart() {
        try {
            const response = await api.get('/home/getProdukTerlarisChart');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getTransaksiPenjualanSatuMinggu() {
        try {
            const response = await api.get('/home/getTransaksiPenjualanSatuMinggu');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
