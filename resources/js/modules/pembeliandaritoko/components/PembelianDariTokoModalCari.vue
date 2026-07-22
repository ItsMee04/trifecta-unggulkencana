<template>
    <!-- Modal Overlay -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isModalCariNotaOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">

            <!-- Modal Box -->
            <div
                class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] transition-all">

                <!-- Modal Header -->
                <div
                    class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <div>
                        <h3 class="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                            Cari Nota Pelanggan
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Masukkan kode nota transaksi penjualan milik pelanggan.
                        </p>
                    </div>
                    <button @click="closeModal"
                        class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Modal Body -->
                <form @submit.prevent="handleSubmit" id="formCariNota" class="p-6 space-y-4 overflow-y-auto flex-1">
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Kode Nota Transaksi
                        </label>
                        <div class="relative">
                            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input v-model="formDariToko.kodetransaksi" type="text"
                                placeholder="Contoh: TR-20251025-001..."
                                :class="[errors.kodetransaksi ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500']"
                                class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden transition" />
                        </div>
                        <span v-if="errors.kodetransaksi" class="text-[11px] text-rose-500 font-medium">
                            {{ errors.kodetransaksi }}
                        </span>
                    </div>
                </form>

                <!-- Modal Footer -->
                <div
                    class="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
                    <button type="button" @click="closeModal"
                        class="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition uppercase tracking-wider cursor-pointer">
                        Batal
                    </button>
                    <button type="submit" form="formCariNota" :disabled="isLoadingTransaksiPelanggan"
                        class="px-5 py-2 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 uppercase tracking-wider cursor-pointer">
                        <Loader2 v-if="isLoadingTransaksiPelanggan" class="w-4 h-4 animate-spin" />
                        <span>{{ isLoadingTransaksiPelanggan ? 'Mencari...' : 'Cari Nota' }}</span>
                    </button>
                </div>

            </div>
        </div>
    </Transition>
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
