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
                    <Building2 class="w-6 h-6" />
                </div>
                <div>
                    <h1 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Transaksi Pembelian Dari Toko
                    </h1>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        Penjualan / pengembalian perhiasan kembali ke toko (Penerimaan Dana)
                    </p>
                </div>
            </div>
        </div>

        <!-- MAIN LAYOUT GRID -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
            <!-- LEFT: FORM TRANSAKSI & TABEL KERANJANG -->
            <div class="lg:col-span-7 flex flex-col gap-4">
                <PembelianDariTokoForm />
            </div>

            <!-- RIGHT: TABEL PRODUK PELANGGAN -->
            <div class="lg:col-span-5 flex flex-col gap-4">
                <PelangganProdukTable />
            </div>
        </div>

        <!-- MODAL CARI NOTA/TRANSAKSI -->
        <PembelianDariTokoModalCari />

        <!-- MODAL EDIT DETAIL PRODUK -->
        <PembelianDariTokoModalEdit />

        <!-- MODAL SUKSES TRANSAKSI -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="isSuccessModalOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                <div
                    class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
                    <div
                        class="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 class="w-7 h-7" />
                    </div>

                    <div class="space-y-1">
                        <h3 class="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                            Pembelian Berhasil!
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                            Transaksi dengan kode <strong class="text-slate-800 dark:text-slate-200 font-mono">{{
                                lastCompletedPembelianKode }}</strong> telah disimpan & lunas.
                        </p>
                    </div>

                    <div class="flex flex-col gap-2 pt-2">
                        <button @click="handlePrintNota"
                            class="w-full py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer">
                            <Printer class="w-4 h-4" />
                            <span>Cetak Nota</span>
                        </button>
                        <button @click="handleNextOrder"
                            class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition uppercase tracking-wider cursor-pointer">
                            Transaksi Baru
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { Building2, CheckCircle2, Printer } from 'lucide-vue-next';
import { usePembelianDariToko } from '../composables/usePembelianDariToko.js';

import PembelianDariTokoForm from '../components/PembelianDariTokoForm.vue';
import PelangganProdukTable from '../components/PembelianDariTokoTable.vue';
import PembelianDariTokoModalCari from '../components/PembelianDariTokoModalCari.vue';
import PembelianDariTokoModalEdit from '../components/PembelianDariTokoModalEdit.vue';

const {
    isSubmitting,
    isSuccessModalOpen,
    lastCompletedPembelianKode,
    handlePrintNota,
    handleNextOrder,
    fetchKodeTransaksi,
} = usePembelianDariToko();

onMounted(() => {
    fetchKodeTransaksi();
});
</script>
