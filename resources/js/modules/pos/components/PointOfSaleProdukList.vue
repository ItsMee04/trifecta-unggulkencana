<template>
    <div
        class="w-full lg:w-8/12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div class="w-full lg:w-8/12 p-6 overflow-y-auto h-full">
            <div class="mb-6">
                <h5 class="text-xl font-bold text-slate-800 tracking-tight">DAFTAR JENIS PRODUK</h5>
                <p class="text-sm text-slate-500 mt-0.5">Pilih Jenis Produk Untuk Menampilkan Produk</p>
            </div>

            <div v-if="isLoadingProduk"
                class="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200">
                <div class="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-3">
                </div>
                <h6 class="text-sm font-semibold text-slate-600">Memuat data produk...</h6>
            </div>

            <div v-else class="space-y-6">
                <div class="w-full">
                    <ul class="flex items-center gap-4 overflow-x-auto pb-3 pt-2 scrollbar-none snap-x snap-mandatory">
                        <li v-for="cat in jenisprodukList" :key="cat.id" @click="selectCategory(cat)"
                            class="snap-start shrink-0 cursor-pointer select-none group">
                            <div class="px-5 py-4 rounded-xl border text-center transition-all duration-300 min-w-[115px] relative overflow-hidden flex flex-col items-center justify-center"
                                :class="[
                                    selectedJenisProduk === cat.id
                                        ? 'bg-blue-950 border-blue-950 text-white shadow-md shadow-blue-950/20 -translate-y-1'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-950'
                                ]">
                                <div class="mb-2 flex justify-center items-center transition-all duration-300" :class="[
                                    selectedJenisProduk === cat.id
                                        ? 'text-white'
                                        : 'text-slate-500 group-hover:text-blue-950 group-hover:-translate-y-1.5'
                                ]">
                                    <svg v-if="cat.id === 'all'" class="w-7 h-7" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    <svg v-else class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>

                                <h6 class="text-xs font-bold uppercase tracking-tight truncate max-w-[100px] transition-colors duration-300"
                                    :class="selectedJenisProduk === cat.id ? 'text-white' : 'text-slate-800 group-hover:text-blue-950'">
                                    {{ cat.jenis }}
                                </h6>

                                <span
                                    class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 transition-colors duration-300"
                                    :class="selectedJenisProduk === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-950 group-hover:text-white'">
                                    {{ countItemsByJenis[cat.id] || 0 }} Items
                                </span>

                            </div>
                        </li>
                    </ul>
                </div>

                <div class="relative max-w-md">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input type="text" v-model="searchProdukQuery"
                        placeholder="Cari produk berdasarkan nama atau kode..."
                        class="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-xs" />
                </div>

                <div v-if="paginatedProduk.length === 0"
                    class="p-12 text-center bg-white rounded-2xl border border-slate-200">
                    <p class="text-sm text-slate-400">Tidak ada produk yang tersedia pada kategori ini.</p>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div v-for="item in paginatedProduk" :key="item.id" @click="handlePilihProduk(item.kodeproduk)"
                        class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-500 transition-all duration-300 cursor-pointer flex flex-col group select-none">
                        <div
                            class="aspect-square w-full bg-slate-50 relative overflow-hidden border-b border-slate-100">
                            <img v-if="item.image" :src="`${storageUrl}/${item.image}`" alt="Foto Produk"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div v-else
                                class="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                                <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span
                                class="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {{ item.kodeproduk }}
                            </span>
                        </div>

                        <div class="p-4 flex-grow flex flex-col justify-between space-y-2">
                            <div>
                                <span class="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                                    {{ item.jenis_produk?.jenis || 'Umum' }}
                                </span>
                                <h6
                                    class="text-sm font-bold text-slate-800 line-clamp-2 mt-0.5 group-hover:text-amber-500 transition-colors">
                                    {{ item.nama }}
                                </h6>
                                <p class="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                    <span>{{ item.berat }}g</span>
                                    <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>{{ item.karat }} Karat</span>
                                </p>
                            </div>
                            <div class="pt-2 border-t border-slate-100 flex justify-between items-center">
                                <span class="text-xs text-slate-400">Harga /g</span>
                                <span class="text-sm font-black text-slate-900">
                                    Rp {{ Number(item.harga || 0).toLocaleString('id-ID') }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="totalPagesProduk > 1" class="flex justify-center items-center gap-2 pt-4">
                    <button @click="currentPageProduk > 1 && currentPageProduk--" :disabled="currentPageProduk === 1"
                        class="p-2 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button v-for="page in totalPagesProduk" :key="page" @click="currentPageProduk = page"
                        class="w-9 h-9 border text-sm font-bold rounded-lg transition-all" :class="[
                            currentPageProduk === page
                                ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        ]">
                        {{ page }}
                    </button>
                    <button @click="currentPageProduk < totalPagesProduk && currentPageProduk++"
                        :disabled="currentPageProduk === totalPagesProduk"
                        class="p-2 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePOS } from '../composables/usePOS';

const storageUrl = import.meta.env.VITE_STORAGE_URL;

const {
    jenisprodukList,
    selectedJenisProduk,
    isLoadingProduk,
    countItemsByJenis,
    searchProdukQuery,
    currentPageProduk,
    totalPagesProduk,
    paginatedProduk,
    fetchJenisProduk,
    fetchProduk,
    handlePilihProduk
} = usePOS();

const selectCategory = (cat) => {
    selectedJenisProduk.value = cat.id;
    currentPageProduk.value = 1;
    fetchProduk(cat.id);
};

onMounted(() => {
    fetchJenisProduk();
    fetchProduk('all');
});
</script>

<style scoped>
/* Class utility tambahan untuk menyembunyikan default scrollbar bawaan browser di section Kategori */
.scrollbar-none::-webkit-scrollbar {
    display: none;
}

.scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
