<template>
    <div class="fixed top-6 right-6 z-50 space-y-3 w-full max-w-sm pointer-events-none">
        <TransitionGroup enter-active-class="transform ease-out duration-300 transition"
            enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
            enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
            leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-for="toast in toasts" :key="toast.id"
                class="pointer-events-auto w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 p-4.5 flex items-start gap-3">
                <div :class="[typeStyles[toast.type].iconBg, 'p-2 rounded-xl text-white shrink-0 shadow-sm']">
                    <component :is="typeStyles[toast.type].icon" class="w-4 h-4" />
                </div>

                <div class="flex-1 pt-0.5">
                    <p class="text-sm font-bold text-slate-900 leading-none">{{ typeStyles[toast.type].title }}</p>
                    <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">{{ toast.message }}</p>
                </div>

                <button @click="removeToast(toast.id)"
                    class="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-50">
                    <X class="w-3.5 h-3.5" />
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { inject } from 'vue';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-vue-next';

// Ambil data toast global dari provider
const { toasts, removeToast } = inject('vortex-toast');

// Definisi Gaya Estetika & Ikon untuk Setiap Tipe Toast
const typeStyles = {
    success: {
        title: 'Berhasil',
        icon: CheckCircle2,
        iconBg: 'bg-emerald-500 shadow-emerald-100',
    },
    error: {
        title: 'Gagal',
        icon: AlertCircle,
        iconBg: 'bg-rose-500 shadow-rose-100',
    },
    warning: {
        title: 'Peringatan',
        icon: AlertTriangle,
        iconBg: 'bg-amber-500 shadow-amber-100',
    },
    info: {
        title: 'Informasi',
        icon: Info,
        iconBg: 'bg-indigo-500 shadow-indigo-100',
    }
};
</script>
