<template>
    <div
        class="h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-800 dark:text-slate-200 antialiased overflow-hidden transition-colors duration-200">

        <Sidebar />

        <div class="flex-1 flex flex-col h-full min-w-0 transition-all duration-200"
            :class="[isMiniSidebar ? 'lg:pl-16' : 'lg:pl-60', 'pl-0']">

            <Header class="shrink-0" />

            <main class="p-4 sm:p-6 flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import { isMiniSidebar, isMobileOpen } from './components/sidebarState';
</script>
