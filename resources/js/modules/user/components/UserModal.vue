<template>
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">

        <Transition appear enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-show="isModalOpen" @click="handleClose"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-all"></div>
        </Transition>

        <div class="flex min-h-full items-center justify-center p-4 text-center">

            <Transition appear enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

                <div v-show="isModalOpen"
                    class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 overflow-visible text-left transition-all">

                    <div
                        class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between relative">
                        <h2 class="font-bold text-slate-900 dark:text-white text-base">
                            {{ isEdit ? 'EDIT ACCOUNT USER' : 'TAMBAH USER' }}
                        </h2>

                        <button @click="handleClose" type="button" title="Close Modal"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <form @submit.prevent="submitUser" class="p-6 space-y-4 font-sans">
                        <div class="space-y-1.5">
                            <label for="nama_pegawai"
                                class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">
                                Nama Pegawai
                            </label>
                            <input v-model="formUser.pegawai" type="text" id="nama_pegawai" readonly
                                class="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed focus:outline-none transition" />
                            <span v-if="errors.pegawai_id" class="text-xs text-rose-500 font-medium block mt-1">
                                {{ errors.pegawai_id }}
                            </span>
                        </div>

                        <div class="space-y-1.5">
                            <label for="email"
                                class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">
                                Email
                            </label>
                            <input v-model="formUser.email" type="email" id="email" placeholder="email@email.com"
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 text-slate-900 dark:text-white transition" />
                            <span v-if="errors.email" class="text-xs text-rose-500 font-medium block mt-1">
                                {{ errors.email }}
                            </span>
                        </div>

                        <div class="space-y-1.5">
                            <label for="password"
                                class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">
                                Password
                            </label>
                            <input v-model="formUser.password" type="password" id="password"
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 text-slate-900 dark:text-white transition" />
                            <span v-if="errors.password" class="text-xs text-rose-500 font-medium block mt-1">
                                {{ errors.password }}
                            </span>
                        </div>

                        <div class="space-y-1.5 relative">
                            <label
                                class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Role</label>

                            <div class="relative">
                                <button type="button" @click="isRoleDropdownOpen = !isRoleDropdownOpen"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                    <span :class="{ 'text-slate-400': !formUser.role_id }">
                                        {{ labelRoleTerpilih }}
                                    </span>
                                    <ChevronDown
                                        class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': isRoleDropdownOpen }" />
                                </button>
                            </div>

                            <div v-if="isRoleDropdownOpen"
                                class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                <div class="relative shrink-0">
                                    <Search
                                        class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                    <input v-model="searchRoleQuery" type="text" placeholder="Cari Role..."
                                        class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                </div>

                                <ul
                                    class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                    <li v-for="role in filteredDaftarRole" :key="role.id" @click="pilihRole(role)"
                                        class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                        :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': formUser.role_id === role.id }">
                                        <span>{{ role.role.toUpperCase() }}</span>
                                        <Check v-if="formUser.role_id === role.id"
                                            class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                    </li>

                                    <li v-if="filteredDaftarRole.length === 0"
                                        class="px-3 py-4 text-center text-slate-400 dark:text-slate-500 italic">
                                        Role tidak ditemukan.
                                    </li>
                                </ul>
                            </div>

                            <span v-if="errors.role_id" class="text-xs text-rose-500 font-medium block mt-1">
                                {{ errors.role_id }}
                            </span>
                        </div>

                        <div
                            class="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <button type="button" @click="handleClose"
                                class="px-5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-rose-900/50 rounded-xl transition active:scale-95 focus:outline-none">
                                Cancel / Close
                            </button>

                            <button type="submit" :disabled="isLoading"
                                class="bg-blue-950 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-semibold text-sm transition shadow-xs active:scale-95 focus:outline-none">
                                {{ isLoading ? 'Saving...' : 'Save Changes' }}
                            </button>
                        </div>
                    </form>

                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { X, ChevronDown, Search, Check } from 'lucide-vue-next'; // Pastikan icon yang dipakai di-import semua
import { useUser } from '../composables/useUser';
import { roleService } from '../../role/services/roleService';

const { isModalOpen, isEdit, formUser, errors, isLoading, submitUser, closeModal } = useUser();

const daftarRole = ref([]);
const isRoleDropdownOpen = ref(false);
const searchRoleQuery = ref('');

const labelRoleTerpilih = computed(() => {
    if (!formUser.role_id || daftarRole.value.length === 0) return '-- Pilih Role --';
    const ditemukan = daftarRole.value.find(j => j.id === formUser.role_id);
    return ditemukan ? ditemukan.role.toUpperCase() : '-- Pilih Role --';
});

const filteredDaftarRole = computed(() => {
    const q = searchRoleQuery.value.toLowerCase().trim();
    if (!q) return daftarRole.value;
    return daftarRole.value.filter(j => (j.role || '').toLowerCase().includes(q));
});

const pilihRole = (role) => {
    formUser.role_id = role.id;
    isRoleDropdownOpen.value = false;
    searchRoleQuery.value = '';
};

onMounted(async () => {
    try {
        const res = await roleService.getRole();
        daftarRole.value = res.data || res;
    } catch (err) {
        console.error('Gagal memuat list role:', err);
    }
});

const handleClose = () => {
    isRoleDropdownOpen.value = false;
    searchRoleQuery.value = '';
    closeModal();
};
</script>
