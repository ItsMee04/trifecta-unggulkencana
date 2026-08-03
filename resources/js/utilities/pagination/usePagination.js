import { ref, computed } from 'vue';

export function usePagination(filteredData, itemsPerPage = 10) {

    const currentPage = ref(1);

    const totalItems = computed(() => filteredData.value.length);

    const totalPages = computed(() =>
        Math.ceil(totalItems.value / itemsPerPage) || 1
    );

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;

        return filteredData.value.slice(
            start,
            start + itemsPerPage
        );
    });

    const showingItems = computed(() => paginatedData.value.length);

    const startItem = computed(() => {
        if (totalItems.value === 0) return 0;

        return (currentPage.value - 1) * itemsPerPage + 1;
    });

    const endItem = computed(() =>
        Math.min(
            currentPage.value * itemsPerPage,
            totalItems.value
        )
    );

    const visiblePages = computed(() => {

        const maxVisible = 5;

        if (totalPages.value <= maxVisible) {
            return Array.from(
                { length: totalPages.value },
                (_, i) => i + 1
            );
        }

        let start = currentPage.value - Math.floor(maxVisible / 2);
        let end = currentPage.value + Math.floor(maxVisible / 2);

        if (start < 1) {
            start = 1;
            end = maxVisible;
        }

        if (end > totalPages.value) {
            end = totalPages.value;
            start = end - maxVisible + 1;
        }

        return Array.from(
            { length: end - start + 1 },
            (_, i) => start + i
        );

    });

    const goFirst = () => currentPage.value = 1;
    const goLast = () => currentPage.value = totalPages.value;
    const nextPage = () => {
        if (currentPage.value < totalPages.value)
            currentPage.value++;
    };
    const prevPage = () => {
        if (currentPage.value > 1)
            currentPage.value--;
    };

    return {
        currentPage,
        totalItems,
        totalPages,
        paginatedData,
        showingItems,
        startItem,
        endItem,
        visiblePages,
        goFirst,
        goLast,
        nextPage,
        prevPage,
    };
}
