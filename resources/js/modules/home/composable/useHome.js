import { ref } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { homeService } from '../services/homeService';

const isLoading = ref(false);
const toast = useToast();

const totalProduk = ref(0);
const totalPenjualanHariIni = ref(0);

export function useHome() {
    const fetchTotalProduk = async () => {
        isLoading.value = true;
        try {
            const response = await homeService.getTotalProduk();
            totalProduk.value = response.data;
        } catch (error) {
            toast.error(response.message || 'Gagal mengambil total produk');
            console.error('Error fetching total produk:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchTotalPenjualanHariIni = async () => {
        isLoading.value = true;
        try {
            const response = await homeService.getTotalPenjualanHariIni();
            totalPenjualanHariIni.value = response.data;
        } catch (error) {
            toast.error(response.message || 'Gagal mengambil total penjualan hari ini');
            console.error('Error fetching total penjualan hari ini:', error);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,

        totalProduk,
        fetchTotalProduk,

        totalPenjualanHariIni,
        fetchTotalPenjualanHariIni,
    };
}
