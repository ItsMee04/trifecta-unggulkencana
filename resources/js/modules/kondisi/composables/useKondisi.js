import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { kondisiService } from '../services/kondisiService';

const toast = useToast();
const kondisi = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formKondisi = reactive({
    id: null,
    kondisi: '',
});

export function useKondisi() {

    const fetchKondisi = async () => {
        isLoading.value = true;
        try {
            const response = await kondisiService.getKondisi();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                kondisi.value = response.data;
            } else if (Array.isArray(response)) {
                kondisi.value = response;
            } else {
                kondisi.value = [];
            }
        } catch (error) {
            kondisi.value = [];
            toast.error('Gagal mengambil data kondisi.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formKondisi.kondisi) {
            errors.value.kondisi = 'Nama kondisi wajib diisi.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formKondisi.id = null;
        formKondisi.kondisi = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formKondisi.id = item.id;
        formKondisi.kondisi = item.kondisi;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitKondisi = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                kondisi: formKondisi.kondisi,
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formKondisi.id;
                response = await kondisiService.updateKondisi(payload);
            } else {
                response = await kondisiService.storeKondisi(payload);
            }

            toast.success(response?.message || 'Data kondisi berhasil disimpan.');
            closeModal();
            await fetchKondisi();
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
            `Data Kondisi "${item.kondisi}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await kondisiService.deleteKondisi({ id: item.id });
                toast.success('Kondisi berhasil dihapus.');
                await fetchKondisi();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredKondisi = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return kondisi.value.filter(item => (item.kondisi || '').toLowerCase().includes(query));
    });

    const paginatedKondisi = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredKondisi.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredKondisi.value.length / itemsPerPage.value) || 1;
    });

    return {
        kondisi,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formKondisi,

        fetchKondisi,
        submitKondisi,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedKondisi,
        totalPages,
    }
}
