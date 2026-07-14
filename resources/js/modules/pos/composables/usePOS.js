import { ref, computed, reactive, watch } from 'vue';
import { useToast } from '../../../utilities/toast/toast';

import { jenisprodukService } from '../../jenisproduk/services/jenisprodukService';
import { nampanprodukService } from '../../nampanproduk/services/nampanprodukService';
import { pelangganService } from '../../pelanggan/services/pelangganService';
import { diskonService } from '../../diskon/services/diskonService';
import { transaksiService } from '../../transaksi/services/transaksiService';

// IMPORT HELPER MODAL SUKSES IMPERATIF BARU
import { showPaymentSuccess } from '../../../utilities/confirm/PaymentsSuccessModal';

const toast = useToast();

const jenisprodukList = ref([]);
const selectedJenisProduk = ref('all');
const produk = ref([]);
const allProdukMaster = ref([]);
const PelangganList = ref([]);
const DiskonList = ref([]);
const TransaksiID = ref('');
const selectedDiskon = ref(null);
const TransaksiDetail = ref([]);
const lastCompletedTransactionId = ref('');
const isLoading = ref(false);
const isLoadingProduk = ref(false);
const searchProdukQuery = ref('');
const currentPageProduk = ref(1);
const itemsPerPageProduk = 8;
const usePoint = ref(false);
const inputPoint = ref(0);
const errors = ref({});
const scanQuery = ref('');

// Dropdown States untuk Custom Search Dropdown
const isPelangganDropdownOpen = ref(false);
const isDiskonDropdownOpen = ref(false);
const searchPelangganQuery = ref('');
const searchDiskonQuery = ref('');

const formPOS = reactive({
    id: null,
    pelanggan: null,
    diskon: null,
});

export function usePOS() {

    // --- LOGIKA FETCH DATA MASTER ---
    const fetchJenisProduk = async () => {
        try {
            const response = await jenisprodukService.getJenisProduk();
            const data = response.data || response;
            jenisprodukList.value = [{ id: 'all', jenis: 'Semua Produk' }, ...data];
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProduk = async (jenisId = 'all') => {
        isLoadingProduk.value = true;
        try {
            const response = await nampanprodukService.getNampanProduk();
            const data = response.data || response;

            // 1. KUNCI UTAMA: Hanya isi allProdukMaster jika data yang ditarik adalah 'all'
            // atau jika allProdukMaster masih kosong. Ini menjaga database master counter tetap utuh.
            if (jenisId === 'all' || allProdukMaster.value.length === 0) {
                allProdukMaster.value = data;
            }

            // 2. Lakukan filtering untuk ditampilkan ke user
            if (jenisId === 'all') {
                produk.value = data;
            } else {
                // Jika API mengembalikan semua data, filter di frontend:
                produk.value = data.filter(item => item.jenisproduk_id === jenisId);

                // CATATAN: Jika API backend Anda otomatis memfilter data berdasarkan parameter,
                // gunakan baris di bawah ini alih-alih filter frontend:
                // produk.value = data;
            }
        } catch (error) {
            console.error(error);
        } finally {
            isLoadingProduk.value = false;
        }
    };

    const fetchPelanggan = async () => {
        try {
            const response = await pelangganService.getPelanggan();
            const data = response.data || response;
            PelangganList.value = data.map(item => ({
                value: item.id,
                label: item.nama,
                kontak: item.telepon || item.hp || '',
                point: item.point || 0
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDiskon = async () => {
        try {
            const response = await diskonService.getDiskon();
            const data = response.data || response;
            DiskonList.value = data.map(item => ({
                value: item.id,
                label: item.nama,
                nilai: item.nilai || 0
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchKodeTransaksi = async () => {
        try {
            const response = await transaksiService.getKodeTransaksi();
            TransaksiID.value = response.kode || response;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTransaksiDetail = async () => {
        try {
            const response = await transaksiService.getTransaksiDetail();
            TransaksiDetail.value = response.data || response || [];
        } catch (error) {
            console.error(error);
        }
    };

    // --- LOGIKA INTERAKSI KASIR ---
    const handlePilihProduk = async (kodeproduk) => {
        try {
            const payload = { kodeproduk };
            const response = await transaksiService.storeProdukToTransaksiDetail(payload);
            if (response.status) {
                toast.success("Produk berhasil ditambahkan ke keranjang");
                await fetchTransaksiDetail();
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Gagal menambahkan produk";
            toast.error(msg);
        }
    };

    const handleDelete = async (id) => {
        try {
            const payload = { id };
            const response = await transaksiService.batalTransaksiDetail(payload);
            if (response.status) {
                toast.success("Item berhasil dihapus dari daftar order");
                await fetchTransaksiDetail();
            }
        } catch (error) {
            toast.error("Gagal menghapus item");
        }
    };

    const handleBarcodeScan = async () => {
        if (!scanQuery.value.trim()) return;
        await handlePilihProduk(scanQuery.value.trim());
        scanQuery.value = '';
    };

    const handleNextOrder = () => {
        formPOS.pelanggan = null;
        formPOS.diskon = null;
        usePoint.value = false;
        inputPoint.value = 0;
        errors.value = {};
        searchPelangganQuery.value = '';
        searchDiskonQuery.value = '';
        fetchKodeTransaksi();
        fetchTransaksiDetail();
    };

    const handlePrint = async () => {
        try {
            const payload = { kode: lastCompletedTransactionId.value };
            const response = await transaksiService.CetakNotaPenjulan(payload);
            if (response.url) {
                window.open(response.url, '_blank');
            }
        } catch (error) {
            toast.error("Gagal mencetak nota transaksi");
        }
    };

    const openWhatsAppModal = () => {
        console.log("Memicu integrasi WhatsApp untuk kode:", lastCompletedTransactionId.value);
    };

    // --- PROSES SIMPAN PEMBAYARAN UTAMA ---
    const paymentTransaksi = async (grandTotal) => {
        errors.value = {};

        if (!formPOS.pelanggan) {
            errors.value.pelanggan = "Pilih pelanggan terlebih dahulu";
            toast.error("Pilih pelanggan terlebih dahulu");
            return;
        }

        if (usePoint.value) {
            if (!inputPoint.value || inputPoint.value <= 0) {
                errors.value.point = "Masukkan jumlah poin valid";
                return;
            }
            if (inputPoint.value > (formPOS.pelanggan.point || 0)) {
                errors.value.point = "Poin tidak mencukupi";
                return;
            }
            if (inputPoint.value % 10 !== 0) {
                errors.value.point = "Poin harus kelipatan 10";
                return;
            }
        }

        isLoading.value = true;
        const currentKode = TransaksiID.value;

        try {
            const payload = {
                kode: currentKode,
                pelanggan: formPOS.pelanggan.value,
                diskon: formPOS.diskon ? formPOS.diskon.value : null,
                point_digunakan: usePoint.value ? inputPoint.value : 0,
                total: grandTotal
            };

            const response = await transaksiService.paymentTransaksi(payload);

            if (response.status) {
                lastCompletedTransactionId.value = currentKode;
                toast.success("Pembayaran Berhasil diproses!");

                // Kirim Notifikasi Telegram (Background Asynchronous)
                transaksiService.sendTelegramNotification({
                    pesan: `Transaksi Baru #${currentKode} Berhasil. Total: Rp ${grandTotal.toLocaleString('id-ID')}`
                }).catch(err => console.error(err));

                // TRIGGER MODAL IMPERATIF (Sama seperti confirmDelete)
                showPaymentSuccess({
                    kodeTransaksi: currentKode,
                    onPrint: () => {
                        handlePrint();
                        handleNextOrder();
                    },
                    onNext: () => {
                        handleNextOrder();
                    },
                    onWhatsApp: () => {
                        openWhatsAppModal();
                        handleNextOrder();
                    }
                });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Gagal memproses pembayaran";
            toast.error(errorMsg);
        } finally {
            isLoading.value = false;
        }
    };

    // --- COMPUTED PROPERTIES DATA FILTERING & HITUNGAN ---
    const filteredPelangganList = computed(() => {
        const q = searchPelangganQuery.value.toLowerCase();
        return PelangganList.value.filter(item =>
            item.label.toLowerCase().includes(q) || item.kontak.toLowerCase().includes(q)
        );
    });

    const filteredDiskonList = computed(() => {
        const q = searchDiskonQuery.value.toLowerCase();
        return DiskonList.value.filter(item => item.label.toLowerCase().includes(q));
    });

    const selectedDiskonNilai = computed(() => {
        return formPOS.diskon ? formPOS.diskon.nilai : 0;
    });

    const calculatePotonganPoint = computed(() => {
        return usePoint.value ? Number(inputPoint.value || 0) * 1000 : 0;
    });

    const countItemsByJenis = computed(() => {
        const counts = { all: allProdukMaster.value.length };
        allProdukMaster.value.forEach(item => {
            if (item.jenisproduk_id) {
                counts[item.jenisproduk_id] = (counts[item.jenisproduk_id] || 0) + 1;
            }
        });
        return counts;
    });

    const totalPagesProduk = computed(() => {
        const query = searchProdukQuery.value.toLowerCase();
        const filtered = produk.value.filter(item =>
            (item.kodeproduk ?? '').toLowerCase().includes(query) ||
            (item.nama ?? '').toLowerCase().includes(query)
        );
        return Math.ceil(filtered.length / itemsPerPageProduk) || 1;
    });

    const paginatedProduk = computed(() => {
        const start = (currentPageProduk.value - 1) * itemsPerPageProduk;
        const query = searchProdukQuery.value.toLowerCase();
        const filtered = produk.value.filter(item =>
            (item.kodeproduk ?? '').toLowerCase().includes(query) ||
            (item.nama ?? '').toLowerCase().includes(query)
        );
        return filtered.slice(start, start + itemsPerPageProduk);
    });

    return {
        TransaksiID,
        PelangganList,
        DiskonList,
        selectedDiskonNilai,
        TransaksiDetail,
        isLoading,
        isLoadingProduk,
        errors,
        formPOS,
        usePoint,
        inputPoint,
        calculatePotonganPoint,
        scanQuery,
        handleBarcodeScan,
        handleDelete,
        paymentTransaksi,
        fetchPelanggan,
        fetchDiskon,
        fetchKodeTransaksi,
        fetchTransaksiDetail,
        fetchJenisProduk,
        fetchProduk,
        jenisprodukList,
        selectedJenisProduk,
        countItemsByJenis,
        searchProdukQuery,
        currentPageProduk,
        totalPagesProduk,
        paginatedProduk,
        handlePilihProduk,
        handleNextOrder,
        handlePrint,
        openWhatsAppModal,

        // Custom Dropdown states & filters
        isPelangganDropdownOpen,
        isDiskonDropdownOpen,
        searchPelangganQuery,
        searchDiskonQuery,
        filteredPelangganList,
        filteredDiskonList
    };
}
