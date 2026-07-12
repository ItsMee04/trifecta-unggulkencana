import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authenticationService } from '../services/authenticationService';
import { useToast } from '../../../utilities/toast/toast.js';

// Global / Shared State
const token = ref(localStorage.getItem('token') || null);
const user = ref(JSON.parse(localStorage.getItem('user')) || null);
const isLoading = ref(false);
// 🌟 TAMBAHKAN STATE INI DI LUAR (SHARED STATE)
const isAccessDeniedOpen = ref(false);

// State Form & Error (Dipindahkan dari View ke Composable)
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

    // Avatar Fallback: Mengambil karakter pertama dari nama
    const avatarFallback = computed(() => {
        if (!user.value || !user.value.nama) return '?';
        return user.value.nama.trim().charAt(0).toUpperCase();
    });

    const validateEmailFormat = (emailVal) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    };

    /**
     * Memproses Validasi Front-end & Submit Login ke Backend
     */
    const handleLogin = async () => {
        errors.email = '';
        errors.password = '';
        let isValid = true;

        // 1. Validasi Form Front-end
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

        // 2. Kirim ke API via Service
        isLoading.value = true;
        try {
            const payload = { email: email.value, password: password.value };
            const data = await authenticationService.login(payload);

            if (data.success) {
                token.value = data.access_token;
                user.value = data.user;

                // Amankan di localStorage agar tahan refresh F5
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));

                toast.success('Login berhasil! Selamat datang kembali.');

                // Bersihkan form login setelah sukses
                email.value = '';
                password.value = '';

                // Lempar user langsung ke Dashboard
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error Auth:', error);
            const message = error.response?.data?.message || 'Email atau password salah.';
            toast.error(message);

            // Jika ada error validasi spesifik dari Laravel backend
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

        // Ambil data permissions dari user
        const userPermissions = user.value.permissions;
        if (!userPermissions) return false;

        // 🌟 KONDISI 1: Jika permissions ternyata berbentuk ARRAY
        if (Array.isArray(userPermissions)) {
            return userPermissions.some(p => p.menu === menu && p[action] === 1);
        }

        // 🌟 KONDISI 2: Jika permissions berbentuk OBJECT (seperti struktur lama Anda)
        // Contoh: { jabatan: { read: 1, create: 1 }, karat: { read: 1 } }
        if (typeof userPermissions === 'object') {
            // Cek apakah ada properti menu tersebut, dan apakah sub-propertinya bernilai 1 atau true
            return !!userPermissions[menu]?.[action];
        }

        return false;
    };

    // 🌟 Tambahkan fungsi ini untuk sync state dengan localStorage terbaru
    const updateCurrentUser = (updatedUserData) => {
        // 1. Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        // 2. Update reactive state (ini yang memicu UI Sidebar & Header langsung berubah)
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
    };
}
