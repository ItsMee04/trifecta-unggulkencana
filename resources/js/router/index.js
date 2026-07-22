import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../modules/authentication/views/LoginView.vue';
import MainLayout from '../layouts/MainLayout.vue';
import Dashboard from '../modules/home/views/DashboardView.vue';
import { useAuthentication } from '../modules/authentication/composables/useAuthentication.js';

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: LoginView,
        meta: { guestOnly: true }
    },
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
                meta: { permission: 'dashboard' }
            },
            {
                path: 'jabatan',
                component: () => import('../modules/jabatan/views/JabatanView.vue'),
                meta: { permission: 'jabatan' }
            },
            {
                path: 'pegawai',
                component: () => import('../modules/pegawai/views/PegawaiView.vue'),
                meta: { permission: 'pegawai' }
            },
            {
                path: 'role',
                component: () => import('../modules/role/views/RoleView.vue'),
                meta: { permission: 'role' }
            },
            {
                path: 'users',
                component: () => import('../modules/user/views/UserView.vue'),
                meta: { permission: 'users' }
            },
            {
                path: 'kondisi',
                component: () => import('../modules/kondisi/views/KondisiView.vue'),
                meta: { permission: 'kondisi' }
            },
            {
                path: 'karat',
                component: () => import('../modules/karat/views/KaratView.vue'),
                meta: { permission: 'karat' }
            },
            {
                path: 'jeniskarat',
                component: () => import('../modules/jeniskarat/views/JenisKaratView.vue'),
                meta: { permission: 'jeniskarat' }
            },
            {
                path: 'harga',
                component: () => import('../modules/harga/views/HargaView.vue'),
                meta: { permission: 'harga' }
            },
            {
                path: 'diskon',
                component: () => import('../modules/diskon/views/DiskonView.vue'),
                meta: { permission: 'diskon' }
            },
            {
                path: 'jenisproduk',
                component: () => import('../modules/jenisproduk/views/JenisProdukView.vue'),
                meta: { permission: 'jenisproduk' }
            },
            {
                path: 'produk',
                component: () => import('../modules/produk/views/ProdukView.vue'),
                meta: { permission: 'produk' }
            },
            {
                path: 'nampan',
                component: () => import('../modules/nampan/views/NampanView.vue'),
                meta: { permission: 'nampan' }
            },
            {
                path: 'nampanproduk',
                component: () => import('../modules/nampanproduk/views/NampanProdukView.vue'),
                meta: { permission: 'nampanproduk' }
            },
            {
                path: 'pelanggan',
                component: () => import('../modules/pelanggan/views/PelangganView.vue'),
                meta: { permission: 'pelanggan' }
            },
            {
                path: 'suplier',
                component: () => import('../modules/suplier/views/SuplierView.vue'),
                meta: { permission: 'suplier' }
            },
            {
                path: 'pesan',
                component: () => import('../modules/pesan/views/PesanView.vue'),
                meta: { permission: 'pesan' }
            },
            {
                path: 'saldo',
                component: () => import('../modules/saldo/views/SaldoView.vue'),
                meta: { permission: 'saldo' }
            },
            {
                path: 'mutasisaldo',
                component: () => import('../modules/mutasisaldo/views/MutasiSaldoView.vue'),
                meta: { permission: 'mutasisaldo' }
            },
            {
                path: 'pos',
                component: () => import('../modules/pos/views/PointOfSaleView.vue'),
                meta: { permission: 'transaksi' }
            },
            {
                path: 'offtake',
                component: () => import('../modules/offtake/views/OfftakeView.vue'),
                meta: { permission: 'offtake' }
            },
            {
                path: 'pembeliandaritoko',
                component: () => import('../modules/pembeliandaritoko/views/PembelianDariTokoView.vue'),
                meta: { permission: 'pembeliandaritoko' }
            },
        ]
    },
    {
        path: '/CetakNotaTransaksi/:kodeTransaksi',
        name: 'CetakNotaTransaksi',
        component: () => import('../modules/pos/components/CetakNotaTransaksi.vue'),
        meta: {
            requiresAuth: true,
            layout: 'blank'
        }
    },
    {
        path: '/CetakNotaOfftake/:kodeTransaksi',
        name: 'CetakNotaOfftake',
        component: () => import('../modules/offtake/components/CetakNotaOfftake.vue'),
        meta: {
            requiresAuth: true,
            layout: 'blank'
        }
    },
    {
        path: '/CetakNotaPembelianDariToko/:kodeTransaksi',
        name: 'CetakNotaPembelianDariToko',
        component: () => import('../modules/pembeliandaritoko/components/CetakNotaPembelianDariToko.vue'),
        meta: {
            requiresAuth: true,
            layout: 'blank'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 🌟 Buat variabel penanda (flag) tepat di luar guard untuk memantau initial load aplikasi
let isFirstLoadCheckDone = false;

// 🌟 GLOBAL NAVIGATION GUARD (ASYNC)
router.beforeEach(async (to, from, next) => {
    const { isAuthenticated, hasPermission, isAccessDeniedOpen, verifyAuthSession } = useAuthentication();

    // 🌟 KUNCI UTAMA: Hanya jalankan verifikasi database tepat 1 kali saat web pertama kali dibuka/load
    if (to.meta.requiresAuth && !isFirstLoadCheckDone) {
        if (localStorage.getItem('token')) {
            const isSessionValid = await verifyAuthSession();

            // Tandai check awal telah selesai supaya perpindahan menu internal selanjutnya tidak menembak API /me lagi
            isFirstLoadCheckDone = true;

            if (!isSessionValid) {
                return next('/login');
            }
        } else {
            isFirstLoadCheckDone = true;
        }
    }

    // 1. Jika halaman butuh login, tapi user tidak terautentikasi
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        return next('/login');
    }

    // 2. Jika halaman khusus guest (Login), tapi user sudah terautentikasi
    if (to.meta.guestOnly && isAuthenticated.value) {
        return next('/dashboard');
    }

    // 3. Pengecekan Hak Akses Menu (Permission Matrix)
    if (to.meta.permission) {
        const menuName = to.meta.permission;

        if (!hasPermission(menuName, 'read')) {
            isAccessDeniedOpen.value = true;

            if (from.path === '/' || from.path === to.path) {
                return hasPermission('dashboard', 'read') ? next('/dashboard') : next(false);
            }

            return next(false);
        }
    }

    next();
});

export default router;
