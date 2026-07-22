<template>
    <div class="space-y-3">
        <!-- Header & Action Bar -->
        <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-150 dark:border-slate-800">
            <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Daftar Keranjang Pembelian Toko
                </span>
                <span class="text-[10px] bg-blue-950 text-white font-black px-2 py-0.5 rounded-full">
                    {{ filteredPembelianDetail.length }} Item
                </span>
            </div>

            <div class="flex items-center gap-2">
                <!-- Search Input -->
                <div class="relative flex-grow sm:flex-grow-0">
                    <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input v-model="searchPembelianDetail" type="text" placeholder="Cari di keranjang..."
                        class="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white" />
                </div>
            </div>
        </div>

        <!-- Table Container -->
        <div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr
                        class="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <th class="p-3 text-center w-10">No</th>
                        <th class="p-3">Kode Produk</th>
                        <th class="p-3">Nama Perhiasan</th>
                        <th class="p-3 text-right">Berat (g)</th>
                        <th class="p-3 text-right">Harga Beli</th>
                        <th class="p-3 text-right">Total</th>
                        <th class="p-3 text-center w-20">Aksi</th>
                    </tr>
                </thead>
                <tbody
                    class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">

                    <!-- 🌟 SPINNER LOADING LOKAL TABEL -->
                    <tr v-if="isLoadingPembelianDetail">
                        <td colspan="7" class="py-10 text-center text-slate-400">
                            <div class="flex flex-col items-center justify-center gap-2">
                                <Loader2 class="w-6 h-6 animate-spin text-blue-950 dark:text-white" />
                                <span class="text-xs font-semibold text-slate-500">Memuat data keranjang...</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Empty State -->
                    <tr v-else-if="paginatedPembelianDetail.length === 0">
                        <td colspan="7" class="p-6 text-center text-slate-400 italic">
                            Belum ada produk di dalam keranjang. Silakan pilih produk dari tabel nota pelanggan.
                        </td>
                    </tr>

                    <!-- Data Rows -->
                    <tr v-else v-for="(item, index) in paginatedPembelianDetail" :key="item.id"
                        class="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition">
                        <td class="p-3 text-slate-400 font-mono text-[11px] text-center">
                            {{ (currentPagePembelianDetail - 1) * itemsPerPagePembelianDetail + index + 1 }}
                        </td>
                        <td class="p-3 font-mono font-bold text-slate-900 dark:text-white">
                            {{ item.produk?.kodeproduk || '-' }}
                        </td>
                        <td class="p-3 font-semibold text-slate-800 dark:text-slate-200">
                            {{ item.produk?.nama || '-' }}
                        </td>
                        <td class="p-3 text-right font-bold text-slate-900 dark:text-white">
                            {{ Number(item.berat || item.produk?.berat || 0).toFixed(2) }} g
                        </td>
                        <td class="p-3 text-right font-bold text-slate-900 dark:text-white">
                            {{ formatRupiah(item.hargabeli || 0) }}
                        </td>
                        <td class="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            {{ formatRupiah(item.total || (item.berat * (item.hargabeli || 0))) }}
                        </td>
                        <td class="p-3 text-center">
                            <div class="flex items-center justify-center gap-1">
                                <button type="button" @click="handleEdit(item)" title="Edit Detail"
                                    class="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition cursor-pointer">
                                    <Edit2 class="w-4 h-4" />
                                </button>
                                <button type="button" @click="handleDelete(item)" title="Hapus Barang"
                                    class="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition cursor-pointer">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>

                <!-- Table Footer Summaries -->
                <tfoot v-if="paginatedPembelianDetail.length > 0 && !isLoadingPembelianDetail"
                    class="bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 font-bold text-xs">
                    <tr>
                        <td colspan="3" class="p-3 text-right uppercase text-slate-500 text-[10px]">Total Akumulasi:
                        </td>
                        <td class="p-3 text-right text-blue-950 dark:text-white font-extrabold">
                            {{ totalBerat.toFixed(2) }} g
                        </td>
                        <td></td>
                        <td class="p-3 text-right text-blue-950 dark:text-white font-extrabold">
                            {{ formatRupiah(totalHargaSemua) }}
                        </td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Pagination Bar -->
        <div v-if="totalPagesPembelianDetail > 1 && !isLoadingPembelianDetail" class="flex justify-between items-center pt-2">
            <span class="text-xs text-slate-400">
                Halaman {{ currentPagePembelianDetail }} dari {{ totalPagesPembelianDetail }}
            </span>

            <div class="flex items-center gap-1">
                <button type="button" @click="currentPagePembelianDetail--" :disabled="currentPagePembelianDetail === 1"
                    class="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                    <ChevronLeft class="w-4 h-4" />
                </button>

                <button type="button" v-for="page in displayedPagesPembelianDetail" :key="page"
                    @click="currentPagePembelianDetail = page"
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer"
                    :class="currentPagePembelianDetail === page ? 'bg-blue-950 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'">
                    {{ page }}
                </button>

                <button type="button" @click="currentPagePembelianDetail++"
                    :disabled="currentPagePembelianDetail === totalPagesPembelianDetail"
                    class="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Search, Edit2, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { usePembelianDariToko } from '../composables/usePembelianDariToko';
import { toRupiah } from '../../../utilities/format/toRupiah';

const formatRupiah = toRupiah();

const {
    filteredPembelianDetail,
    paginatedPembelianDetail,
    searchPembelianDetail,
    currentPagePembelianDetail,
    itemsPerPagePembelianDetail,
    totalPagesPembelianDetail,
    displayedPagesPembelianDetail,
    isLoadingPembelianDetail,
    fetchPembelianDetail,
    handleEdit,
    handleDelete,
} = usePembelianDariToko();

const totalBerat = computed(() => {
    return filteredPembelianDetail.value.reduce((acc, item) => {
        return acc + Number(item.berat || item.produk?.berat || 0);
    }, 0);
});

const totalHargaSemua = computed(() => {
    return filteredPembelianDetail.value.reduce((acc, item) => {
        return acc + Number(item.total || (item.berat * (item.hargabeli || 0)));
    }, 0);
});

onMounted(() => {
    fetchPembelianDetail();
});
</script>
