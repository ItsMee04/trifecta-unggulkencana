<template>
    <main class="relative p-3 sm:p-5 lg:p-6 font-sans bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col gap-4">

        <!-- 🌟 FULL PAGE OVERLAY (MUNCUL SAAT PAYMENT DILAKUKAN) -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="isSubmitting"
                class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center cursor-wait select-none">
                <div
                    class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4 max-w-xs text-center">
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
                            Mohon tunggu sebentar, sistem sedang menyimpan data & memproses transaksi...
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
                    <Store class="w-6 h-6" />
                </div>
                <div>
                    <h1 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Transaksi Pembelian Dari Luar Toko
                    </h1>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        Pembelian emas / perhiasan dari supplier atau pelanggan luar toko
                    </p>
                </div>
            </div>
        </div>

        <!-- MAIN LAYOUT GRID -->
        <div class="grid grid-cols-1 gap-4 w-full">
            <PembelianDariLuarTokoForm />
        </div>

        <!-- MODAL TAMBAH / EDIT PRODUK -->
        <PembelianDariLuarTokoModal />
    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { Store } from 'lucide-vue-next';
import { usePembelianDariLuarToko } from '../composables/usePembelianDariLuarToko.js';

import PembelianDariLuarTokoForm from '../components/PembelianDariLuarTokoForm.vue';
import PembelianDariLuarTokoModal from '../components/PembelianDariLuarTokoModal.vue';

const {
    isSubmitting,
    fetchKodeTransaksi,
    fetchPembelianDetail,
} = usePembelianDariLuarToko();

onMounted(() => {
    fetchKodeTransaksi();
    fetchPembelianDetail();
});
</script>
