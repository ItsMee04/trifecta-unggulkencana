import { ref, computed, reactive, watch } from "vue";
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';
import { usePagination } from '../../../utilities/pagination/usePagination';

import { nampanprodukService } from '../services/nampanprodukService';
import { nampanService } from "../../nampan/services/nampanService";

const toast = useToast();

// ─── SHARED STATE (Sinkron otomatis antarkomponen) ───
const nampan = ref([]);
const nampanproduk = ref([]);
const produk = ref([]);
const selectedNampanId = ref(null);
const isModalOpen = ref(false);       // Modal Tambah Produk
const isPindahModalOpen = ref(false); // Modal Pindah Produk

const isLoading = ref(false);
const isLoadingNampanProduk = ref(false);
const isLoadingProduk = ref(false);

const searchNampanQuery = ref('');
const searchNampanProdukQuery = ref('');
const searchProdukQuery = ref('');

const currentPage = ref(1);
const currentPageNampanProduk = ref(1);
const currentPageProduk = ref(1);

const itemsPerPageNampan = ref(5);
const itemsPerPageNampanProduk = ref(10);
const itemsPerPageProduk = ref(10);

const isEdit = ref(false);
const errors = ref({});
const selectedProdukIds = ref([]);
const targetPindahItem = ref(null);

const formNampanProduk = reactive({
    id: null,
    produk: '',
    nampantujuan_id: '' // Properti utama tanpa underscore (_)
});

// ─── WATCHER GLOBAL OTOMATIS ───
watch(selectedNampanId, (newId) => {
    if (newId) {
        currentPageNampanProduk.value = 1;
        fetchNampanProdukInternal();
    }
});

// Fungsi fetch internal agar bisa diakses langsung oleh watcher di luar scope fungsi
const fetchNampanProdukInternal = async () => {
    if (!selectedNampanId.value) return;

    isLoadingNampanProduk.value = true;
    try {
        const payload = { id: selectedNampanId.value };
        const response = await nampanprodukService.getNampanProdukByNampan(payload);

        if (response && Array.isArray(response.data)) {
            nampanproduk.value = response.data;
        } else if (Array.isArray(response)) {
            nampanproduk.value = response;
        } else {
            nampanproduk.value = [];
        }
    } catch (error) {
        console.error('Error fetching nampan produk:', error);
        nampanproduk.value = [];
    } finally {
        isLoadingNampanProduk.value = false;
    }
};

export function useNampanProduk() {

    // ─── API ACTIONS & METHODS ───
    const fetchNampan = async () => {
        isLoading.value = true;
        try {
            const response = await nampanService.getNampan();
            if (response && Array.isArray(response.data)) {
                nampan.value = response.data;
            } else if (Array.isArray(response)) {
                nampan.value = response;
            } else {
                nampan.value = [];
            }
        } catch (error) {
            console.error('Error fetching nampan:', error);
            nampan.value = [];
            toast.error('Gagal mengambil data nampan.');
        } finally {
            isLoading.value = false;
        }
    };

    const fetchNampanProduk = async () => {
        await fetchNampanProdukInternal();
    };

    const handlePilihNampan = (item) => {
        selectedNampanId.value = item.id;
    };

    const handleCreate = async () => {
        if (!selectedNampanId.value) {
            toast.error("Silahkan pilih nampan terlebih dahulu!");
            return false;
        }

        isEdit.value = false;
        const jenisProdukId = selectedNampanData.value?.jenisproduk_id || selectedNampanData.value?.jenisproduk?.id;
        isLoadingProduk.value = true;
        isModalOpen.value = true;

        try {
            const payload = { jenisproduk: jenisProdukId };
            const response = await nampanprodukService.getProdukByJenisNampan(payload);

            if (response && Array.isArray(response.data)) {
                produk.value = response.data;
            } else if (Array.isArray(response)) {
                produk.value = response;
            } else {
                produk.value = [];
            }
        } catch (error) {
            console.error('Error fetching produk by jenis nampan:', error);
            produk.value = [];
        } finally {
            isLoadingProduk.value = false;
        }

        errors.value = {};
        selectedProdukIds.value = [];
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
        selectedProdukIds.value = [];
    };

    const submitProduk = async () => {
        if (selectedProdukIds.value.length === 0) {
            toast.error("Silahkan pilih setidaknya satu produk!");
            return;
        }

        if (!selectedNampanId.value) {
            toast.error("Data nampan tidak ditemukan!");
            return;
        }

        isLoadingProduk.value = true;
        try {
            const payload = {
                nampan_id: selectedNampanId.value,
                produk_id: selectedProdukIds.value
            };

            const response = await nampanprodukService.storeNampanProduk(payload);
            toast.success(response?.data?.message || response?.message || "Produk berhasil ditambahkan.");

            closeModal();
            await fetchNampanProdukInternal();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.";
            toast.error(errorMessage);
        } finally {
            isLoadingProduk.value = false;
        }
    };

    const handlePindah = (item) => {
        isEdit.value = true;
        errors.value = {};
        targetPindahItem.value = item;

        formNampanProduk.id = item.id;
        formNampanProduk.produk = item.produk?.nama || '-';
        formNampanProduk.nampantujuan_id = '';

        isPindahModalOpen.value = true;
    };

    const closePindahModal = () => {
        isPindahModalOpen.value = false;
        errors.value = {};
    };

    const submitPindah = async () => {
        if (!formNampanProduk.nampantujuan_id) {
            toast.error("Silahkan pilih nampan tujuan!");
            return;
        }

        isLoadingProduk.value = true;
        try {
            const payload = {
                produk: formNampanProduk.id,
                nampan: formNampanProduk.nampantujuan_id?.id || formNampanProduk.nampantujuan_id
            };

            const response = await nampanprodukService.pindahNampanProduk(payload);
            toast.success(response?.message || "Produk berhasil dipindahkan.");

            closePindahModal();
            await fetchNampanProdukInternal();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Gagal memindahkan produk.";
            toast.error(errorMessage);
        } finally {
            isLoadingProduk.value = false;
        }
    };

    const handleDelete = async (item) => {
        const confirm = await confirmDelete(
            'Apakah Anda yakin?',
            `Data Produk "${item.produk?.nama || 'Ini'}" yang dikeluarkan dari nampan tidak dapat dikembalikan!`
        );

        if (confirm) {
            isLoadingNampanProduk.value = true;
            try {
                const payload = { produk: item.id };
                await nampanprodukService.deleteNampanProduk(payload);
                toast.success('Produk berhasil dikeluarkan dari nampan.');
                await fetchNampanProdukInternal();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data produk dari nampan.';
                toast.error(errorMessage);
            } finally {
                isLoadingNampanProduk.value = false;
            }
        }
    };

    const handleRefresh = async () => {
        await fetchNampan();
        if (selectedNampanId.value) await fetchNampanProdukInternal();
    };

    // ─── COMPUTED DATA & FILTER DATA ───
    const selectedNampanData = computed(() => {
        return nampan.value.find(item => item.id === selectedNampanId.value) || {};
    });

    const availableNampanTujuan = computed(() => {
        if (!targetPindahItem.value) return [];
        const jenisIdTarget = targetPindahItem.value.produk?.jenisproduk_id;

        return nampan.value.filter(n =>
            n.jenisproduk_id === jenisIdTarget && n.id !== selectedNampanId.value
        );
    });

    // ─── FILTER & PAGINATION: NAMPAN (LIST) ───
    const filteredNampan = computed(() => {
        const query = String(searchNampanQuery.value || '').toLowerCase();
        return nampan.value.filter(item =>
            String(item.nampan ?? '').toLowerCase().includes(query) ||
            String(item.jenisproduk?.jenis ?? '').toLowerCase().includes(query)
        );
    });

    const {
        currentPage: currentPageNampan,
        totalItems: totalItemsNampan,
        totalPages: totalPagesNampan,
        paginatedData: paginatedNampan,
        showingItems: showingItemsNampan,
        startItem: startItemNampan,
        endItem: endItemNampan,
        visiblePages: visiblePagesNampan,
        goFirst: goFirstNampan,
        goLast: goLastNampan,
        nextPage: nextPageNampan,
        prevPage: prevPageNampan
    } = usePagination(
        filteredNampan, 5
    );

    // ─── FILTER & PAGINATION: NAMPAN PRODUK (TABLE DETAIL) ───
    const filteredNampanProduk = computed(() => {
        const query = String(searchNampanProdukQuery.value || '').toLowerCase();
        return nampanproduk.value.filter(item =>
            String(item.produk?.kodeproduk ?? '').toLowerCase().includes(query) ||
            String(item.produk?.nama ?? '').toLowerCase().includes(query) ||
            String(item.jenis ?? '').toLowerCase().includes(query) ||
            String(item.tanggal ?? '').toLowerCase().includes(query)
        );
    });

    const {
        currentPage: currentPageNampanProduk,
        totalItems: totalItemsNampanProduk,
        totalPages: totalPagesNampanProduk,
        paginatedData: paginatedNampanProduk,
        showingItems: showingItemsNampanProduk,
        startItem: startItemNampanProduk,
        endItem: endItemNampanProduk,
        visiblePages: visiblePagesNampanProduk,
        goFirst: goFirstNampanProduk,
        goLast: goLastNampanProduk,
        nextPage: nextPageNampanProduk,
        prevPage: prevPageNampanProduk
    } = usePagination(
        filteredNampanProduk, 10
    );

    // ─── FILTER & PAGINATION: PRODUK MASTER (MODAL) ───
    const filteredProduk = computed(() => {
        const query = String(searchProdukQuery.value || '').toLowerCase();
        return produk.value.filter(item =>
            String(item.kodeproduk ?? '').toLowerCase().includes(query) ||
            String(item.nama ?? '').toLowerCase().includes(query)
        );
    });

    const {
        currentPage: currentPageProduk,
        totalItems: totalItemsProduk,
        totalPages: totalPagesProduk,
        paginatedData: paginatedProduk,
        showingItems: showingItemsProduk,
        startItem: startItemProduk,
        endItem: endItemProduk,
        visiblePages: visiblePagesProduk,
        goFirst: goFirstProduk,
        goLast: goLastProduk,
        nextPage: nextPageProduk,
        prevPage: prevPageProduk
    } = usePagination(
        filteredProduk, 10
    );

    return {
        // State & Query
        nampan,
        nampanproduk,
        produk,
        selectedNampanId,
        selectedNampanData,
        searchNampanQuery,
        searchNampanProdukQuery,
        searchProdukQuery,
        isModalOpen,
        isPindahModalOpen,

        // Loading
        isLoading,
        isLoadingNampanProduk,
        isLoadingProduk,

        // Pagination Nampan
        currentPageNampan,
        paginatedNampan,
        totalPagesNampan,
        totalItemsNampan,
        showingItemsNampan,
        startItemNampan,
        endItemNampan,
        visiblePagesNampan,
        goFirstNampan,
        goLastNampan,
        nextPageNampan,
        prevPageNampan,

        // Pagination Nampan Produk
        currentPageNampanProduk,
        paginatedNampanProduk,
        totalPagesNampanProduk,
        totalItemsNampanProduk,
        showingItemsNampanProduk,
        startItemNampanProduk,
        endItemNampanProduk,
        visiblePagesNampanProduk,
        goFirstNampanProduk,
        goLastNampanProduk,
        nextPageNampanProduk,
        prevPageNampanProduk,

        // Pagination Produk
        currentPageProduk,
        paginatedProduk,
        totalPagesProduk,
        totalItemsProduk,
        showingItemsProduk,
        startItemProduk,
        endItemProduk,
        visiblePagesProduk,
        goFirstProduk,
        goLastProduk,
        nextPageProduk,
        prevPageProduk,

        // Filter
        filteredNampan,
        filteredNampanProduk,
        filteredProduk,

        // Form
        isEdit,
        errors,
        formNampanProduk,
        targetPindahItem,
        availableNampanTujuan,
        selectedProdukIds,

        // Actions
        fetchNampan,
        fetchNampanProduk,
        handlePilihNampan,
        handleCreate,
        closeModal,
        submitProduk,
        closePindahModal,
        handlePindah,
        submitPindah,
        handleDelete,
        handleRefresh,
    };
}
