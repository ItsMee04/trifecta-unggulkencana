<template>
    <div
        class="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Produk Pelanggan
            </h2>
            <span class="text-[11px] font-mono text-slate-400">
                Pilih untuk tambah ke keranjang
            </span>
        </div>

        <!-- SEARCH INPUT -->
        <div class="relative">
            <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" v-model="searchTransaksiPelanggan" placeholder="Cari nama atau kode produk..."
                class="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-400 transition" />
        </div>

        <!-- TABEL PRODUK -->
        <div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table class="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead
                    class="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th class="p-2.5 text-center w-10">NO</th>
                        <th class="p-2.5">PRODUK</th>
                        <th class="p-2.5 text-right">BERAT</th>
                        <th class="p-2.5 text-right">HARGA JUAL</th>
                        <th class="p-2.5 text-center w-12">PILIH</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                    <!-- LOADING STATE -->
                    <tr v-if="isLoadingTransaksiPelanggan">
                        <td colspan="5" class="p-6 text-center text-slate-500 dark:text-slate-400">
                            <div class="flex items-center justify-center gap-2">
                                <Loader2 class="w-4 h-4 animate-spin text-blue-950 dark:text-blue-400" />
                                <span>Memuat data...</span>
                            </div>
                        </td>
                    </tr>

                    <!-- EMPTY STATE -->
                    <tr v-else-if="paginatedTransaksiPelanggan.length === 0">
                        <td colspan="5" class="p-6 text-center text-slate-400 dark:text-slate-500 font-medium italic">
                            Tidak ada produk pelanggan.
                        </td>
                    </tr>

                    <!-- DATA LIST -->
                    <tr v-else v-for="(item, index) in paginatedTransaksiPelanggan" :key="item.id"
                        class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td class="p-2.5 text-center font-mono text-[11px]">
                            {{ (currentPageTransaksiPelanggan - 1) * itemsPerPageTransaksiPelanggan + index + 1 }}
                        </td>
                        <td class="p-2.5">
                            <div class="flex flex-col">
                                <span class="font-bold text-slate-900 dark:text-white">{{
                                    item.transaksidetail?.produk?.nama || '-' }}</span>
                                <span class="text-[10px] font-mono text-slate-400">{{
                                    item.transaksidetail?.produk?.kodeproduk || '-' }}</span>
                            </div>
                        </td>
                        <td class="p-2.5 text-right font-mono">
                            {{ item.transaksidetail?.berat }}g
                        </td>
                        <td class="p-2.5 text-right font-mono text-slate-900 dark:text-white">
                            {{ formatRupiah(item.transaksidetail?.hargajual) }}
                        </td>
                        <td class="p-2.5 text-center">
                            <button type="button" @click="handlePilihTransaksiPelanggan(item)" title="Pilih Produk Ini"
                                class="p-1.5 bg-blue-950 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg transition cursor-pointer">
                                <ArrowRight class="w-3.5 h-3.5" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- PAGINATION -->
        <div v-if="filteredTransaksiPelanggan.length > 0"
            class="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <div>
                {{ (currentPageTransaksiPelanggan - 1) * itemsPerPageTransaksiPelanggan + 1 }}-{{
                    Math.min(currentPageTransaksiPelanggan * itemsPerPageTransaksiPelanggan,
                filteredTransaksiPelanggan.length) }}
                dari {{ filteredTransaksiPelanggan.length }}
            </div>

            <div class="flex items-center gap-1">
                <button type="button" @click="currentPageTransaksiPelanggan = 1"
                    :disabled="currentPageTransaksiPelanggan === 1"
                    class="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronsLeft class="w-3.5 h-3.5" />
                </button>
                <button type="button"
                    @click="currentPageTransaksiPelanggan > 1 ? currentPageTransaksiPelanggan-- : null"
                    :disabled="currentPageTransaksiPelanggan === 1"
                    class="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft class="w-3.5 h-3.5" />
                </button>
                <button type="button" v-for="page in displayedPagesTransaksiPelanggan" :key="page"
                    @click="currentPageTransaksiPelanggan = page"
                    :class="[page === currentPageTransaksiPelanggan ? 'bg-blue-950 dark:bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800']"
                    class="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono transition">
                    {{ page }}
                </button>
                <button type="button"
                    @click="currentPageTransaksiPelanggan < totalPagesTransaksiPelanggan && currentPageTransaksiPelanggan++"
                    :disabled="currentPageTransaksiPelanggan === totalPagesTransaksiPelanggan"
                    class="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronRight class="w-3.5 h-3.5" />
                </button>
                <button type="button" @click="currentPageTransaksiPelanggan = totalPagesTransaksiPelanggan"
                    :disabled="currentPageTransaksiPelanggan === totalPagesTransaksiPelanggan"
                    class="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronsRight class="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Search, ArrowRight, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';
import { usePembelianDariToko } from '../composables/usePembelianDariToko';
import { toRupiah } from '../../../utilities/format/toRupiah';

const formatRupiah = toRupiah();

const {
    isLoadingTransaksiPelanggan,
    searchTransaksiPelanggan,
    currentPageTransaksiPelanggan,
    itemsPerPageTransaksiPelanggan,
    filteredTransaksiPelanggan,
    paginatedTransaksiPelanggan,
    displayedPagesTransaksiPelanggan,
    totalPagesTransaksiPelanggan,
    handlePilihTransaksiPelanggan,
} = usePembelianDariToko();
</script>
