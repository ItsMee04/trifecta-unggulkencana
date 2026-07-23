<template>
    <div
        class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
        <!-- Card Header -->
        <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 class="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                TRANSAKSI DARI LUAR TOKO
            </h2>
        </div>

        <!-- Card Body -->
        <div class="p-4 sm:p-5 flex flex-col gap-4">
            <form @submit.prevent="paymentPembelian" class="space-y-4">

                <!-- Kode Transaksi -->
                <div class="space-y-1">
                    <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Kode Transaksi Pembelian
                    </label>
                    <input type="text" v-model="formDariLuarToko.kode" readonly
                        class="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl cursor-not-allowed focus:outline-hidden" />
                </div>

                <!-- Bagian Keranjang / Item Barang -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <label class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Detail Items / Barang
                        </label>
                        <!-- Baris 23 pada file PembelianDariLuarTokoForm.vue -->
                        <button type="button" @click="handleCreateProduk"
                            class="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition shadow-xs active:scale-95 flex items-center gap-1.5 uppercase tracking-wider shrink-0 cursor-pointer">
                            <PlusCircle class="w-4 h-4" /> Tambah Barang
                        </button>
                    </div>

                    <!-- Tabel Keranjang Detail -->
                    <PembelianDariLuarTokoTable />
                </div>

                <!-- Sumber Pembelian (Radio Options) -->
                <div class="space-y-2">
                    <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                        Pembelian Dari
                    </label>
                    <div class="flex items-center gap-6">
                        <label
                            class="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                            <input type="radio" name="pembelian_dari" value="supplier" v-model="formDariLuarToko.sumber"
                                class="w-4 h-4 text-blue-950 focus:ring-indigo-500 border-slate-300 dark:border-slate-800">
                            Supplier
                        </label>
                        <label
                            class="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                            <input type="radio" name="pembelian_dari" value="pelanggan"
                                v-model="formDariLuarToko.sumber"
                                class="w-4 h-4 text-blue-950 focus:ring-indigo-500 border-slate-300 dark:border-slate-800">
                            Pelanggan
                        </label>
                    </div>
                </div>

                <!-- Bagian Pilih Supplier / Pelanggan -->
                <div class="space-y-1.5">
                    <div v-if="isFetchingList" class="text-xs text-slate-400 flex items-center gap-1.5 py-1">
                        <Loader2 class="w-3.5 h-3.5 animate-spin" /> Memuat data...
                    </div>

                    <div v-else class="space-y-2">
                        <!-- Jika Sumber Supplier -->
                        <div v-if="formDariLuarToko.sumber === 'supplier'" class="space-y-1.5 relative">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Pilih
                                    Supplier</label>
                                <button type="button" @click="handleCreateSuplier"
                                    class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer">
                                    <PlusCircle class="w-3.5 h-3.5" /> Tambah Supplier
                                </button>
                            </div>

                            <!-- Custom Combobox Supplier -->
                            <div class="relative">
                                <button type="button" @click="toggleDropdown('supplier')"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                    <span :class="{ 'text-slate-400': !formDariLuarToko.selectedId }">
                                        {{ labelSupplierTerpilih }}
                                    </span>
                                    <ChevronDown
                                        class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': openDropdown === 'supplier' }" />
                                </button>

                                <div v-if="openDropdown === 'supplier'"
                                    class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                    <div class="relative shrink-0">
                                        <Search
                                            class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input v-model="searchQuery.supplier" type="text" placeholder="Cari supplier..."
                                            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                    </div>
                                    <ul
                                        class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                        <li v-for="item in filteredSupplierOptions" :key="item.value || item.id"
                                            @click="pilihSupplier(item)"
                                            class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                            :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': formDariLuarToko.selectedId === (item.value || item.id) }">
                                            <span>{{ String(item.label || item.nama || item).toUpperCase() }}</span>
                                            <Check v-if="formDariLuarToko.selectedId === (item.value || item.id)"
                                                class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </li>
                                        <li v-if="filteredSupplierOptions.length === 0"
                                            class="px-3 py-4 text-center text-slate-400 italic">
                                            Supplier tidak ditemukan.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- Jika Sumber Pelanggan -->
                        <div v-if="formDariLuarToko.sumber === 'pelanggan'" class="space-y-1.5 relative">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Pilih
                                    Pelanggan</label>
                                <button type="button" @click="handleCreatePelanggan"
                                    class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer">
                                    <PlusCircle class="w-3.5 h-3.5" /> Tambah Pelanggan
                                </button>
                            </div>

                            <!-- Custom Combobox Pelanggan -->
                            <div class="relative">
                                <button type="button" @click="toggleDropdown('pelanggan')"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                    <span :class="{ 'text-slate-400': !formDariLuarToko.selectedId }">
                                        {{ labelPelangganTerpilih }}
                                    </span>
                                    <ChevronDown
                                        class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': openDropdown === 'pelanggan' }" />
                                </button>

                                <div v-if="openDropdown === 'pelanggan'"
                                    class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                    <div class="relative shrink-0">
                                        <Search
                                            class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input v-model="searchQuery.pelanggan" type="text"
                                            placeholder="Cari pelanggan..."
                                            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                    </div>
                                    <ul
                                        class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                        <li v-for="item in filteredPelangganOptions" :key="item.value || item.id"
                                            @click="pilihPelanggan(item)"
                                            class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                            :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': formDariLuarToko.selectedId === (item.value || item.id) }">
                                            <span>{{ String(item.label || item.nama || item).toUpperCase() }}</span>
                                            <Check v-if="formDariLuarToko.selectedId === (item.value || item.id)"
                                                class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </li>
                                        <li v-if="filteredPelangganOptions.length === 0"
                                            class="px-3 py-4 text-center text-slate-400 italic">
                                            Pelanggan tidak ditemukan.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Keterangan / Catatan -->
                <div class="space-y-1.5">
                    <label for="keterangan" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                        Keterangan / Catatan
                    </label>
                    <textarea v-model="formDariLuarToko.keterangan" id="keterangan" rows="3"
                        placeholder="Masukkan keterangan tambahan..."
                        class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition"
                        :class="{ 'border-rose-500': errors.keterangan }"></textarea>
                    <span v-if="errors.keterangan" class="text-xs text-rose-500 font-medium block mt-1">{{
                        errors.keterangan }}</span>
                </div>

                <!-- Tombol Submit Action -->
                <div class="flex justify-end pt-2">
                    <button type="submit" :disabled="isLoading"
                        class="bg-blue-950 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-xs active:scale-95 focus:outline-none cursor-pointer flex items-center gap-2">
                        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                        <span>{{ isLoading ? 'Memproses...' : 'PAYMENT (PEMBAYARAN)' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modals Pendukung -->
    <SuplierModal />
    <PelangganModal />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Loader2, PlusCircle, ChevronDown, Search, Check } from 'lucide-vue-next';

import { usePembelianDariLuarToko } from '../composables/usePembelianDariLuarToko';
import PembelianDariLuarTokoTable from './PembelianDariLuarTokoTable.vue';
import SuplierModal from '../../suplier/components/SuplierModal.vue';
import PelangganModal from '../../pelanggan/components/PelangganModal.vue';

const {
    formDariLuarToko,
    isLoading,
    isFetchingList,
    supplierOptions,
    pelangganOptions,
    errors,
    paymentPembelian,
    fetchKodeTransaksi,
    handleCreatePelanggan,
    handleCreateSuplier,
    handleCreateProduk, // 👈 Panggil fungsi pembuat/pembuka modal produk dari composable
    fetchOptions,
} = usePembelianDariLuarToko();

const openDropdown = ref(null);
const searchQuery = reactive({
    supplier: '',
    pelanggan: '',
});

const toggleDropdown = (name) => {
    openDropdown.value = openDropdown.value === name ? null : name;
};

const labelSupplierTerpilih = computed(() => {
    if (!formDariLuarToko.selectedId || !supplierOptions.value) return '-- Pilih Supplier --';
    const found = supplierOptions.value.find(s => (s.value || s.id) === formDariLuarToko.selectedId);
    return found ? String(found.label || found.nama || found).toUpperCase() : '-- Pilih Supplier --';
});

const labelPelangganTerpilih = computed(() => {
    if (!formDariLuarToko.selectedId || !pelangganOptions.value) return '-- Pilih Pelanggan --';
    const found = pelangganOptions.value.find(p => (p.value || p.id) === formDariLuarToko.selectedId);
    return found ? String(found.label || found.nama || found).toUpperCase() : '-- Pilih Pelanggan --';
});

const filterList = (list, query) => {
    const q = query.toLowerCase().trim();
    if (!q) return list || [];
    return (list || []).filter(item => {
        const text = String(item.label || item.nama || item).toLowerCase();
        return text.includes(q);
    });
};

const filteredSupplierOptions = computed(() => filterList(supplierOptions.value, searchQuery.supplier));
const filteredPelangganOptions = computed(() => filterList(pelangganOptions.value, searchQuery.pelanggan));

const pilihSupplier = (item) => {
    formDariLuarToko.selectedId = item.value || item.id;
    openDropdown.value = null;
    searchQuery.supplier = '';
};

const pilihPelanggan = (item) => {
    formDariLuarToko.selectedId = item.value || item.id;
    openDropdown.value = null;
    searchQuery.pelanggan = '';
};

onMounted(async () => {
    await fetchKodeTransaksi();
    await fetchOptions('supplier');
});
</script>
