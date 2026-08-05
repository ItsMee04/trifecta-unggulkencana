import { ref } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { homeService } from '../services/homeService';

const isLoading = ref(false);
const toast = useToast();

const totalProduk = ref(0);
const totalPenjualanHariIni = ref(0);
const totalPembelianHariIni = ref(0);
const totalPelanggan = ref(0);
const totalPemasukanTransaksiHariIni = ref(0);
const totalPengeluaranTransaksiHariIni = ref(0);

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

    const fetchTotalPembelianHariIni = async () => {
        isLoading.value = true;
        try {
            const response = await homeService.getTotalPembelianHariIni();
            totalPembelianHariIni.value = response.data;
        } catch (error) {
            toast.error(response.message || 'Gagal mengambil total pembelian hari ini');
            console.error('Error fetching total pembelian hari ini:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchTotalPelanggan = async () => {
        isLoading.value = true;
        try {
            const response = await homeService.getTotalPelanggan();
            totalPelanggan.value = response.data;
        } catch (error) {
            toast.error(response.message || 'Gagal mengambil total pelanggan');
            console.error('Error fetching total pelanggan:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchTotalPemasukanTransaksiHariIni = async () => {
        isLoading.value = true;
        try {
            const response = await homeService.getTotalPemasukanHariIni();
            totalPemasukanTransaksiHariIni.value = response.data;
        } catch (error) {
            toast.error(response.message || 'Gagal mengambil total pemasukan');
            console.error('Error fetching total pemasukan:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchTotalPengeluaranTransaksiHariIni = async () => {
        isLoading.value = true;
        try {
            const response = await homeService.getTotalPengeluaranHariIni();
            totalPengeluaranTransaksiHariIni.value = response.data;
        } catch (error) {
            toast.error(response.message || 'Gagal mengambil total pengeluaran');
            console.error('Error fetching total pengeluaran:', error);
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

        totalPembelianHariIni,
        fetchTotalPembelianHariIni,

        totalPelanggan,
        fetchTotalPelanggan,

        totalPemasukanTransaksiHariIni,
        fetchTotalPemasukanTransaksiHariIni,

        totalPengeluaranTransaksiHariIni,
        fetchTotalPengeluaranTransaksiHariIni
    };
}
