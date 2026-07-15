<template>
    <div
        class="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs p-5 flex flex-col justify-between min-h-[640px] transition-all duration-300">

        <div class="space-y-5">
            <div
                class="flex flex-col items-center justify-center border-b border-slate-100 dark:border-slate-800 pb-3 text-center">
                <h5 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Keranjang Kasir
                </h5>
                <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    ID: <span class="text-blue-950 dark:text-blue-400 font-extrabold">
                        {{ TransaksiID || 'MEMUAT...' }}
                    </span>
                </p>
            </div>

            <div class="relative">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Informasi Pelanggan
                </label>
                <div class="flex items-center gap-2">
                    <div class="relative flex-grow">
                        <div @click="isPelangganDropdownOpen = !isPelangganDropdownOpen"
                            class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white flex justify-between items-center cursor-pointer select-none">
                            <span>{{ selectedPelangganNama }}</span>
                            <svg class="w-4 h-4 text-slate-400 transition-transform duration-200"
                                :class="{ 'rotate-180': isPelangganDropdownOpen }" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        <div v-if="isPelangganDropdownOpen"
                            class="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 space-y-2">
                            <input type="text" v-model="searchPelangganQuery" placeholder="Cari nama pelanggan..."
                                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden placeholder-slate-400" />
                            <ul class="max-h-40 overflow-y-auto space-y-0.5 scrollbar-none">
                                <li v-for="pel in filteredPelangganList" :key="pel.value" @click="selectPelanggan(pel)"
                                    class="px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer flex justify-between items-center">
                                    <span class="font-medium">{{ pel.label }}</span>
                                    <span v-if="pel.point"
                                        class="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 px-1.5 py-0.5 rounded-md font-bold">
                                        {{ pel.point }} Pts
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <button @click="handleCreatePelanggan"
                        class="p-2.5 bg-blue-950 dark:bg-slate-800 text-white rounded-xl hover:opacity-90 transition">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </button>
                </div>
                <div class="text-xs text-red-500 mt-1" v-if="errors.pelanggan">{{ errors.pelanggan }}</div>
            </div>

            <div class="scanner-container relative">
                <input type="text" ref="barcodeInput" v-model="scanQuery" @keyup.enter="handleBarcodeScan"
                    class="absolute opacity-0 pointer-events-none" placeholder="Scanner active..." />
            </div>

            <div class="space-y-2.5">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Barang</label>

                <div v-if="TransaksiDetail.length === 0"
                    class="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/50">
                    <svg class="w-8 h-8 text-slate-300 dark:text-slate-700 mb-1.5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p class="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Keranjang belanja masih
                        kosong</p>
                </div>

                <div v-else class="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                    <div v-for="item in TransaksiDetail" :key="item.id"
                        class="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/80 rounded-xl p-3 flex justify-between items-center group transition-all">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-2">
                                <span
                                    class="text-[9px] bg-blue-950 text-white font-extrabold px-1.5 py-0.5 rounded-sm tracking-wide">
                                    {{ item.produk?.kodeproduk }}
                                </span>
                                <h6 class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                    {{ item.produk?.nama || '-' }}
                                </h6>
                            </div>
                            <p class="text-[10px] text-slate-400 font-medium mt-1">
                                {{ item.berat }}g • {{ item.karat }} Karat • Rp {{ Number(item.hargajual ||
                                0).toLocaleString('id-ID') }}
                            </p>
                        </div>
                        <button @click="handleDelete(item)"
                            class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors ml-2">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 pt-2">
                <div class="relative">
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diskon
                        Promo</label>
                    <div @click="isDiskonDropdownOpen = !isDiskonDropdownOpen"
                        class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-white flex justify-between items-center cursor-pointer select-none">
                        <span class="truncate">{{ selectedDiskonLabel }}</span>
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    <div v-if="isDiskonDropdownOpen"
                        class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 space-y-1.5">
                        <ul class="max-h-32 overflow-y-auto space-y-0.5 scrollbar-none">
                            <li @click="selectDiskon(null)"
                                class="px-2.5 py-1.5 text-xs text-red-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer">
                                Batalkan Diskon
                            </li>
                            <li v-for="dsk in DiskonList" :key="dsk.value" @click="selectDiskon(dsk)"
                                class="px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer flex justify-between items-center">
                                <span>{{ dsk.label }}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Potong Poin
                        Member</label>
                    <div class="flex items-center gap-2 h-[34px]">
                        <input type="checkbox" v-model="usePoint" :disabled="!formPOS.pelanggan"
                            class="w-4 h-4 text-blue-950 bg-slate-100 border-slate-300 rounded-sm focus:ring-blue-950 dark:focus:ring-blue-800 dark:ring-offset-slate-900 dark:bg-slate-700 dark:border-slate-600" />
                        <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Gunakan Poin</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
            <div class="space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-400 font-medium">Sub-Total Barang</span>
                    <span class="text-slate-800 dark:text-slate-200 font-bold">
                        Rp {{ Number(calculateSubtotal).toLocaleString('id-ID') }}
                    </span>
                </div>
                <div v-if="calculateDiskon > 0" class="flex justify-between items-center text-xs">
                    <span class="text-red-500 font-medium">Potongan Diskon Promo</span>
                    <span class="text-red-500 font-bold">- Rp {{ Number(calculateDiskon).toLocaleString('id-ID')
                        }}</span>
                </div>
                <div v-if="usePoint && calculatePotonganPoint > 0" class="flex justify-between items-center text-xs">
                    <span class="text-amber-600 font-medium">Potongan Tukar Poin</span>
                    <span class="text-amber-600 font-bold">- Rp {{
                        Number(calculatePotonganPoint).toLocaleString('id-ID') }}</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-slate-150 dark:border-slate-800/60">
                    <span class="text-xs font-black text-slate-900 dark:text-white uppercase">Total Bayar</span>
                    <span class="text-base font-black text-blue-950 dark:text-white tracking-tight">
                        Rp {{ Number(calculateGrandTotal).toLocaleString('id-ID') }}
                    </span>
                </div>
            </div>

            <button @click="handlePayment" :disabled="TransaksiDetail.length === 0 || isLoading"
                class="w-full bg-blue-950 hover:bg-blue-900 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-blue-950/15 disabled:opacity-40 disabled:cursor-not-allowed">
                {{ isLoading ? 'Memproses Transaksi...' : 'Bayar & Selesaikan Order' }}
            </button>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

// IMPORT SERVICE DATA POS YANG VALID DI PROJECT BARU
import { pelangganService } from '../../pelanggan/services/pelangganService';
import { diskonService } from '../../diskon/services/diskonService';
import { transaksiService } from '../../transaksi/services/transaksiService';

const toast = useToast();

// --- STATE INTERNAL POS KASIR ---
const TransaksiID = ref('');
const TransaksiDetail = ref([]);
const PelangganList = ref([]);
const DiskonList = ref([]);
const isLoading = ref(false);
const scanQuery = ref('');
const errors = ref({});
const usePoint = ref(false);

const formPOS = reactive({
    id: null,
    pelanggan: null,
    diskon: null,
});

// UI Dropdown & Focus Controls
const isPelangganDropdownOpen = ref(false);
const isDiskonDropdownOpen = ref(false);
const searchPelangganQuery = ref('');
const barcodeInput = ref(null);

// --- A. METHOD HIT SERVICE DATA DARI BACKEND API ---

// 1. Ambil Data Pelanggan
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

// 2. Ambil Data Diskon (Disesuaikan dengan key properti "diskon" dari API)
const fetchDiskon = async () => {
    try {
        const response = await diskonService.getDiskon();
        // Sesuai dengan response API: data berada di dalam properti "data"
        const rawData = response.data || [];

        DiskonList.value = rawData.map(item => ({
            value: item.id,
            // Perbaikan: gunakan item.diskon (bukan item.nama) dengan proteksi string kosong
            label: `${(item.diskon || '').toUpperCase()} (${item.nilai}%)`,
            nilai: item.nilai
        }));
    } catch (error) {
        toast.error("Gagal memuat data diskon");
    }
};

// 3. Ambil Kode Transaksi POS Aktif
const fetchKodeTransaksi = async () => {
    try {
        const response = await transaksiService.getKodeTransaksi();
        const data = response.data || response;
        if (data && data.kode) {
            TransaksiID.value = data.kode;
        }
    } catch (error) {
        toast.error("Gagal memuat nomor transaksi");
    }
};

// 4. Ambil Detail Item Barang yang ada di Keranjang
const fetchTransaksiDetail = async () => {
    if (!TransaksiID.value) return;
    try {
        const response = await transaksiService.getTransaksiDetail(TransaksiID.value);
        TransaksiDetail.value = response.data || response || [];
    } catch (error) {
        console.error("Gagal memuat detail transaksi", error);
    }
};

// --- B. COMPUTED LOGIC DROPDOWN & HITUNGAN NOTA ---

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

// Hitung-hitungan Nilai Keranjang Kasir
const calculateSubtotal = computed(() => {
    return TransaksiDetail.value.reduce((acc, item) => acc + Number(item.total || 0), 0);
});

const calculateDiskon = computed(() => {
    return (calculateSubtotal.value * Number(selectedDiskonNilai.value || 0)) / 100;
});

const calculatePotonganPoint = computed(() => {
    if (!usePoint.value || !formPOS.pelanggan) return 0;
    const customer = PelangganList.value.find(p => p.value === formPOS.pelanggan);
    return customer ? Number(customer.point || 0) : 0;
});

const calculateGrandTotal = computed(() => {
    const total = calculateSubtotal.value - calculateDiskon.value - calculatePotonganPoint.value;
    return total < 0 ? 0 : total;
});

// --- C. INTERAKSI ACTION KASIR ---

const selectPelanggan = (pel) => {
    formPOS.pelanggan = pel.value;
    isPelangganDropdownOpen.value = false;
    searchPelangganQuery.value = '';
};

const selectDiskon = (dsk) => {
    formPOS.diskon = dsk ? dsk.value : null;
    isDiskonDropdownOpen.value = false;
};

// Aksi scan dari Barcode Input Gunakan Payload Aman
const handleBarcodeScan = async () => {
    if (!scanQuery.value.trim()) return;
    try {
        const payload = {
            kode: TransaksiID.value,
            kodeproduk: scanQuery.value
        };
        const response = await transaksiService.storeProdukToTransaksiDetail(payload);
        if (response) {
            toast.success("Produk berhasil ditambahkan");
            await fetchTransaksiDetail();
        }
    } catch (error) {
        const msg = error.response?.data?.message || "Gagal men-scan produk";
        toast.error(msg);
    } finally {
        scanQuery.value = '';
    }
};
// Jauh lebih ringkas tanpa mengotori shared state!
const handleDelete = async (item) => {
    const confirm = await confirmDelete(
        'Apakah Anda yakin?',
        `Produk akan dikeluarkan dari daftar order!`
    );

    // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
    if (confirm) {
        isLoading.value = true;
        try {
            await transaksiService.batalTransaksiDetail({ id: item.id });
            toast.success('Produk berhasil dikeluarkan.');
            await fetchTransaksiDetail();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
            toast.error(errorMessage);
        } finally {
            isLoading.value = false;
        }
    }
};

// Reset Form Untuk Transaksi Selanjutnya
const handleNextOrder = () => {
    formPOS.id = null;
    formPOS.pelanggan = null;
    formPOS.diskon = null;
    usePoint.value = false;
    TransaksiDetail.value = [];
    fetchKodeTransaksi();
};

// Kirim Finalisasi Pembayaran Nota ke API
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
        const msg = error.response?.data?.message || 'Terjadi kesalahan pembayaran.';
        toast.error(msg);
    } finally {
        isLoading.value = false;
    }
};

const handleCreatePelanggan = () => {
    console.log("Trigger buka modal input pelanggan baru");
};

// --- D. BARCODE SCANNER FOCUS CONTROLLER ---
const ensureFocus = () => {
    if (barcodeInput.value) barcodeInput.value.focus();
};

onMounted(async () => {
    await fetchPelanggan();
    await fetchDiskon();
    await fetchKodeTransaksi();
    await fetchTransaksiDetail();

    nextTick(() => {
        ensureFocus();
    });
    document.addEventListener('click', ensureFocus);
});

onUnmounted(() => {
    document.removeEventListener('click', ensureFocus);
});
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
    display: none;
}

.scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
