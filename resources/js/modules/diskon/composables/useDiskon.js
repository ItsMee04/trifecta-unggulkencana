import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { diskonService } from '../services/diskonService';

const toast = useToast();
const diskon = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formDiskon = reactive({
    id: null,
    diskon: '',
    nilai: ''
});

export function useDiskon() {

    const fetchDiskon = async () => {
        isLoading.value = true;
        try {
            const response = await diskonService.getDiskon();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                diskon.value = response.data;
            } else if (Array.isArray(response)) {
                diskon.value = response;
            } else {
                diskon.value = [];
            }
        } catch (error) {
            diskon.value = [];
            toast.error('Gagal mengambil data diskon.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formDiskon.diskon) {
            errors.value.diskon = 'Nama diskon wajib diisi.';
        }
        if (!formDiskon.nilai) {
            errors.value.nilai = 'Nilai wajib diisi.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formDiskon.id = null;
        formDiskon.diskon = '';
        formDiskon.nilai = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formDiskon.id = item.id;
        formDiskon.diskon = item.diskon;
        formDiskon.nilai = item.nilai;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitDiskon = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                diskon: formDiskon.diskon,
                nilai: formDiskon.nilai,
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formDiskon.id;
                response = await diskonService.updateDiskon(payload);
            } else {
                response = await diskonService.storeDiskon(payload);
            }

            toast.success(response?.message || 'Data diskon berhasil disimpan.');
            closeModal();
            await fetchDiskon();
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
            `Data Diskon "${item.diskon}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await diskonService.deleteDiskon({ id: item.id });
                toast.success('Diskon berhasil dihapus.');
                await fetchDiskon();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredDiskon = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return diskon.value.filter(item =>
            (item.diskon || '').toLowerCase().includes(query) ||
            (item.nilai || '').toLowerCase().includes(query)
        );
    });

    const paginatedDiskon = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredDiskon.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredDiskon.value.length / itemsPerPage.value) || 1;
    });

    return {
        diskon,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formDiskon,

        fetchDiskon,
        submitDiskon,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedDiskon,
        totalPages,
    }
}
