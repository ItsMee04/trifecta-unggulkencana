import { ref } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { permissionService } from '../services/permissionService';

// 🌟 PERBAIKAN: Pindahkan ke luar fungsi agar menjadi Shared/Global State
const permissions = ref([]);
const loadingPermission = ref(false);

export function usePermission() {
    const toast = useToast(); // Toast tidak masalah di dalam

    const fetchPermissions = async (payload) => {
        loadingPermission.value = true;
        try {
            const response = await permissionService.getPermission(payload);
            if (response && response.data) {
                permissions.value = response.data.data || response.data || [];
            } else if (Array.isArray(response)) {
                permissions.value = response;
            } else {
                permissions.value = [];
            }
        } catch (error) {
            toast.error('Gagal memuat data hak akses.');
            console.error('Error fetch permissions:', error);
            permissions.value = [];
        } finally {
            loadingPermission.value = false;
        }
    };

    const submitBulkPermissions = async (payload) => {
        loadingPermission.value = true;
        try {
            await permissionService.updatePermission(payload);

            // Perbarui state utama jika sukses
            permissions.value = JSON.parse(JSON.stringify(payload.permissions));

            toast.success('Hak akses berhasil diperbarui.');
            return true;
        } catch (error) {
            toast.error('Gagal menyimpan perubahan hak akses.');
            console.error('Error submit bulk permissions:', error);
            return false;
        } finally {
            loadingPermission.value = false;
        }
    };

    return {
        permissions,
        loadingPermission,
        fetchPermissions,
        submitBulkPermissions
    };
}
