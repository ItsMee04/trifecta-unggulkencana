<template>
    <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                <small class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Nampan
                    Terpilih</small>
                <span class="font-bold text-slate-900 dark:text-white text-base uppercase">
                    {{ selectedNampanData?.id ? selectedNampanData.nampan : 'Pilih nampan...' }}
                </span>
            </div>

            <div
                class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                <small class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Total
                    Produk</small>
                <span class="font-bold text-slate-900 dark:text-white text-base">
                    {{ filteredNampanProduk.length }} Item
                </span>
            </div>

            <div
                class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-center">
                <small class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Status</small>
                <div>
                    <template v-if="selectedNampanData && selectedNampanData.id">
                        <span v-if="selectedNampanData.status == 1"
                            class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                            AKTIF
                        </span>
                        <span v-else
                            class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg">
                            TIDAK AKTIF
                        </span>
                    </template>
                    <span v-else class="font-bold text-slate-400">-</span>
                </div>
            </div>
        </div>

        <div
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden relative">
            <div
                class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 class="font-bold text-slate-900 dark:text-white text-base">Produk Dalam Nampan</h2>
                <div class="relative flex-1 sm:flex-none sm:w-64">
                    <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input v-model="searchNampanProdukQuery" type="text" placeholder="Cari produk di nampan..."
                        class="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                </div>
            </div>

            <div class="w-full overflow-x-auto relative">
                <div v-if="isLoadingNampanProduk && paginatedNampanProduk.length > 0"
                    class="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[0.5px] z-10 flex items-center justify-center transition-all duration-200">
                    <div
                        class="flex items-center gap-2 bg-white dark:bg-slate-950 px-3.5 py-2 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800">
                        <RotateCw class="w-4 h-4 text-blue-950 dark:text-white animate-spin" />
                        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Loading...</span>
                    </div>
                </div>

                <table class="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr
                            class="bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                            <th class="py-3 px-4 w-[10%] text-center whitespace-nowrap">No.</th>
                            <th class="py-3 px-4 whitespace-nowrap">Kode Produk</th>
                            <th class="py-3 px-4 whitespace-nowrap">Nama Produk</th>
                            <th class="py-3 px-4 text-center whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        <tr v-if="isLoadingNampanProduk && paginatedNampanProduk.length === 0">
                            <td colspan="4" class="py-10 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <RotateCw class="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                                    <span class="text-xs font-medium text-slate-400 dark:text-slate-500">Memuat
                                        data...</span>
                                </div>
                            </td>
                        </tr>

                        <tr v-else-if="paginatedNampanProduk.length === 0">
                            <td colspan="4"
                                class="py-10 text-center text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">
                                Tidak ada produk di nampan ini.
                            </td>
                        </tr>

                        <tr v-else v-for="(item, index) in paginatedNampanProduk" :key="item.id"
                            class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                            <td class="py-3 px-4 text-center font-medium text-slate-400 whitespace-nowrap">
                                {{ (currentPageNampanProduk - 1) * itemsPerPageNampanProduk + index + 1 }}
                            </td>
                            <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap">
                                {{ item.produk?.kodeproduk || '-' }}
                            </td>
                            <td
                                class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase whitespace-nowrap">
                                {{ item.produk?.nama || '-' }}
                            </td>
                            <td class="py-3 px-4 whitespace-nowrap">
                                <div class="flex items-center justify-center gap-1">
                                    <button @click="handlePindah(item)" title="Pindah Nampan"
                                        class="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition active:scale-95">
                                        <ArrowLeftRight class="w-4 h-4" />
                                    </button>
                                    <button @click="handleDelete(item)" title="Hapus dari Nampan"
                                        class="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition active:scale-95">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="filteredNampanProduk.length > 0"
                class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between text-xs text-slate-400">
                <span>Page {{ currentPageNampanProduk }} of {{ totalPagesNampanProduk }}</span>
                <div class="flex items-center gap-1">
                    <button @click="currentPageNampanProduk--" :disabled="currentPageNampanProduk === 1"
                        class="p-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                        <ChevronLeft class="w-4 h-4" />
                    </button>
                    <button @click="currentPageNampanProduk++"
                        :disabled="currentPageNampanProduk === totalPagesNampanProduk"
                        class="p-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                        <ChevronRight class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Search, ChevronLeft, ChevronRight, Trash2, ArrowLeftRight, RotateCw } from 'lucide-vue-next';
import { useNampanProduk } from '../composables/useNampanProduk';

const {
    handlePindah,
    handleDelete,
    isLoadingNampanProduk,
    currentPageNampanProduk,
    itemsPerPageNampanProduk,
    filteredNampanProduk,
    paginatedNampanProduk,
    totalPagesNampanProduk,
    selectedNampanData,
    searchNampanProdukQuery
} = useNampanProduk();
</script>
