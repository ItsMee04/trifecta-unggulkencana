<template>
    <!-- Card Utama: Daftar Periode -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden relative mb-3">
        <!-- Header & Search -->
        <div class="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 class="font-bold text-slate-900 dark:text-white text-base mb-3">Daftar Periode</h2>
            <div class="relative">
                <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" v-model="searchPeriodeStok" placeholder="Cari periode..."
                    class="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingPeriodeStok" class="py-10 text-center">
            <div class="flex items-center justify-center gap-2">
                <RotateCw class="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <span class="text-xs font-medium text-slate-400 dark:text-slate-500">Memuat data...</span>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="paginatedPeriodeStok.length === 0" class="py-10 text-center text-slate-400 dark:text-slate-500 text-xs italic">
            Tidak ada data periode.
        </div>

        <!-- List Group -->
        <div v-else class="divide-y divide-slate-50 dark:divide-slate-800/40 max-h-[500px] overflow-y-auto">
            <button v-for="item in paginatedPeriodeStok" :key="item.id" @click.prevent="handlePilihPeriodeStok(item)"
                type="button"
                class="w-full text-left p-4 flex items-center justify-between transition group focus:outline-none"
                :class="item.id === selectedPeriodeStokID
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'">
                <div class="flex items-center gap-3">
                    <div class="p-2.5 rounded-xl transition" :class="item.status === 2
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'">
                        <Calendar class="w-4 h-4" />
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-slate-900 dark:text-white">{{ item.periode }}</span>
                        <span class="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                            Kode: <strong class="text-slate-600 dark:text-slate-400">{{ item.kode || '-' }}</strong>
                        </span>
                    </div>
                </div>

                <div class="flex items-center">
                    <!-- Action Final -->
                    <button v-if="item.status === 1" @click.stop="handleFinalisasiPeriode(item)"
                        class="bg-white dark:bg-slate-900 text-amber-600 border border-amber-500/30 hover:bg-amber-500 hover:text-white rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all">
                        <Lock class="w-3 h-3" />
                        <span>Final</span>
                    </button>

                    <!-- Badge Final -->
                    <div v-else class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle class="w-3 h-3" />
                        <span>Final</span>
                    </div>
                </div>
            </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredPeriodeStok.length > 0"
            class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between text-xs text-slate-400">
            <span>Page {{ currentPagePeriodeStok }} of {{ totalPagesPeriodeStok }}</span>
            <div class="flex items-center gap-1">
                <button @click="currentPagePeriodeStok--" :disabled="currentPagePeriodeStok === 1"
                    class="p-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                    <ChevronLeft class="w-4 h-4" />
                </button>
                <button @click="currentPagePeriodeStok++" :disabled="currentPagePeriodeStok === totalPagesPeriodeStok"
                    class="p-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>

    <!-- Card Tambah Periode -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-4">
        <div class="space-y-1.5">
            <label for="periode" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                Tanggal
            </label>
            <div class="flex items-center gap-2">
                <div class="flex-1">
                    <input type="date" id="periode" v-model="formPeriode.periode"
                        @click="$event.target.showPicker()"
                        class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 text-slate-900 dark:text-white transition dark:[color-scheme:dark] cursor-pointer" />
                </div>
                <button @click="handleCreatePeriode" :disabled="isLoadingPeriodeStok"
                    class="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition disabled:opacity-50 shrink-0">
                    <Plus class="w-5 h-5" />
                </button>
            </div>
            <span v-if="errors.periode" class="text-xs text-rose-500 font-medium block mt-1">
                {{ Array.isArray(errors.periode) ? errors.periode[0] : errors.periode }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    RotateCw,
    Calendar,
    Lock,
    CheckCircle,
    Plus
} from 'lucide-vue-next';
import { useInventory } from '../composables/useInventory';

const {
    errors,
    formPeriode,
    selectedPeriodeStokID,
    searchPeriodeStok,
    isLoadingPeriodeStok,
    currentPagePeriodeStok,
    totalPagesPeriodeStok,
    filteredPeriodeStok,
    paginatedPeriodeStok,
    fetchPeriodeStok,
    handleCreatePeriode,
    handlePilihPeriodeStok,
    handleFinalisasiPeriode
} = useInventory();

onMounted(() => {
    fetchPeriodeStok();
});
</script>
