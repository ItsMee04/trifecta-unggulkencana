<template>
    <main class="p-4 sm:p-6 lg:p-8 space-y-6 font-sans">

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Halaman Nampan
                </h1>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Kelola Nampan / Baki operasional Anda.
                </p>
            </div>

            <button @click="handleCreate"
                class="inline-flex items-center justify-center gap-1.5 bg-blue-950 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition shadow-xs active:scale-98 w-full sm:w-auto">
                <Plus class="w-4 h-4" />
                Tambah Nampan / Baki
            </button>
        </div>

        <NampanTable />
        <NampanModal />

    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import NampanTable from '../components/NampanTable.vue';
import NampanModal from '../components/NampanModal.vue';
import { useNampan } from '../composables/useNampan.js';

const { handleCreate, fetchNampan } = useNampan();

// Ambil data pertama kali saat halaman diakses
onMounted(async () => {
    await fetchNampan();
});
</script>
