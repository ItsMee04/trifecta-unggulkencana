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
const chartCategories = ref([]);
const chartSeries = ref([]);
const pieLabels = ref([]);
const pieSeries = ref([]);
const TransaksiPenjualanSatuMinggu = ref([]);

export function useHome() {
    const fetchTotalProduk = async () => {
        isLoading.value = true;
        try {
            const response = await homeService.getTotalProduk();
            totalProduk.value = response.data;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Gagal mengambil total produk'
            );
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
            toast.error(
                error.response?.data?.message ||
                'Gagal mengambil total penjualan hari ini'
            );
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
            toast.error(
                error.response?.data?.message ||
                'Gagal mengambil total pembelian hari ini'
            );
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
            toast.error(
                error.response?.data?.message ||
                'Gagal mengambil total pelanggan'
            );
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
            toast.error(
                error.response?.data?.message ||
                'Gagal mengambil total pemasukan'
            );
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
            toast.error(
                error.response?.data?.message ||
                'Gagal mengambil total pengeluaran'
            );
            console.error('Error fetching total pengeluaran:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchTransaksiChart = async () => {
        isLoading.value = true;
        try {
            const response = await homeService.getTransaksiChart();
            chartCategories.value = response.data.categories;
            chartSeries.value = response.data.series;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Gagal mengambil data chart transaksi'
            );
            console.error('Error fetching transaksi chart:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchProdukTerlarisChart = async () => {
        isLoading.value = true;

        try {
            const response = await homeService.getProdukTerlarisChart();

            pieLabels.value = response.data.labels;
            pieSeries.value = response.data.series;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Gagal mengambil data produk terlaris'
            );
            console.error('Error fetching produk terlaris:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchTransaksiPenjualanSatuMinggu = async () => {
        isLoading.value = true;
        try {
            const response = await homeService.getTransaksiPenjualanSatuMinggu();
            TransaksiPenjualanSatuMinggu.value = response.data;
        } catch(error) {
            toast.error(
                error.response?.data?.message ||
                'Gagal mengambil data transaksi 7 hari terakhir'
            );
            console.error('Error fetching transaksi chart:', error);
        } finally {
            isLoading.value = false;
        }
    }

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
        fetchTotalPengeluaranTransaksiHariIni,

        chartCategories,
        chartSeries,
        fetchTransaksiChart,

        pieLabels,
        pieSeries,
        fetchProdukTerlarisChart,

        TransaksiPenjualanSatuMinggu,
        fetchTransaksiPenjualanSatuMinggu,
    };
}
