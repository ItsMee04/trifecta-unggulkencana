<template>
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden relative">
        <!-- Header & Search -->
        <div class="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 class="font-bold text-slate-900 dark:text-white text-base mb-3">Daftar Nampan</h2>
            <div class="relative">
                <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" v-model="searchNampanQuery" placeholder="Cari nampan..."
                    class="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="py-10 text-center">
            <div class="flex items-center justify-center gap-2">
                <RotateCw class="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <span class="text-xs font-medium text-slate-400 dark:text-slate-500">Memuat data...</span>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="paginatedNampan.length === 0" class="py-10 text-center text-slate-400 dark:text-slate-500 text-xs italic">
            Tidak ada data nampan.
        </div>

        <!-- List Group (Struktur Baru Pilihanmu) -->
        <div v-else class="divide-y divide-slate-50 dark:divide-slate-800/40 max-h-[500px] overflow-y-auto">
            <button v-for="item in paginatedNampan" :key="item.id" @click.prevent="handlePilihNampan(item)"
                type="button"
                class="w-full text-left p-4 flex items-center justify-between transition group focus:outline-none"
                :class="item.id === selectedNampanId
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'">
                <div class="flex items-center gap-3">
                    <div class="p-2.5 rounded-xl transition" :class="item.total > 0
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'">
                        <Box class="w-4 h-4" />
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-slate-900 dark:text-white">{{ item.nampan }}</span>
                        <span class="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                            Jenis: <strong class="text-slate-600 dark:text-slate-400">{{
                                item.jenisproduk?.jenis?.toUpperCase() || '-' }}</strong>
                        </span>
                    </div>
                </div>
                <ChevronRight class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredNampan.length > 0"
            class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between text-xs text-slate-400">
            <span>Page {{ currentPage }} of {{ totalPagesNampan }}</span>
            <div class="flex items-center gap-1">
                <button @click="currentPage--" :disabled="currentPage === 1"
                    class="p-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                    <ChevronLeft class="w-4 h-4" />
                </button>
                <button @click="currentPage++" :disabled="currentPage === totalPagesNampan"
                    class="p-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Search, ChevronLeft, ChevronRight, RotateCw, Box } from 'lucide-vue-next'; // Ditambahkan impor Box di sini
import { useNampanProduk } from '../composables/useNampanProduk';

const {
    selectedNampanId,
    searchNampanQuery,
    isLoading,
    currentPage,
    totalPagesNampan,
    filteredNampan,
    paginatedNampan,
    handlePilihNampan,
    fetchNampan,
} = useNampanProduk();

onMounted(() => {
    fetchNampan();
});
</script>
