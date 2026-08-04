import { ref, computed, reactive, watch } from "vue";
import { useToast } from "../../../utilities/toast/toast";
import { confirmDelete, confirmFinal} from "../../../utilities/confirm/confirm";
import { usePagination } from "../../../utilities/pagination/usePagination";
import { inventoryService } from "../services/inventoryService";

const toast = useToast();

const PeriodeStok = ref([]);
const selectedPeriodeStokID = ref(null);
const isLoadingPeriodeStok = ref(true); // Default true untuk cegah kedip UI
const searchPeriodeStok = ref('');
const currentPagePeriodeStok = ref(1);
const itemsPerPagePeriodeStok = 5;

const nampanproduk = ref([]);
const isLoadingNampanProduk = ref(false);
const searchNampanProduk = ref('');
const currentPageNampanProduk = ref(1);
const itemsPerPageNampanProduk = 10;

const rekapstok = ref([]);

const formPeriode = reactive({
    periode: ''
});

const errors = ref({});

const fetchNampanProduk = async () => {
    if (!selectedPeriodeStokID.value) return;

    isLoadingNampanProduk.value = true;
    try {
        const payload = {
            periode: selectedPeriodeStokID.value
        };
        const response = await inventoryService.getNampanProdukByPeriodeStok(payload);
        nampanproduk.value = Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
        nampanproduk.value = [];
        toast.error(error.response?.data?.message || 'Gagal mengambil data produk nampan.');
    } finally {
        isLoadingNampanProduk.value = false;
    }
};

const fetchRekapStok = async () => {
    if (!selectedPeriodeStokID.value) return;

    isLoadingNampanProduk.value = true;
    try {
        const payload = {
            periode: selectedPeriodeStokID.value
        };
        const response = await inventoryService.getRekapStokByPeriode(payload);

        if (response && response.rekap) {
            rekapstok.value = response.rekap;
        } else if (response?.data && response.data.rekap) {
            rekapstok.value = response.data.rekap;
        } else {
            rekapstok.value = Array.isArray(response) ? response : [];
        }
    } catch (error) {
        rekapstok.value = [];
        toast.error(error.response?.data?.message || 'Gagal mengambil data rekap stok.');
    } finally {
        isLoadingNampanProduk.value = false;
    }
};

watch(selectedPeriodeStokID, (newId) => {
    if (newId) {
        currentPageNampanProduk.value = 1;
        fetchNampanProduk();
        fetchRekapStok();
    }
});

export function useInventory() {

    const fetchPeriodeStok = async () => {
        isLoadingPeriodeStok.value = true;
        try {
            const response = await inventoryService.getPeriodeStok();
            PeriodeStok.value = Array.isArray(response) ? response : (response?.data || []);
        } catch (error) {
            PeriodeStok.value = [];
            toast.error(error.response?.data?.message || 'Gagal mengambil data periode stok.');
        } finally {
            isLoadingPeriodeStok.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};

        if (!formPeriode.periode || formPeriode.periode.trim() === '') {
            errors.value.periode = ["Tanggal tidak boleh kosong."];
            toast.error("Tanggal tidak boleh kosong.");
        }

        return Object.keys(errors.value).length === 0;
    };

    const handleCreatePeriode = async () => {
        if (!validateForm()) return false;

        isLoadingPeriodeStok.value = true;

        try {
            const payload = {
                periode: formPeriode.periode
            };

            const response = await inventoryService.storePeriodeStok(payload);
            toast.success(response?.message || 'Data berhasil disimpan');

            formPeriode.periode = '';
            await fetchPeriodeStok();
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Gagal menyimpan data.';
            toast.error(errorMessage);
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
            return false;
        } finally {
            isLoadingPeriodeStok.value = false;
        }
    };

    const selectPeriodeStok = (id) => {
        selectedPeriodeStokID.value = id;
    };

    const selectedPeriodeStokData = computed(() => {
        return PeriodeStok.value.find(item => item.id === selectedPeriodeStokID.value) || {};
    });

    const handlePilihPeriodeStok = (item) => {
        selectPeriodeStok(item.id);
    };

    const resetProductData = () => {
        selectedPeriodeStokID.value = null;
        nampanproduk.value = [];
        rekapstok.value = [];
        searchNampanProduk.value = '';
        currentPageNampanProduk.value = 1;
    };

    const handlePrint = async () => {
        const dataAktif = selectedPeriodeStokData.value;

        if (!dataAktif || !dataAktif.id) {
            toast.error("Silahkan pilih periode terlebih dahulu.");
            return;
        }

        const payload = {
            PERIODE: dataAktif.periode,
        };

        try {
            const { url } = await inventoryService.CetakLaporanStok(payload);
            window.open(url, '_blank');
        } catch (e) {
            toast.error('Gagal mencetak laporan');
        }
    };

    const handleRefresh = async () => {
        resetProductData();
        await fetchPeriodeStok();
    };

    const handleFinalisasiPeriode = async (item) => {
        const confirm = await confirmFinal(
            'Apakah Anda yakin?',
            `Periode "${item.kode}" akan difinalkan?`
        );

        if (confirm) {
            isLoadingPeriodeStok.value = true;
            try {
                const payload = {
                    id: item.id,
                };
                await inventoryService.finalPeriodeStok(payload);

                toast.success('Periode Stok berhasil difinal.');
                await fetchPeriodeStok();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal memfinal periode stok.';
                toast.error(errorMessage);
            } finally {
                isLoadingPeriodeStok.value = false;
            }
        }
    };

    // ─── COMPUTED PROPERTIES & PAGINATION ───
    const filteredPeriodeStok = computed(() => {
        const query = String(searchPeriodeStok.value || '').toLowerCase();
        return (PeriodeStok.value || []).filter(item =>
            String(item.kode ?? '').toLowerCase().includes(query) ||
            String(item.periode ?? '').toLowerCase().includes(query)
        );
    });

    const {
        currentPage: currentPagePeriodeStok,
        totalItems: totalItemsPeriodeStok,
        totalPages: totalPagesPeriodeStok,
        paginatedData: paginatedPeriodeStok,
        showingItems: showingItemsPeriodeStok,
        startItem: startItemPeriodeStok,
        endItem: endItemPeriodeStok,
        visiblePages: visiblePagesPeriodeStok,
        goFirst: goFirstPeriodeStok,
        goLast: goLastPeriodeStok,
        nextPage: nextPagePeriodeStok,
        prevPage: prevPagePeriodeStok
    } = usePagination(filteredPeriodeStok, 5);

    // const paginatedPeriodeStok = computed(() => {
    //     const start = (currentPagePeriodeStok.value - 1) * itemsPerPagePeriodeStok;
    //     return filteredPeriodeStok.value.slice(start, start + itemsPerPagePeriodeStok);
    // });

    // const totalPagesPeriodeStok = computed(() => {
    //     return Math.ceil(filteredPeriodeStok.value.length / itemsPerPagePeriodeStok) || 1;
    // });

    // const displayedPagesPeriodeStok = computed(() => {
    //     const total = totalPagesPeriodeStok.value;
    //     const current = currentPagePeriodeStok.value;
    //     const maxVisible = 3;

    //     let start = Math.max(current - Math.floor(maxVisible / 2), 1);
    //     let end = start + maxVisible - 1;

    //     if (end > total) {
    //         end = total;
    //         start = Math.max(end - maxVisible + 1, 1);
    //     }

    //     const pages = [];
    //     for (let i = start; i <= end; i++) {
    //         pages.push(i);
    //     }
    //     return pages;
    // });

    const filteredNampanProduk = computed(() => {
        const query = String(searchNampanProduk.value || '').toLowerCase();
        return (nampanproduk.value || []).filter(item =>
            String(item.produk?.kodeproduk ?? '').toLowerCase().includes(query) ||
            String(item.produk?.nama ?? '').toLowerCase().includes(query) ||
            String(item.jenis ?? '').toLowerCase().includes(query) ||
            String(item.tanggal ?? '').toLowerCase().includes(query)
        );
    });

    // const paginatedNampanProduk = computed(() => {
    //     const start = (currentPageNampanProduk.value - 1) * itemsPerPageNampanProduk;
    //     return filteredNampanProduk.value.slice(start, start + itemsPerPageNampanProduk);
    // });

    // const totalPagesNampanProduk = computed(() => {
    //     return Math.ceil(filteredNampanProduk.value.length / itemsPerPageNampanProduk) || 1;
    // });

    // const displayedPagesNampanProduk = computed(() => {
    //     const total = totalPagesNampanProduk.value;
    //     const current = currentPageNampanProduk.value;
    //     const maxVisible = 5;

    //     let start = Math.max(current - Math.floor(maxVisible / 2), 1);
    //     let end = start + maxVisible - 1;

    //     if (end > total) {
    //         end = total;
    //         start = Math.max(end - maxVisible + 1, 1);
    //     }

    //     const pages = [];
    //     for (let i = start; i <= end; i++) {
    //         pages.push(i);
    //     }
    //     return pages;
    // });

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
    } = usePagination(filteredNampanProduk, 10);

    return {
        formPeriode,
        handleCreatePeriode,
        handleRefresh,
        errors,

        searchPeriodeStok,
        isLoadingPeriodeStok,
        PeriodeStok,
        fetchPeriodeStok,
        selectedPeriodeStokID,
        selectPeriodeStok,
        selectedPeriodeStokData,
        handlePilihPeriodeStok,
        handleFinalisasiPeriode,
        filteredPeriodeStok,

        currentPagePeriodeStok,
        totalItemsPeriodeStok,
        totalPagesPeriodeStok,
        paginatedPeriodeStok,
        showingItemsPeriodeStok,
        startItemPeriodeStok,
        endItemPeriodeStok,
        visiblePagesPeriodeStok,
        goFirstPeriodeStok,
        goLastPeriodeStok,
        nextPagePeriodeStok,
        prevPagePeriodeStok,

        searchNampanProduk,
        isLoadingNampanProduk,
        nampanproduk,
        fetchNampanProduk,
        rekapstok,
        handlePrint,
        filteredNampanProduk,

        currentPageNampanProduk,
        totalItemsNampanProduk,
        totalPagesNampanProduk,
        paginatedNampanProduk,
        showingItemsNampanProduk,
        startItemNampanProduk,
        endItemNampanProduk,
        visiblePagesNampanProduk,
        goFirstNampanProduk,
        goLastNampanProduk,
        nextPageNampanProduk,
        prevPageNampanProduk,
    };
}
