<template>
    <div
        class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden relative">

        <div
            class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="font-bold text-slate-900 dark:text-white text-base">Daftar User Account Pegawai</h2>

            <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button @click="handleRefresh" :disabled="isLoading" title="Refresh Data"
                    class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl transition active:scale-95 disabled:opacity-50">
                    <RotateCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
                </button>

                <div class="relative flex-1 sm:flex-none sm:w-64">
                    <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input v-model="searchQuery" type="text" placeholder="Search..."
                        class="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                </div>
            </div>
        </div>

        <div class="w-full overflow-x-auto relative">

            <div v-if="isLoading && paginatedUser.length > 0"
                class="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[0.5px] z-10 flex items-center justify-center transition-all duration-200">
                <div
                    class="flex items-center gap-2 bg-white dark:bg-slate-950 px-3.5 py-2 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800">
                    <RotateCw class="w-4 h-4 text-blue-950 dark:text-white animate-spin" />
                    <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Loading...</span>
                </div>
            </div>

            <table class="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr
                        class="bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                        <th class="py-3 px-4 w-[10%] text-center">No.</th>
                        <th class="py-3 px-4 w-[35%]">Pegawai</th>
                        <th class="py-3 px-4 w-[25%]">Email</th>
                        <th class="py-3 px-4 w-[25%]">Role</th>
                        <th class="py-3 px-4 w-[15%] text-center">Status</th>
                        <th class="py-3 px-4 w-[20%] text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">

                    <tr v-if="isLoading && paginatedUser.length === 0">
                        <td colspan="6" class="py-10 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <RotateCw class="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                                <span class="text-xs font-medium text-slate-400 dark:text-slate-500">Memuat
                                    data...</span>
                            </div>
                        </td>
                    </tr>

                    <tr v-else v-for="(item, index) in paginatedUser" :key="item.id"
                        class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td class="py-3 px-4 text-center font-medium text-slate-400">
                            {{ (currentPage - 1) * 5 + index + 1 }}
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase">
                            <div class="flex items-center gap-3">
                                <div class="relative w-9 h-9 flex-shrink-0">
                                    <img v-if="item.pegawai?.image"
                                        :src="`${getAvatarUrl(item.pegawai.image)}?t=${new Date().getTime()}`"
                                        alt="Avatar"
                                        class="w-full h-full object-cover rounded-full ring-2 ring-slate-100 dark:ring-slate-850"
                                        @error="(e) => e.target.src = '/images/default-avatar.png'" />

                                    <div v-else
                                        class="w-full h-full rounded-full bg-blue-950 text-white flex items-center justify-center text-xs font-bold uppercase tracking-wider">
                                        {{ item.pegawai?.nama?.charAt(0) || 'U' }}
                                    </div>
                                </div>
                                <div class="flex flex-col min-w-0">
                                    <span class="truncate font-semibold text-slate-800 dark:text-slate-200">{{
                                        item.pegawai.nama
                                    }}</span>
                                    <span class="text-xs text-slate-400 normal-case tracking-wide font-normal">{{
                                        item.pegawai.nip
                                    }}</span>
                                </div>
                            </div>
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200">
                            <span v-if="item.email"
                                class="text-slate-700 dark:text-slate-300 normal-case font-normal tracking-wide">
                                {{ item.email }}
                            </span>

                            <span v-else
                                class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg whitespace-nowrap">
                                EMAIL BELUM DI ATUR
                            </span>
                        </td>

                        <td class="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 uppercase">
                            <span v-if="item.role?.role"
                                class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg">
                                {{ item.role?.role }}
                            </span>

                            <span v-else
                                class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg whitespace-nowrap">
                                ROLE BELUM DI ATUR
                            </span>
                        </td>

                        <td class="py-3 px-4 text-center">
                            <span v-if="item.status === 1 || item.status === 'ACTIVE'"
                                class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                                ACTIVE
                            </span>
                            <span v-else
                                class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                INACTIVE
                            </span>
                        </td>

                        <td class="py-3 px-4">
                            <div class="flex items-center justify-center gap-1">
                                <button @click="handleEdit(item)" title="Edit"
                                    class="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition active:scale-95">
                                    <SquarePen class="w-4 h-4" />
                                </button>
                                <!-- <button @click="handleDelete(item)" title="Delete"
                                    class="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition active:scale-95">
                                    <Trash2 class="w-4 h-4" />
                                </button> -->
                            </div>
                        </td>
                    </tr>

                    <tr v-if="!isLoading && paginatedUser.length === 0">
                        <td colspan="4" class="py-10 text-center text-slate-400 dark:text-slate-500 text-xs">
                            No data available.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between text-xs text-slate-400">
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <div class="flex items-center gap-1">
                <button @click="currentPage--" :disabled="currentPage === 1"
                    class="p-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40">
                    <ChevronLeft class="w-4 h-4" />
                </button>
                <button @click="currentPage++" :disabled="currentPage === totalPages"
                    class="p-1 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 disabled:opacity-40">
                    <ChevronRight class="w-4 h-4" />
                </button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { Search, ChevronLeft, ChevronRight, SquarePen, Trash2, RotateCw } from 'lucide-vue-next';
import { useUser } from '../composables/useUser';

const {
    paginatedUser,
    searchQuery,
    currentPage,
    totalPages,
    isLoading,
    fetchUser,
    handleEdit,
    handleDelete
} = useUser();

const handleRefresh = async () => {
    await fetchUser();
};

// 🌟 Helper URL Asset Gambar dari Backend Laravel (Sama dengan Header & Sidebar)
const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '';
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/storage/pegawai/image/${avatarPath}`;
};
</script>
