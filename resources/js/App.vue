<template>
    <router-view></router-view>
    <ToastContainer />
    <AccessDeniedModal />
</template>
<script setup>
import { provide, onMounted } from 'vue';
import ToastContainer from '../js/utilities/toast/ToastContainer.vue';
import AccessDeniedModal from './utilities/modal/AccessDeniedModal.vue';
import { useToast } from '../js/utilities/toast/toast.js';
import FaviconStatis from '@/assets/img/favicon.ico';

const toastService = useToast();

// Bagikan state toast ke seluruh komponen anak (injectable)
provide('vortex-toast', {
    toasts: toastService.toasts,
    removeToast: toastService.remove,
});
onMounted(() => {
    // 🌟 2. Cari apakah sudah ada tag <link rel="icon"> di HTML
    let link = document.querySelector("link[rel~='icon']");

    // Jika belum ada (bersih total), kita buat tag-nya secara realtime
    if (!link) {
        link = document.createElement('link');
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    // 🌟 3. Injeksi link href hasil kompilasi Vite ke head HTML
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = FaviconStatis;
});
</script>
<style>
@import "tailwindcss";

/* Di Tailwind v4, definisikan varian dark di luar blok @theme seperti ini */
@variant dark (&:where(.dark, .dark *));

/* Jika ada custom theme baru ditaruh di bawah ini */
@theme {
    /* contoh: --color-primary: #xxxxxx; */
}
</style>
