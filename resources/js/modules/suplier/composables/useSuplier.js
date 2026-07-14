import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { suplierService } from '../services/suplierService';

const toast = useToast();
const suplier = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formSuplier = reactive({
    id: null,
    nama: '',
    kontak: '',
    alamat: '',
});

export function useSuplier() {

    const fetchSuplier = async () => {
        isLoading.value = true;
        try {
            const response = await suplierService.getSuplier();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                suplier.value = response.data;
            } else if (Array.isArray(response)) {
                suplier.value = response;
            } else {
                suplier.value = [];
            }
        } catch (error) {
            suplier.value = [];
            toast.error('Gagal mengambil data suplier.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formSuplier.nama) {
            errors.value.nama = 'Nama wajib diisi.';
        }
        if (!formSuplier.kontak) {
            errors.value.kontak = 'Kontak wajib diisi.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formSuplier.id = null;
        formSuplier.nama = '';
        formSuplier.kontak = '';
        formSuplier.alamat = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formSuplier.id = item.id;
        formSuplier.nama = item.nama;
        formSuplier.kontak = item.kontak;
        formSuplier.alamat = item.alamat;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitSuplier = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                nama: formSuplier.nama,
                kontak: formSuplier.kontak,
                alamat: formSuplier.alamat,
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formSuplier.id;
                response = await suplierService.updateSuplier(payload);
            } else {
                response = await suplierService.storeSuplier(payload);
            }

            toast.success(response?.message || 'Data suplier berhasil disimpan.');
            closeModal();
            await fetchSuplier();
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
            `Data Suplier "${item.nama}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await suplierService.deleteSuplier({ id: item.id });
                toast.success('Suplier berhasil dihapus.');
                await fetchSuplier();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredSuplier = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return suplier.value.filter(item =>
            (item.nama || '').toLowerCase().includes(query)
        );
    });

    const paginatedSuplier = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredSuplier.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredSuplier.value.length / itemsPerPage.value) || 1;
    });

    return {
        suplier,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formSuplier,

        fetchSuplier,
        submitSuplier,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedSuplier,
        totalPages,
    }
}
