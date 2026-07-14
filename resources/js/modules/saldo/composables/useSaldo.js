import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { saldoService } from '../services/saldoService';

const toast = useToast();
const saldo = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formSaldo = reactive({
    id: null,
    rekening: '',
});

export function useSaldo() {

    const fetchSaldo = async () => {
        isLoading.value = true;
        try {
            const response = await saldoService.getSaldo();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                saldo.value = response.data;
            } else if (Array.isArray(response)) {
                saldo.value = response;
            } else {
                saldo.value = [];
            }
        } catch (error) {
            saldo.value = [];
            toast.error('Gagal mengambil data saldo.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formSaldo.rekening) {
            errors.value.rekening = 'Nama Rekening / Buku Saldo wajib diisi.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formSaldo.id = null;
        formSaldo.rekening = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formSaldo.id = item.id;
        formSaldo.rekening = item.rekening;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitSaldo = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                rekening: formSaldo.rekening,
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formSaldo.id;
                response = await saldoService.updateSaldo(payload);
            } else {
                response = await saldoService.storeSaldo(payload);
            }

            toast.success(response?.message || 'Data saldo berhasil disimpan.');
            closeModal();
            await fetchSaldo();
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
            `Data Rekening "${item.rekening}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await saldoService.deleteSaldo({ id: item.id });
                toast.success('Rekening berhasil dihapus.');
                await fetchSaldo();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredRekening = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return saldo.value.filter(item =>
            (item.rekening || '').toLowerCase().includes(query)
        );
    });

    const paginatedRekening = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredRekening.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredRekening.value.length / itemsPerPage.value) || 1;
    });

    return {
        saldo,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formSaldo,

        fetchSaldo,
        submitSaldo,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedRekening,
        totalPages,
    }
}
