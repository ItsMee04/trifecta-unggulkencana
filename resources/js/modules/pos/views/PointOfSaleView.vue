<template>
    <main class="p-4 sm:p-6 lg:p-8 space-y-6 font-sans bg-slate-50 dark:bg-slate-950 min-h-screen">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Halaman POS
                </h1>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Kelola Transaksi Pelanggan Anda.
                </p>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row items-start gap-6 w-full">

            <PointOfSaleProdukList />

        </div>

    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import PointOfSaleProdukList from '../components/PointOfSaleProdukList.vue';
import { usePOS } from '../composables/usePOS.js';

const { fetchPelanggan, fetchDiskon, fetchKodeTransaksi, fetchTransaksiDetail } = usePOS();

// onMounted(async () => {
//     await fetchPelanggan();
//     await fetchDiskon();
//     await fetchKodeTransaksi();
//     await fetchTransaksiDetail();
// });
</script>
