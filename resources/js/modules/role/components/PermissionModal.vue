<template>
    <div v-if="isPermissionModalOpen" class="fixed inset-0 z-50 overflow-y-auto">

        <Transition appear enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-show="isPermissionModalOpen" @click="closePermissionModal"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-all"></div>
        </Transition>

        <div class="flex min-h-full items-center justify-center p-4 text-center">

            <Transition appear enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

                <div v-show="isPermissionModalOpen"
                    class="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 overflow-hidden text-left transition-all">

                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h2 class="font-bold text-slate-900 dark:text-white text-base uppercase tracking-wide">
                            HAK AKSES ROLE: <span class="text-indigo-600 dark:text-indigo-400">{{ formRole.role ?
                                formRole.role.toUpperCase() : '' }}</span>
                        </h2>
                        <button @click="closePermissionModal" type="button"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <form @submit.prevent="handleSubmit" class="p-6 font-sans">

                        <div v-if="loadingPermission" class="text-center py-12">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Memuat hak akses...</p>
                        </div>

                        <div v-else
                            class="overflow-x-auto max-h-[450px] border border-slate-100 dark:border-slate-800 rounded-xl">
                            <table class="w-full text-xs text-left border-collapse">
                                <thead
                                    class="text-[11px] text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 font-bold tracking-wider">
                                    <tr>
                                        <th class="px-5 py-3 w-[40%]">Nama Menu</th>
                                        <th class="px-4 py-3 text-center">Lihat (Read)</th>
                                        <th class="px-4 py-3 text-center">Tambah (Create)</th>
                                        <th class="px-4 py-3 text-center">Ubah (Update)</th>
                                        <th class="px-4 py-3 text-center">Hapus (Delete)</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                    <template v-for="(group, gKey) in structuredMenus" :key="gKey">
                                        <tr class="bg-slate-50/70 dark:bg-slate-800/40 font-semibold">
                                            <td colspan="5"
                                                class="px-4 py-2 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">
                                                📁 {{ group.header }}
                                            </td>
                                        </tr>

                                        <tr v-for="menu in group.flatMenus" :key="menu.key"
                                            class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td class="px-5 py-2.5 text-slate-700 dark:text-slate-300 font-medium"
                                                :class="{ 'pl-9 text-slate-500 dark:text-slate-400': menu.isSub }">
                                                {{ menu.isSub ? '└ ' : '' }}{{ menu.label }}
                                            </td>

                                            <td v-for="col in ['read', 'create', 'update', 'delete']" :key="col"
                                                class="text-center px-4 py-2.5">
                                                <input type="checkbox" :checked="checkActive(menu.key, col)"
                                                    @change="handleLocalToggle(menu.key, col, $event.target.checked)"
                                                    class="w-4 h-4 text-blue-950 border-slate-300 dark:border-slate-700 rounded focus:ring-blue-900 cursor-pointer transition" />
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>

                        <div
                            class="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <button type="button" @click="closePermissionPermission"
                                class="px-5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-rose-900/50 rounded-xl transition active:scale-95 focus:outline-none">
                                Cancel
                            </button>
                            <button type="submit" :disabled="loadingPermission"
                                class="bg-blue-950 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-semibold text-sm transition shadow-xs active:scale-95 focus:outline-none flex items-center gap-2">
                                <span v-if="loadingPermission"
                                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                {{ loadingPermission ? 'Saving...' : 'Save Changes' }}
                            </button>
                        </div>
                    </form>

                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { X } from 'lucide-vue-next'; // Mengimpor ikon X seperti komponen modal pegawai Anda
import { useRole } from '../composables/useRole';
import { usePermission } from '../composables/usePermission';

const { formRole, isPermissionModalOpen } = useRole();
const { permissions, loadingPermission, fetchPermissions, submitBulkPermissions } = usePermission();

const localPermissions = ref([]);

// 🌟 PERBAIKAN: Ubah 'role_id' menjadi 'id' agar sesuai dengan validasi GET API backend Anda
watch(isPermissionModalOpen, async (isOpen) => {
    if (isOpen && formRole.id) {
        // Ganti properti dari { role_id: formRole.id } menjadi { id: formRole.id }
        await fetchPermissions({ id: formRole.id });
        localPermissions.value = JSON.parse(JSON.stringify(permissions.value));
    }
});

const closePermissionModal = () => {
    isPermissionModalOpen.value = false;
};

// Pengarah fungsi Cancel ke aksi penutupan modal biasa
const closePermissionPermission = () => {
    closePermissionModal();
};

const checkActive = (menuKey, column) => {
    const perm = localPermissions.value.find(p => p.menu === menuKey);
    return perm ? perm[column] === 1 : false;
};

const handleLocalToggle = (menuKey, column, isChecked) => {
    const numericValue = isChecked ? 1 : 0;
    const item = localPermissions.value.find(p => p.menu === menuKey);

    if (item) {
        item[column] = numericValue;
    } else {
        localPermissions.value.push({
            role_id: formRole.id,
            menu: menuKey,
            read: 0, create: 0, update: 0, delete: 0,
            [column]: numericValue
        });
    }
};

const handleSubmit = async () => {
    if (!formRole.id) return;

    const payload = {
        role_id: formRole.id,
        permissions: localPermissions.value
    };

    const success = await submitBulkPermissions(payload);
    if (success) {
        closePermissionModal();
    }
};

const structuredMenus = computed(() => {
    const rawGroups = {
        main: { header: 'Main', items: [{ key: 'dashboard', label: 'Dashboard' }] },
        usermanagement: {
            header: 'User Management',
            items: [
                { key: 'jabatan', label: 'Jabatan', isSub: true },
                { key: 'pegawai', label: 'Pegawai', isSub: true },
                { key: 'role', label: 'Role', isSub: true },
                { key: 'users', label: 'User', isSub: true },
            ]
        },
        product: {
            header: 'Produk',
            items: [
                { key: 'kondisi', label: 'Kondisi', isSub: true },
                { key: 'karat', label: 'Karat', isSub: true },
                { key: 'jeniskarat', label: 'Jenis Karat', isSub: true },
                { key: 'harga', label: 'Harga', isSub: true },
                { key: 'diskon', label: 'Diskon', isSub: true },
                { key: 'jenisproduk', label: 'Jenis Produk', isSub: true },
                { key: 'produk', label: 'Produk', isSub: true },
            ]
        },
        nampan: {
            header: 'Nampan',
            items: [
                { key: 'nampan', label: 'Nampan', isSub: true },
                { key: 'nampanproduk', label: 'Nampan Produk', isSub: true },
            ]
        },
        pelanggan: {
            header: 'Pelanggan & Relasi',
            items: [
                { key: 'pelanggan', label: 'Pelanggan', isSub: true },
                { key: 'suplier', label: 'Suplier', isSub: true },
                { key: 'pesan', label: 'Pesan', isSub: true },
            ]
        },
        keuangan: {
            header: 'Keuangan',
            items: [
                { key: 'saldo', label: 'Saldo' },
                { key: 'mutasisaldo', label: 'Mutasi Saldo' },
            ]
        },
        transaksi: {
            header: 'Transaksi',
            items: [
                { key: 'transaksi', label: 'POS' },
                { key: 'offtake', label: 'Offtake' },
                { key: 'pembeliandaritoko', label: 'Pembelian Dari Toko', isSub: true },
                { key: 'pembeliandariluartoko', label: 'Pembelian Dari Luar Toko', isSub: true },
                { key: 'perbaikan', label: 'Perbaikan' },
            ]
        },
        sales: {
            header: 'Sales (Riwayat)',
            items: [
                { key: 'transaksipenjualan', label: 'Transaksi Penjualan' },
                { key: 'transaksipembelian', label: 'Transaksi Pembelian' },
                { key: 'transaksiofftake', label: 'Transaksi Offtake' },
            ]
        },
        laporan: {
            header: 'Laporan',
            items: [
                { key: 'inventory', label: 'Inventori' },
                { key: 'laporantransaksi', label: 'Laporan Transaksi' },
            ]
        }
    };

    return Object.values(rawGroups).map(group => ({
        header: group.header,
        flatMenus: group.items
    }));
});
</script>
