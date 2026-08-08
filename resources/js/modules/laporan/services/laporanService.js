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

    async getLaporanNampan(payload) {
        try {
            const response = await api.post('/laporan/getLaporanNampan', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getLaporanProduk(payload) {
        try {
            const response = await api.get('/laporan/getLaporanProduk');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getLaporanProdukNampan(payload) {
        try {
            const response = await api.get(
                '/laporan/getLaporanProdukNampan',
                {
                    params: {
                        tanggal_awal: payload.tanggal_awal,
                        tanggal_akhir: payload.tanggal_akhir
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
