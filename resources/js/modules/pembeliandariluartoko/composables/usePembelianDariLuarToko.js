import { ref, computed, reactive, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "../../../utilities/toast/toast";
import { confirmDelete } from "../../../utilities/confirm/confirm";
import { showPaymentSuccess } from "../../../utilities/confirm/PaymentsSuccessModal";

import { pembeliandariluartokoService } from "../services/pembeliandariluartokoService";
import { suplierService } from "../../../modules/suplier/services/suplierService";
import { pelangganService } from "../../../modules/pelanggan/services/pelangganService";
import { kondisiService } from "../../kondisi/services/kondisiService";
import { jenisprodukService } from "../../jenisproduk/services/jenisprodukService";
import { jeniskaratService } from "../../jeniskarat/services/jeniskaratService";
import { karatService } from "../../karat/services/karatService";
import { hargaService } from "../../harga/services/hargaService";
import { transaksiService } from "../../transaksi/services/transaksiService";

import { useSuplier } from "../../suplier/composables/useSuplier";
import { usePelanggan } from "../../pelanggan/composables/usePelanggan";

const toast = useToast();

// SHARED STATE (SINGLETON)
const supplierOptions = ref([]);
const pelangganOptions = ref([]);
const isFetchingList = ref(false);
const PembelianDariLuarToko = ref([]);
const lastCompletedPembelianKode = ref("");

// 🌟 VUE STATE MODAL (REPLACEMENT FOR BOOTSTRAP)
const isModalOpen = ref(false);

// MODAL & SUBMIT STATES
const isSubmitting = ref(false);
const isEdit = ref(false);
const isLoading = ref(false);
const errors = ref({});

// LIST DATA OPTIONS
const jenisprodukList = ref([]);
const karatList = ref([]);
const allJenisKarat = ref([]);
const kondisiList = ref([]);
const masterHarga = ref([]);

// STATE PEMBELIAN DETAIL (TABEL)
const isLoadingPembelianDetail = ref(true);
const searchPembelianDetail = ref("");
const currentPagePembelianDetail = ref(1);
const itemsPerPagePembelianDetail = 5;
const pembeliandetail = ref([]);

// FORM STATES
const formDariLuarToko = reactive({
    kode: "",
    sumber: "supplier",
    selectedId: null,
    keterangan: "",
});

const formProduk = reactive({
    id: null,
    nama: "",
    berat: "",
    jenisproduk: null,
    karat: null,
    kondisi: null,
    hargajual: null,
    hargabeli: "",
    jeniskarat: null,
    harga_id: null,
    harga_display: "",
    lingkar: "",
    panjang: "",
    keteranganproduk: "",
});

export function usePembelianDariLuarToko() {
    const { handleCreate: openSuplierModal } = useSuplier();
    const { handleCreate: openPelangganModal } = usePelanggan();

    const closeModal = () => {
        isModalOpen.value = false;
    };

    const fetchKodeTransaksi = async () => {
        formDariLuarToko.kode = "Memuat data...";
        try {
            const response = await pembeliandariluartokoService.getKodeTransaksi();
            if (PembelianDariLuarToko.value.length > 0) {
                formDariLuarToko.kode = PembelianDariLuarToko.value[0].kode;
            } else if (response && response.kode) {
                formDariLuarToko.kode = response.kode;
            } else {
                formDariLuarToko.kode = "ERR-GENERATE";
            }
        } catch (error) {
            console.error("Composable Error [fetchKodeTransaksi]:", error);
            formDariLuarToko.kode = "ERR-GENERATE";
        }
    };

    const fetchOptions = async (type = formDariLuarToko.sumber, force = false) => {
        if (!type || isFetchingList.value) return;

        if (!force) {
            if (type === "supplier" && supplierOptions.value.length > 0) return;
            if (type === "pelanggan" && pelangganOptions.value.length > 0) return;
        }

        isFetchingList.value = true;
        try {
            if (type === "supplier") {
                const response = await suplierService.getSuplier();
                supplierOptions.value = (response.data || []).map((item) => ({
                    value: item.id,
                    label: item.nama,
                    kontak: item.kontak,
                }));
            } else {
                const response = await pelangganService.getPelanggan();
                pelangganOptions.value = (response.data || []).map((item) => ({
                    value: item.id,
                    label: item.nama,
                    kontak: item.kontak,
                }));
            }
        } catch (error) {
            console.error("Gagal ambil list:", error);
        } finally {
            setTimeout(() => {
                isFetchingList.value = false;
            }, 500);
        }
    };

    const handleModalClosed = (event) => {
        const modalId = event.target?.id;
        if (modalId === "suplierModal" || modalId === "pelangganModal") {
            fetchOptions(formDariLuarToko.sumber, true);
        }
    };

    onMounted(() => {
        document.addEventListener("hidden.bs.modal", handleModalClosed);
    });

    onUnmounted(() => {
        document.removeEventListener("hidden.bs.modal", handleModalClosed);
    });

    const handleCreateSuplier = async () => {
        openSuplierModal();
    };

    const handleCreatePelanggan = async () => {
        openPelangganModal();
    };

    const fetchJenisProduk = async () => {
        try {
            const response = await jenisprodukService.getJenisProduk();
            jenisprodukList.value = (response.data || []).map((item) => ({
                value: item.id,
                label: item.jenis,
            }));
        } catch (error) {
            console.error("Gagal memuat Jenis Produk:", error);
        }
    };

    const fetchKarat = async () => {
        try {
            const response = await karatService.getKarat();
            karatList.value = (response.data || []).map((item) => ({
                value: item.id,
                label: item.karat,
            }));
        } catch (error) {
            console.error("Gagal memuat Karat:", error);
        }
    };

    const fetchJenisKarat = async () => {
        try {
            const response = await jeniskaratService.getJenisKarat();
            allJenisKarat.value = response.data || [];
        } catch (error) {
            console.error("Gagal memuat Jenis Karat:", error);
        }
    };

    const fetchKondisi = async () => {
        try {
            const response = await kondisiService.getKondisi();
            kondisiList.value = (response.data || []).map((item) => ({
                value: item.id,
                label: item.kondisi,
            }));
        } catch (error) {
            console.error("Gagal memuat Kondisi:", error);
        }
    };

    const fetchMasterHarga = async () => {
        if (masterHarga.value.length > 0) return;
        try {
            const response = await hargaService.getHarga();
            masterHarga.value = Array.isArray(response) ? response : response.data || [];
        } catch (error) {
            console.error("Gagal memuat master harga:", error);
        }
    };

    const filteredJenisKaratList = computed(() => {
        if (!formProduk.karat || !formProduk.karat.value) return [];
        return allJenisKarat.value
            .filter((item) => item.karat_id === formProduk.karat.value)
            .map((item) => ({
                value: item.id,
                label: item.jenis,
            }));
    });

    const handleKaratChange = () => {
        formProduk.jeniskarat = null;
        formProduk.hargajual = null;
    };

    const fetchHargaOtomatis = () => {
        if (formProduk.karat?.value && formProduk.jeniskarat?.value) {
            const found = masterHarga.value.find(
                (h) =>
                    h.karat_id === formProduk.karat.value &&
                    h.jeniskarat_id === formProduk.jeniskarat.value
            );

            if (found) {
                formProduk.harga_id = found.id;
                formProduk.harga_display = found.harga;
            } else {
                formProduk.harga_id = null;
                formProduk.harga_display = "Harga belum diatur";
            }
        }
    };

    let debounceTimer = null;
    watch(
        () => formDariLuarToko.sumber,
        (newType) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (newType) {
                    formDariLuarToko.selectedId = null;
                    fetchOptions(newType);
                }
            }, 300);
        },
        { immediate: false }
    );

    watch(
        () => [formProduk.karat, formProduk.jeniskarat],
        () => {
            fetchHargaOtomatis();
        },
        { deep: true }
    );

    const validateForm = () => {
        errors.value = {};
        if (!formProduk.nama || formProduk.nama.trim() === "") {
            errors.value.nama = "Nama tidak boleh kosong.";
        }
        if (!formProduk.berat || String(formProduk.berat).trim() === "") {
            errors.value.berat = "Berat tidak boleh kosong.";
        } else {
            const beratRegex = /^\d+(\.\d+)?$/;
            if (String(formProduk.berat).includes(",")) {
                errors.value.berat = "Gunakan titik (.) sebagai pemisah desimal, bukan koma.";
            } else if (!beratRegex.test(formProduk.berat)) {
                errors.value.berat = "Format berat tidak valid (contoh: 10.5).";
            }
        }
        if (!formProduk.jenisproduk) {
            errors.value.jenisproduk = "Jenis Produk wajib dipilih.";
        }
        if (!formProduk.karat) {
            errors.value.karat = "Karat wajib dipilih.";
        }
        if (!formProduk.jeniskarat) {
            errors.value.jeniskarat = "Jenis Karat wajib dipilih.";
        }
        if (!formProduk.kondisi) {
            errors.value.kondisi = "Kondisi wajib dipilih.";
        }
        if (!formProduk.hargabeli || String(formProduk.hargabeli).trim() === "") {
            errors.value.hargabeli = "Harga beli tidak boleh kosong.";
        } else {
            const hargaRegex = /^\d+$/;
            if (!hargaRegex.test(formProduk.hargabeli)) {
                errors.value.hargabeli = "Harga beli harus berupa angka tanpa simbol.";
            }
        }
        return Object.keys(errors.value).length === 0;
    };

    const resetFormProduk = () => {
        formProduk.id = null;
        formProduk.nama = "";
        formProduk.berat = "";
        formProduk.jenisproduk = null;
        formProduk.karat = null;
        formProduk.jeniskarat = null;
        formProduk.kondisi = null;
        formProduk.hargabeli = "";
        formProduk.harga_id = null;
        formProduk.harga_display = "";
        formProduk.lingkar = "";
        formProduk.panjang = "";
        formProduk.keteranganproduk = "";
        errors.value = {};
    };

    // 🌟 1. MEMBUKA MODAL SECARA REACTIVE
    const handleCreateProduk = async () => {
        isEdit.value = false;
        resetFormProduk();

        await Promise.all([
            fetchJenisProduk(),
            fetchKarat(),
            fetchJenisKarat(),
            fetchKondisi(),
            fetchMasterHarga(),
        ]);

        isModalOpen.value = true;
    };

    const handleSubmitProduk = async () => {
        if (!validateForm()) return false;
        isLoadingPembelianDetail.value = true;
        try {
            const payload = {
                kode: formDariLuarToko.kode,
                nama: formProduk.nama,
                berat: formProduk.berat,
                jenisproduk: formProduk.jenisproduk.value,
                karat: formProduk.karat.value,
                jeniskarat: formProduk.jeniskarat.value,
                kondisi: formProduk.kondisi.value,
                hargabeli: formProduk.hargabeli,
                hargajual: formProduk.harga_id,
                lingkar: formProduk.lingkar,
                panjang: formProduk.panjang,
                keterangan: formProduk.keteranganproduk,
            };

            let response;
            if (isEdit.value) {
                payload.id = formProduk.id;
                response = await pembeliandariluartokoService.updatePembelianDetail(payload);
            } else {
                response = await pembeliandariluartokoService.storeProdukToPembelianDetail(payload);
            }

            if (response && response.status) {
                toast.success(response.message || "Data berhasil disimpan");

                // 🌟 2. MENUTUP MODAL DENGAN VUE STATE
                isModalOpen.value = false;

                resetFormProduk();
                await fetchPembelianDetail();
            } else {
                toast.error(response.message || "Gagal menyimpan data");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.message || "Gagal menyimpan transaksi";
            toast.error(errorMessage);
            if (error.response?.status === 400 && error.response.data.errors) {
                errors.value = error.response.data.errors;
            }
        } finally {
            isLoadingPembelianDetail.value = false;
        }
    };

    const fetchPembelianDetail = async () => {
        isLoadingPembelianDetail.value = true;
        try {
            const response = await pembeliandariluartokoService.getPembelianDetail();
            pembeliandetail.value = Array.isArray(response) ? response : response.data || [];
        } catch (error) {
            console.error("Error fetchPembelianDetail:", error);
            pembeliandetail.value = [];
        } finally {
            isLoadingPembelianDetail.value = false;
        }
    };

    // 🌟 3. EDIT BARANG DENGAN VUE STATE MODAL
    const handleEdit = async (item) => {
        isEdit.value = true;
        errors.value = {};

        await Promise.all([
            fetchJenisProduk(),
            fetchKarat(),
            fetchJenisKarat(),
            fetchKondisi(),
            fetchMasterHarga(),
        ]);

        const produk = item.produk || {};
        formProduk.id = item.id;
        formProduk.nama = produk.nama || "";
        formProduk.berat = produk.berat || "";
        formProduk.hargabeli = item.hargabeli || "";
        formProduk.lingkar = produk.lingkar || "";
        formProduk.panjang = produk.panjang || "";
        formProduk.keteranganproduk = produk.keterangan || "";
        formProduk.harga_id = produk.harga_id || null;

        const foundJenis = jenisprodukList.value.find((jp) => jp.value === produk.jenisproduk_id);
        formProduk.jenisproduk = foundJenis || null;

        const foundKarat = karatList.value.find((k) => k.value === produk.karat_id);
        formProduk.karat = foundKarat || null;

        const foundJenisKarat = allJenisKarat.value
            .filter((jk) => jk.karat_id === produk.karat_id)
            .find((jk) => jk.id === produk.jeniskarat_id);

        formProduk.jeniskarat = foundJenisKarat
            ? { value: foundJenisKarat.id, label: foundJenisKarat.jenis }
            : null;

        const foundKondisi = kondisiList.value.find((kon) => kon.value === item.kondisi_id);
        formProduk.kondisi = foundKondisi || null;

        isModalOpen.value = true;
    };

    const handleDelete = async (item) => {
        const confirm = await confirmDelete(
            "Apakah Anda yakin?",
            `Data produk "${item.produk?.nama}" yang dihapus tidak dapat dikembalikan!`
        );

        if (confirm) {
            try {
                await pembeliandariluartokoService.batalPembelianDetail({ id: item.id });
                toast.success("Data Pembelian berhasil dihapus.");
                await fetchPembelianDetail();
                await fetchKodeTransaksi();
            } catch (error) {
                toast.error(error.response?.data?.message || "Gagal menghapus data.");
            }
        }
    };

    const paymentPembelian = async () => {
        if (isSubmitting.value) return;

        if (!formDariLuarToko.selectedId) {
            const tipe =
                formDariLuarToko.sumber === "supplier" || formDariLuarToko.sumber === "suplier"
                    ? "Suplier"
                    : "Pelanggan";
            toast.error(`Silakan pilih ${tipe} terlebih dahulu sebelum bayar.`);
            return;
        }

        if (pembeliandetail.value.length === 0) {
            toast.error("Keranjang pembelian masih kosong.");
            return;
        }

        isSubmitting.value = true;

        try {
            const actualId = formDariLuarToko.selectedId?.value || formDariLuarToko.selectedId;
            const payload = {
                kode: formDariLuarToko.kode,
                sumber: formDariLuarToko.sumber,
                selectedId: actualId,
                keterangan: formDariLuarToko.keterangan,
            };

            const response = await pembeliandariluartokoService.paymentPembelian(payload);

            if (response && response.status) {
                lastCompletedPembelianKode.value = formDariLuarToko.kode;
                const completedKode = formDariLuarToko.kode;

                const sekarang = new Date();
                const waktu = sekarang.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                const tanggal = sekarang.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

                const isSupplier = formDariLuarToko.sumber === "supplier" || formDariLuarToko.sumber === "suplier";
                const labelSumber = isSupplier ? "🏢 Supplier" : "👤 Pelanggan";

                // 🛠️ FIX 1: Cari objek lengkap di optionsList jika selectedId hanya ID
                const optionsList = isSupplier
                    ? (supplierOptions?.value || [])
                    : (pelangganOptions?.value || []);

                const selectedObj = typeof formDariLuarToko.selectedId === "object" && formDariLuarToko.selectedId !== null
                    ? formDariLuarToko.selectedId
                    : optionsList.find(opt => opt.value === actualId || opt.id === actualId);

                // 🛠️ FIX 2: Fallback bertingkat untuk nama dan kontak
                const namaSumber =
                    selectedObj?.nama ||
                    selectedObj?.label ||
                    "Tidak Diketahui";

                const kontakSumber =
                    selectedObj?.kontak ||
                    selectedObj?.no_hp ||
                    "";

                let waLinkInfo = "";
                if (kontakSumber && kontakSumber !== "Tidak Diketahui") {
                    let formattedNo = String(kontakSumber).replace(/\D/g, "");
                    if (formattedNo.startsWith("0")) {
                        formattedNo = "62" + formattedNo.slice(1);
                    } else if (formattedNo.length > 0 && !formattedNo.startsWith("62")) {
                        formattedNo = "62" + formattedNo;
                    }
                    if (formattedNo) {
                        waLinkInfo = `\n📲 [Chat WhatsApp](https://wa.me/${formattedNo}?text=)`;
                    }
                }

                let totalBayarTelegram = 0;
                const daftarProduk = pembeliandetail.value
                    .map((item, index) => {
                        const namaItem = item.produk?.nama || item.nama_barang || "Produk Baru";
                        const beratItem = Number(item.berat || item.produk?.berat || 0);
                        const hargaPerGram = Number(item.hargabeli || 0);
                        const subTotalItem = hargaPerGram * beratItem;
                        totalBayarTelegram += subTotalItem;

                        return (
                            `${index + 1}. *${namaItem}*\n` +
                            `    Berat : ${beratItem}g\n` +
                            `    Harga : Rp ${hargaPerGram.toLocaleString("id-ID")}/g\n` +
                            `    Subtotal : Rp ${subTotalItem.toLocaleString("id-ID")}`
                        );
                    })
                    .join("\n");

                const pesan = `
📦 *PEMBELIAN LUAR TOKO BERHASIL*
━━━━━━━━━━━━━━━
📅 *Tanggal:* ${tanggal}
🕒 *Jam:* ${waktu} WIB
🆔 *Kode:* ${completedKode}
📂 *Sumber:* ${labelSumber}
📛 *Nama:* ${namaSumber}${waLinkInfo}

📜 *Rincian Barang:*
${daftarProduk}
━━━━━━━━━━━━━━━
💰 *Total Bayar Keluar:* Rp ${totalBayarTelegram.toLocaleString("id-ID")}
📝 *Ket:* ${formDariLuarToko.keterangan || "-"}
━━━━━━━━━━━━━━━
_Notifikasi Otomatis Sistem Pembelian_`;

                try {
                    await transaksiService.sendTelegramNotification({ pesan });
                } catch (telegramError) {
                    console.error("Telegram Error:", telegramError);
                }

                showPaymentSuccess({
                    kodeTransaksi: completedKode,
                    onPrint: () => {
                        try {
                            const previewUrl = `/CetakNotaPembelianDariToko/${completedKode}`;
                            window.open(previewUrl, "_blank");
                        } catch (e) {
                            console.error(e);
                            toast.error("Gagal membuka preview cetak nota pembelian");
                        }
                    },
                    onWhatsApp: () => {
                        if (!kontakSumber) {
                            toast.error("Nomor kontak sumber tidak ditemukan.");
                            return;
                        }

                        let formattedPhone = String(kontakSumber).replace(/[^0-9]/g, "");
                        if (formattedPhone.startsWith("0")) {
                            formattedPhone = "62" + formattedPhone.slice(1);
                        } else if (formattedPhone.length > 0 && !formattedPhone.startsWith("62")) {
                            formattedPhone = "62" + formattedPhone;
                        }

                        const message = `Halo ${namaSumber},\nBerikut rincian Pembelian Luar Toko:\nNo. Transaksi: *${completedKode}*\nTotal Pembelian: *Rp ${Number(totalBayarTelegram).toLocaleString("id-ID")}*\nStatus: *BERHASIL / LUNAS*\n\nTerima kasih!`;
                        const waUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
                        window.open(waUrl, "_blank");
                    },
                    onNext: () => {
                        handleNextOrder();
                    },
                });

                formDariLuarToko.selectedId = null;
                formDariLuarToko.keterangan = "";

                await fetchKodeTransaksi();
                await fetchPembelianDetail();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Gagal memproses pembayaran");
        } finally {
            isSubmitting.value = false;
        }
    };

    const handlePrintNota = async () => {
        if (!lastCompletedPembelianKode.value) {
            toast.error("Tidak ada transaksi yang ditemukan untuk dicetak");
            return;
        }

        try {
            const response = await pembeliandariluartokoService.CetakNotaPembelian({
                kode: lastCompletedPembelianKode.value,
            });
            if (response && response.url) {
                window.open(response.url, "_blank");
            }
        } catch (e) {
            toast.error("Gagal mencetak nota pembelian");
        }
    };

    const handleNextOrder = async () => {
        formDariLuarToko.selectedId = null;
        formDariLuarToko.keterangan = "";
        pembeliandetail.value = [];
        resetFormProduk();

        await fetchKodeTransaksi();
        toast.info("Siap untuk transaksi pembelian baru");
    };

    const totalPagesPembelianDetail = computed(() => {
        const query = String(searchPembelianDetail.value || "").toLowerCase();
        const filteredCount = (pembeliandetail.value || []).filter((item) => {
            return (
                String(item.produk?.kodeproduk || "").toLowerCase().includes(query) ||
                String(item.produk?.nama || "").toLowerCase().includes(query)
            );
        }).length;
        return Math.ceil(filteredCount / itemsPerPagePembelianDetail) || 1;
    });

    const displayedPagesPembelianDetail = computed(() => {
        const total = totalPagesPembelianDetail.value;
        const current = currentPagePembelianDetail.value;
        const maxVisible = 5;
        let start = Math.max(current - Math.floor(maxVisible / 2), 1);
        let end = start + maxVisible - 1;
        if (end > total) {
            end = total;
            start = Math.max(end - maxVisible + 1, 1);
        }
        const pages = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    });

    const paginatedPembelianDetail = computed(() => {
        const query = String(searchPembelianDetail.value || "").toLowerCase();
        const filtered = (pembeliandetail.value || []).filter(
            (item) =>
                String(item.produk?.kodeproduk || "").toLowerCase().includes(query) ||
                String(item.produk?.nama || "").toLowerCase().includes(query)
        );
        const start = (currentPagePembelianDetail.value - 1) * itemsPerPagePembelianDetail;
        return filtered.slice(start, start + itemsPerPagePembelianDetail);
    });

    const filteredPembelianDetail = computed(() => {
        const query = String(searchPembelianDetail.value || "").toLowerCase();
        return (pembeliandetail.value || []).filter(
            (item) =>
                String(item.produk?.kodeproduk || "").toLowerCase().includes(query) ||
                String(item.produk?.nama || "").toLowerCase().includes(query)
        );
    });

    return {
        isModalOpen,
        closeModal,
        isSubmitting,
        isEdit,
        isLoading,
        errors,
        PembelianDariLuarToko,
        isFetchingList,
        supplierOptions,
        pelangganOptions,
        formDariLuarToko,
        fetchKodeTransaksi,
        fetchOptions,
        handleCreateSuplier,
        handleCreatePelanggan,
        formProduk,
        handleCreateProduk,
        jenisprodukList,
        jeniskaratList: filteredJenisKaratList,
        karatList,
        kondisiList,
        allJenisKarat,
        fetchJenisProduk,
        fetchKarat,
        fetchJenisKarat,
        fetchKondisi,
        handleKaratChange,
        handleSubmitProduk,
        isLoadingPembelianDetail,
        searchPembelianDetail,
        currentPagePembelianDetail,
        itemsPerPagePembelianDetail,
        totalPagesPembelianDetail,
        displayedPagesPembelianDetail,
        fetchPembelianDetail,
        handleEdit,
        handleDelete,
        paymentPembelian,
        handlePrintNota,
        handleNextOrder,
        paginatedPembelianDetail,
        filteredPembelianDetail,
    };
}
