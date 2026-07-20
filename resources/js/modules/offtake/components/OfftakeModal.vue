<template>
    <!-- Modal Overlay -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
            <!-- Modal Box -->
            <div
                class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] transition-all">
                <!-- Modal Header -->
                <div
                    class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <div>
                        <h3 class="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                            Pilih Produk Nampan
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Pilih satu atau beberapa produk perhiasan dari nampan untuk di-offtake.
                        </p>
                    </div>
                    <button @click="closeModal"
                        class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-4 overflow-y-auto flex-1">

                    <!-- Search Input -->
                    <div class="relative">
                        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input v-model="searchProdukQuery" type="text"
                            placeholder="Cari berdasarkan kode produk atau nama perhiasan..."
                            class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-medium" />
                    </div>

                    <!-- Loading State -->
                    <div v-if="isLoadingProduk" class="py-12 flex flex-col items-center justify-center gap-2">
                        <Loader2 class="w-8 h-8 text-blue-950 dark:text-white animate-spin" />
                        <span class="text-xs font-semibold text-slate-500">Memuat data produk...</span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="paginatedProduk.length === 0"
                        class="py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                        <p class="text-xs font-medium text-slate-400">Tidak ada produk nampan yang ditemukan.</p>
                    </div>

                    <!-- Table List Produk -->
                    <div v-else class="overflow-x-auto border border-slate-150 dark:border-slate-800 rounded-xl">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr
                                    class="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-150 dark:border-slate-800">
                                    <th class="p-3 w-10 text-center">
                                        <!-- Header Checkbox logic can be implemented if needed -->
                                    </th>
                                    <th class="p-3">Kode Produk</th>
                                    <th class="p-3">Nama Produk</th>
                                    <th class="p-3">Karat</th>
                                    <th class="p-3 text-right">Berat (g)</th>
                                    <th class="p-3 text-right">Harga</th>
                                </tr>
                            </thead>
                            <tbody
                                class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                                <tr v-for="item in paginatedProduk" :key="item.id" @click="toggleSelect(item.id)"
                                    class="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer transition select-none"
                                    :class="{ 'bg-indigo-50/70 dark:bg-indigo-950/40': selectedProdukIds.includes(item.id) }">
                                    <td class="p-3 text-center" @click.stop>
                                        <input type="checkbox" :value="item.id" v-model="selectedProdukIds"
                                            class="w-4 h-4 text-blue-950 rounded border-slate-300 focus:ring-blue-950 cursor-pointer" />
                                    </td>
                                    <td class="p-3 font-mono font-bold text-slate-900 dark:text-white">
                                        {{ item.produk?.kodeproduk || '-' }}
                                    </td>
                                    <td class="p-3 font-semibold text-slate-800 dark:text-slate-200">
                                        {{ item.produk?.nama || '-' }}
                                    </td>
                                    <td class="p-3">
                                        <span
                                            class="bg-amber-50 dark:bg-amber-950/40 text-amber-600 px-2 py-0.5 rounded font-bold text-[10px]">
                                            {{ item.produk?.karat?.karat || 0 }} K
                                        </span>
                                    </td>
                                    <td class="p-3 text-right font-bold text-slate-900 dark:text-white">
                                        {{ Number(item.produk?.berat || 0).toFixed(2) }} g
                                    </td>
                                    <td class="p-3 text-right font-bold text-slate-900 dark:text-white">
                                        Rp {{ Number(item.produk?.harga?.harga || 0).toLocaleString('id-ID') }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Modal Produk -->
                    <div v-if="totalPagesProduk > 1" class="flex justify-between items-center pt-2">
                        <span class="text-xs text-slate-500">
                            Terpilih: <strong class="text-blue-950 dark:text-white">{{ selectedProdukIds.length
                                }}</strong> item
                        </span>

                        <div class="flex items-center gap-1">
                            <button @click="currentPageProduk--" :disabled="currentPageProduk === 1"
                                class="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <ChevronLeft class="w-4 h-4" />
                            </button>

                            <button v-for="page in displayedPagesProduk" :key="page" @click="currentPageProduk = page"
                                class="px-3 py-1 text-xs font-bold rounded-lg transition"
                                :class="currentPageProduk === page ? 'bg-blue-950 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'">
                                {{ page }}
                            </button>

                            <button @click="currentPageProduk++" :disabled="currentPageProduk === totalPagesProduk"
                                class="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <ChevronRight class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>

                <!-- Modal Footer -->
                <div
                    class="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
                    <button type="button" @click="closeModal"
                        class="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition uppercase tracking-wider">
                        Batal
                    </button>
                    <button type="button" @click="submitProduk"
                        :disabled="isLoadingProduk || selectedProdukIds.length === 0"
                        class="px-5 py-2 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 uppercase tracking-wider">
                        <Loader2 v-if="isLoadingProduk" class="w-4 h-4 animate-spin" />
                        <span>Tambahkan ({{ selectedProdukIds.length }})</span>
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { X, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useOfftake } from '../composables/useOfftake';

const {
    isModalOpen,
    isLoadingProduk,
    searchProdukQuery,
    paginatedProduk,
    selectedProdukIds,
    currentPageProduk,
    totalPagesProduk,
    displayedPagesProduk,
    closeModal,
    submitProduk,
} = useOfftake();

// Handler toggle checklist saat baris tabel diklik
const toggleSelect = (id) => {
    const index = selectedProdukIds.value.indexOf(id);
    if (index > -1) {
        selectedProdukIds.value.splice(index, 1);
    } else {
        selectedProdukIds.value.push(id);
    }
};
</script>
