<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <!-- Total Produk -->
        <div
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 transition hover:shadow-md hover:-translate-y-1">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">Total Produk</p>
                    <SkeletonCard v-if="isLoading" />
                    <template v-else>
                        <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ totalProduk }}</h2>
                        <p class="mt-3 text-xs text-slate-400">Produk aktif di inventory</p>
                    </template>
                </div>
                <div class="relative">
                    <div class="w-14 h-14 rounded-2xl bg-blue-950 flex items-center justify-center">
                        <Package2 class="w-7 h-7 text-white" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Penjualan Hari Ini -->
        <div
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 transition hover:shadow-md hover:-translate-y-1">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">Penjualan Hari Ini</p>
                    <SkeletonCard v-if="isLoading" />
                    <template v-else>
                        <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ totalPenjualanHariIni }}</h2>
                        <p class="mt-3 text-xs text-slate-400">Penjualan hari ini</p>
                    </template>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-blue-950 flex items-center justify-center">
                    <ShoppingCart class="w-7 h-7 text-white" />
                </div>
            </div>
        </div>

        <!-- Pembelian Hari Ini -->
        <div
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 transition hover:shadow-md hover:-translate-y-1">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">Pembelian Hari Ini</p>
                    <SkeletonCard v-if="isLoading" />
                    <template v-else>
                        <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ totalPembelianHariIni }}</h2>
                        <p class="mt-3 text-xs text-slate-400">Pembelian hari ini</p>
                    </template>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-blue-950 flex items-center justify-center">
                    <Wallet class="w-7 h-7 text-white" />
                </div>
            </div>
        </div>

        <!-- Total Pelanggan -->
        <div
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 transition hover:shadow-md hover:-translate-y-1">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">Total Pelanggan</p>
                    <SkeletonCard v-if="isLoading" />
                    <template v-else>
                        <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ totalPelanggan }}</h2>
                        <p class="mt-3 text-xs text-slate-400">Customer terdaftar</p>
                    </template>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-blue-950 flex items-center justify-center">
                    <Users class="w-7 h-7 text-white" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { Package2, ShoppingCart, Wallet, Users } from 'lucide-vue-next';
import { useHome } from '../composable/useHome';

import SkeletonCard from './SkeletonCard.vue';

let interval = null;

const loadDashboard = async () => {
    await Promise.all([
        fetchTotalProduk(),
        fetchTotalPenjualanHariIni(),
        fetchTotalPembelianHariIni(),
        fetchTotalPelanggan()
    ]);
}

const {
    isLoading,

    totalProduk,
    fetchTotalProduk,

    totalPenjualanHariIni,
    fetchTotalPenjualanHariIni,

    totalPembelianHariIni,
    fetchTotalPembelianHariIni,

    totalPelanggan,
    fetchTotalPelanggan
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
