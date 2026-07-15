<template>
    <div
        class="w-full min-w-0 min-h-[640px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs p-5 flex flex-col justify-between transition-all duration-300">
        <div class="space-y-4">
            <div class="flex flex-col sm:flex-row items-center gap-3">
                <div class="relative w-full">
                    <span
                        class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
                        <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input type="text" v-model="searchProdukQuery"
                        placeholder="Cari perhiasan berdasarkan nama, jenis, atau kode..."
                        class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none text-slate-900 dark:text-white font-medium placeholder-slate-400" />
                </div>
            </div>

            <div class="relative w-full min-w-0">
                <ul ref="sliderRef" @mousedown="startDrag" @mouseleave="stopDrag" @mouseup="stopDrag"
                    @mousemove="onDrag"
                    class="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory w-full cursor-grab active:cursor-grabbing select-none px-2">
                    <li v-for="cat in jenisprodukList" :key="cat.id" @click="selectCategory(cat.id)"
                        class="snap-start shrink-0">
                        <button
                            class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 border border-slate-100 dark:border-slate-800/80"
                            :class="selectedJenisProduk === cat.id ? 'bg-blue-950 border-blue-950 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'">
                            <span class="p-1 rounded-lg flex justify-center items-center"
                                :class="selectedJenisProduk === cat.id ? 'bg-white/15 text-white' : 'bg-slate-200/50 dark:bg-slate-800'">
                                <svg v-if="cat.id === 'all'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </span>
                            <span
                                :class="selectedJenisProduk === cat.id ? 'text-white' : 'text-slate-700 dark:text-slate-300'">{{
                                cat.jenis }}</span>
                            <span class="text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1"
                                :class="selectedJenisProduk === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-800'">{{
                                countItemsByJenis[cat.id] || 0 }}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <div class="mt-5 flex-grow flex flex-col justify-between min-w-0">
            <div v-if="isLoadingProduk"
                class="w-full flex-grow min-h-[350px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 dark:border-slate-800/80 my-2">
                <div
                    class="w-9 h-9 border-3 border-blue-950/20 border-t-blue-950 dark:border-t-white rounded-full animate-spin mb-3">
                </div>
                <div class="text-xs font-semibold text-slate-500">Memuat data dari kategori...</div>
            </div>

            <div v-else-if="paginatedProduk.length === 0"
                class="w-full flex-grow min-h-[350px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <svg class="w-12 h-12 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p class="text-xs font-semibold text-slate-400">Tidak ada perhiasan yang ditemukan</p>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 flex-grow content-start">
                <div v-for="item in paginatedProduk" :key="item.id" @click="handlePilihProduk(item)"
                    class="bg-white dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-950/40 transition-all duration-300 cursor-pointer flex flex-col justify-between">
                    <div>
                        <div
                            class="aspect-4/3 w-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden border-b border-slate-100">
                            <img v-if="item.image && item.image !== 'default.png'" :src="`${STORAGE_URL}/${item.image}`"
                                alt="Foto" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg></div>
                            <span
                                class="absolute top-2 left-2 bg-slate-900/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">{{
                                item.kodeproduk }}</span>
                        </div>
                        <div class="p-3 space-y-1">
                            <div class="flex justify-between items-center">
                                <span class="text-[9px] uppercase font-bold text-blue-950 dark:text-blue-400">{{
                                    item.jenis_produk?.jenis || 'Umum' }}</span>
                                <span
                                    class="bg-blue-50 dark:bg-blue-950/40 text-blue-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">{{
                                    item.berat }}g</span>
                            </div>
                            <div class="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{{ item.nama
                                }}</div>
                            <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
                                <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>{{ item.karat }} Karat</span>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 pt-2 border-t border-slate-100 flex justify-between items-center">
                        <span class="text-[9px] text-slate-400 font-semibold uppercase">Harga /g</span>
                        <span class="text-[12px] font-black text-slate-900 dark:text-white">Rp {{ Number(item.harga ||
                            0).toLocaleString('id-ID') }}</span>
                    </div>
                </div>
            </div>

            <div v-if="totalPagesProduk > 1" class="flex justify-center items-center gap-1 pt-4 mt-auto">
                <button @click="currentPageProduk--" :disabled="currentPageProduk === 1"
                    class="p-1.5 border border-slate-150 rounded-lg disabled:opacity-30">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button v-for="page in totalPagesProduk" :key="page" @click="currentPageProduk = page"
                    class="w-7 h-7 text-xs font-bold rounded-lg"
                    :class="currentPageProduk === page ? 'bg-blue-950 text-white' : 'bg-transparent text-slate-600 dark:text-slate-400'">
                    {{ page }}
                </button>

                <button @click="currentPageProduk++" :disabled="currentPageProduk === totalPagesProduk"
                    class="p-1.5 border border-slate-150 rounded-lg disabled:opacity-30">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePOS } from '../composables/usePOS';

const {
    jenisprodukList, selectedJenisProduk, isLoadingProduk, searchProdukQuery,
    countItemsByJenis, totalPagesProduk, currentPageProduk, paginatedProduk, STORAGE_URL,
    selectCategory, handlePilihProduk
} = usePOS();

// Logic Slider Drag Mouse
const sliderRef = ref(null);
let isDown = false, startX, scrollLeft;
const startDrag = (e) => { isDown = true; startX = e.pageX - sliderRef.value.offsetLeft; scrollLeft = sliderRef.value.scrollLeft; };
const stopDrag = () => { isDown = false; };
const onDrag = (e) => { if (!isDown) return; e.preventDefault(); const walk = ((e.pageX - sliderRef.value.offsetLeft) - startX) * 2; sliderRef.value.scrollLeft = scrollLeft - walk; };
</script>
