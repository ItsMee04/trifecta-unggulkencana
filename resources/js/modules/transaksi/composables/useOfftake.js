import { ref, computed } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';
import { offtakeService } from '../services/offtakeService';

const toast = useToast();
const offtake = ref([]);

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

export function useOfftake() {

    const fetchOfftake = async () => {
        isLoading.value = true;
        try {
            const response = await offtakeService.getTransaksiOfftake();

            if (response && Array.isArray(response.data)) {
                offtake.value = response.data;
            } else if (Array.isArray(response)) {
                offtake.value = response;
            } else {
                offtake.value = [];
            }
        } catch (error) {
            offtake.value = [];
            toast.error('Gagal mengambil data transaksi offtake.');
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
            // 1. Ambil kode transaksi dari item
            const kodeTransaksi = item.kode || item.kode_transaksi || item.kode_offtake;

            if (!kodeTransaksi) {
                toast.error('Kode transaksi tidak ditemukan.');
                closeNotaModal();
                return;
            }

            // 2. Kirim objek { kode: kodeTransaksi } LANGSUNG tanpa dibungkus 'params:'
            const response = await offtakeService.getNotaData({
                kode: kodeTransaksi
            });

            if (response && response.status) {
                selectedNotaData.value = response.notaData;
            } else {
                toast.error('Data nota tidak ditemukan.');
                closeNotaModal();
            }
        } catch (error) {
            console.error('Error fetching nota:', error);
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
                await offtakeService.batalTransaksiOfftake({ kode: item.id });
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

    const filteredOfftake = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return offtake.value.filter(item =>
            (item.kode || '').toLowerCase().includes(query) ||
            (item.produk?.kodeproduk || '').toLowerCase().includes(query)
        );
    });

    const paginatedOfftake = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredOfftake.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredOfftake.value.length / itemsPerPage.value) || 1;
    });

    return {
        offtake,
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

        fetchOfftake,
        paginatedOfftake,
        totalPages,
    };
}
