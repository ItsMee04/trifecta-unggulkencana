<template>
    <router-view></router-view>
    <ToastContainer />
    <AccessDeniedModal />
</template>
<script setup>
import { provide } from 'vue';
import ToastContainer from '../js/utilities/toast/ToastContainer.vue';
import AccessDeniedModal from './utilities/modal/AccessDeniedModal.vue';
import { useToast } from '../js/utilities/toast/toast.js';

const toastService = useToast();

// Bagikan state toast ke seluruh komponen anak (injectable)
provide('vortex-toast', {
    toasts: toastService.toasts,
    removeToast: toastService.remove,
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
