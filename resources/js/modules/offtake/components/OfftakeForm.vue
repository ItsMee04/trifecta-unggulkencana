<template>
    <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs p-5 sm:p-6">
        <form @submit.prevent="paymentOfftake" class="space-y-5">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Kode Transaksi -->
                <div>
                    <label for="kode"
                        class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                        Kode Transaksi
                    </label>
                    <input type="text" id="kode" v-model="formOfftake.kode" readonly
                        class="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed" />
                    <p v-if="errors.kode" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.kode }}</p>
                </div>

                <!-- Custom Suplier Dropdown -->
                <div class="space-y-1.5 relative">
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                        Suplier
                    </label>

                    <div class="relative">
                        <button type="button" @click="isSuplierDropdownOpen = !isSuplierDropdownOpen"
                            class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                            <span :class="{ 'text-slate-400': !formOfftake.suplier }">
                                {{ labelSuplierTerpilih }}
                            </span>
                            <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                :class="{ 'rotate-180': isSuplierDropdownOpen }" />
                        </button>
                    </div>

                    <!-- Floating Dropdown Menu -->
                    <div v-if="isSuplierDropdownOpen"
                        class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                        <!-- Search Box inside Dropdown -->
                        <div class="relative shrink-0">
                            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input v-model="searchSuplierQuery" type="text" placeholder="Cari suplier..."
                                class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                        </div>

                        <!-- List Items -->
                        <ul
                            class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                            <li v-for="sup in filteredDaftarSuplier" :key="sup.value" @click="pilihSuplier(sup)"
                                class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': formOfftake.suplier?.value === sup.value }">
                                <span>{{ sup.label }}</span>
                                <Check v-if="formOfftake.suplier?.value === sup.value"
                                    class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            </li>

                            <li v-if="filteredDaftarSuplier.length === 0"
                                class="px-3 py-4 text-center text-slate-400 dark:text-slate-500 italic">
                                Suplier tidak ditemukan.
                            </li>
                        </ul>
                    </div>

                    <span v-if="errors.suplier" class="text-xs text-rose-500 font-medium block mt-1">
                        {{ errors.suplier }}
                    </span>
                </div>
            </div>

            <!-- Tabel Detail Offtake (Komponen Terpisah) -->
            <OfftakeTable />

            <div class="space-y-4">
                <!-- Harga Total (Dana Masuk) -->
                <div>
                    <label for="hargatotal"
                        class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                        Harga Total (Dana Masuk) <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                        <span
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                        <input type="text" id="hargatotal" v-model="formOfftake.harga" placeholder="0"
                            class="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                    </div>
                    <p v-if="errors.harga" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.harga }}</p>
                </div>

                <!-- Keterangan / Catatan -->
                <div>
                    <label for="keterangan"
                        class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                        Keterangan / Catatan
                    </label>
                    <textarea id="keterangan" v-model="formOfftake.keterangan" rows="2"
                        placeholder="Masukkan keterangan tambahan..."
                        class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"></textarea>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-2">
                <button type="submit" :disabled="isLoading || offtakeDetail.length === 0"
                    class="w-full sm:w-auto px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-xs active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-900">
                    <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
                    <span>{{ isLoading ? 'Memuat data...' : 'PAYMENT (TERIMA DANA)' }}</span>
                </button>
            </div>

        </form>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Loader2, ChevronDown, Search, Check } from 'lucide-vue-next';
import { useOfftake } from '../composables/useOfftake';
import OfftakeTable from './OfftakeTable.vue';

const {
    suplierList,
    isLoading,
    errors,
    formOfftake,
    offtakeDetail,
    fetchSuplier,
    fetchKodeTransaksi,
    paymentOfftake,
} = useOfftake();

// State khusus untuk custom dropdown suplier
const isSuplierDropdownOpen = ref(false);
const searchSuplierQuery = ref('');

// Label suplier yang sedang dipilih
const labelSuplierTerpilih = computed(() => {
    return formOfftake.suplier?.label || 'Pilih suplier...';
});

// Filtering list suplier berdasarkan input pencarian
const filteredDaftarSuplier = computed(() => {
    const query = searchSuplierQuery.value.toLowerCase();
    return (suplierList.value || []).filter(item =>
        item.label.toLowerCase().includes(query)
    );
});

// Method saat item suplier diklik
const pilihSuplier = (suplier) => {
    formOfftake.suplier = suplier;
    isSuplierDropdownOpen.value = false;
    searchSuplierQuery.value = '';
};

onMounted(() => {
    fetchSuplier();
    fetchKodeTransaksi();
});
</script>
