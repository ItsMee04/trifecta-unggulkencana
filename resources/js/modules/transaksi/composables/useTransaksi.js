import { ref, computed } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';
import { transaksiService } from '../services/transaksiService';

const toast = useToast();
const transaksi = ref([]);

const isLoading = ref(false);
const isLoadingNota = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);

// State Modal Nota & Data Nota
const isNotaModalOpen = ref(false);
const selectedNotaData = ref(null);

const errors = ref({});

export function useTransaksi() {

    const fetchTransaksi = async () => {
        isLoading.value = true;
        try {
            const response = await transaksiService.getTransaksiPenjualan();

            if (response && Array.isArray(response.data)) {
                transaksi.value = response.data;
            } else if (Array.isArray(response)) {
                transaksi.value = response;
            } else {
                transaksi.value = [];
            }
        } catch (error) {
            transaksi.value = [];
            toast.error('Gagal mengambil data transaksi.');
        } finally {
            isLoading.value = false;
        }
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const closeNotaModal = () => {
        isNotaModalOpen.value = false;
        selectedNotaData.value = null;
    };

    const handleView = async (item) => {
        isLoadingNota.value = true;
        isNotaModalOpen.value = true;

        try {
            const kodeTransaksi = item.kode || item.kode_transaksi;
            const response = await transaksiService.getNotaData({
                params: { kode: kodeTransaksi }
            });

            if (response && response.status) {
                selectedNotaData.value = response.notaData;
            } else {
                toast.error('Data nota tidak ditemukan.');
                closeNotaModal();
            }
        } catch (error) {
            toast.error('Gagal memuat data nota.');
            closeNotaModal();
        } finally {
            isLoadingNota.value = false;
        }
    };

    const handleBatal = async (item) => {
        const confirm = await confirmDelete(
            'Apakah Anda yakin?',
            `Data Perbaikan "${item.kode}" yang dibatalkan tidak dapat dikembalikan!`
        );

        if (confirm) {
            isLoading.value = true;
            try {
                await transaksiService.batalTransaksi({ kode: item.id });
                toast.success('Perbaikan berhasil dihapus.');
                await fetchTransaksi();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    const filteredTransaksi = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return transaksi.value.filter(item =>
            (item.kode || '').toLowerCase().includes(query) ||
            (item.produk?.kodeproduk || '').toLowerCase().includes(query)
        );
    });

    const paginatedTransaksi = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredTransaksi.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredTransaksi.value.length / itemsPerPage.value) || 1;
    });

    return {
        transaksi,
        isLoading,
        isLoadingNota,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        isNotaModalOpen,
        selectedNotaData,
        handleView,
        handleBatal,
        closeModal,
        closeNotaModal,
        errors,

        fetchTransaksi,
        paginatedTransaksi,
        totalPages,
    };
}
