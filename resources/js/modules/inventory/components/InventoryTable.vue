<template>
    <!-- Card Overview Header -->
    <div
        class="mb-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-900/50 p-4 shadow-xs border border-indigo-100 dark:border-slate-800">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <!-- Periode Info -->
            <div
                class="w-full md:w-1/4 pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                <div v-if="selectedPeriodeStokData">
                    <small class="block text-xs text-slate-500 uppercase tracking-wider">Periode</small>
                    <span class="font-bold text-indigo-600 dark:text-indigo-400 text-base">
                        {{ selectedPeriodeStokData?.periode || '-' }}
                    </span>
                </div>
                <div v-else>
                    <span class="text-sm text-slate-400 italic">Pilih Periode...</span>
                </div>
            </div>

            <!-- Rekap Summary Metrics -->
            <div class="w-full md:w-2/4 py-2 md:py-0">
                <div class="flex flex-wrap items-center justify-around gap-2">
                    <div class="text-center">
                        <small class="block text-xs text-slate-500 uppercase tracking-wider mb-1">MASUK</small>
                        <span
                            class="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                            {{ totalRekap?.masukUnit || 0 }} Itm /
                            {{ totalRekap?.masukBerat?.toFixed(3) || '0.000' }}g
                        </span>
                    </div>

                    <div class="text-center">
                        <small class="block text-xs text-slate-500 uppercase tracking-wider mb-1">KELUAR</small>
                        <span
                            class="inline-flex items-center rounded-full bg-rose-100 dark:bg-rose-950/40 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:text-rose-400">
                            {{ totalRekap?.keluarUnit || 0 }} Itm /
                            {{ totalRekap?.keluarBerat?.toFixed(3) || '0.000' }}g
                        </span>
                    </div>

                    <div class="text-center">
                        <small class="block text-xs text-slate-500 uppercase tracking-wider mb-1">PINDAH</small>
                        <span
                            class="inline-flex items-center rounded-full bg-sky-100 dark:bg-sky-950/40 px-2.5 py-0.5 text-xs font-semibold text-sky-800 dark:text-sky-400">
                            {{ totalPindah }} Item
                        </span>
                    </div>

                    <div class="text-center pl-4 border-l border-slate-300 dark:border-slate-800">
                        <small
                            class="block text-xs text-slate-700 dark:text-slate-300 font-medium uppercase tracking-wider mb-1">Total
                            Pergerakan</small>
                        <span class="font-bold text-slate-900 dark:text-white text-sm">{{ filteredNampanProduk.length }}
                            Log</span>
                    </div>
                </div>
            </div>

            <!-- Status Periode -->
            <div
                class="w-full md:w-1/4 text-center md:text-right pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
                <small class="block text-xs text-slate-500 uppercase tracking-wider mb-1">Status Periode</small>
                <template v-if="selectedPeriodeStokData && selectedPeriodeStokData.id">
                    <span :class="[
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        selectedPeriodeStokData.status == 1 ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400' : 'bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-400'
                    ]">
                        {{ selectedPeriodeStokData.status == 1 ? 'AKTIF' : 'FINAL' }}
                    </span>
                </template>
                <span v-else class="font-bold text-slate-700 dark:text-slate-300">-</span>
            </div>
        </div>
    </div>

    <!-- Table 1: Rekap Stok Per Jenis -->
    <div
        class="mb-6 rounded-2xl bg-white dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div class="bg-slate-50 dark:bg-slate-950 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">REKAP STOK PER
                JENIS
            </h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-center text-xs text-slate-600 dark:text-slate-300 border-collapse">
                <thead
                    class="bg-slate-50 dark:bg-slate-950 font-semibold text-slate-700 dark:text-slate-200 uppercase border-b border-slate-200 dark:border-slate-800">
                    <tr>
                        <th rowspan="2" class="px-4 py-2 border-r border-slate-200 dark:border-slate-800 align-middle">
                            Jenis
                        </th>
                        <th colspan="2" class="py-2 border-r border-slate-200 dark:border-slate-800">Awal</th>
                        <th colspan="2"
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
                            Masuk</th>
                        <th colspan="2"
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400">
                            Keluar</th>
                        <th colspan="2"
                            class="py-2 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300">
                            Akhir
                        </th>
                    </tr>
                    <tr class="border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <th class="w-[8%] py-1.5 border-r border-slate-200 dark:border-slate-800">Pt</th>
                        <th class="w-[12%] py-1.5 border-r border-slate-200 dark:border-slate-800">Gr</th>
                        <th class="w-[8%] py-1.5 border-r border-slate-200 dark:border-slate-800">Pt</th>
                        <th class="w-[12%] py-1.5 border-r border-slate-200 dark:border-slate-800">Gr</th>
                        <th class="w-[8%] py-1.5 border-r border-slate-200 dark:border-slate-800">Pt</th>
                        <th class="w-[12%] py-1.5 border-r border-slate-200 dark:border-slate-800">Gr</th>
                        <th
                            class="w-[8%] py-1.5 border-r border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/20">
                            Pt</th>
                        <th class="w-[12%] py-1.5 bg-indigo-50/50 dark:bg-indigo-950/20">Gr</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40">
                    <tr v-if="isLoadingNampanProduk">
                        <td colspan="9" class="py-6 text-center text-slate-400 dark:text-slate-500">
                            <div class="inline-flex items-center justify-center gap-2">
                                <RotateCw class="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                                <span class="text-xs font-medium">Memuat data...</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-else-if="rekapDataNormalized.length === 0">
                        <td colspan="9" class="py-6 text-center text-slate-400 dark:text-slate-500 italic">
                            <div class="inline-flex items-center gap-1.5">
                                <Info class="w-4 h-4" />
                                <span>Tidak ada data tersedia.</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-else v-for="rekap in rekapDataNormalized" :key="rekap.kategori"
                        class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td
                            class="px-4 py-2 font-bold bg-slate-50 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                            {{ rekap.kategori }}</td>
                        <td class="py-2 border-r border-slate-200 dark:border-slate-800">{{ rekap.stok_awal?.unit || 0
                            }}
                        </td>
                        <td class="py-2 border-r border-slate-200 dark:border-slate-800">{{
                            rekap.stok_awal?.berat?.toFixed(2) || '0.00' }}</td>
                        <td
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-medium">
                            {{ rekap.masuk?.unit || 0 }}</td>
                        <td
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-medium">
                            {{ rekap.masuk?.berat?.toFixed(2) || '0.00' }}</td>
                        <td
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 font-medium">
                            {{ rekap.keluar?.unit || 0 }}</td>
                        <td
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 font-medium">
                            {{ rekap.keluar?.berat?.toFixed(2) || '0.00' }}</td>
                        <td
                            class="py-2 border-r border-slate-200 dark:border-slate-800 font-bold bg-indigo-50/30 dark:bg-indigo-950/10 text-slate-900 dark:text-white">
                            {{ rekap.stok_akhir?.unit || 0 }}</td>
                        <td class="py-2 font-bold bg-indigo-50/30 dark:bg-indigo-950/10 text-slate-900 dark:text-white">
                            {{ rekap.stok_akhir?.berat?.toFixed(2) || '0.00' }}</td>
                    </tr>
                </tbody>
                <tfoot v-if="!isLoadingNampanProduk && rekapDataNormalized.length > 0"
                    class="bg-slate-50 dark:bg-slate-950 font-bold text-slate-800 dark:text-slate-200 border-t-2 border-slate-200 dark:border-slate-800">
                    <tr>
                        <td class="px-4 py-2 text-right border-r border-slate-200 dark:border-slate-800">TOTAL</td>
                        <td class="py-2 border-r border-slate-200 dark:border-slate-800">{{ totalRekap.awalUnit }}</td>
                        <td class="py-2 border-r border-slate-200 dark:border-slate-800">{{
                            totalRekap.awalBerat.toFixed(2)
                            }}</td>
                        <td
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
                            {{ totalRekap.masukUnit }}</td>
                        <td
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
                            {{ totalRekap.masukBerat.toFixed(2) }}</td>
                        <td
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400">
                            {{ totalRekap.keluarUnit }}</td>
                        <td
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400">
                            {{ totalRekap.keluarBerat.toFixed(2) }}</td>
                        <td
                            class="py-2 border-r border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
                            {{ totalRekap.akhirUnit }}</td>
                        <td class="py-2 text-indigo-600 dark:text-indigo-400">{{ totalRekap.akhirBerat.toFixed(2) }}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>

    <!-- Table 2: Daftar Produk -->
    <div
        class="rounded-2xl bg-white dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div
            class="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">DAFTAR PRODUK</h3>

            <div class="flex items-center">
                <div class="relative w-60">
                    <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text"
                        class="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                        placeholder="Cari Produk..." v-model="searchNampanProduk" />
                </div>
            </div>
        </div>

        <div class="p-4">
            <div class="overflow-x-auto">
                <table
                    class="w-full text-left text-xs whitespace-nowrap divide-y divide-slate-100 dark:divide-slate-800">
                    <thead
                        class="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                        <tr>
                            <th scope="col" class="px-4 py-3">NO.</th>
                            <th scope="col" class="px-4 py-3">PRODUK</th>
                            <th scope="col" class="px-4 py-3">JENIS</th>
                            <th scope="col" class="px-4 py-3">TANGGAL</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40 bg-white dark:bg-slate-900">
                        <tr v-if="isLoadingNampanProduk">
                            <td colspan="4" class="px-4 py-6 text-center text-slate-400 dark:text-slate-500">
                                <div class="inline-flex items-center justify-center gap-2">
                                    <RotateCw class="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                                    <span class="text-xs font-medium">Memuat data...</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="!isLoadingNampanProduk && paginatedNampanProduk.length === 0">
                            <td colspan="4" class="px-4 py-6 text-center text-slate-400 dark:text-slate-500 italic">
                                Tidak ada data.</td>
                        </tr>
                        <tr v-else v-for="(item, index) in paginatedNampanProduk" :key="item.id"
                            class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                            <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                {{ (currentPageNampanProduk - 1) * itemsPerPageNampanProduk + index + 1 }}
                            </td>
                            <td class="px-4 py-3 text-slate-700 dark:text-slate-300">
                                <span class="font-medium">{{ item.produk?.kodeproduk }}</span>
                            </td>
                            <td class="px-4 py-3">
                                <span v-if="item.jenis == 'MASUK'"
                                    class="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    MASUK
                                </span>
                                <span v-else-if="item.jenis == 'KELUAR'"
                                    class="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                    KELUAR
                                </span>
                                <span v-else
                                    class="inline-flex items-center rounded-full bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-sky-600 dark:text-sky-400 border border-sky-500/20">
                                    PINDAH
                                </span>
                            </td>
                            <td class="px-4 py-3 text-slate-600 dark:text-slate-400">
                                {{ item.tanggal }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Footer -->
            <div v-if="!isLoadingNampanProduk && filteredNampanProduk.length > 0"
                class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                <div class="text-xs text-slate-400">
                    Showing {{ (currentPageNampanProduk - 1) * itemsPerPageNampanProduk + 1 }} to
                    {{ Math.min(currentPageNampanProduk * itemsPerPageNampanProduk, filteredNampanProduk.length) }} of
                    {{ filteredNampanProduk.length }} entries
                </div>

                <nav class="inline-flex rounded-xl shadow-xs -space-x-px text-xs" aria-label="Pagination">
                    <button
                        class="relative inline-flex items-center px-2 py-1.5 rounded-l-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        :disabled="currentPageNampanProduk === 1" @click="currentPageNampanProduk = 1">
                        <ChevronsLeft class="w-4 h-4" />
                    </button>
                    <button
                        class="relative inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        :disabled="currentPageNampanProduk === 1"
                        @click="currentPageNampanProduk > 1 ? currentPageNampanProduk-- : null">
                        Previous
                    </button>

                    <button v-for="page in displayedPagesNampanProduk" :key="page"
                        class="relative inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-800 font-medium transition-all"
                        :class="[
                            page === currentPageNampanProduk
                                ? 'z-10 bg-indigo-600 border-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        ]" @click="currentPageNampanProduk = page">
                        {{ page }}
                    </button>

                    <button
                        class="relative inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        :disabled="currentPageNampanProduk === totalPagesNampanProduk"
                        @click="currentPageNampanProduk < totalPagesNampanProduk && currentPageNampanProduk++">
                        Next
                    </button>
                    <button
                        class="relative inline-flex items-center px-2 py-1.5 rounded-r-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        :disabled="currentPageNampanProduk === totalPagesNampanProduk"
                        @click="currentPageNampanProduk = totalPagesNampanProduk">
                        <ChevronsRight class="w-4 h-4" />
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import {
    Search,
    RotateCw,
    Info,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-vue-next';
import { useInventory } from '../composables/useInventory';

const {
    isLoadingNampanProduk,
    currentPageNampanProduk,
    itemsPerPageNampanProduk,
    filteredNampanProduk,
    paginatedNampanProduk,
    displayedPagesNampanProduk,
    totalPagesNampanProduk,
    selectedPeriodeStokData,
    searchNampanProduk,
    rekapstok
} = useInventory();

const rekapDataNormalized = computed(() => {
    const raw = rekapstok.value;
    if (!raw) return [];

    if (raw.rekap && Array.isArray(raw.rekap)) {
        return raw.rekap;
    }

    return Array.isArray(raw) ? raw : [];
});

const totalRekap = computed(() => {
    const data = rekapDataNormalized.value;

    const initialValue = {
        awalUnit: 0,
        awalBerat: 0,
        masukUnit: 0,
        masukBerat: 0,
        keluarUnit: 0,
        keluarBerat: 0,
        akhirUnit: 0,
        akhirBerat: 0
    };

    if (data.length === 0) return initialValue;

    return data.reduce((acc, curr) => {
        acc.awalUnit += Number(curr.stok_awal?.unit || 0);
        acc.awalBerat += Number(curr.stok_awal?.berat || 0);

        acc.masukUnit += Number(curr.masuk?.unit || 0);
        acc.masukBerat += Number(curr.masuk?.berat || 0);

        acc.keluarUnit += Number(curr.keluar?.unit || 0);
        acc.keluarBerat += Number(curr.keluar?.berat || 0);

        acc.akhirUnit += Number(curr.stok_akhir?.unit || 0);
        acc.akhirBerat += Number(curr.stok_akhir?.berat || 0);

        return acc;
    }, initialValue);
});

const totalPindah = computed(() => {
    if (!filteredNampanProduk.value) return 0;
    return filteredNampanProduk.value.filter(item => item.jenis === 'PINDAH').length;
});
</script>
