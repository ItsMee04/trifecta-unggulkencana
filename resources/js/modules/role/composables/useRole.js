import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';

import { roleService } from '../services/roleService';

const toast = useToast();
const role = ref([]);

const isLoading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isEdit = ref(false);
const isModalOpen = ref(false);
const isPermissionModalOpen = ref(false);
const errors = ref({});

const formRole = reactive({
    id: null,
    role: '',
});

export function useRole() {

    const fetchRole = async () => {
        isLoading.value = true;
        try {
            const response = await roleService.getRole();

            // PERUBAHAN DI SINI: Cek apakah response.data yang merupakan array, atau response itu sendiri
            if (response && Array.isArray(response.data)) {
                role.value = response.data;
            } else if (Array.isArray(response)) {
                role.value = response;
            } else {
                role.value = [];
            }
        } catch (error) {
            console.error('Error fetching role:', error);
            role.value = [];
            toast.error('Gagal mengambil data role.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
        errors.value = {};
        if (!formRole.role) {
            errors.value.role = 'Nama role wajib diisi.';
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCreate = () => {
        isEdit.value = false;
        formRole.id = null;
        formRole.role = '';
        errors.value = {};
        isModalOpen.value = true;
    };

    const handleEdit = (item) => {
        isEdit.value = true;
        formRole.id = item.id;
        formRole.role = item.role;
        errors.value = {};
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
        errors.value = {};
    };

    const submitRole = async () => {
        if (!validateForm()) return false;
        isLoading.value = true;

        try {
            const payload = {
                role: formRole.role,
            };

            // KUNCI PERBAIKAN: Deklarasikan variabel response di sini
            let response;

            if (isEdit.value) {
                payload.id = formRole.id;
                response = await roleService.updateRole(payload);
            } else {
                response = await roleService.storeRole(payload);
            }

            toast.success(response?.message || 'Data role berhasil disimpan.');
            closeModal();
            await fetchRole();
            return true;
        } catch (error) {
            console.error('Error submitting role:', error);
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
            `Data Role "${item.role}" yang dihapus tidak dapat dikembalikan!`
        );

        // Jika user mengklik "Ya, Hapus!" (Promise mengembalikan true)
        if (confirm) {
            isLoading.value = true;
            try {
                await roleService.deleteRole({ id: item.id });
                toast.success('Role berhasil dihapus.');
                await fetchRole();
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Gagal menghapus data.';
                toast.error(errorMessage);
            } finally {
                isLoading.value = false;
            }
        }
    };

    const handlePermission = (item) => {
        formRole.id = item.id;
        formRole.role = item.role;
        isPermissionModalOpen.value = true;
    };

    // ─── PAGINATION LOGIC ───
    const filteredRole = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return role.value.filter(item => (item.role || '').toLowerCase().includes(query));
    });

    const paginatedRole = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredRole.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
        // KUNCI: Tambahkan .value pada itemsPerPage
        return Math.ceil(filteredRole.value.length / itemsPerPage.value) || 1;
    });

    return {
        role,
        isLoading,
        searchQuery,
        currentPage,
        itemsPerPage,
        isEdit,
        isModalOpen,
        closeModal,
        errors,
        formRole,

        fetchRole,
        submitRole,
        handleCreate,
        handleEdit,
        handleDelete,
        isPermissionModalOpen,
        handlePermission,
        paginatedRole,
        totalPages,
    }
}
