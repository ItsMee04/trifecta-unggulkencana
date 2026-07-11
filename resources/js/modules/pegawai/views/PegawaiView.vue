<template>
    <main class="p-8 space-y-6 font-sans">

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Halaman Pegawai</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Kelola pegawai operasional Anda.</p>
            </div>

            <button @click="handleCreate"
                class="inline-flex items-center gap-1.5 bg-blue-950 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition shadow-xs active:scale-98">
                <Plus class="w-4 h-4" />
                Tambah Pegawai
            </button>
        </div>

        <PegawaiTable />
        <PegawaiModal />

    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { Plus } from 'lucide-vue-next';
import PegawaiTable from '../components/PegawaiTable.vue';
import PegawaiModal from '../components/PegawaiModal.vue';
import { usePegawai } from '../composables/usePegawai.js';

const { handleCreate, fetchPegawai } = usePegawai();

// Ambil data pertama kali saat halaman diakses
onMounted(async () => {
    await fetchPegawai();
});
</script>
