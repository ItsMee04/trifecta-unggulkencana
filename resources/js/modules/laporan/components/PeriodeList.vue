<template>
    <!-- Card Utama: Filter Laporan Stok Harian -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden relative mb-3">
        <!-- Header -->
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <FileText class="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h2 class="font-bold text-slate-900 dark:text-white text-base">Filter Laporan Stok Harian</h2>
        </div>

        <!-- Form Body -->
        <div class="p-4">
            <form @submit.prevent>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Dari Tanggal -->
                    <div class="space-y-1.5">
                        <label for="tanggaldari" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                            Dari Tanggal
                        </label>
                        <input
                            type="date"
                            id="tanggaldari"
                            v-model="formLaporan.tanggaldari"
                            @click="$event.target.showPicker()"
                            class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 text-slate-900 dark:text-white transition dark:[color-scheme:dark] cursor-pointer"
                        />
                    </div>

                    <!-- Sampai Tanggal -->
                    <div class="space-y-1.5">
                        <label for="tanggalsampai" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                            Sampai Tanggal
                        </label>
                        <input
                            type="date"
                            id="tanggalsampai"
                            v-model="formLaporan.tanggalsampai"
                            @click="$event.target.showPicker()"
                            class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 text-slate-900 dark:text-white transition dark:[color-scheme:dark] cursor-pointer"
                        />
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { FileText } from 'lucide-vue-next';
import { useLaporan } from '../composables/useLaporan';

const {
    formLaporan,
} = useLaporan();
</script>
