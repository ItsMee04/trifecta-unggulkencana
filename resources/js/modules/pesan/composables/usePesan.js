import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { pesanService } from '../services/pesanService';

const toast = useToast();
const pesan = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formPesan = reactive({
    id: null,
    judul: '',
    pesan: '',
});

export function usePesan() {

    const fetchPesan = async () => {
        isLoading.value = true;
        try {
            const response = await pesanService.getPesan();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                pesan.value = response.data;
            } else if (Array.isArray(response)) {
                pesan.value = response;
            } else {
                pesan.value = [];
            }
        } catch (error) {
            pesan.value = [];
            toast.error('Gagal mengambil data pesan.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formPesan.judul) {
            errors.value.judul = 'Judul wajib diisi.';
        }
        if (!formPesan.pesan) {
            errors.value.pesan = 'Pesan wajib diisi.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formPesan.id = null;
        formPesan.judul = '';
        formPesan.pesan = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formPesan.id = item.id;
        formPesan.judul = item.judul;
        formPesan.pesan = item.pesan;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitPesan = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                judul: formPesan.judul,
                pesan: formPesan.pesan,
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formPesan.id;
                response = await pesanService.updatePesan(payload);
            } else {
                response = await pesanService.storePesan(payload);
            }

            toast.success(response?.message || 'Data pesan / template pesan berhasil disimpan.');
            closeModal();
            await fetchPesan();
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
            `Data Pesan "${item.judul}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await pesanService.deletePesan({ id: item.id });
                toast.success('Pesan berhasil dihapus.');
                await fetchPesan();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredPesan = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return pesan.value.filter(item =>
            (item.judul || '').toLowerCase().includes(query) ||
            (item.pesan || '').toLowerCase().includes(query)
        );
    });

    const paginatedPesan = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredPesan.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredPesan.value.length / itemsPerPage.value) || 1;
    });

    return {
        pesan,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formPesan,

        fetchPesan,
        submitPesan,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedPesan,
        totalPages,
    }
}
