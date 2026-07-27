<template>
    <div class="min-h-screen bg-zinc-800 flex flex-col items-center justify-start p-6 print:bg-white print:p-0">

        <!-- Loading State -->
        <div v-if="isLoading" class="my-auto text-white font-semibold animate-pulse print:hidden">
            <div class="flex flex-col items-center gap-3">
                <svg class="animate-spin h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <span>Menyiapkan Laporan Pembelian...</span>
            </div>
        </div>

        <!-- Container Laporan A4 Standar -->
        <div v-else-if="laporanData"
            class="w-[21cm] min-h-[29.7cm] bg-white p-8 text-slate-800 shadow-2xl border border-zinc-700 flex flex-col justify-between print:shadow-none print:border-none print:p-0 print:w-full print:min-h-0">

            <table class="w-full border-collapse">

                <!-- 🌟 HEADER LAPORAN (Otomatis Diulang di Setiap Halaman A4) -->
                <thead class="print-header">
                    <tr>
                        <td colspan="9" class="pb-4">
                            <!-- KOP SURAT / HEADER LAPORAN -->
                            <div class="grid grid-cols-12 gap-2 items-center border-b-2 border-slate-800 pb-3">
                                <div class="col-span-8 flex gap-4 items-center">
                                    <img :src="logoToko" alt="Logo Toko"
                                        class="w-[70px] h-[70px] object-contain flex-shrink-0" />
                                    <div class="space-y-1">
                                        <span
                                            class="text-[9px] uppercase tracking-wider font-extrabold text-slate-800 block leading-none">
                                            Toko Emas
                                        </span>
                                        <h2
                                            class="text-[18px] font-black uppercase tracking-wide text-amber-500 leading-none">
                                            Unggul Kencana
                                        </h2>
                                        <p class="text-[9px] text-slate-500 font-medium leading-tight max-w-[320px]">
                                            Ruko No. 8 Jl. Patimura, Karang Lewas, Purwokerto, Jawa Tengah
                                        </p>
                                    </div>
                                </div>

                                <div class="col-span-4 flex flex-col justify-between items-end">
                                    <h1
                                        class="text-base font-black uppercase tracking-wider text-slate-800 border-b-2 border-amber-500 pb-0.5 mb-1 inline-block">
                                        Laporan Pembelian
                                    </h1>
                                    <div class="text-[9.5px] text-right font-medium text-slate-600">
                                        <span>Tanggal: </span>
                                        <span class="font-semibold text-slate-900">
                                            {{ formatTanggalPeriode(laporanData.periode?.tanggal_awal) }} s/d {{
                                                formatTanggalPeriode(laporanData.periode?.tanggal_akhir) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- HEADER TABEL LAPORAN -->
                    <tr
                        class="bg-slate-100 text-[9px] uppercase font-bold text-slate-800 border-b border-t border-slate-300">
                        <th class="border-r border-slate-300 py-2 w-[5%] text-center">NO</th>
                        <th class="border-r border-slate-300 py-2 w-[13%] text-center">TANGGAL</th>
                        <th class="border-r border-slate-300 py-2 w-[22%] text-center">KODE TRANSAKSI</th>
                        <th class="border-r border-slate-300 py-2 w-[12%] text-center">JENIS</th>
                        <th class="border-r border-slate-300 py-2 w-[16%] text-center">KODE PRODUK</th>
                        <th class="border-r border-slate-300 py-2 w-[10%] text-center">BERAT</th>
                        <th class="border-r border-slate-300 py-2 w-[8%] text-center">KARAT</th>
                        <th class="border-r border-slate-300 py-2 w-[12%] text-right pr-3">HARGA BELI</th>
                        <th class="py-2 w-[14%] text-right pr-3">TOTAL</th>
                    </tr>
                </thead>

                <!-- 🌟 BODY TABEL LAPORAN -->
                <tbody class="divide-y divide-slate-200 text-[10px]">
                    <tr v-for="(item, index) in laporanData.items" :key="index" class="break-inside-avoid">
                        <td class="py-2 text-center text-slate-500 font-mono border-r border-slate-200">
                            {{ index + 1 }}
                        </td>
                        <td class="py-2 text-center font-mono border-r border-slate-200">
                            {{ formatTanggalTable(item.tanggal) }}
                        </td>
                        <td class="py-2 text-center font-mono font-semibold border-r border-slate-200 text-slate-800">
                            {{ item.kode_transaksi }}
                        </td>
                        <td class="py-2 text-center font-medium uppercase border-r border-slate-200">
                            {{ item.jenis_produk }}
                        </td>
                        <td class="py-2 text-center font-mono border-r border-slate-200">
                            {{ item.kode_produk }}
                        </td>
                        <td class="py-2 text-center font-mono border-r border-slate-200">
                            {{ Number(item.berat || 0).toFixed(3) }}
                        </td>
                        <td class="py-2 text-center font-mono border-r border-slate-200">
                            {{ item.karat }}
                        </td>
                        <td class="py-2 pr-3 text-right font-mono font-medium border-r border-slate-200">
                            {{ formatRupiah(item.harga) }}
                        </td>

                        <td class="py-2 pr-3 text-right font-mono font-semibold text-slate-900">
                            {{ formatRupiah(item.harga_total) }}
                        </td>
                    </tr>
                </tbody>

                <!-- 🌟 FOOTER LAPORAN (Otomatis Diulang di Setiap Bawah Halaman A4) -->
                <tfoot class="print-footer">
                    <tr>
                        <td colspan="9" class="pt-4">
                            <div class="border-t-2 border-slate-800 pt-3 break-inside-avoid">
                                <div class="flex justify-between items-start">

                                    <!-- Tanggal Cetak Hari Ini -->
                                    <div class="text-[9.5px] text-slate-700">
                                        <span>Di cetak tanggal : </span>
                                        <span class="font-semibold">{{ tanggalCetakHariIni }}</span>
                                    </div>

                                    <!-- Summary Laporan -->
                                    <div class="w-[280px] space-y-1 text-[10px]">
                                        <div class="flex justify-between border-b border-slate-200 pb-1">
                                            <span class="font-bold text-slate-700">Jumlah</span>
                                            <span class="font-mono font-bold">{{ laporanData.summary?.total_potong ||
                                                laporanData.items?.length || 0 }} Pt</span>
                                        </div>
                                        <div class="flex justify-between border-b border-slate-200 pb-1">
                                            <span class="font-bold text-slate-700">Gram</span>
                                            <span class="font-mono font-bold">{{ Number(laporanData.summary?.total_berat
                                                || 0).toFixed(2) }}</span>
                                        </div>
                                        <div class="flex justify-between pt-0.5">
                                            <span class="font-black text-slate-900 uppercase">Total</span>
                                            <span
                                                class="font-mono font-black text-slate-900 border-b-2 border-double border-slate-800 pb-0.5">
                                                {{ formatRupiah(
                                                laporanData.summary?.total_transaksi
                                                ) }}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>

            </table>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { laporanService } from '../services/laporanService';
import logoTokoImg from '@/assets/img/LOGOTOKO.png';

const route = useRoute();
const isLoading = ref(true);
const laporanData = ref(null);
const logoToko = ref(logoTokoImg);

// Format Tanggal untuk Periode Header (contoh: 2026-04-01 s/d 2026-07-26)
const formatTanggalPeriode = (tanggalString) => {
    if (!tanggalString) return '-';
    return tanggalString;
};

// Format Tanggal untuk Baris Tabel (contoh: 26-04-2026)
const formatTanggalTable = (tanggalString) => {
    if (!tanggalString) return '-';
    try {
        const date = new Date(tanggalString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    } catch (e) {
        return tanggalString;
    }
};

// Format Tanggal Cetak Hari Ini (contoh: 26 Juli 2026)
const tanggalCetakHariIni = computed(() => {
    const today = new Date();
    return today.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
});

const formatRupiah = (angka) => {
    if (angka === undefined || angka === null || isNaN(angka)) return 'Rp. 0';
    return 'Rp. ' + Number(angka).toLocaleString('id-ID');
};

const fetchLaporanData = async () => {
    isLoading.value = true;
    try {
        const tanggalAwal = route.query.tanggal_awal || route.params.tanggal_awal;
        const tanggalAkhir = route.query.tanggal_akhir || route.params.tanggal_akhir;

        const payload = {
            tanggal_awal: tanggalAwal,
            tanggal_akhir: tanggalAkhir
        };

        const response = await laporanService.getLaporanPembelian(payload);

        if (response && response.status) {
            laporanData.value = response.laporanData;
            document.title = `LAPORAN-PEMBELIAN-${tanggalAwal}_sd_${tanggalAkhir}`;
        }
    } catch (error) {
        console.error("Gagal memuat data laporan pembelian:", error);
    } finally {
        isLoading.value = false;

        if (laporanData.value) {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }
};

onMounted(() => {
    fetchLaporanData();
});
</script>

<style>
@media print {
    @page {
        size: A4 portrait;
        margin: 1cm;
    }

    body {
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        background-color: #fff !important;
    }

    .print-header {
        display: table-header-group;
    }

    .print-footer {
        display: table-footer-group;
    }

    tr {
        page-break-inside: avoid;
    }
}
</style>
