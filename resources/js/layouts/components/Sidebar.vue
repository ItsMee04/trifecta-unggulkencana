<template>
    <div>
        <div v-if="isMobileOpen" @click="isMobileOpen = false"
            class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300">
        </div>

        <aside
            class="bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-900 flex flex-col fixed top-0 left-0 h-[100dvh] z-50 font-sans select-none transition-all duration-200"
            :class="[
                isMobileOpen ? 'translate-x-0 w-60' : '-translate-x-full lg:translate-x-0',
                isMiniSidebar ? 'lg:w-16' : 'lg:w-60'
            ]">

            <div
                class="h-14 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-900 shrink-0 overflow-hidden">
                <div class="flex items-center gap-2.5 min-w-0">

                    <div
                        class="bg-blue-950 p-1 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none shrink-0 w-8 h-8 flex items-center justify-center overflow-hidden">
                        <img :src="LogoStatis" alt="Trifecta Logo" class="w-full h-full object-contain" />
                    </div>
                    <span v-if="!isMiniSidebar || isMobileOpen"
                        class="font-bold text-sm tracking-tight text-slate-950 dark:text-white whitespace-nowrap truncate">
                        Trifecta Solutions
                    </span>
                </div>

                <button v-if="isMobileOpen" @click="isMobileOpen = false"
                    class="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition shrink-0 lg:hidden">
                    <X class="w-4 h-4" />
                </button>
            </div>

            <div
                class="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin overflow-x-hidden max-h-[calc(100dvh-140px)]">

                <!-- Ubah pemanggilan menuGroups lama menjadi objek computed allowedMenuGroups -->
                <div v-for="(group, groupKey) in allowedMenuGroups" :key="groupKey" class="space-y-1">

                    <span v-if="!isMiniSidebar || isMobileOpen"
                        class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                        {{ group.header }}
                    </span>

                    <div v-for="(menu, menuKey) in group.menus" :key="menuKey" class="space-y-1">

                        <router-link v-if="!menu.submenus" :to="menu.path"
                            class="group flex items-center gap-2.5 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-blue-950 dark:hover:text-white font-medium rounded-xl text-xs transition-all duration-150 relative"
                            exact-active-class="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm shadow-indigo-100/10"
                            :class="{ 'lg:justify-center lg:px-0': isMiniSidebar && !isMobileOpen }">

                            <div v-if="(!isMiniSidebar || isMobileOpen)"
                                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 dark:bg-indigo-500 rounded-r-full scale-0 transition-transform duration-150 group-[.router-link-exact-active]:scale-100">
                            </div>

                            <component :is="iconMap[menu.icon] || HelpCircle"
                                class="w-4 h-4 shrink-0 transition-colors duration-150" />
                            <span v-if="!isMiniSidebar || isMobileOpen" class="whitespace-nowrap">{{ menu.label
                                }}</span>
                        </router-link>

                        <div v-else>
                            <button @click="toggleSubmenu(menuKey)"
                                class="w-full flex items-center justify-between px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-blue-950 dark:hover:text-white font-medium rounded-xl text-xs transition-all duration-150"
                                :class="[
                                    isGroupActive(menu.submenus) ? 'bg-slate-50/80 dark:bg-slate-900/30 text-indigo-600 dark:text-indigo-400 font-semibold' : '',
                                    isMiniSidebar && !isMobileOpen ? 'lg:justify-center lg:px-0' : ''
                                ]">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <component :is="iconMap[menu.icon] || HelpCircle" class="w-4 h-4 shrink-0" />
                                    <span v-if="!isMiniSidebar || isMobileOpen" class="whitespace-nowrap truncate">
                                        {{ menu.label }}
                                    </span>
                                </div>
                                <ChevronDown v-if="(!isMiniSidebar || isMobileOpen)"
                                    class="w-3.5 h-3.5 transition-transform duration-200 shrink-0"
                                    :class="{ 'rotate-180': openSubmenus[menuKey] || isGroupActive(menu.submenus) }" />
                            </button>

                            <div v-show="openSubmenus[menuKey] || isGroupActive(menu.submenus) && (!isMiniSidebar || isMobileOpen)"
                                class="pl-4 mt-1 space-y-0.5 border-l-2 border-slate-100 dark:border-slate-900 ml-5">
                                <router-link v-for="(sub, subIdx) in menu.submenus" :key="subIdx" :to="sub.path"
                                    class="flex items-center h-8 px-3 text-slate-500 dark:text-slate-400 hover:text-blue-950 dark:hover:text-white rounded-lg text-[11px] font-medium transition-all duration-150"
                                    exact-active-class="bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold">
                                    {{ sub.name }}
                                </router-link>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <div
                class="p-3 border-t border-slate-100 dark:border-slate-950 bg-white dark:bg-[#070b14] shrink-0 z-10 flex items-center justify-between overflow-hidden">
                <div class="flex items-center gap-2.5 min-w-0">

                    <img v-if="user?.avatar && !imageError" :src="getAvatarUrl(user.avatar)" :alt="user?.nama"
                        @error="imageError = true"
                        class="w-8 h-8 rounded-xl object-cover shadow-md shrink-0 border border-slate-100 dark:border-slate-800" />

                    <div v-else
                        class="w-8 h-8 rounded-xl bg-blue-950 text-white font-extrabold text-xs flex items-center justify-center shadow-md shrink-0 uppercase tracking-wider">
                        {{ avatarFallback }}
                    </div>

                    <div v-if="!isMiniSidebar || isMobileOpen" class="min-w-0 truncate">
                        <p class="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                            {{ user?.nama || 'Nama Tidak Set' }}
                        </p>
                        <p
                            class="text-[10px] text-slate-400 dark:text-slate-500 leading-none mt-0.5 capitalize truncate">
                            {{ user?.role_name || 'Guest' }}
                        </p>
                    </div>
                </div>

                <button v-if="!isMiniSidebar || isMobileOpen" @click="handleLogout" :disabled="isLoading"
                    class="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-500 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition shrink-0 disabled:opacity-40">
                    <LogOut class="w-3.5 h-3.5" />
                </button>
            </div>

        </aside>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'; // 🌟 Tambahkan computed
import { useRoute } from 'vue-router';
import { isMiniSidebar, isMobileOpen } from './sidebarState';
import { useAuthentication } from '../../modules/authentication/composables/useAuthentication';
import {
    Layers, LogOut, X, ChevronDown, HelpCircle,
    LayoutGrid, Users, Archive, Info, HardDrive, Pocket, ShoppingBag, Repeat, Server, Book,
    ArrowLeftCircle, ArrowRightCircle, ArrowUpCircle
} from 'lucide-vue-next';

import LogoStatis from '@/assets/img/logo.png';

const route = useRoute();

// 🌟 Destructure hasPermission untuk memvalidasi hak akses
const { user, avatarFallback, handleLogout, isLoading, hasPermission } = useAuthentication();

const imageError = ref(false);

const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '';
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/storage/pegawai/image/${avatarPath}`;
};

const isGroupActive = (submenus) => {
    if (!submenus) return false;
    return submenus.some(sub => route.path === sub.path);
};

const iconMap = {
    'grid': LayoutGrid,
    'users': Users,
    'archive': Archive,
    'layers': Layers,
    'info': Info,
    'hard-drive': HardDrive,
    'pocket': Pocket,
    'shopping-bag': ShoppingBag,
    'repeat': Repeat,
    'server': Server,
    'book': Book,
    'arrow-left-circle': ArrowLeftCircle,
    'arrow-right-circle': ArrowRightCircle,
    'arrow-up-circle': ArrowUpCircle
};

// 🌟 Mapping manual nama permission dari router/index jika key objek menu berbeda
const permissionMapping = {
    'dashboard': 'dashboard',
    'jabatan': 'jabatan',
    'pegawai': 'pegawai',
    'role': 'role',
    'users': 'users',
    'kondisi': 'kondisi',
    'karat': 'karat',
    'jeniskarat': 'jeniskarat',
    'harga': 'harga',
    'diskon': 'diskon',
    'jenisproduk': 'jenisproduk',
    'produk': 'produk',
    'nampan': 'nampan',
    'nampanproduk': 'nampanproduk',
    'pelanggan': 'pelanggan',
    'suplier': 'suplier',
    'pesan': 'pesan',
    'saldo': 'saldo',
    'mutasisaldo': 'mutasisaldo',
    'transaksi': 'transaksi', // POS menggunakan transaksi
    'offtake': 'offtake',
    'pembeliandaritoko': 'pembeliandaritoko',
    'pembeliandariluartoko': 'pembeliandariluartoko',
    'perbaikan': 'perbaikan',
    'transaksipenjualan': 'transaksipenjualan',
    'transaksipembelian': 'transaksipembelian',
    'transaksiofftake': 'transaksiofftake',
    'inventori': 'inventori',
    'laporan': 'laporan'
};

const menuGroups = {
    main: {
        header: 'Main',
        menus: {
            dashboard: { label: 'Dashboard', icon: 'grid', path: '/dashboard' },
        }
    },
    master: {
        header: 'Master',
        menus: {
            usermanagement: {
                label: 'User Management',
                icon: 'users',
                submenus: [
                    { name: 'Jabatan', path: '/jabatan' },
                    { name: 'Pegawai', path: '/pegawai' },
                    { name: 'Role', path: '/role' },
                    { name: 'User', path: '/users' },
                ]
            },
            product: {
                label: 'Produk',
                icon: 'archive',
                submenus: [
                    { name: 'Kondisi', path: '/kondisi' },
                    { name: 'Karat', path: '/karat' },
                    { name: 'Jenis Karat', path: '/jeniskarat' },
                    { name: 'Harga', path: '/harga' },
                    { name: 'Diskon', path: '/diskon' },
                    { name: 'Jenis Produk', path: '/jenisproduk' },
                    { name: 'Produk', path: '/produk' },
                ]
            },
            nampan: {
                label: 'Nampan',
                icon: 'layers',
                submenus: [
                    { name: 'Nampan', path: '/nampan' },
                    { name: 'Nampan Produk', path: '/nampanproduk' }
                ]
            },
            pelanggan: {
                label: 'Pelanggan',
                icon: 'users',
                submenus: [
                    { name: 'Pelanggan', path: '/pelanggan' },
                    { name: 'Suplier', path: '/suplier' },
                    { name: 'Pesan', path: '/pesan' },
                ]
            }
        }
    },
    keuangan: {
        header: 'Keuangan',
        menus: {
            saldo: { label: 'Saldo', icon: 'info', path: '/saldo' },
            mutasisaldo: { label: 'Mutasi Saldo', icon: 'info', path: '/mutasisaldo' },
        }
    },
    transaksi: {
        header: 'Transaksi',
        menus: {
            transaksi: { label: 'POS', icon: 'hard-drive', path: '/pos' },
            offtake: { label: 'Offtake', icon: 'pocket', path: '/offtake' },
            pembelian: {
                label: 'Pembelian',
                icon: 'shopping-bag',
                submenus: [
                    { name: 'Pembelian Dari Toko', path: '/pembeliandaritoko' },
                    { name: 'Pembelian Dari Luar Toko', path: '/pembeliandariluartoko' }
                ]
            },
            perbaikan: { label: 'Perbaikan', icon: 'repeat', path: '/perbaikan' },
        }
    },
    sales: {
        header: 'Sales',
        menus: {
            transaksipenjualan: { label: 'Transaksi Penjualan', icon: 'arrow-left-circle', path: '/transaksipenjualan' },
            transaksipembelian: { label: 'Transaksi Pembelian', icon: 'arrow-right-circle', path: '/transaksipembelian' },
            transaksiofftake: { label: 'Transaksi Offtake', icon: 'arrow-up-circle', path: '/transaksiofftake' },
        }
    },
    Laporan: {
        header: 'Laporan',
        menus: {
            inventory: { label: 'Inventori', icon: 'server', path: '/inventori' },
            laporantransaksi: { label: 'Laporan Transaksi', icon: 'book', path: '/laporan' },
        }
    },
};

// 🌟 FILTER LOGIC BERDASARKAN PERMISSION NYATA DATA USER
const allowedMenuGroups = computed(() => {
    const filteredGroups = {};

    Object.entries(menuGroups).forEach(([groupKey, group]) => {
        const filteredMenus = {};

        Object.entries(group.menus).forEach(([menuKey, menu]) => {
            if (menu.submenus) {
                // Saring data anak (submenus)
                const validSubmenus = menu.submenus.filter(sub => {
                    const permKey = permissionMapping[sub.path.replace('/', '')] || sub.name.toLowerCase().replace(/\s+/g, '');
                    return hasPermission(permKey, 'read');
                });

                // Jika memiliki sub-menu yang lolos sensor, masukkan ke list render
                if (validSubmenus.length > 0) {
                    filteredMenus[menuKey] = { ...menu, submenus: validSubmenus };
                }
            } else {
                // Cek menu tunggal tanpa sub-menu
                const permKey = permissionMapping[menuKey] || menu.path.replace('/', '');
                if (hasPermission(permKey, 'read')) {
                    filteredMenus[menuKey] = menu;
                }
            }
        });

        // Hanya tampilkan header kelompok menu jika ada isinya
        if (Object.keys(filteredMenus).length > 0) {
            filteredGroups[groupKey] = {
                ...group,
                menus: filteredMenus
            };
        }
    });

    return filteredGroups;
});

const openSubmenus = ref({});

const toggleSubmenu = (menuKey) => {
    openSubmenus.value[menuKey] = !openSubmenus.value[menuKey];
};

watch(
    (() => route.path),
    () => {
        openSubmenus.value = {};
        isMobileOpen.value = false;
    }
);

watch(() => user.value?.avatar, () => {
    imageError.value = false;
});
</script>
