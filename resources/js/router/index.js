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
            }
        ]
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

router.beforeEach((to, from, next) => {
    // Ambil fungsi auth dari composable
    const { isAuthenticated, hasPermission, isAccessDeniedOpen } = useAuthentication();

    // 1. Jika halaman butuh login, tapi user belum login
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        return next('/login');
    }

    // 2. Jika halaman khusus guest (seperti login), tapi user sudah login
    if (to.meta.guestOnly && isAuthenticated.value) {
        return next('/dashboard');
    }

    // 3. Pengecekan matriks Permission Menu
    if (to.meta.permission) {
        const menuName = to.meta.permission;

        if (!hasPermission(menuName, 'read')) {
            isAccessDeniedOpen.value = true; // Munculkan pop-up access denied

            // 🌟 PENGAMAN: Jika user asal mulanya belum dari mana-mana (buka url manual pertama kali)
            if (from.path === '/' || from.path === to.path) {
                // Jika dia punya akses dashboard, lempar ke dashboard. Jika tidak, batalkan total (stay/blank aman)
                return hasPermission('dashboard', 'read') ? next('/dashboard') : next(false);
            }

            // Jika dia berpindah dari halaman valid sebelumnya, batalkan perpindahan (tetap di halaman asal)
            return next(false);
        }
    }

    next();
});

export default router;
