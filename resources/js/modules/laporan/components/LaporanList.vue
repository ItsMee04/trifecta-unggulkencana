<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Laporan Penjualan -->
        <div @click="cetakLaporanPenjualan"
            class="bg-sky-50/50 dark:bg-slate-900/60 hover:bg-sky-100/60 dark:hover:bg-slate-800/80 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-3.5 shadow-xs">
            <div class="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-xs shrink-0 text-sky-600 dark:text-sky-400">
                <Box class="w-5 h-5" />
            </div>
            <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">LAPORAN PENJUALAN</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Total transaksi penjualan</p>
            </div>
        </div>

        <!-- Laporan Pembelian -->
        <div @click="cetakLaporanPembelian"
            class="bg-sky-50/50 dark:bg-slate-900/60 hover:bg-sky-100/60 dark:hover:bg-slate-800/80 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-3.5 shadow-xs">
            <div class="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-xs shrink-0 text-sky-600 dark:text-sky-400">
                <Box class="w-5 h-5" />
            </div>
            <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">LAPORAN PEMBELIAN</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Total transaksi pembelian</p>
            </div>
        </div>

        <!-- Laporan Offtake -->
        <div @click="cetakLaporanOfftake"
            class="bg-sky-50/50 dark:bg-slate-900/60 hover:bg-sky-100/60 dark:hover:bg-slate-800/80 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-3.5 shadow-xs">
            <div class="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-xs shrink-0 text-sky-600 dark:text-sky-400">
                <Box class="w-5 h-5" />
            </div>
            <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">LAPORAN OFFTAKE</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Total transaksi Offtake</p>
            </div>
        </div>

        <!-- Laporan Perbaikan -->
        <div @click="cetakLaporanPerbaikan"
            class="bg-sky-50/50 dark:bg-slate-900/60 hover:bg-sky-100/60 dark:hover:bg-slate-800/80 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-3.5 shadow-xs">
            <div class="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-xs shrink-0 text-sky-600 dark:text-sky-400">
                <Box class="w-5 h-5" />
            </div>
            <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">LAPORAN PERBAIKAN</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Rekap produk perbaikan</p>
            </div>
        </div>

        <!-- Laporan Mutasi Saldo -->
        <div @click="cetakLaporanMutasiSaldo"
            class="bg-sky-50/50 dark:bg-slate-900/60 hover:bg-sky-100/60 dark:hover:bg-slate-800/80 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-3.5 shadow-xs">
            <div class="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-xs shrink-0 text-sky-600 dark:text-sky-400">
                <Box class="w-5 h-5" />
            </div>
            <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">LAPORAN MUTASI SALDO</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Catatan Pemasukan, Pengeluaran</p>
            </div>
        </div>

        <!-- Laporan Nampan / Baki -->
        <div @click="cetakLaporanNampan"
            class="bg-sky-50/50 dark:bg-slate-900/60 hover:bg-sky-100/60 dark:hover:bg-slate-800/80 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-3.5 shadow-xs">
            <div class="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-xs shrink-0 text-sky-600 dark:text-sky-400">
                <Box class="w-5 h-5" />
            </div>
            <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">LAPORAN NAMPAN / BAKI</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Catatan Stok</p>
            </div>
        </div>

        <!-- Laporan Produk -->
        <div @click="cetakLaporanProduk"
            class="bg-sky-50/50 dark:bg-slate-900/60 hover:bg-sky-100/60 dark:hover:bg-slate-800/80 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-3.5 shadow-xs">
            <div class="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-xs shrink-0 text-sky-600 dark:text-sky-400">
                <Box class="w-5 h-5" />
            </div>
            <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">LAPORAN PRODUK</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Catatan Stok</p>
            </div>
        </div>

        <!-- Laporan Nampan per Baki -->
        <div @click="cetakLaporanNampanPerBaki"
            class="bg-sky-50/50 dark:bg-slate-900/60 hover:bg-sky-100/60 dark:hover:bg-slate-800/80 border border-sky-100 dark:border-slate-800 rounded-2xl p-4 transition-all cursor-pointer flex items-center gap-3.5 shadow-xs">
            <div class="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-xs shrink-0 text-sky-600 dark:text-sky-400">
                <Box class="w-5 h-5" />
            </div>
            <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">LAPORAN NAMPAN PER BAKI</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Catatan Stok</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Box } from 'lucide-vue-next';
import { useLaporan } from '../composables/useLaporan';

const {
    cetakLaporanPenjualan,
    cetakLaporanPembelian,
    cetakLaporanOfftake,
    cetakLaporanPerbaikan,
    cetakLaporanStokBulanan,
    cetakLaporanMutasiSaldo,
    cetakLaporanNampan,
    cetakLaporanProduk,
    cetakLaporanNampanPerBaki
} = useLaporan();
</script>
