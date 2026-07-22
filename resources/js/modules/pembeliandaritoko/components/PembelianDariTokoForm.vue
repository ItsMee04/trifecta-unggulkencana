<template>
    <div
        class="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-4">

        <!-- HEADER & TOMBOL CARI NOTA -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2
                class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span>Form Pembelian</span>
            </h2>
            <button type="button" @click="handleCariTransaksiPelanggan"
                class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-950 dark:text-blue-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                <Search class="w-3.5 h-3.5" />
                <span>Cari Nota Pelanggan</span>
            </button>
        </div>

        <form @submit.prevent="paymentPembelian" class="flex flex-col gap-4">
            <!-- INPUT FIELDS -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                    <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Kode Transaksi Pembelian
                    </label>
                    <input type="text" v-model="formDariToko.kode" readonly
                        class="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl cursor-not-allowed focus:outline-hidden" />
                </div>

                <div class="space-y-1">
                    <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Nama Pelanggan
                    </label>
                    <input type="text" v-model="formDariToko.pelanggan" readonly
                        placeholder="Pilih dari Nota Transaksi..."
                        class="w-full px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl cursor-not-allowed focus:outline-hidden" />
                </div>
            </div>

            <!-- TABEL KERANJANG DETAIL -->
            <PembelianDariTokoTable />

            <!-- KETERANGAN -->
            <div class="space-y-1">
                <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Keterangan / Catatan Transaksi
                </label>
                <textarea v-model="formDariToko.keterangan" rows="2"
                    placeholder="Tambahkan catatan khusus pembelian (opsional)..."
                    class="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-400 transition resize-none"></textarea>
            </div>

            <!-- SUBMIT BUTTON (Menggunakan state isSubmitting agar sinkron dengan overlay) -->
            <div class="flex justify-end pt-2">
                <button type="submit" :disabled="isSubmitting || paginatedPembelianDetail.length === 0"
                    class="w-full sm:w-auto px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                    <CreditCard v-else class="w-4 h-4" />
                    <span>{{ isSubmitting ? 'Memproses...' : 'PAYMENT (TERIMA DANA)' }}</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { Search, CreditCard, Loader2 } from 'lucide-vue-next';
import { usePembelianDariToko } from '../composables/usePembelianDariToko';
import PembelianDariTokoTable from './PembelianDariTokoTable.vue';

const {
    formDariToko,
    isSubmitting,
    paginatedPembelianDetail,
    paymentPembelian,
    handleCariTransaksiPelanggan,
} = usePembelianDariToko();
</script>
