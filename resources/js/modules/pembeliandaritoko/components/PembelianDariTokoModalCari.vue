<template>
    <div v-if="isModalCariNotaOpen" class="fixed inset-0 z-50 overflow-y-auto">

        <!-- 1. Backdrop Overlay Animation -->
        <Transition appear enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-show="isModalCariNotaOpen" @click="closeModal"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-all"></div>
        </Transition>

        <div class="flex min-h-full items-center justify-center p-4 text-center">

            <!-- 2. Modal Box Scale & Slide Animation -->
            <Transition appear enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div v-show="isModalCariNotaOpen"
                    class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 overflow-hidden text-left transition-all">

                    <!-- Modal Header -->
                    <div
                        class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between relative">
                        <h2 class="font-bold text-slate-900 dark:text-white text-base">
                            CARI NOTA PELANGGAN
                        </h2>

                        <button @click="closeModal" type="button" title="Close Modal"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Modal Body / Form -->
                    <form @submit.prevent="handleSubmit" class="p-6 space-y-4 font-sans">
                        <div class="space-y-1.5">
                            <label for="kodetransaksi" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                Kode Nota Transaksi
                            </label>
                            <div class="relative">
                                <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input v-model="formDariToko.kodetransaksi" type="text" id="kodetransaksi"
                                    placeholder="Contoh: TR-20251025-001..."
                                    :class="[errors.kodetransaksi ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500']"
                                    class="w-full pl-10 pr-3.5 py-2 bg-white dark:bg-slate-950 border rounded-xl text-sm focus:outline-none text-slate-900 dark:text-white transition" />
                            </div>
                            <span v-if="errors.kodetransaksi" class="text-xs text-rose-500 font-medium block mt-1">
                                {{ errors.kodetransaksi }}
                            </span>
                        </div>

                        <!-- Modal Footer Buttons -->
                        <div
                            class="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <button type="button" @click="closeModal"
                                class="px-5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-rose-900/50 rounded-xl transition active:scale-95 focus:outline-none">
                                Cancel / Close
                            </button>

                            <button type="submit" :disabled="isLoadingTransaksiPelanggan"
                                class="bg-blue-950 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-semibold text-sm transition shadow-xs active:scale-95 focus:outline-none flex items-center gap-2">
                                <Loader2 v-if="isLoadingTransaksiPelanggan" class="w-4 h-4 animate-spin" />
                                <span>{{ isLoadingTransaksiPelanggan ? 'Mencari...' : 'Cari Nota' }}</span>
                            </button>
                        </div>
                    </form>

                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup>
import { X, Search, Loader2 } from 'lucide-vue-next';
import { usePembelianDariToko } from '../composables/usePembelianDariToko';

const {
    isModalCariNotaOpen,
    isLoadingTransaksiPelanggan,
    formDariToko,
    errors,
    submitTransaksiPelanggan,
} = usePembelianDariToko();

const closeModal = () => {
    isModalCariNotaOpen.value = false;
};

const handleSubmit = async () => {
    await submitTransaksiPelanggan();
};
</script>
