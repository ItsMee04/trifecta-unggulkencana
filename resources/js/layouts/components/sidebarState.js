import { ref } from 'vue';

export const isMiniSidebar = ref(false);
export const isMobileOpen = ref(false);

export const toggleMiniSidebar = () => {
    isMiniSidebar.value = !isMiniSidebar.value;
};

export const toggleMobileSidebar = () => {
    isMobileOpen.value = !isMobileOpen.value;
};
