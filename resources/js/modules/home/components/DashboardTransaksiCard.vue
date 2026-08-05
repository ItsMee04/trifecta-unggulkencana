<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
        <!-- Total Produk -->
        <div
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 transition hover:shadow-md hover:-translate-y-1">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">Total Dana Masuk Dari Transaksi Hari Ini</p>
                    <SkeletonCard v-if="isLoading" />
                    <template v-else>
                        <h2 class="mt-2 text-3xl font-bold text-blue-700 dark:text-white">{{ toRupiah(totalPemasukanTransaksiHariIni) }}</h2>
                        <p class="mt-3 text-xs text-slate-400">Pemasukan dari Transakdi dan Offtake</p>
                    </template>
                </div>
                <div class="relative">
                    <div class="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center">
                        <BanknoteArrowDown class="w-7 h-7 text-white" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Penjualan Hari Ini -->
        <div
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 transition hover:shadow-md hover:-translate-y-1">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">Total Dana Keluar Dari Transaksi Hari Ini</p>
                    <SkeletonCard v-if="isLoading" />
                    <template v-else>
                        <h2 class="mt-2 text-3xl font-bold text-emerald-700 dark:text-white">{{ toRupiah(totalPengeluaranTransaksiHariIni) }}</h2>
                        <p class="mt-3 text-xs text-slate-400">Penjualan hari ini</p>
                    </template>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-emerald-700 flex items-center justify-center">
                    <BanknoteArrowUp class="w-7 h-7 text-white" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { BanknoteArrowUp, BanknoteArrowDown } from 'lucide-vue-next';
import { useHome } from '../composable/useHome';
import { toRupiah } from '../../../utilities/format/toRupiah.js'

import SkeletonCard from './SkeletonCard.vue';

let interval = null;

const loadDashboard = async () => {
    await Promise.all([
        fetchTotalPemasukanTransaksiHariIni(),
        fetchTotalPengeluaranTransaksiHariIni(),
    ]);
}

const {
    isLoading,

    totalPemasukanTransaksiHariIni,
    fetchTotalPemasukanTransaksiHariIni,

    totalPengeluaranTransaksiHariIni,
    fetchTotalPengeluaranTransaksiHariIni
} = useHome();

onMounted(() => {
    loadDashboard();
    interval = setInterval(() => {
        loadDashboard();
    }, 10000); // Reload every minute
});

onUnmounted(() => {
    if (interval) {
        clearInterval(interval);
    }
});
</script>
