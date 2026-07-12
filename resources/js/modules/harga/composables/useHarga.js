import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { hargaService } from '../services/hargaService';

const toast = useToast();
const harga = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formHarga = reactive({
    id: null,
    karat_id: null,
    jeniskarat_id: null,
    harga: ''
});

export function useHarga() {

    const fetchHarga = async () => {
        isLoading.value = true;
        try {
            const response = await hargaService.getHarga();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                harga.value = response.data;
            } else if (Array.isArray(response)) {
                harga.value = response;
            } else {
                harga.value = [];
            }
        } catch (error) {
            harga.value = [];
            toast.error('Gagal mengambil data harga.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        // harga
        if (!formHarga.harga?.trim()) {
            errors.value.harga = 'Harga wajib diisi.';
        }

        // Karat (Combobox)
        if (
            formHarga.karat_id === null ||
            formHarga.karat_id === undefined ||
            formHarga.karat_id === ''
        ) {
            errors.value.karat_id = 'Karat wajib dipilih.';
        }

        // Jenis Karat (Combobox)
        if (
            formHarga.jeniskarat_id === null ||
            formHarga.jeniskarat_id === undefined ||
            formHarga.jeniskarat_id === ''
        ) {
            errors.value.karat_id = 'Jenis Karat wajib dipilih.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        fetchHarga.id = null;
        formHarga.karat_id = null;
        formHarga.jeniskarat_id = null;
        formHarga.harga = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formHarga.id = item.id;
        formHarga.karat_id = item.karat_id;
        formHarga.jeniskarat_id = item.jeniskarat_id;
        formHarga.harga = item.harga;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitHarga = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                karat_id: formHarga.karat_id,
                jeniskarat_id: formHarga.jeniskarat_id,
                harga: formHarga.harga
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formHarga.id;
                response = await hargaService.updateHarga(payload);
            } else {
                response = await hargaService.storeHarga(payload);
            }

            toast.success(response?.message || 'Data harga berhasil disimpan.');
            closeModal();
            await fetchHarga();
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
            `Data Harga "${item.karat?.karat} K" "${item.harga}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await hargaService.deleteHarga({ id: item.id });
                toast.success('Harga berhasil dihapus.');
                await fetchHarga();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredHarga = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return harga.value.filter(item => {
            // 🌟 PERBAIKAN: Konversi integer harga ke string terlebih dahulu
            const hargaStr = String(item.harga || '');

            return (
                hargaStr.toLowerCase().includes(query) ||
                (item.karat?.karat || '').toLowerCase().includes(query) ||
                (item.jeniskarat?.jenis || '').toLowerCase().includes(query)
            );
        });
    });

    const paginatedHarga = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredHarga.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredHarga.value.length / itemsPerPage.value) || 1;
    });

    return {
        harga,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formHarga,

        fetchHarga,
        submitHarga,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedHarga,
        totalPages,
    }
}
