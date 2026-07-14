import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { mutasisaldoService } from '../services/mutasisaldoService';

const toast = useToast();
const mutasisaldo = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const errors = ref({});

const formMutasiSaldo = reactive({
    id: null,
    saldo_id: null,
    tanggal:'',
    keterangan:'',
    jenis:'',
    jumlah:''
});

export function useMutasiSaldo() {

    const fetchMutasiSaldo = async () => {
        isLoading.value = true;
        try {
            const response = await mutasisaldoService.getMutasiSaldo();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                mutasisaldo.value = response.data;
            } else if (Array.isArray(response)) {
                mutasisaldo.value = response;
            } else {
                mutasisaldo.value = [];
            }
        } catch (error) {
            mutasisaldo.value = [];
            toast.error('Gagal mengambil data mutasi saldo.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};

        if (
            formMutasiSaldo.saldo_id === null ||
            formMutasiSaldo.saldo_id === undefined ||
            formMutasiSaldo.saldo_id === ''
        ) {
            errors.value.saldo_id = 'Buku Rekening / Saldo wajib dipilih.';
        }

        if (!formMutasiSaldo.tanggal) {
            errors.value.tanggal = 'Tanggal wajib diisi.';
        }

        if (!formMutasiSaldo.keterangan?.trim()) {
            errors.value.keterangan = 'Keterangan wajib diisi.';
        }

        if (!formMutasiSaldo.jenis?.trim()) {
            errors.value.jenis = 'Jenis wajib dipilih.';
        }

        if (!formMutasiSaldo.jumlah) {
            errors.value.jumlah = 'Jumlah wajib diisi.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formMutasiSaldo.id = null;
        formMutasiSaldo.saldo_id = null;
        formMutasiSaldo.tanggal = '';
        formMutasiSaldo.keterangan = '';
        formMutasiSaldo.jenis = '';
        formMutasiSaldo.jumlah = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formMutasiSaldo.id = item.id;
        formMutasiSaldo.saldo_id = item.saldo_id;
        formMutasiSaldo.tanggal = item.tanggal;
        formMutasiSaldo.keterangan = item.keterangan;
        formMutasiSaldo.jenis = item.jenis;
        formMutasiSaldo.jumlah = item.jumlah;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitMutasiSaldo = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                saldo_id: formMutasiSaldo.saldo_id,
                tanggal: formMutasiSaldo.tanggal,
                keterangan: formMutasiSaldo.keterangan,
                jenis: formMutasiSaldo.jenis,
                jumlah: formMutasiSaldo.jumlah
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formMutasiSaldo.id;
                response = await mutasisaldoService.updateMutasiSaldo(payload);
            } else {
                response = await mutasisaldoService.storeMutasiSaldo(payload);
            }

            toast.success(response?.message || 'Data mutasi saldo berhasil disimpan.');
            closeModal();
            await fetchMutasiSaldo();
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
            `Data Mutasi Saldo "${item.jumlah}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await mutasisaldoService.deleteMutasiSaldo({ id: item.id });
                toast.success('Mutasi Saldo berhasil dihapus.');
                await fetchMutasiSaldo();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    // ─── PAGINATION LOGIC ───
    const filteredMutasiSaldo = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return mutasisaldo.value.filter(item =>
            (item.saldo?.saldo_id || '').toLowerCase().includes(query) ||
            (item.tanggal || '').toLowerCase().includes(query) ||
            (item.keterangan || '').toLowerCase().includes(query) ||
            (item.jenis || '').toLowerCase().includes(query) ||
            String(item.jumlah ?? '').includes(query)
        );
    });

    const paginatedMutasiSaldo = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredMutasiSaldo.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredMutasiSaldo.value.length / itemsPerPage.value) || 1;
    });

    return {
        mutasisaldo,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formMutasiSaldo,

        fetchMutasiSaldo,
        submitMutasiSaldo,
        handleCreate,
        handleEdit,
        handleDelete,
        paginatedMutasiSaldo,
        totalPages,
    }
}
