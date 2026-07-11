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
    const { isAuthenticated, hasPermission } = useAuthentication();
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        return next('/login');
    }
    if (to.meta.guestOnly && isAuthenticated.value) {
        return next('/dashboard');
    }
    if (to.meta.permission) {
        const menuName = to.meta.permission;
        if (!hasPermission(menuName, 'read')) {
            const { isAccessDeniedOpen } = useAuthentication();
            isAccessDeniedOpen.value = true;
            return next('/dashboard');
        }
    }
    next();
});

export default router;
