<template>
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">

        <Transition appear enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-show="isModalOpen" @click="handleClose"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-all"></div>
        </Transition>

        <div class="flex min-h-full items-center justify-center p-4 text-center">

            <Transition appear enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div v-show="isModalOpen"
                    class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 overflow-hidden text-left transition-all">

                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <h2 class="font-bold text-slate-900 dark:text-white text-base">
                                TAMBAH PRODUK KE NAMPAN
                            </h2>
                            <p class="text-[11px] text-slate-400 mt-0.5">Pilih satu atau beberapa produk di bawah ini</p>
                        </div>
                        <button @click="handleClose" type="button"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <form @submit.prevent="handleSubmit" class="p-6 space-y-4 font-sans">

                        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                            <div class="relative flex-1 max-w-md">
                                <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="text" v-model="searchProdukQuery" placeholder="Cari kode atau nama produk..."
                                    class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                            </div>
                            <div class="text-xs text-slate-400 self-center">
                                Terpilih: <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ selectedProdukIds.length }}</span> produk
                            </div>
                        </div>

                        <div v-if="isLoadingProduk" class="space-y-2 py-8 text-center text-sm text-slate-400">
                            <div class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent mb-2"></div>
                            <div>Memuat data produk master...</div>
                        </div>

                        <div v-else-if="paginatedProduk.length === 0" class="py-12 text-center text-slate-400 dark:text-slate-500 text-sm italic">
                            Tidak ada produk master yang cocok dengan jenis nampan ini.
                        </div>

                        <div v-else class="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
                            <table class="w-full text-left border-collapse text-sm text-slate-600 dark:text-slate-400">
                                <thead class="bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-semibold text-xs border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th class="p-3 w-12 text-center">
                                            <input type="checkbox" @change="handleSelectAll"
                                                class="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 transition cursor-pointer" />
                                        </th>
                                        <th class="p-3">Kode Produk</th>
                                        <th class="p-3">Nama Produk</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    <tr v-for="item in paginatedProduk" :key="item.id"
                                        class="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition">
                                        <td class="p-3 text-center">
                                            <input type="checkbox" :value="item.id" v-model="selectedProdukIds"
                                                class="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 transition cursor-pointer" />
                                        </td>
                                        <td class="p-3 font-mono text-xs text-slate-900 dark:text-white font-semibold">{{ item.kodeproduk }}</td>
                                        <td class="p-3 text-slate-700 dark:text-slate-300">{{ item.nama }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div v-if="filteredProduk.length > 0 && !isLoadingProduk" class="flex items-center justify-between text-xs text-slate-400 pt-2">
                            <span>Menampilkan {{ paginatedProduk.length }} dari {{ filteredProduk.length }} produk</span>
                            <div class="flex items-center gap-1">
                                <button type="button" @click="currentPageProduk > 1 && currentPageProduk--" :disabled="currentPageProduk === 1"
                                    class="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40 transition hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none">
                                    <ChevronLeft class="w-4 h-4" />
                                </button>
                                <button type="button" @click="currentPageProduk < totalPagesProduk && currentPageProduk++" :disabled="currentPageProduk === totalPagesProduk"
                                    class="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40 transition hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none">
                                    <ChevronRight class="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <button type="button" @click="handleClose"
                                class="px-5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-rose-900/50 rounded-xl transition active:scale-95 focus:outline-none">
                                Cancel / Close
                            </button>

                            <button type="submit" :disabled="isLoadingProduk || selectedProdukIds.length === 0"
                                class="bg-blue-950 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-semibold text-sm transition shadow-xs active:scale-95 focus:outline-none">
                                {{ isLoadingProduk ? 'Saving...' : 'Save Changes' }}
                            </button>
                        </div>

                    </form>

                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup>
import { X, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useNampanProduk } from '../composables/useNampanProduk';

const {
    isModalOpen,
    closeModal,
    isLoadingProduk,
    currentPageProduk,
    filteredProduk,
    paginatedProduk,
    totalPagesProduk,
    searchProdukQuery,
    selectedProdukIds,
    submitProduk,
} = useNampanProduk();

const handleSelectAll = (event) => {
    if (event.target.checked) {
        paginatedProduk.value.forEach(item => {
            if (!selectedProdukIds.value.includes(item.id)) {
                selectedProdukIds.value.push(item.id);
            }
        });
    } else {
        const currentIds = paginatedProduk.value.map(item => item.id);
        selectedProdukIds.value = selectedProdukIds.value.filter(id => !currentIds.includes(id));
    }
};

const handleSubmit = async () => {
    await submitProduk();
};

const handleClose = () => {
    closeModal();
};
</script>
