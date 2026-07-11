import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast'
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { userService } from '../services/userService';

const toast = useToast();
const user = ref([])

const isLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isEdit = ref(false)
const isModalOpen = ref(false)
const errors = ref({})

const formUser = reactive({
    'id': null,
    'pegawai': '',
    'email': '',
    'password': '',
    'role_id': '',
})

export function useUser() {

    const fetchUser = async () => {
        isLoading.value = true;
        try {
            const response = await userService.getUser();

            if (response && Array.isArray(response.data)) {
                user.value = response.data;
            } else if (Array.isArray(response)) {
                user.value = response;
            } else {
                user.value = [];
            }
        } catch (error) {
            console.log('Error fetching user account:', error);
            user.value = [];
            toast.error('Gagal mengambil data user account');
        } finally {
            isLoading.value = false;
        }
    }

    const validateForm = () => {
        errors.value = {};

        // 1. Validasi Email: Wajib, Format Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formUser.email || formUser.email.trim() === '') {
            errors.value.email = 'Email wajib diisi.';
        } else if (!emailRegex.test(formUser.email)) {
            errors.value.email = 'Format email tidak valid.';
        }

        // 2. Validasi Password: Wajib, Minimal 6 Karakter
        // Catatan: Jika ini kondisi EDIT, mungkin Anda ingin membuat password opsional (hanya diisi jika ingin ganti).
        // Tapi berdasarkan permintaan Anda, ini adalah validasi wajib:
        if (!formUser.password || formUser.password.trim() === '') {
            errors.value.password = 'Password wajib diisi.';
        } else if (formUser.password.length < 6) {
            errors.value.password = 'Password minimal harus 6 karakter.';
        }

        // 3. Validasi Role: Harus dipilih (Cek ID yang valid)
        // Pastikan menggunakan variabel form yang konsisten (formUser.role_id)
        if (
            formUser.role_id === null ||
            formUser.role_id === undefined ||
            formUser.role_id === ''
        ) {
            errors.value.role_id = 'Role wajib dipilih.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const handleEdit = (item) => {
        isEdit.value = true;

        // Mapping data item ke form
        formUser.id = item.id;
        formUser.pegawai = item.pegawai.nama;
        formUser.email = item.email;
        formUser.password = item.password;
        formUser.role_id = item.role_id;

        errors.value = {};
        isModalOpen.value = true;
    };

    const submitUser = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            // Buat objek FormData sebagai payload tunggal
            const payload = {
                'email': formUser.email,
                'password': formUser.password,
                'role_id': formUser.role_id
            }

            let response;

            if (isEdit.value) {
                // Jika EDIT, selipkan ID pegawai ke dalam payload agar backend tahu data mana yang diubah
                payload.id = formUser.id;

                // Oper payload utuh ke fungsi update (yang di dalamnya menjalankan POST murni)
                response = await userService.updateUser(payload);
            }

            toast.success('Data user account berhasil disimpan!');
            closeModal();
            fetchUser(); // Refresh data pada tabel Anda

        } catch (error) {
            // 4. Tangani Error dari Axios (400, 422, 500)
            if (error.response) {
                const { data, status } = error.response;

                // Jika error validasi (Laravel 422)
                if (status === 422 && data.errors) {
                    errors.value = data.errors;
                }
                // Jika ada pesan error custom (seperti 400 "Password tidak boleh sama")
                else if (data.message) {
                    toast.error(data.message);
                }
                // Fallback untuk error lain
                else {
                    toast.error('Terjadi kesalahan saat menyimpan data.');
                }
            } else {
                toast.error('Terjadi kesalahan koneksi ke server.');
            }
        } finally {
            isLoading.value = false;
        }
    };

    // Jauh lebih ringkas tanpa mengotori shared state!
    const handleDelete = async (item) => {
        const confirm = await confirmDelete(
            'Apakah Anda yakin?',
            `Data User Acount "${item.pegawai.nama}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await userService.deleteUser({ id: item.id });
                toast.success('User Acount berhasil dihapus.');
                await fetchUser();
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
    };

    const filteredUser = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return user.value.filter(item =>
            (item.email || '').toLowerCase().includes(query) ||
            (item.pegawai.nip || '').toLowerCase().includes(query) ||
            (item.pegawai.nama || '').toLowerCase().includes(query)
        );
    });

    const paginatedUser = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredUser.value.slice(start, start + itemsPerPage.value);
    })

    const totalPages = computed(() => {
        return Math.ceil(filteredUser.value.length / itemsPerPage.value) || 1;
    })

    return {
        user,
        formUser,
        fetchUser,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        paginatedUser,
        totalPages,
        isEdit,
        isModalOpen,
        closeModal,
        handleEdit,
        handleDelete,
        submitUser,
        errors,
    }
}
