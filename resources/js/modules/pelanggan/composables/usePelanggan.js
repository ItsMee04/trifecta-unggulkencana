import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { pelangganService } from '../services/pelangganService';

const toast = useToast();
const pelanggan = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formPelanggan = reactive({
    id: null,
    nama: '',
    kontak: '',
    alamat: '',
    poin: '',
    tanggal: ''
});

export function usePelanggan() {

    const fetchPelanggan = async () => {
        isLoading.value = true;
        try {
            const response = await pelangganService.getPelanggan();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                pelanggan.value = response.data;
            } else if (Array.isArray(response)) {
                pelanggan.value = response;
            } else {
                pelanggan.value = [];
            }
        } catch (error) {
            pelanggan.value = [];
            toast.error('Gagal mengambil data pelanggan.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formPelanggan.nama) {
            errors.value.nama = 'Nama diskon wajib diisi.';
        }
        if (!formPelanggan.kontak) {
            errors.value.kontak = 'Kontak wajib diisi.';
        }
        if (!formPelanggan.tanggal) {
            errors.value.tanggal = 'Tanggal wajib diisi.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formPelanggan.id = null;
        formPelanggan.nama = '';
        formPelanggan.kontak = '';
        formPelanggan.alamat = '';
        formPelanggan.poin = '';
        formPelanggan.tanggal = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formPelanggan.id = item.id;
        formPelanggan.nama = item.nama;
        formPelanggan.kontak = item.kontak;
        formPelanggan.alamat = item.alamat;
        formPelanggan.poin = item.poin;
        formPelanggan.tanggal = item.tanggal;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitPelanggan = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                nama: formPelanggan.nama,
                kontak: formPelanggan.kontak,
                alamat: formPelanggan.alamat,
                poin: formPelanggan.poin,
                tanggal: formPelanggan.tanggal,
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formPelanggan.id;
                response = await pelangganService.updatePelanggan(payload);
            } else {
                response = await pelangganService.storePelanggan(payload);
            }

            toast.success(response?.message || 'Data pelanggan berhasil disimpan.');
            closeModal();
            await fetchPelanggan();
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
            `Data Pelanggan "${item.nama}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await pelangganService.deletePelanggan({ id: item.id });
                toast.success('Pelanggan berhasil dihapus.');
                await fetchPelanggan();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredPelanggan = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return pelanggan.value.filter(item =>
            (item.nama || '').toLowerCase().includes(query)
        );
    });

    const paginatedPelanggan = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredPelanggan.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredPelanggan.value.length / itemsPerPage.value) || 1;
    });

    return {
        pelanggan,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formPelanggan,

        fetchPelanggan,
        submitPelanggan,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedPelanggan,
        totalPages,
    }
}
