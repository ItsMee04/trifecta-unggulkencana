import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast'
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { pegawaiService } from '../services/pegawaiService';
import { useAuthentication } from '../../authentication/composables/useAuthentication';

const toast = useToast();
const pegawai = ref([])

const isLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isEdit = ref(false)
const isModalOpen = ref(false)
const errors = ref({})
const imagePreview = ref(null);

const formPegawai = reactive({
    'id': null,
    'nip': '',
    'nama': '',
    'alamat': '',
    'kontak': '',
    'jabatan_id': null,
    'image': null
})


export function usePegawai() {

    const { user, updateCurrentUser } = useAuthentication();

    const fetchPegawai = async () => {
        isLoading.value = true;
        try {
            const response = await pegawaiService.getPegawai();

            if (response && Array.isArray(response.data)) {
                pegawai.value = response.data;
            } else if (Array.isArray(response)) {
                pegawai.value = response;
            } else {
                pegawai.value = [];
            }
        } catch (error) {
            console.log('Error fetching pegawai:', error);
            pegawai.value = [];
            toast.error('Gagal mengambil data pegawai');
        } finally {
            isLoading.value = false;
        }
    }

    const validateForm = () => {
        errors.value = {};

        // NIP
        if (!formPegawai.nip?.trim()) {
            errors.value.nip = 'NIP wajib diisi.';
        }

        // Nama
        if (!formPegawai.nama?.trim()) {
            errors.value.nama = 'Nama wajib diisi.';
        }

        // Jabatan (Combobox)
        if (
            formPegawai.jabatan_id === null ||
            formPegawai.jabatan_id === undefined ||
            formPegawai.jabatan_id === ''
        ) {
            errors.value.jabatan_id = 'Jabatan wajib dipilih.';
        }

        // Validasi Foto
        if (formPegawai.image) {
            const file = formPegawai.image;

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
        formPegawai.id = null;
        formPegawai.nip = '';
        formPegawai.nama = '';
        formPegawai.alamat = '';
        formPegawai.kontak = '';
        formPegawai.jabatan_id = null;
        formPegawai.image = null;
        errors.value = {};
        isModalOpen.value = true;
    }

    const handleEdit = (item) => {
        isEdit.value = true;

        // Mapping data item ke form
        formPegawai.id = item.id;
        formPegawai.nip = item.nip;
        formPegawai.nama = item.nama;
        formPegawai.alamat = item.alamat;
        formPegawai.kontak = item.kontak;
        formPegawai.jabatan_id = item.jabatan_id;
        formPegawai.image = item.image; // Menyimpan nama file / path lama

        if (item.image) {
            const storageUrl = import.meta.env.VITE_STORAGE_URL;
            imagePreview.value = `${storageUrl}/${item.image}`;
        } else {
            imagePreview.value = null;
        }

        errors.value = {};
        isModalOpen.value = true;
    };

    const submitPegawai = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            // Buat objek FormData sebagai payload tunggal
            const payload = new FormData();

            payload.append('nip', formPegawai.nip);
            payload.append('nama', formPegawai.nama);
            payload.append('alamat', formPegawai.alamat);
            payload.append('kontak', formPegawai.kontak);
            payload.append('jabatan_id', formPegawai.jabatan_id);

            // Masukkan file gambar jika ada berkas baru yang diunggah
            // Cari baris ini di submitPegawai Anda, lalu ubah kondisinya:
            if (formPegawai.image && formPegawai.image instanceof File) {
                payload.append('image', formPegawai.image);
            }

            let response;

            if (isEdit.value) {
                payload.append('id', formPegawai.id);

                // Karena service sudah mengembalikan response.data,
                // maka isi variabel 'response' di bawah ini adalah { success: true, message: '...', data: {...} }
                response = await pegawaiService.updatePegawai(payload);

                // 🌟 PERBAIKAN: Langsung cek response.success (tanpa .data)
                if (response?.success && formPegawai.id == user.value?.id) {

                    // 🌟 PERBAIKAN: Langsung ambil dari response.data sesuai JSON Laravel
                    const updatedData = response.data;

                    if (updatedData) {
                        const newUserState = {
                            ...user.value,
                            nama: updatedData.nama || user.value.nama,
                            avatar: updatedData.image || user.value.avatar
                        };

                        // Simpan ke localStorage & perbarui reactive state global
                        updateCurrentUser(newUserState);
                    }
                }
            } else {
                // Oper payload utuh ke fungsi store (POST murni)
                response = await pegawaiService.storePegawai(payload);
            }

            toast.success('Data pegawai berhasil disimpan!');
            closeModal();
            fetchPegawai(); // Refresh data pada tabel Anda

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
            `Data Pegawai "${item.nama}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await pegawaiService.deletePegawai({ id: item.id });
                toast.success('Pegawai berhasil dihapus.');
                await fetchPegawai();
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

    const filteredPegawai = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return pegawai.value.filter(item =>
            (item.nip || '').toLowerCase().includes(query) ||
            (item.nama || '').toLowerCase().includes(query)
        );
    });

    const paginatedPegawai = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredPegawai.value.slice(start, start + itemsPerPage.value);
    })

    const totalPages = computed(() => {
        return Math.ceil(filteredPegawai.value.length / itemsPerPage.value) || 1;
    })

    return {
        pegawai,
        formPegawai,
        fetchPegawai,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        paginatedPegawai,
        totalPages,
        isEdit,
        isModalOpen,
        closeModal,
        handleCreate,
        handleEdit,
        handleDelete,
        submitPegawai,
        imagePreview,
        errors,
    }
}
