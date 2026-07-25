import { ref, computed } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';
import { pembelianService } from '../services/pembelianService';

const toast = useToast();
const pembelian = ref([]);

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

export function usePembelian() {

    const fetchPembelian = async () => {
        isLoading.value = true;
        try {
            const response = await pembelianService.getTransaksiPembelian();

            if (response && Array.isArray(response.data)) {
                pembelian.value = response.data;
            } else if (Array.isArray(response)) {
                pembelian.value = response;
            } else {
                pembelian.value = [];
            }
        } catch (error) {
            pembelian.value = [];
            toast.error('Gagal mengambil data pembelian.');
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
            const response = await pembelianService.getNotaData({
                kode:kodeTransaksi
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
            `Data Transaksi "${item.kode}" yang dibatalkan tidak dapat dikembalikan!`
        );

        if (confirm) {
            isLoading.value = true;
            try {
                await pembelianService.batalTransaksiPembelian({ kode: item.id });
                toast.success('Pembelian berhasil dibatalkan.');
                await fetchPembelian();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    const filteredPembelian = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return pembelian.value.filter(item =>
            (item.kode || '').toLowerCase().includes(query) ||
            (item.produk?.kodeproduk || '').toLowerCase().includes(query)
        );
    });

    const paginatedPembelian = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredPembelian.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredPembelian.value.length / itemsPerPage.value) || 1;
    });

    return {
        pembelian,
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

        fetchPembelian,
        paginatedPembelian,
        totalPages,
    };
}
