<template>
    <div
        class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 class="font-bold text-slate-900 dark:text-white text-base">Harga Emas Hari Ini</h2>
            <button
                class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition">View
                All</button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr
                        class="bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                        <th class="py-3 px-6">Karat</th>
                        <th class="py-3 px-6">Jenis Emas</th>
                        <th class="py-3 px-6">Harga</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    <tr v-if="isLoading">
                        <td colspan="3" class="py-10 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <RotateCw class="w-4 h-4 text-blue-950 dark:text-indigo-400 animate-spin" />
                                <span class="text-xs font-medium text-slate-400 dark:text-slate-500">Memuat
                                    data...</span>
                            </div>
                        </td>
                    </tr>

                    <tr v-else v-for="(item, index) in HargaEmas" :key="item.id"
                        class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td class="py-4 px-6 font-medium text-slate-900 dark:text-slate-200">{{ item.karat?.karat }} K
                        </td>
                        <td class="py-4 px-6 font-medium text-slate-900 dark:text-slate-200">{{ item.jeniskarat?.jenis
                            }}</td>
                        <td class="py-4 px-6 font-medium text-slate-900 dark:text-slate-200">{{ toRupiah(item.harga) }}
                        </td>
                    </tr>

                    <tr v-if="!isLoading && HargaEmas.length === 0">
                        <td colspan="3" class="py-10 text-center text-slate-400 dark:text-slate-500 text-xs">
                            No data available.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
import { RotateCw } from 'lucide-vue-next';
import { onMounted, onUnmounted } from 'vue';
import { useHome } from '../composable/useHome';
import { toRupiah } from '../../../utilities/format/toRupiah.js'

import SkeletonCard from './SkeletonCard.vue';

let interval = null;

const {
    isLoading,
    HargaEmas,
    fetchHargaEmas
} = useHome();

const loadDashboard = async () => {
    await Promise.all([
        fetchHargaEmas(),
    ]);
}

onMounted(() => {
    loadDashboard();
    interval = setInterval(() => {
        loadDashboard();
    }, 60000); // Reload every minute
});

onUnmounted(() => {
    if (interval) {
        clearInterval(interval);
    }
});

</script>
