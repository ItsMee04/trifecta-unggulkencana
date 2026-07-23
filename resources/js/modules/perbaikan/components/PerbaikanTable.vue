<template>
    <div
        class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden relative">

        <div
            class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="font-bold text-slate-900 dark:text-white text-base">Daftar Produk Perbaikan</h2>

            <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button @click="handleRefresh" :disabled="isLoading" title="Refresh Data"
                    class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl transition active:scale-95 disabled:opacity-50">
                    <RotateCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
                </button>

                <div class="relative flex-1 sm:flex-none sm:w-64">
                    <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input v-model="searchQuery" type="text" placeholder="Search..."
                        class="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                </div>
            </div>
        </div>

        <div class="w-full overflow-x-auto relative">

            <div v-if="isLoading && paginatedPerbaikan.length > 0"
                class="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[0.5px] z-10 flex items-center justify-center transition-all duration-200">
                <div
                    class="flex items-center gap-2 bg-white dark:bg-slate-950 px-3.5 py-2 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800">
                    <RotateCw class="w-4 h-4 text-blue-950 dark:text-white animate-spin" />
                    <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Loading...</span>
                </div>
            </div>

            <table class="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr
                        class="bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                        <th class="py-3 px-4 w-[10%] text-center">No.</th>
                        <th class="py-3 px-4 w-[25%]">KODE</th>
                        <th class="py-3 px-4 w-[25%]">KODE PRODUK</th>
                        <th class="py-3 px-4 w-[25%]">KONDISI</th>
                        <th class="py-3 px-4 w-[25%]">KETERANGAN</th>
                        <th class="py-3 px-4 w-[25%]">TANGGAL MASUK</th>
                        <th class="py-3 px-4 w-[25%]">TANGGAL KELUAR</th>
                        <th class="py-3 px-4 w-[15%] text-center">Status</th>
                        <th class="py-3 px-4 w-[20%] text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">

                    <tr v-if="isLoading && paginatedPerbaikan.length === 0">
                        <td colspan="9" class="py-10 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <RotateCw class="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                                <span class="text-xs font-medium text-slate-400 dark:text-slate-500">Memuat
                                    data...</span>
                            </div>
                        </td>
                    </tr>

                    <tr v-else v-for="(item, index) in paginatedPerbaikan" :key="item.id"
                        class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td class="py-3 px-4 text-center font-medium text-slate-400">
                            {{ (currentPage - 1) * 10 + index + 1 }}
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase truncate">
                            {{ item.kode }}
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase">
                            <div class="flex items-center gap-3">
                                <div class="flex flex-col min-w-0">
                                    <span class="truncate font-semibold text-slate-800 dark:text-slate-200">{{
                                        item.produk?.kodeproduk }}</span>
                                    <span class="text-xs text-slate-400 normal-case tracking-wide font-normal">{{
                                        item.produk?.nama }}</span>
                                </div>
                            </div>
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase truncate">
                            {{ item.kondisi?.kondisi }}
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase truncate">
                            {{ item.keterangan }}
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase truncate">
                            {{ item.tanggalmasuk }}
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase truncate">
                            {{ item.tanggalkeluar }}
                        </td>

                        <td class="py-3 px-4 text-center">
                            <span v-if="item.status === 1 || item.status === 'ACTIVE'"
                                class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                                ACTIVE
                            </span>
                            <span v-else
                                class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-white dark:text-slate-400 bg-blue-600 dark:bg-slate-800 rounded-lg">
                                SELESAI
                            </span>
                        </td>

                        <td class="py-3 px-4">
                            <!-- Tampil jika status BUKAN 2 -->
                            <div v-if="item.status !== 2" class="flex items-center justify-center gap-1">
                                <!-- Button Final / Selesai -->
                                <button @click="handleFinal(item)" title="Final / Selesai"
                                    class="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition active:scale-95">
                                    <CheckCircle2 class="w-4 h-4" />
                                </button>

                                <!-- Button Delete -->
                                <button @click="handleBatal(item)" title="Delete"
                                    class="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition active:scale-95">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>

                            <!-- Tanda strip atau keterangan jika status === 2 -->
                            <span v-else
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                                Selesai
                            </span>
                        </td>
                    </tr>

                    <tr v-if="!isLoading && paginatedPerbaikan.length === 0">
                        <td colspan="4" class="py-10 text-center text-slate-400 dark:text-slate-500 text-xs">
                            No data available.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between text-xs text-slate-400">
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <div class="flex items-center gap-1">
                <button @click="currentPage--" :disabled="currentPage === 1"
                    class="p-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40">
                    <ChevronLeft class="w-4 h-4" />
                </button>
                <button @click="currentPage++" :disabled="currentPage === totalPages"
                    class="p-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40">
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { Search, ChevronLeft, ChevronRight, CheckCircle2, Trash2, RotateCw } from 'lucide-vue-next';
import { usePerbaikan } from '../composables/usePerbaikan';

const {
    paginatedPerbaikan,
    searchQuery,
    currentPage,
    totalPages,
    isLoading,
    fetchPerbaikan,
    handleFinal, // Ganti handleEdit menjadi handleFinal jika ada di composable
    handleBatal
} = usePerbaikan();

const handleRefresh = async () => {
    await fetchPerbaikan();
};
</script>
