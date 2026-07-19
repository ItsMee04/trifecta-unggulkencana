import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authenticationService } from '../services/authenticationService';
import { useToast } from '../../../utilities/toast/toast.js';

// Global / Shared State
const token = ref(localStorage.getItem('token') || null);
const user = ref(JSON.parse(localStorage.getItem('user')) || null);
const isLoading = ref(false);
const isAccessDeniedOpen = ref(false);

// State Form & Error
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errors = reactive({
    email: '',
    password: ''
});

export function useAuthentication() {
    const router = useRouter();
    const toast = useToast();

    const isAuthenticated = computed(() => !!token.value);
    const permissions = computed(() => user.value?.permissions || {});

    const avatarFallback = computed(() => {
        if (!user.value || !user.value.nama) return '?';
        return user.value.nama.trim().charAt(0).toUpperCase();
    });

    const validateEmailFormat = (emailVal) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    };

    /**
     * 🌟 VALIDASI & SINKRONISASI SESI DENGAN DATABASE
     * Fungsi ini dipanggil saat aplikasi pertama kali dimuat (App.vue / Router Guard)
     */
    const verifyAuthSession = async () => {
        if (!token.value) return false;

        try {
            // Panggil API untuk memastikan token ini benar-benar ada di DB yang aktif
            const data = await authenticationService.checkSession();

            if (data && data.user) {
                // Jika valid, sinkronkan data user terbaru dari DB ke state & localStorage
                user.value = data.user;
                localStorage.setItem('user', JSON.stringify(data.user));
                return true;
            }
        } catch (error) {
            console.warn('Sesi tidak valid atau database telah di-migrate ulang. Membersihkan sisa token...');
            // Bersihkan sisa state & localStorage secara paksa
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect ke login jika tidak sedang di halaman login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return false;
    };

    /**
     * Memproses Validasi Front-end & Submit Login ke Backend
     */
    const handleLogin = async () => {
        errors.email = '';
        errors.password = '';
        let isValid = true;

        if (!email.value.trim()) {
            errors.email = 'Alamat email wajib diisi.';
            isValid = false;
        } else if (!validateEmailFormat(email.value)) {
            errors.email = 'Format alamat email tidak valid.';
            isValid = false;
        }

        if (!password.value) {
            errors.password = 'Kata sandi wajib diisi.';
            isValid = false;
        } else if (password.value.length < 6) {
            errors.password = 'Kata sandi minimal harus terdiri dari 6 karakter.';
            isValid = false;
        }

        if (!isValid) {
            toast.error('Mohon periksa kembali formulir login Anda.');
            return;
        }

        isLoading.value = true;
        try {
            const payload = { email: email.value, password: password.value };
            const data = await authenticationService.login(payload);

            if (data.success) {
                token.value = data.access_token;
                user.value = data.user;

                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));

                toast.success('Login berhasil! Selamat datang kembali.');

                email.value = '';
                password.value = '';

                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error Auth:', error);
            const message = error.response?.data?.message || 'Email atau password salah.';
            toast.error(message);

            if (error.response?.status === 421 && error.response?.data?.errors) {
                const backendErrors = error.response.data.errors;
                if (backendErrors.email) errors.email = backendErrors.email[0];
                if (backendErrors.password) errors.password = backendErrors.password[0];
            }
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Memproses Sesi Logout
     */
    const handleLogout = async () => {
        isLoading.value = true;
        try {
            await authenticationService.logout();
        } catch (error) {
            console.error('Logout error backend:', error);
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            isLoading.value = false;
            window.location.href = '/login';
        }
    };

    /**
     * Menguji hak akses untuk menu sidebar atau tombol aksi
     */
    const hasPermission = (menu, action = 'read') => {
        if (!user.value) return false;
        const userPermissions = user.value.permissions;
        if (!userPermissions) return false;

        if (Array.isArray(userPermissions)) {
            return userPermissions.some(p => p.menu === menu && p[action] === 1);
        }

        if (typeof userPermissions === 'object') {
            return !!userPermissions[menu]?.[action];
        }

        return false;
    };

    const updateCurrentUser = (updatedUserData) => {
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        user.value = updatedUserData;
    };

    return {
        email,
        password,
        showPassword,
        errors,
        isLoading,
        user,
        isAuthenticated,
        permissions,
        avatarFallback,
        handleLogin,
        handleLogout,
        hasPermission,
        isAccessDeniedOpen,
        updateCurrentUser,
        verifyAuthSession // Ekspor fungsi verifikasi sesi ini
    };
}
