import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../modules/authentication/views/LoginView.vue';
import MainLayout from '../layouts/MainLayout.vue';
import Dashboard from '../modules/home/views/DashboardView.vue';
import { useAuthentication } from '../modules/authentication/composables/useAuthentication.js'; // 🌟 1. Impor Composable Auth

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: LoginView,
        meta: { guestOnly: true } // 🌟 Penanda: Hanya untuk user yang BELUM login
    },
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true }, // 🌟 Penanda: Semua halaman di dalam layout ini WAJIB login
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
                meta: { permission: 'dashboard' }
            },
            {
                path: 'jabatan',
                component: () => import('../modules/jabatan/views/JabatanView.vue'),
                meta: { permission: 'jabatan' } // 🌟 Nama menu harus sesuai dengan key permission dari backend
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
                meta: { permission: 'users' } // 🌟 Sesuaikan dengan string menu di database (misal: 'user')
            }
        ]
    },
    {
        // Fallback jika user mengetik URL asal-asalan yang tidak terdaftar
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ─── 🛡️ VUE ROUTER NAVIGATION GUARD ───
router.beforeEach((to, from, next) => {
    // Ambil state dan helper function dari composable useAuth
    const { isAuthenticated, hasPermission } = useAuthentication();

    // KONDISI 1: Halaman butuh login, tapi user BELUM login
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        return next('/login');
    }

    // KONDISI 2: User SUDAH login, tapi mencoba kembali ke halaman /login
    if (to.meta.guestOnly && isAuthenticated.value) {
        return next('/dashboard');
    }

    // KONDISI 3: Pengecekan Otorisasi Menu Dinamis dari Database
    if (to.meta.permission) {
        const menuName = to.meta.permission;

        // Cek apakah properti 'read' bernilai true/1 untuk menu ini
        if (!hasPermission(menuName, 'read')) {
            // 🌟 KUNCI: Ubah state modal menjadi true untuk memicu modal Tailwind muncul
            const { isAccessDeniedOpen } = useAuthentication();
            isAccessDeniedOpen.value = true;

            return next('/dashboard'); // Amankan dengan mengembalikan user ke dashboard
        }
    }

    // Jika lolos semua pengecekan, izinkan masuk halaman tujuan
    next();
});

export default router;
