<template>
    <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Keranjang Pembelian (Toko)
            </h3>
        </div>

        <div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table class="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead class="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th class="p-3 text-center w-12">NO</th>
                        <th class="p-3">KODE PRODUK</th>
                        <th class="p-3">NAMA PRODUK</th>
                        <th class="p-3 text-right">BERAT</th>
                        <th class="p-3 text-right">HARGA BELI</th>
                        <th class="p-3 text-right">TOTAL</th>
                        <th class="p-3 text-center w-20">AKSI</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                    <!-- LOADING STATE -->
                    <tr v-if="isLoadingPembelianDetail">
                        <td colspan="7" class="p-6 text-center text-slate-500 dark:text-slate-400">
                            <div class="flex items-center justify-center gap-2">
                                <Loader2 class="w-4 h-4 animate-spin text-blue-950 dark:text-blue-400" />
                                <span>Memuat data...</span>
                            </div>
                        </td>
                    </tr>

                    <!-- EMPTY STATE -->
                    <tr v-else-if="paginatedPembelianDetail.length === 0">
                        <td colspan="7" class="p-6 text-center text-slate-400 dark:text-slate-500 font-medium italic">
                            Keranjang kosong. Silakan pilih produk pelanggan.
                        </td>
                    </tr>

                    <!-- DATA LIST -->
                    <tr v-else v-for="(item, index) in paginatedPembelianDetail" :key="item.id"
                        class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td class="p-3 text-center font-mono text-[11px]">
                            {{ (currentPagePembelianDetail - 1) * itemsPerPagePembelianDetail + index + 1 }}
                        </td>
                        <td class="p-3 font-mono font-bold text-slate-900 dark:text-white">
                            {{ item.produk?.kodeproduk || '-' }}
                        </td>
                        <td class="p-3 font-medium text-slate-800 dark:text-slate-200">
                            {{ item.produk?.nama || '-' }}
                        </td>
                        <td class="p-3 text-right font-mono">
                            {{ item.berat }}g
                        </td>
                        <td class="p-3 text-right font-mono text-slate-900 dark:text-white">
                            {{ formatRupiah(item.hargabeli) }}
                        </td>
                        <td class="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {{ formatRupiah(item.total) }}
                        </td>
                        <td class="p-3 text-center">
                            <div class="flex items-center justify-center gap-1">
                                <button type="button" @click="handleEdit(item)" title="Edit Produk"
                                    class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition cursor-pointer">
                                    <Edit2 class="w-3.5 h-3.5" />
                                </button>
                                <button type="button" @click="handleDelete(item)" title="Hapus Produk"
                                    class="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition cursor-pointer">
                                    <Trash2 class="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- PAGINATION -->
        <div v-if="filteredPembelianDetail.length > 0"
            class="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div>
                Menampilkan {{ (currentPagePembelianDetail - 1) * itemsPerPagePembelianDetail + 1 }} sampai
                {{ Math.min(currentPagePembelianDetail * itemsPerPagePembelianDetail, filteredPembelianDetail.length) }}
                dari {{ filteredPembelianDetail.length }} data
            </div>

            <div class="flex items-center gap-1">
                <button type="button" @click="currentPagePembelianDetail = 1" :disabled="currentPagePembelianDetail === 1"
                    class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronsLeft class="w-3.5 h-3.5" />
                </button>
                <button type="button" @click="currentPagePembelianDetail > 1 ? currentPagePembelianDetail-- : null"
                    :disabled="currentPagePembelianDetail === 1"
                    class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft class="w-3.5 h-3.5" />
                </button>
                <button type="button" v-for="page in displayedPagesPembelianDetail" :key="page"
                    @click="currentPagePembelianDetail = page"
                    :class="[page === currentPagePembelianDetail ? 'bg-blue-950 dark:bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800']"
                    class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 font-mono transition">
                    {{ page }}
                </button>
                <button type="button" @click="currentPagePembelianDetail < totalPagesPembelianDetail && currentPagePembelianDetail++"
                    :disabled="currentPagePembelianDetail === totalPagesPembelianDetail"
                    class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronRight class="w-3.5 h-3.5" />
                </button>
                <button type="button" @click="currentPagePembelianDetail = totalPagesPembelianDetail"
                    :disabled="currentPagePembelianDetail === totalPagesPembelianDetail"
                    class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronsRight class="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Loader2, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';
import { usePembelianDariToko } from '../composables/usePembelianDariToko';
import { toRupiah } from '../../../utilities/format/toRupiah';

const formatRupiah = toRupiah();

const {
    filteredPembelianDetail,
    paginatedPembelianDetail,
    currentPagePembelianDetail,
    itemsPerPagePembelianDetail,
    isLoadingPembelianDetail,
    totalPagesPembelianDetail,
    displayedPagesPembelianDetail,
    fetchPembelianDetail,
    handleEdit,
    handleDelete,
} = usePembelianDariToko();

onMounted(() => {
    fetchPembelianDetail();
});
</script>
