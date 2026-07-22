import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast'
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { jenisprodukService } from '../services/jenisprodukService';

const toast = useToast();
const jenisproduk = ref([])

const isLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isEdit = ref(false)
const isModalOpen = ref(false)
const errors = ref({})
const imagePreview = ref(null);

const formJenisProduk = reactive({
    'id': null,
    'jenis': '',
    'urutan': '',
    'image': null
})


export function useJenisProduk() {

    const fetchJenisProduk = async () => {
        isLoading.value = true;
        try {
            const response = await jenisprodukService.getJenisProduk();

            if (response && Array.isArray(response.data)) {
                jenisproduk.value = response.data;
            } else if (Array.isArray(response)) {
                jenisproduk.value = response;
            } else {
                jenisproduk.value = [];
            }
        } catch (error) {
            jenisproduk.value = [];
            toast.error('Gagal mengambil data jenis produk');
        } finally {
            isLoading.value = false;
        }
    }

    const validateForm = () => {
        errors.value = {};

        // JENIS
        if (!formJenisProduk.jenis?.trim()) {
            errors.value.jenis = 'Jenis Produk wajib diisi.';
        }

        //
        if (!formJenisProduk.urutan) {
            errors.value.urutan = 'Urutan wajib diisi.';
        }

        // Validasi Foto
        if (formJenisProduk.image) {
            const file = formJenisProduk.image;

            // 🌟 KUNCI UTAMA: Validasi ukuran & tipe HANYA JIKA objek ini benar-benar sebuah File
            // Jika tipenya String (nama file lama saat edit), lewati validasi ini.
            if (file instanceof File) {

                // Maksimal 1 MB
                const maxSize = 1024 * 1024;
                if (file.size > maxSize) {
                    errors.value.image = 'Ukuran foto maksimal 1 MB.';
                }

                // Format yang diizinkan
                const allowedTypes = [
                    'image/jpeg',
                    'image/jpg',
                    'image/png'
                ];
                if (!allowedTypes.includes(file.type)) {
                    errors.value.image = 'Format foto harus JPG, JPEG, atau PNG.';
                }
            }
        }

        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formJenisProduk.id = null;
        formJenisProduk.jenis = '';
        formJenisProduk.urutan = '';
        formJenisProduk.image = null;
        errors.value = {};
        isModalOpen.value = true;
    }

    const handleEdit = (item) => {
        isEdit.value = true;

        // Mapping data item ke form
        formJenisProduk.id = item.id;
        formJenisProduk.jenis = item.jenis;
        formJenisProduk.urutan = item.urutan;
        formJenisProduk.image = item.image; // Menyimpan nama file / path lama

        if (item.image) {
            const storageUrl = import.meta.env.VITE_JENIS_PRODUK_URL;
            imagePreview.value = `${storageUrl}/${item.image}`;
        } else {
            imagePreview.value = null;
        }

        errors.value = {};
        isModalOpen.value = true;
    };

    const submitJenisProduk = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            // Buat objek FormData sebagai payload tunggal
            const payload = new FormData();

            payload.append('jenis', formJenisProduk.jenis);
            payload.append('urutan', formJenisProduk.urutan);
            // Masukkan file gambar jika ada berkas baru yang diunggah
            // Cari baris ini di submitPegawai Anda, lalu ubah kondisinya:
            if (formJenisProduk.image && formJenisProduk.image instanceof File) {
                payload.append('image', formJenisProduk.image);
            }

            let response;

            if (isEdit.value) {
                payload.append('id', formJenisProduk.id);
                response = await jenisprodukService.updateJenisProduk(payload);
            } else {
                response = await jenisprodukService.storeJenisProduk(payload);
            }

            toast.success('Data jenis produk berhasil disimpan!');
            closeModal();
            fetchJenisProduk(); // Refresh data pada tabel Anda

        } catch (error) {
            if (error.response && error.response.data.errors) {
                errors.value = error.response.data.errors;
            } else {
                toast.error('Terjadi kesalahan saat menyimpan data.');
            }
        } finally {
            isLoading.value = false;
        }
    };

    // Jauh lebih ringkas tanpa mengotori shared state!
    const handleDelete = async (item) => {
        const confirm = await confirmDelete(
            'Apakah Anda yakin?',
            `Data Jenis Produk "${item.jenis}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await jenisprodukService.deleteJenisProduk({ id: item.id });
                toast.success('Jenis Produk berhasil dihapus.');
                await fetchJenisProduk();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
        imagePreview.value = null;
    };

    const filteredJenisProduk = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return jenisproduk.value.filter(item =>
            (item.jenis || '').toLowerCase().includes(query)
        );
    });

    const paginatedJenisProduk = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredJenisProduk.value.slice(start, start + itemsPerPage.value);
    })

    const totalPages = computed(() => {
        return Math.ceil(filteredJenisProduk.value.length / itemsPerPage.value) || 1;
    })

    return {
        jenisproduk,
        formJenisProduk,
        fetchJenisProduk,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        paginatedJenisProduk,
        totalPages,
        isEdit,
        isModalOpen,
        closeModal,
        handleCreate,
        handleEdit,
        handleDelete,
        submitJenisProduk,
        imagePreview,
        errors,
    }
}
