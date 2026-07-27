import { ref, onMounted, reactive } from "vue";
import { useToast } from '../../../utilities/toast/toast';
import { laporanService } from "../services/laporanService";

const errors = ref('')
const formLaporan = reactive({
    tanggaldari: '',
    tanggalsampai: ''
});
const toast = useToast();

export function useLaporan() {

    const validateForm = () => {
        errors.value = {}; // Reset error

        // 2. Validasi Tanggal (Wajib diisi)
        if (!formLaporan.tanggaldari) {
            errors.value.tanggaldari = 'Periode Dari harus dipilih.';
            toast.error('Periode Dari harus dipilih.')
        }

        if (!formLaporan.tanggalsampai) {
            errors.value.tanggalsampai = 'Periode Sampai harus dipilih.';
            toast.error('Periode Sampai harus dipilih.')
        }

        return Object.keys(errors.value).length === 0;
    };

    const cetakLaporanPenjualan = async () => {
        if (!validateForm()) return false;

        try {
            // 1. Ambil nilai tanggal dari reactive form
            const tanggalAwal = formLaporan.tanggaldari;
            const tanggalAkhir = formLaporan.tanggalsampai;

            // 2. Susun Query Parameters
            const params = new URLSearchParams({
                tanggal_awal: tanggalAwal,
                tanggal_akhir: tanggalAkhir
            });

            // 3. Buat URL dengan query string
            // Contoh hasil: /CetakLaporanPenjualan?tanggal_awal=2026-04-01&tanggal_akhir=2026-07-26
            const previewUrl = `/CetakLaporanPenjualan?${params.toString()}`;

            // 4. Buka di tab baru
            window.open(previewUrl, '_blank');

        } catch (e) {
            console.error(e);
            toast.error('Gagal mencetak laporan penjualan');
        }
    }

    const cetakLaporanPembelian = async () => {
        if (!validateForm()) return false;

        try {
            // 1. Ambil nilai tanggal dari reactive form
            const tanggalAwal = formLaporan.tanggaldari;
            const tanggalAkhir = formLaporan.tanggalsampai;

            // 2. Susun Query Parameters
            const params = new URLSearchParams({
                tanggal_awal: tanggalAwal,
                tanggal_akhir: tanggalAkhir
            });

            // 3. Buat URL dengan query string
            // Contoh hasil: /CetakLaporanPembelian?tanggal_awal=2026-04-01&tanggal_akhir=2026-07-26
            const previewUrl = `/CetakLaporanPembelian?${params.toString()}`;

            // 4. Buka di tab baru
            window.open(previewUrl, '_blank');

        } catch (e) {
            console.error(e);
            toast.error('Gagal mencetak laporan pembelian');
        }
    }

    const cetakLaporanOfftake = async () => {
        if (!validateForm()) return false;

        try {
            // 1. Ambil nilai tanggal dari reactive form
            const tanggalAwal = formLaporan.tanggaldari;
            const tanggalAkhir = formLaporan.tanggalsampai;

            // 2. Susun Query Parameters
            const params = new URLSearchParams({
                tanggal_awal: tanggalAwal,
                tanggal_akhir: tanggalAkhir
            });

            // 3. Buat URL dengan query string
            // Contoh hasil: /CetakLaporanOfftake?tanggal_awal=2026-04-01&tanggal_akhir=2026-07-26
            const previewUrl = `/CetakLaporanOfftake?${params.toString()}`;

            // 4. Buka di tab baru
            window.open(previewUrl, '_blank');

        } catch (e) {
            console.error(e);
            toast.error('Gagal mencetak laporan offtake');
        }
    }

    const cetakLaporanPerbaikan = async () => {
        if (!validateForm()) return false;

        try {
            // 1. Ambil nilai tanggal dari reactive form
            const tanggalAwal = formLaporan.tanggaldari;
            const tanggalAkhir = formLaporan.tanggalsampai;

            // 2. Susun Query Parameters
            const params = new URLSearchParams({
                tanggal_awal: tanggalAwal,
                tanggal_akhir: tanggalAkhir
            });

            // 3. Buat URL dengan query string
            // Contoh hasil: /CetakLaporanPerbaikan?tanggal_awal=2026-04-01&tanggal_akhir=2026-07-26
            const previewUrl = `/CetakLaporanPerbaikan?${params.toString()}`;

            // 4. Buka di tab baru
            window.open(previewUrl, '_blank');

        } catch (e) {
            console.error(e);
            toast.error('Gagal mencetak laporan perbaikan');
        }
    }

    const cetakLaporanStokBulanan = async () => {
        if (!validateForm()) return false;

        const payload = {
            periodedari: formLaporan.tanggaldari,
            periodesampai: formLaporan.tanggalsampai
        }

        try {
            const { url } = await laporanService.cetakLaporanStokBulanan(payload)
            window.open(url, '_blank')
        } catch (e) {
            console.log(e)
            toast.error('Gagal mencetak laporan stok bulanan')
        }
    }

    const cetakLaporanMutasiSaldo = async () => {
        if (!validateForm()) return false;

        const payload = {
            periodedari: formLaporan.tanggaldari,
            periodesampai: formLaporan.tanggalsampai
        }

        try {
            const { url } = await laporanService.cetakLaporanMutasiSaldo(payload)
            window.open(url, '_blank')
        } catch (e) {
            console.log(e)
            toast.error('Gagal mencetak laporan mutasi saldo')
        }
    }

    const cetakLaporanNampan = async () => {
        if (!validateForm()) return false;

        const payload = {
            periodedari: formLaporan.tanggaldari,
            periodesampai: formLaporan.tanggalsampai
        }

        try {
            const { url } = await laporanService.cetakLaporanNampan(payload)
            window.open(url, '_blank')
        } catch (e) {
            console.log(e)
            toast.error('Gagal mencetak laporan nampan')
        }
    }

    const cetakLaporanProduk = async () => {

        try {
            const { url } = await laporanService.cetakLaporanProduk()
            window.open(url, '_blank')
        } catch (e) {
            console.log(e)
            toast.error('Gagal mencetak laporan produk')
        }
    }

    const cetakLaporanNampanPerBaki = async () => {
        if (!validateForm()) return false;

        const payload = {
            periodedari: formLaporan.tanggaldari,
        }

        try {
            const { url } = await laporanService.cetakLaporanNampanPerBaki(payload)
            window.open(url, '_blank')
        } catch (e) {
            console.log(e)
            toast.error('Gagal mencetak laporan nampan per baki')
        }
    }

    return {
        errors,
        formLaporan,
        cetakLaporanPenjualan,
        cetakLaporanPembelian,
        cetakLaporanOfftake,
        cetakLaporanPerbaikan,
        cetakLaporanStokBulanan,
        cetakLaporanMutasiSaldo,
        cetakLaporanNampan,
        cetakLaporanProduk,
        cetakLaporanNampanPerBaki
    }
}
