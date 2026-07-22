<template>
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="isModalCariNotaOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div
                class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl overflow-hidden flex flex-col">

                <!-- HEADER -->
                <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        Cari Transaksi Pelanggan
                    </h3>
                    <button type="button" @click="isModalCariNotaOpen = false"
                        class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition cursor-pointer">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- BODY -->
                <form @submit.prevent="handleSubmit" class="p-5 flex flex-col gap-4">
                    <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Kode Nota / Transaksi
                        </label>
                        <input type="text" v-model="formDariToko.kodetransaksi" placeholder="Masukkan kode misal: PJ-2025..."
                            :class="[errors.kodetransaksi ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-950 dark:focus:ring-blue-400']"
                            class="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 transition" />
                        <span v-if="errors.kodetransaksi" class="text-[10px] text-rose-500 font-medium">
                            {{ errors.kodetransaksi }}
                        </span>
                    </div>

                    <!-- FOOTER ACTIONS -->
                    <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" @click="isModalCariNotaOpen = false"
                            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl uppercase tracking-wider transition cursor-pointer">
                            Batal
                        </button>
                        <button type="submit" :disabled="isLoadingTransaksiPelanggan"
                            class="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer disabled:opacity-50">
                            <Loader2 v-if="isLoadingTransaksiPelanggan" class="w-3.5 h-3.5 animate-spin" />
                            <span>{{ isLoadingTransaksiPelanggan ? 'Mencari...' : 'Cari Nota' }}</span>
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { X, Loader2 } from 'lucide-vue-next';
import { usePembelianDariToko } from '../composables/usePembelianDariToko';

const {
    isModalCariNotaOpen,
    isLoadingTransaksiPelanggan,
    formDariToko,
    errors,
    submitTransaksiPelanggan,
} = usePembelianDariToko();

const handleSubmit = async () => {
    await submitTransaksiPelanggan();
};
</script>
