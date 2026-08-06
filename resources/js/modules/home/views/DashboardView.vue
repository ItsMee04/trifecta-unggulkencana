<template>
    <main class="p-8 space-y-6 font-sans">

        <div class="flex items-center gap-4">
            <div class="shrink-0">
                <img v-if="user?.avatar && !imageError" :src="getAvatarUrl(user.avatar)" :alt="user?.nama"
                    @error="imageError = true"
                    class="w-12 h-12 rounded-full object-cover shadow-xs border border-slate-100 dark:border-slate-800" />

                <div v-else
                    class="w-12 h-12 rounded-full bg-blue-950 text-white font-extrabold text-sm flex items-center justify-center shadow-xs uppercase tracking-wider">
                    {{ avatarFallback }}
                </div>
            </div>

            <div>
                <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                <p class="text-sm text-slate-500 mt-0.5">
                    Welcome back, <span class="font-semibold text-slate-800">{{ user?.nama || 'Guest' }}</span>. Here's
                    what's happening.
                </p>
            </div>
        </div>

        <DashboardCard />
        <DashboardTransaksiCard />

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div class="xl:col-span-2">
                <DashboardTransaksiChart />
            </div>

            <div>
                <DashboardTransaksiTerlaris />
            </div>

        </div>

        <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">

            <!-- Tabel 1 -->
             <DashboardTransaksiSatuMinggu />

            <!-- Tabel 2 -->
            <div class="lg:col-span-1 bg-white rounded-2xl shadow p-4">
                ...
            </div>

            <!-- Tabel 3 -->
            <div class="lg:col-span-1 bg-white rounded-2xl shadow p-4">
                ...
            </div>

        </div>



    </main>
</template>

<script setup>
import { ref, watch } from 'vue';
import { DollarSign, Users, ShoppingBag, Activity, Package2, ShoppingCart, Wallet } from 'lucide-vue-next';
import { useAuthentication } from '../../authentication/composables/useAuthentication';

import DashboardCard from '../components/DashboardCard.vue';
import DashboardTransaksiCard from '../components/DashboardTransaksiCard.vue';
import DashboardTransaksiChart from '../components/DashboardTransaksiChart.vue';
import DashboardTransaksiTerlaris from '../components/DashboardTransaksiTerlaris.vue';
import DashboardTransaksiSatuMinggu from '../components/DashboardTransaksiSatuMinggu.vue';

// Destructure data auth yang diperlukan
const { user, avatarFallback } = useAuthentication();

// State internal untuk menangani jika gambar error/tidak ditemukan di server
const imageError = ref(false);

// Helper URL Asset Gambar Laravel
const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '';
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/storage/pegawai/image/${avatarPath}`;
};

// Reset state error jika sewaktu-waktu data avatar di database berubah secara dinamis
watch(() => user.value?.avatar, () => {
    imageError.value = false;
});
</script>
