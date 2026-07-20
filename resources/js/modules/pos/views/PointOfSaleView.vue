<template>
    <main class="relative p-3 sm:p-5 lg:p-6 font-sans bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col gap-4">

        <!-- 🌟 FULL PAGE LOADING OVERLAY (Mencegah Klik & Interaksi saat Transaksi Diproses) -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="isLoading"
                class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center cursor-wait select-none">
                <div
                    class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4 max-w-xs text-center">
                    <!-- Loading Spinner Ring -->
                    <div class="relative w-12 h-12">
                        <div
                            class="w-12 h-12 border-4 border-blue-950/20 dark:border-white/20 border-t-blue-950 dark:border-t-white rounded-full animate-spin">
                        </div>
                    </div>

                    <div class="space-y-1">
                        <h6 class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                            Memproses Transaksi
                        </h6>
                        <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Mohon tunggu sebentar, sistem sedang menyimpan data & memproses pesanan...
                        </p>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- HEADER SECTION -->
        <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
            <div class="flex items-center gap-3">
                <div class="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-950 dark:text-blue-300 rounded-xl">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Point of
                        Sale (POS)</h1>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Sistem kasir cerdas & transaksi cepat untuk
                        toko emas Anda</p>
                </div>
            </div>
        </div>

        <!-- MAIN CONTENT SECTION -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
            <div class="lg:col-span-7 xl:col-span-8 min-w-0 w-full">
                <PointOfSaleProdukList />
            </div>
            <div class="lg:col-span-5 xl:col-span-4 w-full sticky top-6">
                <PointOfSaleKasirList />
            </div>
        </div>

        <!-- MODAL PELANGGAN -->
        <PelanggaModal />
    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import PointOfSaleProdukList from '../components/PointOfSaleProdukList.vue';
import PointOfSaleKasirList from '../components/PointOfSaleKasirList.vue';
import PelanggaModal from '../../pelanggan/components/PelangganModal.vue';
import { usePOS } from '../composables/usePOS.js';

// 🌟 Import isLoading dari composables usePOS
const { fetchPelanggan, fetchDiskon, fetchKodeTransaksi, fetchJenisProduk, fetchProdukByJenis, isLoading } = usePOS();

onMounted(async () => {
    await fetchJenisProduk();
    await fetchProdukByJenis('all');
    await fetchPelanggan();
    await fetchDiskon();
    await fetchKodeTransaksi();
});
</script>
