import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { jabatanService } from '../services/jabatanService';

const toast = useToast();
const jabatan = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formJabatan = reactive({
    id: null,
    jabatan: '',
});

export function useJabatan() {

    const fetchJabatan = async () => {
        isLoading.value = true;
        try {
            const response = await jabatanService.getJabatan();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                jabatan.value = response.data;
            } else if (Array.isArray(response)) {
                jabatan.value = response;
            } else {
                jabatan.value = [];
            }
        } catch (error) {
            console.error('Error fetching jabatan:', error);
            jabatan.value = [];
            toast.error('Gagal mengambil data jabatan.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formJabatan.jabatan) {
            errors.value.jabatan = 'Nama jabatan wajib diisi.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formJabatan.id = null;
        formJabatan.jabatan = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formJabatan.id = item.id;
        formJabatan.jabatan = item.jabatan;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitJabatan = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                jabatan: formJabatan.jabatan,
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formJabatan.id;
                response = await jabatanService.updateJabatan(payload);
            } else {
                response = await jabatanService.storeJabatan(payload);
            }

            toast.success(response?.message || 'Data jabatan berhasil disimpan.');
            closeModal();
            await fetchJabatan();
            return true;
        } catch (error) {
            console.error('Error submitting jabatan:', error);
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
            `Data Jabatan "${item.jabatan}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await jabatanService.deleteJabatan({ id: item.id });
                toast.success('Jabatan berhasil dihapus.');
                await fetchJabatan();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredJabatan = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return jabatan.value.filter(item => (item.jabatan || '').toLowerCase().includes(query));
    });

    const paginatedJabatan = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredJabatan.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredJabatan.value.length / itemsPerPage.value) || 1;
    });

    return {
        jabatan,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formJabatan,

        fetchJabatan,
        submitJabatan,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedJabatan,
        totalPages,
    }
}
