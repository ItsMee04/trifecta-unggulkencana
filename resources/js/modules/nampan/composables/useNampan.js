import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { nampanService } from '../services/nampanService';

const toast = useToast();
const nampan = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formNampan = reactive({
    id: null,
    nampan: '',
    jenisproduk_id: null
});

export function useNampan() {

    const fetchNampan = async () => {
        isLoading.value = true;
        try {
            const response = await nampanService.getNampan();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                nampan.value = response.data;
            } else if (Array.isArray(response)) {
                nampan.value = response;
            } else {
                nampan.value = [];
            }
        } catch (error) {
            console.error('Error fetching nampan:', error);
            nampan.value = [];
            toast.error('Gagal mengambil data nampan.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formNampan.nampan) {
            errors.value.nampan = 'Nama nampan wajib diisi.';
        }
        // Jabatan (Combobox)
        if (
            formNampan.jenisproduk_id === null ||
            formNampan.jenisproduk_id === undefined ||
            formNampan.jenisproduk_id === ''
        ) {
            errors.value.jenisproduk_id = 'Jenis Produk wajib dipilih.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formNampan.id = null;
        formNampan.nampan = '';
        formNampan.jenisproduk_id = null;
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formNampan.id = item.id;
        formNampan.nampan = item.nampan;
        formNampan.jenisproduk_id = item.jenisproduk_id
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitNampan = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                nampan: formNampan.nampan,
                jenisproduk_id: formNampan.jenisproduk_id
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formNampan.id;
                response = await nampanService.updateNampan(payload);
            } else {
                response = await nampanService.storeNampan(payload);
            }

            toast.success(response?.message || 'Data nampan berhasil disimpan.');
            closeModal();
            await fetchNampan();
            return true;
        } catch (error) {
            console.error('Error submitting nampan:', error);
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
            `Data Nampan "${item.nampan}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await nampanService.deleteNampan({ id: item.id });
                toast.success('Nampan berhasil dihapus.');
                await fetchNampan();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredNampan = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return nampan.value.filter(item =>
            (item.nampan || '').toLowerCase().includes(query) ||
            (item.jenisproduk?.jenis || '').toLowerCase().includes(query)
        );
    });

    const paginatedNampan = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredNampan.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredNampan.value.length / itemsPerPage.value) || 1;
    });

    return {
        nampan,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formNampan,

        fetchNampan,
        submitNampan,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedNampan,
        totalPages,
    }
}
