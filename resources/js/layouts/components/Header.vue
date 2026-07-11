<template>
    <header
        class="app-header h-14 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center px-3 sm:px-6 sticky top-0 z-40 font-sans transition-colors duration-200">

        <div class="flex items-center flex-1 min-w-0 gap-2">
            <button @click="lgDevice ? toggleMiniSidebar() : toggleMobileSidebar()"
                class="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-xl transition shrink-0">
                <Menu class="w-4 h-4" />
            </button>

            <div
                class="header-search relative flex-1 min-w-[70px] max-w-[110px] min-[500px]:max-w-[130px] sm:max-w-xs md:max-w-md">
                <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search..."
                    class="w-full pl-8 pr-2 sm:pr-12 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition" />
                <span
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded-md font-mono hidden sm:inline">Ctrl+K</span>
            </div>
        </div>

        <div class="header-actions flex items-center gap-1 sm:gap-2.5 shrink-0 ml-2">

            <div class="relative" v-click-outside="closeNotif">
                <button @click="toggleNotif"
                    class="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-700/30 rounded-xl transition relative">
                    <Bell class="w-4 h-4" />
                    <span
                        class="absolute top-1 right-1 min-w-[14px] h-3.5 bg-rose-500 text-white text-[8px] font-bold px-1 rounded-full flex items-center justify-center">15</span>
                </button>

                <transition name="pop">
                    <div v-if="isNotifOpen"
                        class="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden text-xs">
                        <div
                            class="p-3 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-900/50">
                            Notifications
                        </div>
                        <div class="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
                            <a href="#"
                                class="block p-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition">📦
                                Order <span class="font-bold">#TRF-9021</span> shipped</a>
                        </div>
                    </div>
                </transition>
            </div>

            <button @click="toggleDarkMode"
                class="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-700/30 rounded-xl transition">
                <Sun v-if="isDark" class="w-4 h-4 text-amber-500" />
                <Moon v-else class="w-4 h-4" />
            </button>

            <div class="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

            <div class="relative" v-click-outside="closeProfile">
                <div @click="toggleProfile" class="flex items-center gap-1 shrink-0 cursor-pointer select-none">

                    <img v-if="user?.avatar && !imageError" :src="getAvatarUrl(user.avatar)" :alt="user?.nama"
                        @error="imageError = true"
                        class="w-8 h-8 rounded-full object-cover shadow-sm shrink-0 border border-slate-100 dark:border-slate-800" />

                    <div v-else
                        class="w-8 h-8 rounded-full bg-blue-950 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0 uppercase tracking-wider">
                        {{ avatarFallback }}
                    </div>

                    <ChevronDown class="w-3 h-3 text-slate-400 shrink-0" />
                </div>

                <transition name="pop">
                    <div v-if="isProfileOpen"
                        class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1 text-xs">

                        <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800 min-w-0">
                            <p class="font-bold text-slate-900 dark:text-white leading-tight truncate">
                                {{ user?.nama || 'Nama Tidak Set' }}
                            </p>
                            <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                {{ user?.email || 'No Email' }}
                            </p>
                        </div>

                        <div class="p-1">
                            <a href="#"
                                class="flex items-center gap-2 px-2.5 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition">
                                <User class="w-3.5 h-3.5" /> Profile
                            </a>

                            <button @click="handleLogout" :disabled="isLoading"
                                class="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition mt-1 disabled:opacity-40 text-left font-medium">
                                <LogOut class="w-3.5 h-3.5" /> Sign Out
                            </button>
                        </div>
                    </div>
                </transition>
            </div>

        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { toggleMiniSidebar, toggleMobileSidebar } from './sidebarState';
import { isDark, toggleDarkMode, initTheme } from './themeState';
import { useAuthentication } from '../../modules/authentication/composables/useAuthentication'; // 🌟 1. Impor Composable Auth
import { Menu, Search, Bell, Sun, Moon, ChevronDown, User, LogOut } from 'lucide-vue-next';

// 🌟 2. Destructure State & Method Auth yang dibutuhkan
const { user, avatarFallback, handleLogout, isLoading } = useAuthentication();

const isNotifOpen = ref(false);
const isProfileOpen = ref(false);
const lgDevice = ref(true);

// 🌟 3. State Deteksi Gambar Rusak/Error
const imageError = ref(false);

const toggleNotif = () => { isNotifOpen.value = !isNotifOpen.value; isProfileOpen.value = false; };
const toggleProfile = () => { isProfileOpen.value = !isProfileOpen.value; isNotifOpen.value = false; };
const closeNotif = () => isNotifOpen.value = false;
const closeProfile = () => isProfileOpen.value = false;

const checkBreakpoint = () => { lgDevice.value = window.innerWidth >= 1024; };

// 🌟 4. Helper URL Asset Gambar dari Backend Laravel
const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '';
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${baseUrl}/storage/pegawai/image/${avatarPath}`;
};

onMounted(() => {
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    initTheme();
});

onUnmounted(() => { window.removeEventListener('resize', checkBreakpoint); });

const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = (e) => { if (!(el === e.target || el.contains(e.target))) binding.value(e); };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) { document.body.removeEventListener('click', el.clickOutsideEvent); }
};

watch(() => user.value?.avatar, () => {
    imageError.value = false;
});
</script>

<style scoped>
.pop-enter-active,
.pop-leave-active {
    transition: transform 0.1s ease, opacity 0.08s ease;
}

.pop-enter-from,
.pop-leave-to {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
}
</style>
