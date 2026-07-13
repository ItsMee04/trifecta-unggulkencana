import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast'
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { produkService } from '../services/produkService';

const toast = useToast();
const produk = ref([])

const isLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isEdit = ref(false)
const isModalOpen = ref(false)
const errors = ref({})
const imagePreview = ref(null);

const formProduk = reactive({
    'id': null,
    'nama': '',
    'berat': '',
    'jenisproduk_id': null,
    'karat_id': null,
    'jeniskarat_id': null,
    'lingkar': '',
    'panjang': '',
    'harga_id': null,
    'keterangan': '',
    'image': null
})


export function useProduk() {

    const fetchProduk = async () => {
        isLoading.value = true;
        try {
            const response = await produkService.getProduk();

            if (response && Array.isArray(response.data)) {
                produk.value = response.data;
            } else if (Array.isArray(response)) {
                produk.value = response;
            } else {
                produk.value = [];
            }
        } catch (error) {
            console.log('Error fetching produk:', error);
            produk.value = [];
            toast.error('Gagal mengambil data produk');
        } finally {
            isLoading.value = false;
        }
    }

    const validateForm = () => {
        errors.value = {};

        //
        if (!formProduk.nama?.trim()) {
            errors.value.nama = 'Nama produk wajib diisi.';
        }

        // 1. Cek apakah berat kosong (null, undefined, atau string kosong)
        if (formProduk.berat === null || formProduk.berat === undefined || String(formProduk.berat).trim() === '') {
            errors.value.berat = 'Berat produk wajib diisi.';
        }
        // 2. Cek apakah format desimalnya valid (Contoh: 12.5, 0.75, 100)
        else {
            // Regex ini menerima angka bulat biasa ATAU angka desimal dengan pemisah titik (.)
            const decimalRegex = /^\d+(\.\d+)?$/;

            if (!decimalRegex.test(String(formProduk.berat))) {
                errors.value.berat = 'Format berat harus berupa angka/desimal valid (gunakan titik untuk koma, contoh: 2.5).';
            }
            // 3. Opsional: Cek jika berat tidak boleh 0 atau minus
            else if (parseFloat(formProduk.berat) <= 0) {
                errors.value.berat = 'Berat produk harus lebih besar dari 0.';
            }
        }

        // jenis produk (Combobox)
        if (
            formProduk.jenisproduk_id === null ||
            formProduk.jenisproduk_id === undefined ||
            formProduk.jenisproduk_id === ''
        ) {
            errors.value.jenisproduk_id = 'Jenis Produk wajib dipilih.';
        }

        // karat (Combobox)
        if (
            formProduk.karat_id === null ||
            formProduk.karat_id === undefined ||
            formProduk.karat_id === ''
        ) {
            errors.value.karat_id = 'Karat wajib dipilih.';
        }

        // karat (Combobox)
        if (
            formProduk.jeniskarat_id === null ||
            formProduk.jeniskarat_id === undefined ||
            formProduk.jeniskarat_id === ''
        ) {
            errors.value.jeniskarat_id = 'Jenis Karat wajib dipilih.';
        }

        // Validasi Foto
        if (formProduk.image) {
            const file = formProduk.image;

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
        formProduk.id = null;
        formProduk.nama = '';
        formProduk.berat = '';
        formProduk.jenisproduk_id = null;
        formProduk.karat_id = null;
        formProduk.jeniskarat_id = null;
        formProduk.lingkar = '';
        formProduk.panjang = '';
        formProduk.harga_id = null;
        formProduk.keterangan = '';
        formProduk.image = null;
        errors.value = {};
        isModalOpen.value = true;
    }

    const handleEdit = (item) => {
        isEdit.value = true;

        // Mapping data item ke form
        formProduk.id = item.id;
        formProduk.nama = item.nama;
        formProduk.berat = item.berat;
        formProduk.jenisproduk_id = item.jenisproduk_id;
        formProduk.karat_id = item.karat_id;
        formProduk.jeniskarat_id = item.jeniskarat_id;
        formProduk.lingkar = item.lingkar;
        formProduk.panjang = item.panjang;
        formProduk.harga_id = item.harga_id;
        formProduk.keterangan = item.keterangan;
        formProduk.image = item.image; // Menyimpan nama file / path lama

        if (item.image) {
            const storageUrl = import.meta.env.VITE_STORAGE_URL;
            imagePreview.value = `${storageUrl}/${item.image}`;
        } else {
            imagePreview.value = null;
        }

        errors.value = {};
        isModalOpen.value = true;
    };

    const submitProduk = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            // Buat objek FormData sebagai payload tunggal
            const payload = new FormData();

            payload.append('nama', formProduk.nama);
            payload.append('berat', formProduk.berat);
            payload.append('jenisproduk_id', formProduk.jenisproduk_id);
            payload.append('karat_id', formProduk.karat_id);
            payload.append('jeniskarat_id', formProduk.jeniskarat_id);
            payload.append('lingkar', formProduk.lingkar);
            payload.append('panjang', formProduk.panjang);
            payload.append('harga_id', formProduk.harga_id);
            payload.append('keterangan', formProduk.keterangan);

            // Masukkan file gambar jika ada berkas baru yang diunggah
            // Cari baris ini di submit produk Anda, lalu ubah kondisinya:
            if (formProduk.image && formProduk.image instanceof File) {
                payload.append('image', formProduk.image);
            }

            let response;

            if (isEdit.value) {
                payload.append('id', formProduk.id);

                // Karena service sudah mengembalikan response.data,
                // maka isi variabel 'response' di bawah ini adalah { success: true, message: '...', data: {...} }
                response = await produkService.updateProduk(payload);
            } else {
                // Oper payload utuh ke fungsi store (POST murni)
                response = await produkService.storeProduk(payload);
            }

            toast.success('Data produk berhasil disimpan!');
            closeModal();
            fetchProduk(); // Refresh data pada tabel Anda

        } catch (error) {
            if (error.response && error.response.data.errors) {
                errors.value = error.response.data.errors;
            } else {
                toast.error('Terjadi kesalahan saat menyimpan data.');
                console.log(error)
            }
        } finally {
            isLoading.value = false;
        }
    };

    // Jauh lebih ringkas tanpa mengotori shared state!
    const handleDelete = async (item) => {
        const confirm = await confirmDelete(
            'Apakah Anda yakin?',
            `Data produk "${item.nama}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await produkService.deleteProduk({ id: item.id });
                toast.success('Produk berhasil dihapus.');
                await fetchProduk();
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

    const filteredProduk = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return produk.value.filter(item =>
            (item.kodeproduk || '').toLowerCase().includes(query) ||
            (item.nama || '').toLowerCase().includes(query)
        );
    });

    const paginatedProduk = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredProduk.value.slice(start, start + itemsPerPage.value);
    })

    const totalPages = computed(() => {
        return Math.ceil(filteredProduk.value.length / itemsPerPage.value) || 1;
    })

    return {
        produk,
        formProduk,
        fetchProduk,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        paginatedProduk,
        totalPages,
        isEdit,
        isModalOpen,
        closeModal,
        handleCreate,
        handleEdit,
        handleDelete,
        submitProduk,
        imagePreview,
        errors,
    }
}
