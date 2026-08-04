import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete, confirmFinal } from '../../../utilities/confirm/confirm';
import { usePagination } from '../../../utilities/pagination/usePagination';

import { perbaikanService } from '../services/perbaikanService';

const toast = useToast();
const perbaikan = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

export function usePerbaikan() {

    const fetchPerbaikan = async () => {
        isLoading.value = true;
        try {
            const response = await perbaikanService.getPerbaikan();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                perbaikan.value = response.data;
            } else if (Array.isArray(response)) {
                perbaikan.value = response;
            } else {
                perbaikan.value = [];
            }
        } catch (error) {
            perbaikan.value = [];
            toast.error('Gagal mengambil data perbaikan.');
        } finally {
            isLoading.value = false;
        }
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    // Jauh lebih ringkas tanpa mengotori shared state!
    const handleFinal = async (item) => {
        const confirm = await confirmFinal(
            'Apakah Anda yakin?',
            `Data Perbaikan "${item.kode}" yang difinal tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await perbaikanService.finalPerbaikan({ kode: item.id });
                toast.success('Perbaikan berhasil difinal.');
                await fetchPerbaikan();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // Jauh lebih ringkas tanpa mengotori shared state!
    const handleBatal = async (item) => {
        const confirm = await confirmDelete(
            'Apakah Anda yakin?',
            `Data Perbaikan "${item.kode}" yang dibatalkan tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await perbaikanService.batalPerbaikan({ kode: item.id });
                toast.success('Perbaikan berhasil dihapus.');
                await fetchPerbaikan();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredPerbaikan = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return perbaikan.value.filter(item =>
            (item.kode || '').toLowerCase().includes(query) ||
            (item.produk?.kodeproduk || '').toLowerCase().includes(query)||
            (item.kondisi?.kondisi || '').toLowerCase().includes(query) ||
            (item.tanggalmasuk || '').toLowerCase().includes(query) ||
            (item.produk?.tanggalkeluar || '').toLowerCase().includes(query)
        );
    });

    const {
        currentPage: currentPagePerbaikan,
        totalItems: totalItemsPerbaikan,
        totalPages: totalPagesPerbaikan,
        paginatedData: paginatedPerbaikan,
        showingItems: showingItemsPerbaikan,
        startItem: startItemPerbaikan,
        endItem: endItemPerbaikan,
        visiblePages: visiblePagesPerbaikan,
        goFirst: goFirstPerbaikan,
        goLast: goLastPerbaikan,
        nextPage: nextPagePerbaikan,
        prevPage: prevPagePerbaikan,
    } = usePagination(filteredPerbaikan, 10);



    return {
        perbaikan,
        isLoading,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,

        fetchPerbaikan,
        handleFinal,
        handleBatal,
        currentPagePerbaikan,
        totalItemsPerbaikan,
        totalPagesPerbaikan,
        paginatedPerbaikan,
        showingItemsPerbaikan,
        startItemPerbaikan,
        endItemPerbaikan,
        visiblePagesPerbaikan,
        goFirstPerbaikan,
        goLastPerbaikan,
        nextPagePerbaikan,
        prevPagePerbaikan
    }
}
