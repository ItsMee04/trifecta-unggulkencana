<template>
    <main class="p-4 sm:p-6 lg:p-8 space-y-6 font-sans">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Halaman Nampan Produk
                </h1>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Kelola Produk pada Nampan / Baki operasional Anda.
                </p>
            </div>

            <button v-if="selectedNampanId" type="button" @click="handleCreate"
                class="inline-flex items-center justify-center gap-1.5 bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 rounded-xl font-semibold text-sm transition shadow-xs active:scale-98 w-full sm:w-auto">
                <Plus class="w-4 h-4" />
                Tambah Produk ke Nampan
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-4">
                <NampanList />
            </div>

            <div class="lg:col-span-8">
                <NampanProdukTable />
            </div>
        </div>

        <NampanProdukModal />
        <NampanProdukPindah />

    </main>
</template>

<script setup>
import { Plus } from 'lucide-vue-next';
import NampanList from '../components/NampanList.vue';
import NampanProdukTable from '../components/NampanProdukTable.vue';
import NampanProdukModal from '../components/NampanProdukModal.vue';
import NampanProdukPindah from '../components/NampanProdukPindah.vue';
import { useNampanProduk } from '../composables/useNampanProduk';

// PERBAIKAN: Ambil juga fungsi handleCreate dari composable
const { selectedNampanId, handleCreate } = useNampanProduk();
</script>
