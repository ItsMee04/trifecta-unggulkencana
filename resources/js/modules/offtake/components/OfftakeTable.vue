<template>
    <div class="space-y-3">
        <!-- Header & Action Bar -->
        <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-150 dark:border-slate-800">
            <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Daftar Barang Offtake
                </span>
                <span class="text-[10px] bg-blue-950 text-white font-black px-2 py-0.5 rounded-full">
                    {{ totalProduk }} Item
                </span>
            </div>

            <div class="flex items-center gap-2">
                <!-- Search Input -->
                <div class="relative flex-grow sm:flex-grow-0">
                    <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input v-model="searchOfftakeDetailQuery" type="text" placeholder="Cari barang..."
                        class="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white" />
                </div>

                <!-- Button Tambah Produk -->
                <button type="button" @click="handleCreate"
                    class="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition shadow-xs active:scale-95 flex items-center gap-1.5 uppercase tracking-wider shrink-0 cursor-pointer">
                    <Plus class="w-3.5 h-3.5" />
                    <span>Pilih Produk</span>
                </button>
            </div>
        </div>

        <!-- Table Container -->
        <div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr
                        class="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <th class="p-3">No</th>
                        <th class="p-3">Kode Produk</th>
                        <th class="p-3">Nama Perhiasan</th>
                        <th class="p-3 text-center">Karat</th>
                        <th class="p-3 text-right">Berat (g)</th>
                        <th class="p-3 text-right">Estimasi Harga</th>
                        <th class="p-3 text-center w-12">Aksi</th>
                    </tr>
                </thead>
                <tbody
                    class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">

                    <!-- 🌟 SPINNER LOADING LOKAL TABEL -->
                    <tr v-if="isLoadingTable">
                        <td colspan="7" class="py-10 text-center text-slate-400">
                            <div class="flex flex-col items-center justify-center gap-2">
                                <Loader2 class="w-6 h-6 animate-spin text-blue-950 dark:text-white" />
                                <span class="text-xs font-semibold text-slate-500">Memuat data produk...</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Empty State -->
                    <tr v-else-if="paginatedOfftakeDetail.length === 0">
                        <td colspan="7" class="p-6 text-center text-slate-400 italic">
                            Belum ada produk di dalam keranjang offtake. Klik tombol <strong>"Pilih Produk"</strong>
                            untuk menambahkan.
                        </td>
                    </tr>

                    <!-- Data Rows -->
                    <tr v-else v-for="(item, index) in paginatedOfftakeDetail" :key="item.id"
                        class="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition">
                        <td class="p-3 text-slate-400 font-mono text-[11px]">
                            {{ (currentPageOfftakeDetail - 1) * itemsPerPageOfftakeDetail + index + 1 }}
                        </td>
                        <td class="p-3 font-mono font-bold text-slate-900 dark:text-white">
                            {{ item.produk?.kodeproduk || '-' }}
                        </td>
                        <td class="p-3 font-semibold text-slate-800 dark:text-slate-200">
                            {{ item.produk?.nama || '-' }}
                        </td>
                        <td class="p-3 text-center">
                            <span
                                class="bg-amber-50 dark:bg-amber-950/40 text-amber-600 px-2 py-0.5 rounded font-bold text-[10px]">
                                {{ item.karat || item.produk?.karat?.karat || 0 }} K
                            </span>
                        </td>
                        <td class="p-3 text-right font-bold text-slate-900 dark:text-white">
                            {{ Number(item.berat || 0).toFixed(2) }} g
                        </td>
                        <td class="p-3 text-right font-bold text-slate-900 dark:text-white">
                            Rp {{ Number(item.total || (item.berat * (item.hargajual || 0))).toLocaleString('id-ID') }}
                        </td>
                        <td class="p-3 text-center">
                            <button type="button" @click="handleDelete(item)" title="Keluarkan barang"
                                class="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition">
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                </tbody>

                <!-- Table Footer Summaries -->
                <tfoot v-if="paginatedOfftakeDetail.length > 0 && !isLoadingTable"
                    class="bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 font-bold text-xs">
                    <tr>
                        <td colspan="4" class="p-3 text-right uppercase text-slate-500 text-[10px]">Total Akumulasi:
                        </td>
                        <td class="p-3 text-right text-blue-950 dark:text-white font-extrabold">
                            {{ totalBerat.toFixed(2) }} g
                        </td>
                        <td class="p-3 text-right text-blue-950 dark:text-white font-extrabold">
                            Rp {{ totalHargaSemua.toLocaleString('id-ID') }}
                        </td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Pagination Bar -->
        <div v-if="totalPagesOfftakeDetail > 1 && !isLoadingTable" class="flex justify-between items-center pt-2">
            <span class="text-xs text-slate-400">
                Halaman {{ currentPageOfftakeDetail }} dari {{ totalPagesOfftakeDetail }}
            </span>

            <div class="flex items-center gap-1">
                <button type="button" @click="currentPageOfftakeDetail--" :disabled="currentPageOfftakeDetail === 1"
                    class="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                    <ChevronLeft class="w-4 h-4" />
                </button>

                <button type="button" v-for="page in displayedPagesOfftakeDetail" :key="page"
                    @click="currentPageOfftakeDetail = page"
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer"
                    :class="currentPageOfftakeDetail === page ? 'bg-blue-950 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'">
                    {{ page }}
                </button>

                <button type="button" @click="currentPageOfftakeDetail++"
                    :disabled="currentPageOfftakeDetail === totalPagesOfftakeDetail"
                    class="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Plus, Search, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useOfftake } from '../composables/useOfftake';

const {
    paginatedOfftakeDetail,
    searchOfftakeDetailQuery,
    currentPageOfftakeDetail,
    itemsPerPageOfftakeDetail,
    totalPagesOfftakeDetail,
    displayedPagesOfftakeDetail,
    isLoadingTable,
    totalProduk,
    totalBerat,
    totalHargaSemua,
    handleCreate,
    handleDelete,
} = useOfftake();
</script>
