<template>
    <div
        class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden relative">

        <div
            class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="font-bold text-slate-900 dark:text-white text-base">Daftar Transaksi Offtake</h2>

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

            <div v-if="isLoading && paginatedOfftake.length > 0"
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
                        <th class="py-3 px-4 w-[20%]">SUPLIER</th>
                        <th class="py-3 px-4 w-[20%]">TOTAL</th>
                        <th class="py-3 px-4 w-[25%]">TANGGAL</th>
                        <th class="py-3 px-4 w-[20%] text-center">ACTIONS</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">

                    <tr v-if="isLoading && paginatedOfftake.length === 0">
                        <td colspan="6" class="py-10 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <RotateCw class="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                                <span class="text-xs font-medium text-slate-400 dark:text-slate-500">Memuat
                                    data...</span>
                            </div>
                        </td>
                    </tr>

                    <tr v-else v-for="(item, index) in paginatedOfftake" :key="item.id"
                        class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td class="py-3 px-4 text-center font-medium text-slate-400">
                            {{ (currentPage - 1) * 10 + index + 1 }}
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase truncate">
                            {{ item.kode }}
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase truncate">
                            {{ item.suplier?.nama }}
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase truncate">
                            {{ toRupiah(item.hargatotal) }}
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase truncate">
                            {{ item.tanggal }}
                        </td>

                        <td class="py-3 px-4">
                            <div class="flex items-center justify-center gap-1">
                                <button @click="handleView(item)" title="Lihat Detail"
                                    class="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition active:scale-95">
                                    <Eye class="w-4 h-4" />
                                </button>

                                <!-- Tombol Batal -->
                                <button @click="handleBatal(item)" title="Batalkan Transaksi"
                                    class="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition active:scale-95">
                                    <XCircle class="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="!isLoading && paginatedOfftake.length === 0">
                        <td colspan="6" class="py-10 text-center text-slate-400 dark:text-slate-500 text-xs">
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
import {
    Search,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Trash2,
    RotateCw,
    Eye,
    XCircle
} from 'lucide-vue-next';
import { useOfftake } from '../composables/useOfftake';
import { toRupiah } from '../../../utilities/format/toRupiah';

const {
    paginatedOfftake,
    searchQuery,
    currentPage,
    totalPages,
    isLoading,
    fetchOfftake,
    handleView,
    handleBatal
} = useOfftake();

const handleRefresh = async () => {
    await fetchOfftake();
};
</script>
