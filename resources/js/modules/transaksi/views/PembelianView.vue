<template>
    <main class="p-4 sm:p-6 lg:p-8 space-y-6 font-sans">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Halaman Transaksi Pembelian
                </h1>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Kelola Transaksi Pembelian Anda.
                </p>
            </div>
        </div>

        <PembelianTable />
        <PembelianModal />

    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import PembelianTable from '../components/PembelianTable.vue';
import PembelianModal from '../components/PembelianModal.vue';
import { usePembelian } from '../composables/usePembelian.js';

const { fetchPembelian } = usePembelian();

onMounted(async () => {
    await fetchPembelian();
});
</script>
