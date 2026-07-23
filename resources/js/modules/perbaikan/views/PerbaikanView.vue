<template>
    <main class="p-4 sm:p-6 lg:p-8 space-y-6 font-sans">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Halaman Produk Perbaikan
                </h1>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Kelola Transaksi Produk Perbaikan
                    Anda.
                </p>
            </div>
        </div>

        <PerbaikanTable />

    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import PerbaikanTable from '../components/PerbaikanTable.vue';
import { usePerbaikan } from '../composables/usePerbaikan.js';

const { handleCreate, fetchPerbaikan } = usePerbaikan();

onMounted(async () => {
    await fetchPerbaikan();
});
</script>
