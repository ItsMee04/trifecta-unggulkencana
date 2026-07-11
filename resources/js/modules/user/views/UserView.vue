<template>
    <main class="p-8 space-y-6 font-sans">

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Halaman User Account</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Kelola account pegawai operasional Anda.</p>
            </div>
        </div>

        <UserTable />
        <UserModal />

    </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { Plus, User } from 'lucide-vue-next';
import UserTable from '../components/UserTable.vue';
import UserModal from '../components/UserModal.vue';
import { useUser } from '../composables/useUser.js';

const { fetchUser } = useUser();

// Ambil data pertama kali saat halaman diakses
onMounted(async () => {
    await fetchUser();
});
</script>
