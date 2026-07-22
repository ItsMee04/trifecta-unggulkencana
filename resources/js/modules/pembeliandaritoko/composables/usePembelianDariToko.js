import { ref, computed, reactive } from "vue";
import { useToast } from "../../../utilities/toast/toast";
import { confirmDelete } from "../../../utilities/confirm/confirm";

import { pembeliandaritokoService } from "../services/pembeliandaritokoService";
import { kondisiService } from "../../../modules/kondisi/services/kondisiService";
import { transaksiService } from "../../../modules/transaksi/services/transaksiService";

const toast = useToast();

// SHARED STATE
const isSubmitting = ref(false);
const errors = ref({});
const lastCompletedPembelianKode = ref("");

// MODAL STATES
const isModalCariNotaOpen = ref(false);
const isModalEditOpen = ref(false);
const isSuccessModalOpen = ref(false);

const searchPembelianDariTokoProduk = ref("");
const currentPagePembelianDariTokoProduk = ref(1);
const itemsPerPagePembelianDariTokoProduk = 5;
const PembelianDariToko = ref([]);

// STATE TRANSAKSI
const isLoadingTransaksiPelanggan = ref(false);
const searchTransaksiPelanggan = ref("");
const currentPageTransaksiPelanggan = ref(1);
const itemsPerPageTransaksiPelanggan = 5;
const transaksiPelanggan = ref([]);

// STATE PEMBELIAN DETAIL
const isLoadingPembelianDetail = ref(true); // Default true agar memuat data duluan & tidak flicker "Tidak ada data"
const searchPembelianDetail = ref("");
const currentPagePembelianDetail = ref(1);
const itemsPerPagePembelianDetail = 5;
const pembeliandetail = ref([]);

// STATE KONDISI
const kondisiList = ref([]);

const formDariToko = reactive({
    id: null,
    kode: "",
    kodetransaksi: "",
    pelanggan: "",
    pelanggan_id: null,
    keterangan: "",
});

const formPembelianDetail = reactive({
    id: null,
    kodeproduk: "",
    hargajual: 0,
    hargabeli: 0,
    berat: 0,
    kondisi: null,
    jenis_hargabeli: "hargajual",
});

export function usePembelianDariToko() {
    const validateFormCariTransaksiPelanggan = () => {
        errors.value = {};
        if (!formDariToko.kodetransaksi || formDariToko.kodetransaksi.trim() === "") {
            errors.value.kodetransaksi = "Kode Transaksi tidak boleh kosong.";
        }
        return Object.keys(errors.value).length === 0;
    };

    const handleCariTransaksiPelanggan = () => {
        formDariToko.kodetransaksi = "";
        errors.value = {};
        isModalCariNotaOpen.value = true;
    };

    const fetchKodeTransaksi = async () => {
        formDariToko.kode = "Memuat data..."; // Indikator loading[cite: 1]
        try {
            const response = await pembeliandaritokoService.getKodeTransaksi();

            // Ambil kode dari response JSON { status, message, kode }
            if (response && response.kode) {
                formDariToko.kode = response.kode;
            } else {
                formDariToko.kode = "ERR-GENERATE";
            }
        } catch (error) {
            console.error("Composable Error [fetchKodeTransaksi]:", error);
            formDariToko.kode = "ERR-GENERATE"; // Ditangkap jika Service melempar throw error[cite: 1]
        }
    };

    const submitTransaksiPelanggan = async () => {
        if (!validateFormCariTransaksiPelanggan()) return false;

        isLoadingTransaksiPelanggan.value = true;
        try {
            const payload = { kode: formDariToko.kodetransaksi };
            const response = await pembeliandaritokoService.getTransaksiByKode(payload);
            const dataRes = response.data || [];
            transaksiPelanggan.value = dataRes;

            if (dataRes.length > 0) {
                formDariToko.pelanggan = dataRes[0].pelanggan?.nama || "";
                formDariToko.pelanggan_id = dataRes[0].pelanggan?.id || null;
            }

            toast.success(response.message || "Data berhasil ditemukan");
            isModalCariNotaOpen.value = false;
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat mencari data";
            toast.error(errorMessage);
        } finally {
            isLoadingTransaksiPelanggan.value = false;
        }
    };

    const handlePilihTransaksiPelanggan = async (item) => {
        const payload = {
            kode: formDariToko.kode,
            kodetransaksi: formDariToko.kodetransaksi,
            produk: item.transaksidetail?.produk_id,
            pelanggan_id: formDariToko.pelanggan_id,
        };

        if (!payload.produk) {
            toast.error("ID Produk tidak ditemukan");
            return;
        }

        try {
            const response = await pembeliandaritokoService.storeProdukToPembelianDetail(payload);

            if (response.status) {
                toast.success(response.message);
                await fetchPembelianDetail();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Gagal menambahkan produk";
            toast.error(errorMessage);
        }
    };

    const fetchPembelianDetail = async () => {
        isLoadingPembelianDetail.value = true;
        formDariToko.pelanggan = "Memuat data...";

        try {
            const response = await pembeliandaritokoService.getPembelianDetail();
            const dataRes = Array.isArray(response) ? response : response.data || [];
            pembeliandetail.value = dataRes;

            if (dataRes.length > 0) {
                const itemPertama = dataRes[0];
                if (itemPertama.pembelian && itemPertama.pembelian.pelanggan) {
                    formDariToko.pelanggan = itemPertama.pembelian.pelanggan.nama;
                    formDariToko.pelanggan_id = itemPertama.pembelian.pelanggan_id;
                } else {
                    formDariToko.pelanggan = "Pelanggan Tidak Diketahui";
                }
            } else {
                formDariToko.pelanggan = "";
            }
        } catch (error) {
            console.error(error);
            formDariToko.pelanggan = "Gagal memuat data";
        } finally {
            isLoadingPembelianDetail.value = false;
            if (pembeliandetail.value.length === 0) {
                formDariToko.pelanggan = "";
            }
        }
    };

    const fetchKondisi = async () => {
        try {
            const response = await kondisiService.getKondisi();
            kondisiList.value = response.data.map((item) => ({
                value: item.id,
                label: item.kondisi,
            }));
        } catch (error) {
            console.error("Gagal memuat Kondisi:", error);
        }
    };

    const handleEdit = (item) => {
        errors.value = {};
        formPembelianDetail.id = item.id;
        formPembelianDetail.kodeproduk = item.produk?.kodeproduk;
        formPembelianDetail.hargajual = item.kodetransaksi?.transaksidetail?.hargajual || 0;
        formPembelianDetail.hargabeli = item.hargabeli || 0;
        formPembelianDetail.jenis_hargabeli = item.jenis_hargabeli || "hargajual";
        formPembelianDetail.kondisi = item.kondisi_id
            ? kondisiList.value.find(k => k.value === item.kondisi_id) || null
            : null;

        isModalEditOpen.value = true;
    };

    const handleSubmitEdit = async () => {
        errors.value = {};
        let valid = true;
        const newErrors = {};

        if (!formPembelianDetail.hargabeli || formPembelianDetail.hargabeli <= 0) {
            newErrors.hargabeli = ["Harga beli harus diisi dan lebih besar dari 0."];
            valid = false;
        }

        if (!valid) {
            errors.value = newErrors;
            return;
        }

        isLoadingPembelianDetail.value = true;
        try {
            const payload = {
                id: formPembelianDetail.id,
                hargabeli: formPembelianDetail.hargabeli,
                kondisi_id: formPembelianDetail.kondisi?.value || null,
                jenis_hargabeli: formPembelianDetail.jenis_hargabeli,
            };

            const response = await pembeliandaritokoService.updatePembelianDetail(payload);

            if (response.status) {
                toast.success(response.message);
                isModalEditOpen.value = false;
                await fetchPembelianDetail();
                await fetchKodeTransaksi();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Gagal memperbarui data");
        } finally {
            isLoadingPembelianDetail.value = false;
        }
    };

    // MENGGUNAKAN UTILITY CONFIRM PROYEK
    const handleDelete = async (item) => {
        const confirm = await confirmDelete(
            "Apakah Anda yakin?",
            `Data produk "${item.produk?.nama}" yang dihapus tidak dapat dikembalikan!`
        );

        if (confirm) {
            try {
                await pembeliandaritokoService.batalPembelianDetail({ id: item.id });
                toast.success("Data Pembelian berhasil dihapus.");
                await fetchPembelianDetail();
            } catch (error) {
                toast.error(error.response?.data?.message || "Gagal menghapus data.");
            }
        }
    };

    const paymentPembelian = async () => {
        if (!formDariToko.pelanggan_id) {
            toast.error("Data pelanggan belum lengkap.");
            return;
        }

        if (pembeliandetail.value.length === 0) {
            toast.error("Keranjang pembelian masih kosong.");
            return;
        }

        isSubmitting.value = true;

        try {
            const payload = { kode: formDariToko.kode };
            const response = await pembeliandaritokoService.paymentPembelian(payload);

            if (response.status) {
                lastCompletedPembelianKode.value = formDariToko.kode;

                const grandTotalPembelian = pembeliandetail.value.reduce((acc, item) => {
                    const berat = Number(item.produk?.berat || 0);
                    const hargaJual = Number(item.kodetransaksi?.transaksidetail?.hargajual || 0);
                    const totalHargaJual = hargaJual * berat;
                    let totalAkhir = totalHargaJual;

                    if (item.jenis_hargabeli === "potongan_4") {
                        totalAkhir = totalHargaJual * 0.96;
                    } else if (item.jenis_hargabeli === "lebih_tinggi") {
                        totalAkhir = Number(item.hargabeli || 0);
                    }
                    return acc + totalAkhir;
                }, 0);

                const sekarang = new Date();
                const waktu = sekarang.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                const tanggal = sekarang.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

                let waLinkInfo = "";
                let noKontakRaw = "";

                if (transaksiPelanggan.value && transaksiPelanggan.value.length > 0) {
                    noKontakRaw = transaksiPelanggan.value[0].pelanggan?.kontak || "";
                } else if (pembeliandetail.value && pembeliandetail.value.length > 0) {
                    const itemPertama = pembeliandetail.value[0];
                    if (itemPertama.pembelian && itemPertama.pembelian.pelanggan) {
                        noKontakRaw = itemPertama.pembelian.pelanggan.kontak || "";
                    }
                }

                if (noKontakRaw) {
                    let formattedNo = String(noKontakRaw).replace(/\D/g, '');
                    if (formattedNo.startsWith('0')) {
                        formattedNo = '62' + formattedNo.slice(1);
                    } else if (formattedNo.length > 0 && !formattedNo.startsWith('62')) {
                        formattedNo = '62' + formattedNo;
                    }
                    if (formattedNo) {
                        waLinkInfo = `\n📲 [Chat WhatsApp](https://wa.me/${formattedNo}?text=)`;
                    }
                }

                const daftarProduk = pembeliandetail.value
                    .map((item, index) => {
                        const namaItem = item.produk?.nama || "Produk Tidak Diketahui";
                        const beratItem = Number(item.produk?.berat || 0);
                        const hargaJual = Number(item.kodetransaksi?.transaksidetail?.hargajual || 0);
                        const totalHargaJual = hargaJual * beratItem;
                        let hargaBeli = totalHargaJual;

                        if (item.jenis_hargabeli === "potongan_4") {
                            hargaBeli = totalHargaJual * 0.96;
                        } else if (item.jenis_hargabeli === "lebih_tinggi") {
                            hargaBeli = Number(item.hargabeli || 0);
                        }

                        const labelJenis = {
                            hargajual: "Harga Jual",
                            potongan_4: "Potongan 4%",
                            lebih_tinggi: "Lebih Tinggi",
                        };

                        return (
                            `${index + 1}. *${namaItem}*\n` +
                            `    Berat : ${beratItem}g\n` +
                            `    Harga Jual : Rp ${hargaJual.toLocaleString("id-ID")}/g\n` +
                            `    Total Harga Jual : Rp ${totalHargaJual.toLocaleString("id-ID")}\n` +
                            `    Harga Beli : Rp ${hargaBeli.toLocaleString("id-ID")} (${labelJenis[item.jenis_hargabeli] || "Harga Jual"})`
                        );
                    })
                    .join("\n");

                const pesan = `
📥 *PEMBELIAN DARI TOKO BERHASIL*
━━━━━━━━━━━━━━━
📅 *Tanggal:* ${tanggal}
🕒 *Jam:* ${waktu} WIB
🆔 *Kode:* ${formDariToko.kode}
👤 *Dari Pelanggan:* ${formDariToko.pelanggan}${waLinkInfo}

📦 *Detail Barang Yang Dibeli:*
${daftarProduk}
━━━━━━━━━━━━━━━
💰 *Grand Total Pembelian:* Rp ${grandTotalPembelian.toLocaleString("id-ID")}
━━━━━━━━━━━━━━━
_Notifikasi Otomatis Sistem Pembelian_`;

                try {
                    await transaksiService.sendTelegramNotification({ pesan });
                } catch (telegramError) {
                    console.error("Telegram Error:", telegramError);
                }

                isSuccessModalOpen.value = true;
            }
        } catch (error) {
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
            const response = await pembeliandaritokoService.CetakNotaPembelian({
                kode: lastCompletedPembelianKode.value,
            });
            if (response.url) {
                window.open(response.url, "_blank");
            }
        } catch (e) {
            toast.error("Gagal mencetak nota pembelian");
        }
    };

    const handleNextOrder = async () => {
        formDariToko.pelanggan = "";
        formDariToko.pelanggan_id = null;
        formDariToko.keterangan = "";
        formDariToko.kodetransaksi = "";

        pembeliandetail.value = [];
        transaksiPelanggan.value = [];
        searchTransaksiPelanggan.value = "";
        currentPageTransaksiPelanggan.value = 1;

        formPembelianDetail.id = null;
        formPembelianDetail.hargabeli = 0;
        formPembelianDetail.hargajual = 0;
        formPembelianDetail.kondisi = null;
        formPembelianDetail.jenis_hargabeli = "hargajual";

        isSuccessModalOpen.value = false;
        await fetchKodeTransaksi();

        toast.info("Siap untuk transaksi pembelian baru");
    };

    // COMPUTED PAGINATIONS & FILTERS
    const totalPagesTransaksiPelanggan = computed(() => {
        const query = String(searchTransaksiPelanggan.value || "").toLowerCase();
        const filteredCount = (transaksiPelanggan.value || []).filter((item) => {
            return (
                String(item.transaksidetail?.produk?.kodeproduk || "").toLowerCase().includes(query) ||
                String(item.transaksidetail?.produk?.nama || "").toLowerCase().includes(query)
            );
        }).length;
        return Math.ceil(filteredCount / itemsPerPageTransaksiPelanggan) || 1;
    });

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

    const displayedPagesTransaksiPelanggan = computed(() => {
        const total = totalPagesTransaksiPelanggan.value;
        const current = currentPageTransaksiPelanggan.value;
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

    return {
        isSubmitting,
        isModalCariNotaOpen,
        isModalEditOpen,
        isSuccessModalOpen,
        lastCompletedPembelianKode,

        formDariToko,
        fetchKodeTransaksi,

        errors,
        searchPembelianDariTokoProduk,
        currentPagePembelianDariTokoProduk,
        itemsPerPagePembelianDariTokoProduk,

        isLoadingTransaksiPelanggan,
        searchTransaksiPelanggan,
        currentPageTransaksiPelanggan,
        itemsPerPageTransaksiPelanggan,
        totalPagesTransaksiPelanggan,
        displayedPagesTransaksiPelanggan,
        handleCariTransaksiPelanggan,
        submitTransaksiPelanggan,
        handlePilihTransaksiPelanggan,
        paginatedTransaksiPelanggan: computed(() => {
            const query = String(searchTransaksiPelanggan.value || "").toLowerCase();
            const filtered = (transaksiPelanggan.value || []).filter(
                (item) =>
                    String(item.transaksidetail?.produk?.kodeproduk || "").toLowerCase().includes(query) ||
                    String(item.transaksidetail?.produk?.nama || "").toLowerCase().includes(query)
            );
            const start = (currentPageTransaksiPelanggan.value - 1) * itemsPerPageTransaksiPelanggan;
            return filtered.slice(start, start + itemsPerPageTransaksiPelanggan);
        }),

        filteredTransaksiPelanggan: computed(() => {
            const query = String(searchTransaksiPelanggan.value || "").toLowerCase();
            return (transaksiPelanggan.value || []).filter(
                (item) =>
                    String(item.transaksidetail?.produk?.kodeproduk || "").toLowerCase().includes(query) ||
                    String(item.transaksidetail?.produk?.nama || "").toLowerCase().includes(query)
            );
        }),

        isLoadingPembelianDetail,
        searchPembelianDetail,
        currentPagePembelianDetail,
        itemsPerPagePembelianDetail,
        totalPagesPembelianDetail,
        displayedPagesPembelianDetail,
        fetchPembelianDetail,
        handleEdit,
        handleDelete,
        handleSubmitEdit,
        formPembelianDetail,
        kondisiList,
        fetchKondisi,
        paymentPembelian,
        handleNextOrder,
        handlePrintNota,
        paginatedPembelianDetail: computed(() => {
            const query = String(searchPembelianDetail.value || "").toLowerCase();
            const filtered = (pembeliandetail.value || []).filter(
                (item) =>
                    String(item.produk?.kodeproduk || "").toLowerCase().includes(query) ||
                    String(item.produk?.nama || "").toLowerCase().includes(query)
            );
            const start = (currentPagePembelianDetail.value - 1) * itemsPerPagePembelianDetail;
            return filtered.slice(start, start + itemsPerPagePembelianDetail);
        }),

        filteredPembelianDetail: computed(() => {
            const query = String(searchPembelianDetail.value || "").toLowerCase();
            return (pembeliandetail.value || []).filter(
                (item) =>
                    String(item.produk?.kodeproduk || "").toLowerCase().includes(query) ||
                    String(item.produk?.nama || "").toLowerCase().includes(query)
            );
        }),
    };
}
