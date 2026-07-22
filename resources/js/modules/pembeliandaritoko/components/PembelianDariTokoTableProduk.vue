<template>
    <!-- Outer Card Container -->
    <div
        class="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-3">

        <!-- Header Judul Card & Tombol Cari Nota -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Produk Nota Pelanggan
            </h2>

            <!-- 🌟 Tombol Cari Nota Pelanggan -->
            <button type="button" @click="handleCariTransaksiPelanggan"
                class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-950 dark:text-blue-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                <Search class="w-3.5 h-3.5" />
                <span>Cari Nota Pelanggan</span>
            </button>
        </div>

        <!-- Header Action & Search Bar Tabel -->
        <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-150 dark:border-slate-800">
            <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    PRODUK NOTA PELANGGAN
                </span>
                <span class="text-[10px] bg-blue-950 text-white font-black px-2 py-0.5 rounded-full">
                    {{ filteredTransaksiPelanggan.length }} Item
                </span>
            </div>

            <div class="flex items-center gap-2">
                <!-- Search Input Local Filter -->
                <div class="relative flex-grow sm:flex-grow-0">
                    <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input v-model="searchTransaksiPelanggan" type="text" placeholder="Cari di keranjang..."
                        class="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                </div>
            </div>
        </div>

        <!-- Table Container -->
        <div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr
                        class="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <th class="p-3 text-center w-10">NO</th>
                        <th class="p-3">KODE PRODUK</th>
                        <th class="p-3">NAMA PERHIASAN</th>
                        <th class="p-3 text-right">BERAT (G)</th>
                        <th class="p-3 text-right">HARGA JUAL</th>
                        <th class="p-3 text-center w-12">PILIH</th>
                    </tr>
                </thead>
                <tbody
                    class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">

                    <!-- Spinner Loading -->
                    <tr v-if="isLoadingTransaksiPelanggan">
                        <td colspan="6" class="py-10 text-center text-slate-400">
                            <div class="flex flex-col items-center justify-center gap-2">
                                <Loader2 class="w-6 h-6 animate-spin text-blue-950 dark:text-white" />
                                <span class="text-xs font-semibold text-slate-500">Memuat data produk nota...</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Empty State -->
                    <tr v-else-if="paginatedTransaksiPelanggan.length === 0">
                        <td colspan="6" class="p-6 text-center text-slate-400 italic">
                            Belum ada produk dari transaksi nota pelanggan. Silakan cari nota terlebih dahulu.
                        </td>
                    </tr>

                    <!-- Data Rows -->
                    <tr v-else v-for="(item, index) in paginatedTransaksiPelanggan" :key="item.id"
                        class="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition">
                        <td class="p-3 text-slate-400 font-mono text-[11px] text-center">
                            {{ (currentPageTransaksiPelanggan - 1) * itemsPerPageTransaksiPelanggan + index + 1 }}
                        </td>
                        <td class="p-3 font-mono font-bold text-slate-900 dark:text-white">
                            {{ item.transaksidetail?.produk?.kodeproduk || '-' }}
                        </td>
                        <td class="p-3 font-semibold text-slate-800 dark:text-slate-200">
                            {{ item.transaksidetail?.produk?.nama || '-' }}
                        </td>
                        <td class="p-3 text-right font-bold text-slate-900 dark:text-white">
                            {{ Number(item.transaksidetail?.berat || 0).toFixed(2) }} g
                        </td>
                        <td class="p-3 text-right font-bold text-slate-900 dark:text-white">
                            {{ formatRupiah(item.transaksidetail?.hargajual || 0) }}
                        </td>
                        <td class="p-3 text-center">
                            <button type="button" @click="handlePilihTransaksiPelanggan(item)" title="Tambah ke Keranjang Toko"
                                class="p-1.5 bg-blue-950 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg transition shadow-xs active:scale-95 cursor-pointer">
                                <ArrowRight class="w-3.5 h-3.5" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Bar -->
        <div v-if="totalPagesTransaksiPelanggan > 1 && !isLoadingTransaksiPelanggan" class="flex justify-between items-center pt-1">
            <span class="text-xs text-slate-400">
                Halaman {{ currentPageTransaksiPelanggan }} dari {{ totalPagesTransaksiPelanggan }}
            </span>

            <div class="flex items-center gap-1">
                <button type="button" @click="currentPageTransaksiPelanggan--" :disabled="currentPageTransaksiPelanggan === 1"
                    class="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                    <ChevronLeft class="w-4 h-4" />
                </button>

                <button type="button" v-for="page in displayedPagesTransaksiPelanggan" :key="page"
                    @click="currentPageTransaksiPelanggan = page"
                    class="px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer"
                    :class="currentPageTransaksiPelanggan === page ? 'bg-blue-950 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'">
                    {{ page }}
                </button>

                <button type="button" @click="currentPageTransaksiPelanggan++"
                    :disabled="currentPageTransaksiPelanggan === totalPagesTransaksiPelanggan"
                    class="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Search, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-vue-next';
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
    handleCariTransaksiPelanggan, // 👈 Diimpor di sini
} = usePembelianDariToko();
</script>
