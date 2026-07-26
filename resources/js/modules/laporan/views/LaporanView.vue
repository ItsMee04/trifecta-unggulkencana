<template>
    <main class="p-4 sm:p-6 lg:p-8 space-y-6 font-sans">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Halaman Laporan
                </h1>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Kelola laporan Produk pada penjualan / pembelian operasional Anda.
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-4">
                <PeriodeList />
            </div>

            <div class="lg:col-span-8">
                <LaporanList />
            </div>
        </div>

    </main>
</template>

<script setup>
import { Plus } from 'lucide-vue-next';
import PeriodeList from '../components/PeriodeList.vue';
import LaporanList from '../components/LaporanList.vue';
import { useLaporan } from '../composables/useLaporan.js';

// // PERBAIKAN: Ambil juga fungsi handleCreate dari composable
// const { selectPeriodeStok } = useLaporan();
</script>
