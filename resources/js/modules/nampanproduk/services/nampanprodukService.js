import api from '../../../utilities/api/apiClient';

export const nampanprodukService = {
    async getNampanProduk() {
        try {
            const response = await api.get('/nampan/nampanproduk');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getNampanProdukByNampan(payload) {
        try {
            const response = await api.post('/nampan/nampanproduk/getNampanProdukByNampan', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getProdukByJenisNampan(payload) {
        try {
            const response = await api.post('/nampan/nampanproduk/getProdukByJenisNampan', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getProdukInNampanByJenis(payload) {
        try {
            const response = await api.post('/nampan/nampanproduk/getProdukInNampanByJenis', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storeNampanProduk(payload) {
        try {
            const response = await api.post('/nampan/nampanproduk/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async pindahNampanProduk(payload) {
        try {
            const response = await api.post('/nampan/nampanproduk/update', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteNampanProduk(payload) {
        try {
            const response = await api.post('/nampan/nampanproduk/delete', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
