import { ref, computed, reactive } from 'vue';
import { useToast } from '../../../utilities/toast/toast';
import { confirmDelete } from '../../../utilities/confirm/confirm';
import { showPaymentSuccess } from '../../../utilities/confirm/PaymentsSuccessModal';

// SERVICE INSTANCES
import { offtakeService } from '../services/offtakeService';
import { suplierService } from '../../../modules/suplier/services/suplierService';
import { nampanprodukService } from '../../nampanproduk/services/nampanprodukService';
import { transaksiService } from '../../transaksi/services/transaksiService';

const STORAGE_URL = import.meta.env.VITE_PRODUK_URL;

// --- SHARED STATE GLOBAL (SINGLETON) ---
const offtake = ref([]);
const offtakeDetail = ref([]);
const suplierList = ref([]);
const produk = ref([]);

// 💡 UBAH / PASTIKAN STATE KONSISTEN DENGAN VIEW PARENT
const isSubmitting = ref(false);       // Loading khusus Overlay / Process Payment
const isLoadingTable = ref(false);    // Loading khusus area tabel
const isLoadingProduk = ref(false);   // Loading khusus modal produk
const isModalOpen = ref(false);

const searchProdukQuery = ref('');
const searchOfftakeDetailQuery = ref('');

const currentPageProduk = ref(1);
const currentPageOfftakeDetail = ref(1);
const itemsPerPageProduk = 10;
const itemsPerPageOfftakeDetail = 5;

const selectedProdukIds = ref([]);
const errors = ref({});

const formOfftake = reactive({
    id: null,
    kode: 'Memuat data...',
    suplier: null, // Berisi objek: { value, label, kontak }
    harga: '',
    keterangan: ''
});

export function useOfftake() {
    const toast = useToast();

    // --- A. FETCHERS (API CALLS) ---
    const fetchOfftakeDetail = async () => {
        isLoadingTable.value = true;
        try {
            const response = await offtakeService.getOfftakeDetail();
            offtakeDetail.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            offtakeDetail.value = [];
            toast.error("Gagal memuat detail offtake");
        } finally {
            isLoadingTable.value = false;
        }
    };

    const fetchSuplier = async () => {
        try {
            const response = await suplierService.getSuplier();
            const rawData = response.data || response || [];
            suplierList.value = rawData.map(item => ({
                value: item.id,
                label: (item.nama || '').toUpperCase(),
                kontak: item.kontak || item.hp || ''
            }));
        } catch (error) {
            toast.error("Gagal memuat data suplier");
        }
    };

    const fetchKodeTransaksi = async () => {
        formOfftake.kode = "Memuat data...";
        try {
            const response = await offtakeService.getKodeTransaksi();
            const data = response.data || response;
            if (offtakeDetail.value.length > 0) {
                formOfftake.kode = offtakeDetail.value[0].kode;
            } else if (data && data.kode) {
                formOfftake.kode = data.kode;
            }
        } catch (error) {
            toast.error("Gagal memuat nomor transaksi offtake");
            formOfftake.kode = "ERR-GENERATE";
        }
    };

    // --- B. COMPUTED LOGIC & FILTERS ---
    const totalProduk = computed(() => offtakeDetail.value.length);
    const totalBerat = computed(() => offtakeDetail.value.reduce((acc, item) => acc + Number(item.berat || 0), 0));
    const totalHargaSemua = computed(() => offtakeDetail.value.reduce((acc, item) => acc + Number(item.total || 0), 0));

    const filteredProduk = computed(() => {
        const query = searchProdukQuery.value.toLowerCase();
        return (produk.value || []).filter(item =>
            (item.produk?.kodeproduk ?? '').toLowerCase().includes(query) ||
            (item.produk?.nama ?? '').toLowerCase().includes(query)
        );
    });

    const totalPagesProduk = computed(() => Math.ceil(filteredProduk.value.length / itemsPerPageProduk) || 1);

    const paginatedProduk = computed(() => {
        const start = (currentPageProduk.value - 1) * itemsPerPageProduk;
        return filteredProduk.value.slice(start, start + itemsPerPageProduk);
    });

    const filteredOfftakeDetail = computed(() => {
        const query = searchOfftakeDetailQuery.value.toLowerCase();
        return (offtakeDetail.value || []).filter(item =>
            (item.produk?.kodeproduk ?? '').toLowerCase().includes(query) ||
            (item.produk?.nama ?? '').toLowerCase().includes(query)
        );
    });

    const totalPagesOfftakeDetail = computed(() => Math.ceil(filteredOfftakeDetail.value.length / itemsPerPageOfftakeDetail) || 1);

    const paginatedOfftakeDetail = computed(() => {
        const start = (currentPageOfftakeDetail.value - 1) * itemsPerPageOfftakeDetail;
        return filteredOfftakeDetail.value.slice(start, start + itemsPerPageOfftakeDetail);
    });

    const visiblePagesProduk = computed(() => {
        const total = totalPagesProduk.value;
        const current = currentPageProduk.value;
        const range = 5;
        let start = Math.max(1, current - Math.floor(range / 2));
        let end = Math.min(total, start + range - 1);
        if (end - start + 1 < range && start > 1) {
            start = Math.max(1, end - range + 1);
        }
        const pages = [];
        for (let i = start; i <= end; i++) { pages.push(i); }
        return pages;
    });

    // --- C. ACTIONS (MUTATIONS) ---
    const validateForm = () => {
        errors.value = {};

        if (!formOfftake.kode || formOfftake.kode.trim() === '' || formOfftake.kode === 'Memuat data...') {
            errors.value.kode = 'Kode transaksi belum valid.';
        }

        if (!formOfftake.suplier) {
            errors.value.suplier = 'Suplier wajib dipilih.';
        }

        if (!formOfftake.harga || formOfftake.harga === '') {
            errors.value.harga = 'Harga total wajib diisi.';
        } else if (isNaN(formOfftake.harga)) {
            errors.value.harga = 'Harga harus berupa angka.';
        }

        return Object.keys(errors.value).length === 0;
    };

    const handleNextOrder = async () => {
        formOfftake.id = null;
        formOfftake.suplier = null;
        formOfftake.harga = '';
        formOfftake.keterangan = '';
        offtakeDetail.value = [];

        await fetchKodeTransaksi();
        await fetchSuplier();

        toast.info("Siap untuk transaksi baru");
    };

    const handleCreate = async () => {
        errors.value = {};
        selectedProdukIds.value = [];
        searchProdukQuery.value = '';
        currentPageProduk.value = 1;

        isLoadingProduk.value = true;
        isModalOpen.value = true;

        try {
            const response = await nampanprodukService.getNampanProduk();
            produk.value = Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            produk.value = [];
            toast.error("Gagal mengambil data produk dari nampan");
        } finally {
            isLoadingProduk.value = false;
        }
    };

    const closeModal = () => {
        isModalOpen.value = false;
        selectedProdukIds.value = [];
    };

    const submitProduk = async () => {
        if (selectedProdukIds.value.length === 0) {
            toast.error("Silahkan pilih setidaknya satu produk!");
            return;
        }

        const items = filteredProduk.value
            .filter(item => selectedProdukIds.value.includes(item.id))
            .map(item => ({
                produk_id: item.produk_id,
                harga: item.produk?.harga?.harga || 0,
                berat: item.produk?.berat || 0,
                karat: item.produk?.karat?.karat || 0,
                lingkar: item.produk?.lingkar || 0,
                panjang: item.produk?.panjang || 0,
            }));

        const finalPayload = {
            kode: formOfftake.kode,
            items: items
        };

        isLoadingProduk.value = true;
        try {
            const response = await offtakeService.storeProdukToOfftakeDetail(finalPayload);
            toast.success(response.message || "Produk berhasil diproses");

            selectedProdukIds.value = [];
            closeModal();
            await fetchOfftakeDetail();
        } catch (error) {
            toast.error(error.response?.data?.message || "Terjadi kesalahan");
        } finally {
            isLoadingProduk.value = false;
        }
    };

    const handleDelete = async (item) => {
        const confirm = await confirmDelete(
            'Apakah Anda yakin?',
            `Data Produk "${item.produk?.nama}" akan dikeluarkan dari daftar offtake!`
        );

        if (confirm) {
            isLoadingTable.value = true;
            try {
                await offtakeService.batalOfftakeDetail({ id: item.id });
                toast.success('Produk berhasil dihapus.');

                await fetchOfftakeDetail();

                if (offtakeDetail.value.length === 0) {
                    await fetchKodeTransaksi();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Gagal menghapus data Produk.');
            } finally {
                isLoadingTable.value = false;
            }
        }
    };

    const paymentOfftake = async () => {
        // 🔒 Mencegah double click saat sedang memproses
        if (isSubmitting.value) return;

        if (!validateForm()) {
            if (errors.value.suplier) toast.error(errors.value.suplier);
            else if (errors.value.harga) toast.error(errors.value.harga);
            return;
        }

        if (offtakeDetail.value.length === 0) {
            toast.error("Keranjang daftar produk masih kosong.");
            return;
        }

        // 🌟 AKTIFKAN OVERLAY LOADING
        isSubmitting.value = true;

        try {
            const payload = {
                kode: formOfftake.kode,
                suplier_id: formOfftake.suplier.value,
                total: formOfftake.harga,
                keterangan: formOfftake.keterangan
            };

            const response = await offtakeService.paymentOfftake(payload);

            if (response) {
                toast.success("Transaksi Offtake berhasil diselesaikan");

                const completedKode = formOfftake.kode;
                const completedTotal = formOfftake.harga;
                const suplierContact = formOfftake.suplier?.kontak || '';
                const namaSuplier = formOfftake.suplier?.label || 'Tidak Diketahui';

                // =================================================================
                // TELEGRAM NOTIFICATION
                // =================================================================
                const sekarang = new Date();
                const waktu = sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                const tanggal = sekarang.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

                let waLinkInfo = "";
                if (suplierContact) {
                    let formattedNo = String(suplierContact).replace(/\D/g, '');
                    if (formattedNo.startsWith('0')) {
                        formattedNo = '62' + formattedNo.slice(1);
                    } else if (formattedNo.length > 0 && !formattedNo.startsWith('62')) {
                        formattedNo = '62' + formattedNo;
                    }
                    if (formattedNo) {
                        waLinkInfo = `\n📲 [Chat WhatsApp](https://wa.me/${formattedNo}?text=)`;
                    }
                }

                let totalBeratOfftake = 0;
                let kalkulasiTotalUang = 0;

                const daftarProduk = offtakeDetail.value.map((item, index) => {
                    const namaItem = item.produk?.nama || 'Produk Tidak Diketahui';
                    const beratItem = Number(item.berat || 0);
                    const hargaPerGram = Number(item.hargajual || 0);
                    const subTotal = beratItem * hargaPerGram;

                    totalBeratOfftake += beratItem;
                    kalkulasiTotalUang += subTotal;

                    return `${index + 1}. *${namaItem}*\n` +
                        `    Berat : ${beratItem}g\n` +
                        `    Harga : Rp ${hargaPerGram.toLocaleString('id-ID')}/g\n` +
                        `    Subtotal : Rp ${subTotal.toLocaleString('id-ID')}`;
                }).join('\n');

                const totalFinal = completedTotal ? Number(completedTotal) : kalkulasiTotalUang;

                const pesan = `
🏢 *PENJUALAN OFFTAKE BERHASIL*
━━━━━━━━━━━━━━━
📅 *Tanggal:* ${tanggal}
🕒 *Jam:* ${waktu} WIB
🆔 *Kode:* ${completedKode}
🏢 *Ke Supplier:* ${namaSuplier}${waLinkInfo}

📦 *Detail Barang Offtake:*
${daftarProduk}
━━━━━━━━━━━━━━━
⚖️ *Total Berat:* ${totalBeratOfftake.toFixed(3)}g
💰 *Total Nilai Offtake:* Rp ${totalFinal.toLocaleString('id-ID')}
📝 *Ket:* ${formOfftake.keterangan || '-'}
━━━━━━━━━━━━━━━
_Notifikasi Otomatis Sistem POS_`;

                try {
                    await transaksiService.sendTelegramNotification({ pesan });
                } catch (telegramError) {
                    console.error("Gagal kirim notif Telegram:", telegramError);
                }
                // =================================================================

                // 🌟 SHOW PAYMENT SUCCESS MODAL
                showPaymentSuccess({
                    kodeTransaksi: completedKode,
                    onPrint: () => {
                        try {
                            const previewUrl = `/CetakNotaOfftake/${completedKode}`;
                            window.open(previewUrl, '_blank');
                        } catch (e) {
                            console.error(e);
                            toast.error('Gagal membuka preview cetak nota offtake');
                        }
                    },
                    onWhatsApp: () => {
                        if (!suplierContact) {
                            toast.error("Nomor kontak suplier tidak ditemukan.");
                            return;
                        }

                        let formattedPhone = String(suplierContact).replace(/[^0-9]/g, '');
                        if (formattedPhone.startsWith('0')) {
                            formattedPhone = '62' + formattedPhone.slice(1);
                        } else if (formattedPhone.length > 0 && !formattedPhone.startsWith('62')) {
                            formattedPhone = '62' + formattedPhone;
                        }

                        const message = `Halo ${namaSuplier},\nBerikut adalah rincian transaksi Offtake perhiasan:\nNo. Transaksi: *${completedKode}*\nTotal Transaksi: *Rp ${Number(totalFinal).toLocaleString('id-ID')}*\nStatus: *BERHASIL / LUNAS*\n\nTerima kasih atas kerja samanya!`;
                        const waUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
                        window.open(waUrl, '_blank');
                    },
                    onNext: () => {
                        handleNextOrder();
                    }
                });

                // Reset Form
                formOfftake.suplier = null;
                formOfftake.keterangan = '';
                formOfftake.harga = '';

                await fetchOfftakeDetail();
                await fetchKodeTransaksi();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal memproses pembayaran offtake");
        } finally {
            // 🌟 MATIKAN OVERLAY LOADING
            isSubmitting.value = false;
        }
    };

    return {
        offtake,
        offtakeDetail,
        suplierList,
        produk,
        isSubmitting,        // 💡 Di-return sebagai isSubmitting agar sesuai dengan View Parent
        isLoadingTable,
        isLoadingProduk,
        isModalOpen,
        searchProdukQuery,
        searchOfftakeDetailQuery,
        currentPageProduk,
        currentPageOfftakeDetail,
        itemsPerPageProduk,
        itemsPerPageOfftakeDetail,
        selectedProdukIds,
        errors,
        formOfftake,
        STORAGE_URL,
        fetchOfftakeDetail,
        fetchSuplier,
        fetchKodeTransaksi,
        totalProduk,
        totalBerat,
        totalHargaSemua,
        filteredProduk,
        totalPagesProduk,
        paginatedProduk,
        filteredOfftakeDetail,
        totalPagesOfftakeDetail,
        paginatedOfftakeDetail,
        visiblePagesProduk,
        handleNextOrder,
        handleCreate,
        closeModal,
        submitProduk,
        handleDelete,
        paymentOfftake,
    };
}
