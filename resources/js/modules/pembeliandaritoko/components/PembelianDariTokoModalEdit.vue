<template>
    <div v-if="isModalEditOpen" class="fixed inset-0 z-50 overflow-y-auto">

        <!-- Backdrop Overlay -->
        <Transition appear enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-show="isModalEditOpen" @click="handleClose"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-all"></div>
        </Transition>

        <div class="flex min-h-full items-center justify-center p-4 text-center">

            <!-- Modal Box Container -->
            <Transition appear enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div v-show="isModalEditOpen"
                    class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 overflow-hidden text-left transition-all">

                    <!-- Modal Header -->
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between relative">
                        <h2 class="font-bold text-slate-900 dark:text-white text-base">
                            EDIT DETAIL PEMBELIAN PRODUK
                        </h2>

                        <button @click="handleClose" type="button" title="Close Modal"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95 cursor-pointer">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Modal Body / Form -->
                    <form @submit.prevent="handleSubmit" class="p-6 space-y-4 font-sans">

                        <!-- GRID KODE & HARGA JUAL NOTA -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                    Kode Produk
                                </label>
                                <input type="text" :value="formPembelianDetail.kodeproduk || formPembelianDetail.produk?.kodeproduk || '-'" readonly
                                    class="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed focus:outline-none" />
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                    Harga Jual Nota
                                </label>
                                <input type="text" :value="toRupiah(hargaJualNotaTampil)" readonly
                                    class="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed focus:outline-none" />
                            </div>
                        </div>

                        <!-- CUSTOM DROPDOWN 1: KONDISI PRODUK -->
                        <div class="space-y-1.5 relative">
                            <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                Kondisi Produk
                            </label>

                            <div class="relative">
                                <button type="button" @click="toggleKondisiDropdown"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500 cursor-pointer">
                                    <span :class="{ 'text-slate-400': !formPembelianDetail.kondisi && !formPembelianDetail.kondisi_id }">
                                        {{ labelKondisiTerpilih }}
                                    </span>
                                    <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': isKondisiDropdownOpen }" />
                                </button>
                            </div>

                            <div v-if="isKondisiDropdownOpen"
                                class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                <div class="relative shrink-0">
                                    <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                    <input v-model="searchKondisiQuery" type="text" placeholder="Cari kondisi..."
                                        class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                </div>

                                <ul class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                    <li v-for="item in filteredKondisiList" :key="item.id || item.value" @click="pilihKondisi(item)"
                                        class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                        :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': isKondisiSelected(item) }">
                                        <span>{{ getKondisiLabel(item).toUpperCase() }}</span>
                                        <Check v-if="isKondisiSelected(item)"
                                            class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                    </li>

                                    <li v-if="filteredKondisiList.length === 0" class="px-3 py-4 text-center text-slate-400 dark:text-slate-500 italic">
                                        Kondisi tidak ditemukan.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- CUSTOM DROPDOWN 2: JENIS HARGA BELI -->
                        <div class="space-y-1.5 relative">
                            <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                Jenis Harga Beli
                            </label>

                            <div class="relative">
                                <button type="button" @click="toggleHargaDropdown"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500 cursor-pointer">
                                    <span>
                                        {{ hargaBeliPilihan?.label || 'Pilih Jenis Harga' }}
                                    </span>
                                    <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': isHargaDropdownOpen }" />
                                </button>
                            </div>

                            <div v-if="isHargaDropdownOpen"
                                class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-1 max-h-60 flex flex-col">
                                <ul class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                    <li v-for="opsi in opsiHargaBeli" :key="opsi.value" @click="pilihHargaBeli(opsi)"
                                        class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                        :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': hargaBeliPilihan?.value === opsi.value }">
                                        <span>{{ opsi.label }}</span>
                                        <Check v-if="hargaBeliPilihan?.value === opsi.value"
                                            class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- MANUAL HARGA -->
                        <div v-if="hargaBeliPilihan?.value === 'lebih_tinggi'" class="space-y-1.5">
                            <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                Harga Beli Manual (Rp)
                            </label>
                            <input v-model="hargaManual" type="number" placeholder="Masukkan nominal harga beli..."
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition" />
                        </div>

                        <!-- PREVIEW HASIL HARGA BELI -->
                        <div class="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl flex items-center justify-between">
                            <span class="text-xs font-extrabold text-blue-950 dark:text-blue-300 uppercase tracking-wider">
                                Total Harga Beli Fix
                            </span>
                            <span class="text-base font-mono font-black text-blue-950 dark:text-blue-300">
                                {{ toRupiah(formPembelianDetail.hargabeli) }}
                            </span>
                        </div>

                        <!-- Modal Action Buttons -->
                        <div class="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <button type="button" @click="handleClose"
                                class="px-5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-rose-900/50 rounded-xl transition active:scale-95 focus:outline-none cursor-pointer">
                                Cancel / Close
                            </button>

                            <button type="submit" :disabled="isLoadingPembelianDetail"
                                class="bg-blue-950 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-semibold text-sm transition shadow-xs active:scale-95 focus:outline-none cursor-pointer flex items-center gap-2">
                                <Loader2 v-if="isLoadingPembelianDetail" class="w-4 h-4 animate-spin" />
                                <span>{{ isLoadingPembelianDetail ? 'Saving...' : 'Save Changes' }}</span>
                            </button>
                        </div>
                    </form>

                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { X, Loader2, ChevronDown, Search, Check } from 'lucide-vue-next';
import { usePembelianDariToko } from '../composables/usePembelianDariToko';
import { toRupiah } from '../../../utilities/format/toRupiah';

const {
    isModalEditOpen,
    kondisiList,
    formPembelianDetail,
    isLoadingPembelianDetail,
    handleSubmitEdit,
    fetchKondisi,
} = usePembelianDariToko();

// --- STATE DROPDOWN ---
const isKondisiDropdownOpen = ref(false);
const searchKondisiQuery = ref('');

const isHargaDropdownOpen = ref(false);

const opsiHargaBeli = [
    { label: 'Harga Jual', value: 'hargajual' },
    { label: 'Potongan 4%', value: 'potongan_4' },
    { label: 'Lebih Tinggi (Custom)', value: 'lebih_tinggi' }
];

const hargaBeliPilihan = ref(opsiHargaBeli[0]);
const hargaManual = ref('');

// --- AMBIL HARGA JUAL NOTA SECARA FLEKSIBEL ---
const hargaJualNotaTampil = computed(() => {
    return parseFloat(
        formPembelianDetail.hargajual ||
        formPembelianDetail.hargajualnota ||
        formPembelianDetail.transaksidetail?.hargajual ||
        0
    );
});

// --- HELPER KONDISI ---
const getKondisiLabel = (item) => {
    if (typeof item === 'string') return item;
    return item?.kondisi || item?.label || item?.nama || '';
};

const isKondisiSelected = (item) => {
    const val = getKondisiLabel(item);
    return formPembelianDetail.kondisi === val || (item.id && formPembelianDetail.kondisi_id === item.id);
};

const labelKondisiTerpilih = computed(() => {
    if (formPembelianDetail.kondisi) {
        return getKondisiLabel(formPembelianDetail.kondisi).toUpperCase();
    }
    if (formPembelianDetail.kondisi_id) {
        const found = (kondisiList.value || []).find(k => k.id === formPembelianDetail.kondisi_id);
        if (found) return getKondisiLabel(found).toUpperCase();
    }
    return '-- Pilih Kondisi Barang --';
});

const filteredKondisiList = computed(() => {
    const list = kondisiList.value || [];
    const q = searchKondisiQuery.value.toLowerCase().trim();
    if (!q) return list;
    return list.filter(item => getKondisiLabel(item).toLowerCase().includes(q));
});

// --- AKSI DROPDOWN ---
const toggleKondisiDropdown = () => {
    isKondisiDropdownOpen.value = !isKondisiDropdownOpen.value;
    isHargaDropdownOpen.value = false;
};

const toggleHargaDropdown = () => {
    isHargaDropdownOpen.value = !isHargaDropdownOpen.value;
    isKondisiDropdownOpen.value = false;
};

const pilihKondisi = (item) => {
    formPembelianDetail.kondisi = typeof item === 'object' ? item : getKondisiLabel(item);
    if (item.id) formPembelianDetail.kondisi_id = item.id;
    isKondisiDropdownOpen.value = false;
    searchKondisiQuery.value = '';
};

const pilihHargaBeli = (opsi) => {
    hargaBeliPilihan.value = opsi;
    isHargaDropdownOpen.value = false;
};

// --- KALKULASI HARGA ---
const hargaAkhir = computed(() => {
    const jual = hargaJualNotaTampil.value;

    if (hargaBeliPilihan.value?.value === 'hargajual') {
        return jual;
    }
    if (hargaBeliPilihan.value?.value === 'potongan_4') {
        return Math.round(jual * 0.96);
    }
    if (hargaBeliPilihan.value?.value === 'lebih_tinggi') {
        return Number(hargaManual.value) || 0;
    }
    return jual;
});

const handleClose = () => {
    isKondisiDropdownOpen.value = false;
    isHargaDropdownOpen.value = false;
    searchKondisiQuery.value = '';
    isModalEditOpen.value = false;
};

const handleSubmit = async () => {
    await handleSubmitEdit();
};

// Sync hasil kalkulasi
watch(hargaAkhir, (newVal) => {
    formPembelianDetail.hargabeli = newVal;
}, { immediate: true });

watch(hargaBeliPilihan, (newVal) => {
    formPembelianDetail.jenis_hargabeli = newVal?.value;
    if (newVal?.value !== 'lebih_tinggi') {
        hargaManual.value = '';
    }
});

watch(() => formPembelianDetail.id, () => {
    const foundOpsi = opsiHargaBeli.find(o => o.value === formPembelianDetail.jenis_hargabeli);
    hargaBeliPilihan.value = foundOpsi || opsiHargaBeli[0];
    hargaManual.value = formPembelianDetail.jenis_hargabeli === 'lebih_tinggi' ? formPembelianDetail.hargabeli : '';
});

onMounted(() => {
    if (typeof fetchKondisi === 'function') {
        fetchKondisi();
    }
});
</script>
