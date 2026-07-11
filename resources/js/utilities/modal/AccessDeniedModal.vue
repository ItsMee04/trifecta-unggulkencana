<template>
    <Transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="isAccessDeniedOpen"
            class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60">

            <!-- Konten Modal -->
            <Transition enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div
                    class="w-full max-w-sm bg-white dark:bg-[#090e1a] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-900 p-6 space-y-4 text-center transition-colors duration-200">

                    <!-- Icon Peringatan -->
                    <div
                        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                        <ShieldAlert class="w-6 h-6" />
                    </div>

                    <!-- Teks -->
                    <div class="space-y-1">
                        <h3 class="text-base font-bold text-slate-950 dark:text-white tracking-tight">Akses Ditolak</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Maaf, Anda tidak memiliki hak akses yang cukup untuk membuka halaman tersebut. Silakan
                            hubungi Administrator.
                        </p>
                    </div>

                    <!-- Tombol Mengerti -->
                    <button type="button" @click="isAccessDeniedOpen = false"
                        class="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition duration-150 active:scale-[0.98]">
                        Mengerti
                    </button>
                </div>
            </Transition>

        </div>
    </Transition>
</template>

<script setup>
import { ShieldAlert } from 'lucide-vue-next';
import { useAuthentication } from '../../modules/authentication/composables/useAuthentication'; // Sesuaikan path useAuth-mu

const { isAccessDeniedOpen } = useAuthentication();
</script>
