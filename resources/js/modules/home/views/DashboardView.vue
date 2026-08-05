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

        <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 class="font-bold text-slate-900 text-base">Recent Transactions</h2>
                <button class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">View All</button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="bg-slate-50 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                            <th class="py-3 px-6">Customer</th>
                            <th class="py-3 px-6">Status</th>
                            <th class="py-3 px-6">Date</th>
                            <th class="py-3 px-6 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        <tr class="hover:bg-slate-50/50 transition">
                            <td class="py-4 px-6 font-medium text-slate-900">Alex Rivera</td>
                            <td class="py-4 px-6">
                                <span
                                    class="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg">Success</span>
                            </td>
                            <td class="py-4 px-6 text-slate-500">Jul 8, 2026</td>
                            <td class="py-4 px-6 text-right font-semibold text-slate-900">$250.00</td>
                        </tr>
                        <tr class="hover:bg-slate-50/50 transition">
                            <td class="py-4 px-6 font-medium text-slate-900">Marcus Vance</td>
                            <td class="py-4 px-6">
                                <span
                                    class="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg">Pending</span>
                            </td>
                            <td class="py-4 px-6 text-slate-500">Jul 7, 2026</td>
                            <td class="py-4 px-6 text-right font-semibold text-slate-900">$89.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </main>
</template>

<script setup>
import { ref, watch } from 'vue';
import { DollarSign, Users, ShoppingBag, Activity, Package2, ShoppingCart, Wallet } from 'lucide-vue-next';
import { useAuthentication } from '../../authentication/composables/useAuthentication';

import DashboardCard from '../components/DashboardCard.vue';

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
