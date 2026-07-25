import api from '../../../utilities/api/apiClient';

export const inventoryService = {
    async getPeriodeStok() {
        try {
            const response = await api.get('/inventory');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async storePeriodeStok(payload) {
        try {
            const response = await api.post('/inventory/store', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getNampanProdukByPeriodeStok(payload) {
        try {
            const response = await api.post('/inventory/getNampanProdukByPeriodeStok', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getRekapStokByPeriode(payload) {
        try {
            const response = await api.post('/inventory/getRekapStokByPeriode', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async finalPeriodeStok(payload) {
        try {
            const response = await api.post('/inventory/finalPeriodeStok', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
