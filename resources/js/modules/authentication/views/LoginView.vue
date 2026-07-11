<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-200">
        <div class="w-full max-w-md flex flex-col items-center relative z-10">

            <div class="flex items-center gap-2.5 justify-center mb-6">
                <div class="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none">
                    <Layers class="w-6 h-6" />
                </div>
                <span class="font-bold text-2xl tracking-tight text-slate-950 dark:text-white">Trifecta Solutions</span>
            </div>

            <div class="w-full bg-white dark:bg-[#090e1a] p-8 md:py-10 md:px-12 rounded-3xl shadow-2xl shadow-slate-200/80 dark:shadow-none border border-slate-100 dark:border-slate-900 space-y-6 transition-colors duration-200">

                <div class="text-center space-y-1">
                    <h1 class="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tighter">Masuk Akun Anda</h1>
                    <p class="text-slate-500 dark:text-slate-400 text-xs max-w-xs mx-auto">Silakan masukkan email dan kata sandi.</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-4" novalidate>

                    <div class="space-y-1.5">
                        <label for="email" class="text-xs font-semibold text-slate-700 dark:text-slate-300">Email</label>
                        <div class="relative">
                            <Mail class="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input v-model="email" :disabled="isLoading" type="email" id="email" placeholder="contoh@surel.com" :class="[
                                'w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border rounded-xl text-sm focus:outline-none transition-all duration-150',
                                errors.email
                                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-950/50'
                                    : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50'
                            ]" />
                        </div>
                        <p v-if="errors.email" class="text-[11px] font-medium text-rose-500 pl-1">{{ errors.email }}</p>
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <label for="password" class="text-xs font-semibold text-slate-700 dark:text-slate-300">Kata Sandi</label>
                            <a href="#" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition">Lupa?</a>
                        </div>
                        <div class="relative">
                            <Lock class="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input v-model="password" :disabled="isLoading" :type="showPassword ? 'text' : 'password'" id="password" placeholder="••••••••" :class="[
                                    'w-full pl-10 pr-11 py-2.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border rounded-xl text-sm focus:outline-none transition-all duration-150',
                                    errors.password
                                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-950/50'
                                        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/50'
                                ]" />
                            <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition p-1">
                                <Eye v-if="showPassword" class="w-4 h-4" />
                                <EyeOff v-else class="w-4 h-4" />
                            </button>
                        </div>
                        <p v-if="errors.password" class="text-[11px] font-medium text-rose-500 pl-1">{{ errors.password }}</p>
                    </div>

                    <button type="submit" :disabled="isLoading"
                        class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition duration-150 shadow-lg shadow-indigo-100 dark:shadow-none active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ isLoading ? 'Memproses Sesi...' : 'Masuk Sekarang' }}
                    </button>
                </form>

                <div class="text-center space-y-2 border-t border-slate-100 dark:border-slate-900 pt-5">
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        Belum punya akun?
                        <a href="#" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition">Daftar</a>.
                    </p>
                    <p class="text-[11px] text-slate-400 dark:text-slate-500">© 2026 TrifectaSolutions. All Rights Reserved.</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Layers, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next';
import { useAuthentication } from '../composables/useAuthentication.js'; // <-- Panggil Composable Baru
import { initTheme } from '../../../layouts/components/themeState.js';

onMounted(() => {
    initTheme();
});

// Tarik seluruh state dan fungsi yang dibutuhkan dari useAuth
const {
    email,
    password,
    showPassword,
    errors,
    isLoading,
    handleLogin
} = useAuthentication();
</script>
