import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

// SERVICE INSTANCES
import { jenisprodukService } from '../../jenisproduk/services/jenisprodukService';
import { nampanprodukService } from '../../nampanproduk/services/nampanprodukService';
import { pelangganService } from '../../pelanggan/services/pelangganService';
import { diskonService } from '../../diskon/services/diskonService';
import { transaksiService } from '../../transaksi/services/transaksiService';

const STORAGE_URL = import.meta.env.VITE_PRODUK_URL;

// --- SHARED STATE GLOBAL (SINGLETON) ---
const jenisprodukList = ref([]);
const selectedJenisProduk = ref('all');
const produk = ref([]);
const allProdukMaster = ref([]);
const PelangganList = ref([]);
const DiskonList = ref([]);
const TransaksiID = ref('');
const TransaksiDetail = ref([]);
const isLoading = ref(false);
const isLoadingProduk = ref(false);
const searchProdukQuery = ref('');
const currentPageProduk = ref(1);
const itemsPerPageProduk = 8;
const usePoint = ref(false);
const scanQuery = ref('');

const formPOS = reactive({
    id: null,
    pelanggan: null,
    diskon: null,
});

// UI Dropdowns state shared
const isPelangganDropdownOpen = ref(false);
const isDiskonDropdownOpen = ref(false);
const searchPelangganQuery = ref('');

export function usePOS() {
    const toast = useToast();

    // --- A. FETCHERS (API CALLS) ---
    const fetchJenisProduk = async () => {
        try {
            const response = await jenisprodukService.getJenisProduk();
            const rawData = response.data || [];
            const mappedData = rawData.map(item => ({
                id: item.id,
                jenis: item.jenis.toUpperCase(),
                value: item.id,
                label: item.jenis.toUpperCase()
            }));
            jenisprodukList.value = [
                { id: 'all', jenis: 'SEMUA', value: 'all', label: 'SEMUA' },
                ...mappedData
            ];
        } catch (error) {
            toast.error("Gagal memuat Jenis Produk");
        }
    };

    const fetchProdukByJenis = async (jenisId = 'all') => {
        isLoadingProduk.value = true;
        try {
            const payload = { jenis: jenisId };
            const response = await nampanprodukService.getProdukInNampanByJenis(payload);
            const data = response.data || [];
            produk.value = data;
            if (jenisId === 'all') allProdukMaster.value = data;
        } catch (error) {
            produk.value = [];
            toast.error("Gagal memuat data produk");
        } finally {
            isLoadingProduk.value = false;
        }
    };

    const fetchKodeTransaksi = async () => {
        try {
            const response = await transaksiService.getKodeTransaksi();
            const data = response.data || response;
            if (data && data.kode) {
                TransaksiID.value = data.kode;
                await fetchTransaksiDetail();
            }
        } catch (error) {
            toast.error("Gagal memuat nomor transaksi");
        }
    };

    const fetchTransaksiDetail = async () => {
        if (!TransaksiID.value) return;
        try {
            const response = await transaksiService.getTransaksiDetail(TransaksiID.value);
            TransaksiDetail.value = response.data || response || [];
        } catch (error) {
            console.error("Gagal memuat detail transaksi", error);
        }
    };

    const fetchPelanggan = async () => {
        try {
            const response = await pelangganService.getPelanggan();
            const rawData = response.data || response || [];
            PelangganList.value = rawData.map(item => ({
                value: item.id,
                label: item.nama.toUpperCase(),
                point: item.point || 0
            }));
        } catch (error) {
            toast.error("Gagal memuat data pelanggan");
        }
    };

    const fetchDiskon = async () => {
        try {
            const response = await diskonService.getDiskon();
            const rawData = response.data || [];
            DiskonList.value = rawData.map(item => ({
                value: item.id,
                label: `${(item.diskon || '').toUpperCase()} (${item.nilai}%)`,
                nilai: item.nilai
            }));
        } catch (error) {
            toast.error("Gagal memuat data diskon");
        }
    };

    // --- B. COMPUTED LOGIC (FILTERS & HITUNGAN) ---
    const selectedPelangganNama = computed(() => {
        if (!formPOS.pelanggan) return 'Pilih Pelanggan (Umum)';
        const found = PelangganList.value.find(p => p.value === formPOS.pelanggan);
        return found ? found.label : 'Pilih Pelanggan (Umum)';
    });

    const filteredPelangganList = computed(() => {
        const query = searchPelangganQuery.value.toLowerCase();
        return PelangganList.value.filter(p => String(p.label || '').toLowerCase().includes(query));
    });

    const selectedDiskonLabel = computed(() => {
        if (!formPOS.diskon) return 'Tanpa Diskon';
        const found = DiskonList.value.find(d => d.value === formPOS.diskon);
        return found ? found.label : 'Tanpa Diskon';
    });

    const selectedDiskonNilai = computed(() => {
        if (!formPOS.diskon) return 0;
        const found = DiskonList.value.find(d => d.value === formPOS.diskon);
        return found ? Number(found.nilai || 0) : 0;
    });

    const countItemsByJenis = computed(() => {
        const counts = {};
        counts['all'] = allProdukMaster.value.length;
        allProdukMaster.value.forEach(p => {
            if (p.jenisproduk_id !== undefined && p.jenisproduk_id !== null) {
                const id = String(p.jenisproduk_id);
                counts[id] = (counts[id] || 0) + 1;
            }
        });
        return counts;
    });

    const filteredProduk = computed(() => {
        const query = searchProdukQuery.value.toLowerCase();
        return produk.value.filter(item =>
            (item.kodeproduk ?? '').toLowerCase().includes(query) ||
            (item.nama ?? '').toLowerCase().includes(query)
        );
    });

    const totalPagesProduk = computed(() => Math.ceil(filteredProduk.value.length / itemsPerPageProduk) || 1);

    const paginatedProduk = computed(() => {
        const start = (currentPageProduk.value - 1) * itemsPerPageProduk;
        return filteredProduk.value.slice(start, start + itemsPerPageProduk);
    });

    const calculateSubtotal = computed(() => TransaksiDetail.value.reduce((acc, item) => acc + Number(item.total || 0), 0));
    const calculateDiskon = computed(() => (calculateSubtotal.value * Number(selectedDiskonNilai.value || 0)) / 100);
    const calculatePotonganPoint = computed(() => {
        if (!usePoint.value || !formPOS.pelanggan) return 0;
        const customer = PelangganList.value.find(p => p.value === formPOS.pelanggan);
        return customer ? Number(customer.point || 0) : 0;
    });
    const calculateGrandTotal = computed(() => {
        const total = calculateSubtotal.value - calculateDiskon.value - calculatePotonganPoint.value;
        return total < 0 ? 0 : total;
    });

    // --- C. ACTIONS (MUTATIONS) ---
    const selectCategory = async (id) => {
        selectedJenisProduk.value = id;
        currentPageProduk.value = 1;
        await fetchProdukByJenis(id);
    };

    const handlePilihProduk = async (item) => {
        if (!TransaksiID.value || TransaksiID.value.includes("Memuat")) {
            toast.error("Tunggu kode transaksi selesai dimuat");
            return;
        }
        await fetchTransaksiDetail();
        if (TransaksiDetail.value && TransaksiDetail.value.length >= 1) {
            toast.error("Gagal! 1 nomor transaksi hanya diperbolehkan untuk 1 produk.");
            return;
        }
        try {
            const payload = {
                kodeproduk: item.kodeproduk,
                kode: TransaksiID.value,
                harga: Number(item.harga || 0),
                berat: Number(item.berat || 0)
            };
            const response = await transaksiService.storeProdukToTransaksiDetail(payload);
            if (response) {
                toast.success("Produk berhasil ditambahkan ke keranjang");
                await fetchTransaksiDetail();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal menambahkan produk");
        }
    };

    const handleBarcodeScan = async () => {
        if (!scanQuery.value.trim()) return;
        await fetchTransaksiDetail();
        if (TransaksiDetail.value && TransaksiDetail.value.length >= 1) {
            toast.error("Gagal! 1 nomor transaksi hanya diperbolehkan untuk 1 produk.");
            scanQuery.value = '';
            return;
        }
        try {
            const payload = { kode: TransaksiID.value, kodeproduk: scanQuery.value };
            const response = await transaksiService.storeProdukToTransaksiDetail(payload);
            if (response) {
                toast.success("Produk berhasil ditambahkan");
                await fetchTransaksiDetail();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal men-scan produk");
        } finally {
            scanQuery.value = '';
        }
    };

    const handleDelete = async (item) => {
        const confirm = await confirmDelete('Apakah Anda yakin?', `Produk akan dikeluarkan dari daftar order!`);
        if (confirm) {
            isLoading.value = true;
            try {
                await transaksiService.batalTransaksiDetail({ id: item.id });
                toast.success('Produk berhasil dikeluarkan.');
                await fetchTransaksiDetail();
                await fetchKodeTransaksi();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Gagal menghapus data.');
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handleNextOrder = () => {
        formPOS.id = null;
        formPOS.pelanggan = null;
        formPOS.diskon = null;
        usePoint.value = false;
        TransaksiDetail.value = [];
        fetchKodeTransaksi();
    };

    const handlePayment = async () => {
        isLoading.value = true;
        try {
            const payload = {
                kode: TransaksiID.value,
                pelanggan_id: formPOS.pelanggan,
                diskon_id: formPOS.diskon,
                use_point: usePoint.value,
                grand_total: calculateGrandTotal.value
            };
            const response = await transaksiService.paymentTransaksi(payload);
            if (response) {
                toast.success("Transaksi berhasil diselesaikan");
                handleNextOrder();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan pembayaran.');
        } finally {
            isLoading.value = false;
        }
    };

    return {
        jenisprodukList, selectedJenisProduk, produk, allProdukMaster, PelangganList, DiskonList,
        TransaksiID, TransaksiDetail, isLoading, isLoadingProduk, searchProdukQuery, currentPageProduk,
        itemsPerPageProduk, usePoint, scanQuery, formPOS, STORAGE_URL, isPelangganDropdownOpen,
        isDiskonDropdownOpen, searchPelangganQuery,
        fetchJenisProduk, fetchProdukByJenis, fetchKodeTransaksi, fetchTransaksiDetail, fetchPelanggan, fetchDiskon,
        selectedPelangganNama, filteredPelangganList, selectedDiskonLabel, countItemsByJenis, paginatedProduk,
        totalPagesProduk, calculateSubtotal, calculateDiskon, calculatePotonganPoint, calculateGrandTotal,
        selectCategory, handlePilihProduk, handleBarcodeScan, handleDelete, handleNextOrder, handlePayment
    };
}
