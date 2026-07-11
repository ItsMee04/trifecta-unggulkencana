import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { karatService } from '../services/karatService';

const toast = useToast();
const karat = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formKarat = reactive({
    id: null,
    karat: '',
});

export function useKarat() {

    const fetchKarat = async () => {
        isLoading.value = true;
        try {
            const response = await karatService.getKarat();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                karat.value = response.data;
            } else if (Array.isArray(response)) {
                karat.value = response;
            } else {
                karat.value = [];
            }
        } catch (error) {
            karat.value = [];
            toast.error('Gagal mengambil data karat.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formKarat.karat) {
            errors.value.karat = 'karat wajib diisi.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formKarat.id = null;
        formKarat.karat = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formKarat.id = item.id;
        formKarat.karat = item.karat;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitKarat = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                karat: formKarat.karat,
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formKarat.id;
                response = await karatService.updateKarat(payload);
            } else {
                response = await karatService.storeKarat(payload);
            }

            toast.success(response?.message || 'Data karat berhasil disimpan.');
            closeModal();
            await fetchKarat();
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Gagal menyimpan data.';
            toast.error(errorMessage);
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    // Jauh lebih ringkas tanpa mengotori shared state!
    const handleDelete = async (item) => {
        const confirm = await confirmDelete(
            'Apakah Anda yakin?',
            `Data Karat "${item.karat}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await karatService.deleteKarat({ id: item.id });
                toast.success('Karat berhasil dihapus.');
                await fetchKarat();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredKarat = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return karat.value.filter(item => (item.karat || '').toLowerCase().includes(query));
    });

    const paginatedKarat = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredKarat.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredKarat.value.length / itemsPerPage.value) || 1;
    });

    return {
        karat,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formKarat,

        fetchKarat,
        submitKarat,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedKarat,
        totalPages,
    }
}
