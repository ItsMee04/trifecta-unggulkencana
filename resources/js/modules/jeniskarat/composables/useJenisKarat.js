import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { jeniskaratService } from '../services/jeniskaratService';

const toast = useToast();
const jeniskarat = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formJenisKarat = reactive({
    id: null,
    karat_id: null,
    jenis: ''
});

export function useJenisKarat() {

    const fetchJenisKarat = async () => {
        isLoading.value = true;
        try {
            const response = await jeniskaratService.getJenisKarat();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                jeniskarat.value = response.data;
            } else if (Array.isArray(response)) {
                jeniskarat.value = response;
            } else {
                jeniskarat.value = [];
            }
        } catch (error) {
            jeniskarat.value = [];
            toast.error('Gagal mengambil data jenis karat.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        // jenis
        if (!formJenisKarat.jenis?.trim()) {
            errors.value.jenis = 'Jenis wajib diisi.';
        }

        // Jabatan (Combobox)
        if (
            formJenisKarat.karat_id === null ||
            formJenisKarat.karat_id === undefined ||
            formJenisKarat.karat_id === ''
        ) {
            errors.value.karat_id = 'Karat wajib dipilih.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formJenisKarat.id = null;
        formJenisKarat.karat_id = null;
        formJenisKarat.jenis = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formJenisKarat.id = item.id;
        formJenisKarat.karat_id = item.karat_id;
        formJenisKarat.jenis = item.jenis;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitJenisKarat = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                karat_id: formJenisKarat.karat_id,
                jenis: formJenisKarat.jenis
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formJenisKarat.id;
                response = await jeniskaratService.updateJenisKarat(payload);
            } else {
                response = await jeniskaratService.storeJenisKarat(payload);
            }

            toast.success(response?.message || 'Data jenis karat berhasil disimpan.');
            closeModal();
            await fetchJenisKarat();
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
            `Data Jenis Karat "${item.karat?.karat}" "${item.jenis}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await jeniskaratService.deleteJenisKarat({ id: item.id });
                toast.success('Jenis Karat berhasil dihapus.');
                await fetchJenisKarat();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredJenisKarat = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return jeniskarat.value.filter(item =>
            (item.jenis || '').toLowerCase().includes(query) ||
            (item.karat?.karat || '').toLowerCase().includes(query)
        );
    });

    const paginatedJenisKarat = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredJenisKarat.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredJenisKarat.value.length / itemsPerPage.value) || 1;
    });

    return {
        jeniskarat,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formJenisKarat,

        fetchJenisKarat,
        submitJenisKarat,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedJenisKarat,
        totalPages,
    }
}
