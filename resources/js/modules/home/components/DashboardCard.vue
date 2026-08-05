<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <!-- Total Produk -->
        <div
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 transition hover:shadow-md hover:-translate-y-1">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">Total Produk</p>
                    <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{totalProduk}}</h2>
                    <p class="mt-3 text-xs text-slate-400">Produk aktif di inventory</p>
                </div>
                <div class="relative">
                    <div class="w-14 h-14 rounded-2xl bg-blue-950 flex items-center justify-center">
                        <Package2 class="w-7 h-7 text-white" />
                    </div>
                    <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white">
                    </span>
                </div>
            </div>
        </div>

        <!-- Penjualan Hari Ini -->
        <div
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 transition hover:shadow-md hover:-translate-y-1">
            <div class="flex items-start justify-between">
                <div>
                    <p class="text-sm font-medium text-slate-500">Penjualan Hari Ini</p>
                    <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ totalPenjualanHariIni }}</h2>
                    <p class="mt-3 flex items-center gap-2 text-xs">
                        <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">+4</span>
                        <span class="text-slate-400">dibanding kemarin</span>
                    </p>
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
                    <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">7</h2>
                    <p class="mt-3 flex items-center gap-2 text-xs">
                        <span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-semibold">Rp18,5 Jt</span>
                        <span class="text-slate-400">total pembelian</span>
                    </p>
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
                    <h2 class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">836</h2>
                    <p class="mt-3 text-xs text-slate-400">Customer terdaftar</p>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-blue-950 flex items-center justify-center">
                    <Users class="w-7 h-7 text-white" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { Package2, ShoppingCart, Wallet, Users } from 'lucide-vue-next';
import { useHome } from '../composable/useHome';

const {
    totalProduk,
    fetchTotalProduk,

    totalPenjualanHariIni,
    fetchTotalPenjualanHariIni

} = useHome();

onMounted(() => {
    fetchTotalProduk();
    fetchTotalPenjualanHariIni();
});
</script>
