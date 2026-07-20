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
                <span>Menyiapkan Preview Nota Offtake...</span>
            </div>
        </div>

        <!-- Nota Container (Ukuran A4 Standar) -->
        <div v-else-if="notaData"
            class="w-[21cm] min-h-[29.7cm] bg-white p-8 text-slate-800 shadow-2xl border border-zinc-700 flex flex-col justify-between print:shadow-none print:border-none print:p-0 print:w-full print:min-h-0">

            <table class="w-full border-collapse">

                <!-- 🌟 HEADER TABLE (Otomatis Diulang di Setiap Halaman A4) -->
                <thead class="print-header">
                    <tr>
                        <td colspan="7" class="pb-4">
                            <!-- KOP SURAT / HEADER NOTA -->
                            <div class="grid grid-cols-12 gap-2 items-start border-b-2 border-slate-800 pb-3">
                                <div class="col-span-7 flex gap-4 items-center">
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
                                        <p
                                            class="text-[9px] text-green-600 font-extrabold flex items-center gap-1 leading-none">
                                            📲 <span class="font-mono">0822-2537-7888</span>
                                        </p>
                                    </div>
                                </div>

                                <div class="col-span-5 flex flex-col justify-between items-end">
                                    <h1
                                        class="text-base font-black uppercase tracking-wider text-slate-800 border-b-2 border-amber-500 pb-0.5 mb-1 inline-block">
                                        Nota Offtake Supplier
                                    </h1>

                                    <table class="text-[9.5px] text-left">
                                        <tbody>
                                            <tr>
                                                <td class="text-slate-500 py-0.5 text-right font-medium" colspan="2">
                                                    Purwokerto, {{ formatTanggal(notaData.tanggal) }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="py-0.5 pr-2 text-slate-500">Supplier</td>
                                                <!-- 🌟 DIBERSIHKAN: Sesuaikan dengan JSON API "supplier_nama" -->
                                                <td class="py-0.5 font-bold uppercase text-slate-900">: {{
                                                    notaData.supplier_nama || notaData.nama_suplier || '-' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="py-0.5 pr-2 text-slate-500">No. HP / Kontak</td>
                                                <!-- 🌟 DIBERSIHKAN: Sesuaikan dengan JSON API "kontak" -->
                                                <td class="py-0.5 text-slate-700 font-mono font-semibold">: {{
                                                    notaData.kontak || notaData.hp_suplier || '-' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="py-0.5 pr-2 text-slate-500">No. Transaksi</td>
                                                <td class="py-0.5 font-mono font-bold text-slate-800">: {{
                                                    notaData.kode_transaksi }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- 🌟 FIX HEADER TABEL BARANG: Dipisah menjadi TR tersendiri agar presisi 7 Kolom -->
                    <tr class="bg-slate-100 text-[9px] uppercase font-bold text-slate-700 border-b border-t border-slate-300">
                        <th class="border-r border-slate-300 py-2 w-[6%] text-center">No</th>
                        <th class="border-r border-slate-300 py-2 w-[12%] text-center">Foto</th>
                        <th class="border-r border-slate-300 py-2 w-[38%] text-left px-3">Uraian / Nama Perhiasan</th>
                        <th class="border-r border-slate-300 py-2 w-[10%] text-center">Karat</th>
                        <th class="border-r border-slate-300 py-2 w-[10%] text-center">Berat (g)</th>
                        <th class="border-r border-slate-300 py-2 w-[12%] text-right pr-2">Estimasi @g</th>
                        <th class="py-2 w-[12%] text-right pr-3">Total Sub</th>
                    </tr>
                </thead>

                <!-- 🌟 BODY TABLE (Data Produk Mengalir Secara Otomatis) -->
                <tbody class="divide-y divide-slate-200 text-[10px]">
                    <tr v-for="(item, index) in notaData.items" :key="index" class="break-inside-avoid">
                        <td class="py-2 text-center text-slate-400 font-mono border-r border-slate-200">
                            {{ index + 1 }}
                        </td>
                        <td class="py-2 border-r border-slate-200 text-center p-1">
                            <img v-if="item.foto" :src="dapatkanUrlFotoProduk(item.foto)" alt="Produk"
                                class="w-12 h-12 object-contain rounded border border-slate-200 mx-auto" />
                            <div v-else
                                class="w-12 h-12 bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-[8px] text-slate-400 font-bold mx-auto">
                                NO FOTO
                            </div>
                        </td>
                        <td class="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">
                            {{ item.nama_produk }}
                            <span class="block text-[8.5px] font-mono text-slate-400 font-normal">
                                Kode: {{ item.kodeproduk || item.kode_produk || '-' }}
                            </span>
                        </td>
                        <td class="py-2 text-center font-mono border-r border-slate-200">
                            {{ item.karat }}
                        </td>
                        <td class="py-2 text-center font-mono font-bold border-r border-slate-200">
                            {{ Number(item.berat || 0).toFixed(2) }} g
                        </td>
                        <td class="py-2 pr-2 text-right font-mono border-r border-slate-200">
                            {{ formatRupiah(item.harga_per_gram) }}
                        </td>
                        <td class="py-2 pr-3 text-right font-mono font-bold text-slate-900">
                            {{ formatRupiah(item.total_harga || (item.berat * item.harga_per_gram)) }}
                        </td>
                    </tr>
                </tbody>

                <!-- 🌟 FOOTER TABLE (Otomatis Diulang di Setiap Bawah Halaman A4) -->
                <tfoot class="print-footer">
                    <tr>
                        <td colspan="7" class="pt-4">
                            <div class="border-t-2 border-slate-800 pt-3 break-inside-avoid">
                                <div class="grid grid-cols-12 gap-3 items-end">

                                    <!-- Sisi Kiri: Catatan & Security Hash -->
                                    <div class="col-span-6 text-[8px] text-slate-500 space-y-1">
                                        <p class="font-bold text-slate-700 uppercase tracking-wider">Keterangan / Catatan:</p>
                                        <p class="italic text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
                                            "{{ notaData.keterangan || 'Tidak ada catatan tambahan.' }}"
                                        </p>
                                        <div class="pt-1 text-[8px] font-mono text-slate-400">
                                            ID Hash Validasi: <span class="font-bold">{{ generateHash(notaData.kode_transaksi) }}</span>
                                        </div>
                                    </div>

                                    <!-- Sisi Kanan: TTD & Total Pembayaran -->
                                    <div class="col-span-6 flex flex-col justify-end">
                                        <div class="grid grid-cols-12 items-end gap-2">
                                            <div class="col-span-6 text-center">
                                                <p class="text-[8px] text-slate-400 mb-8">Penerima / Supplier,</p>
                                                <p class="font-bold border-t border-slate-300 inline-block pt-0.5 text-slate-700 min-w-[100px] uppercase text-[9px]">
                                                    ( {{ notaData.supplier_nama || notaData.nama_suplier || 'SUPPLIER' }} )
                                                </p>
                                            </div>

                                            <div class="col-span-6 text-right">
                                                <span class="text-[8px] text-slate-400 uppercase tracking-widest block">Total Terima Dana</span>
                                                <span class="font-mono text-sm font-black text-slate-900 border-b-2 border-double border-slate-800 pb-0.5">
                                                    {{ formatRupiah(notaData.grand_total) }}
                                                </span>
                                            </div>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { offtakeService } from '../services/offtakeService';
import logoTokoImg from '@/assets/img/LOGOTOKO.png';

const route = useRoute();
const isLoading = ref(true);
const notaData = ref(null);
const logoToko = ref(logoTokoImg);

const formatTanggal = (tanggalString) => {
    if (!tanggalString) return '-';
    try {
        const date = new Date(tanggalString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    } catch (e) {
        return tanggalString;
    }
};

const formatRupiah = (angka) => {
    if (angka === undefined || angka === null || isNaN(angka)) return 'Rp 0';
    return 'Rp ' + Number(angka).toLocaleString('id-ID');
};

const generateHash = (str) => {
    if (!str) return 'N/A';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(16).toUpperCase();
};

const dapatkanUrlFotoProduk = (fotoString) => {
    if (!fotoString) return '';
    if (fotoString.startsWith('http://') || fotoString.startsWith('https://')) {
        return fotoString;
    }
    const namaFile = fotoString.split('/').pop();
    const produkUrl = import.meta.env.VITE_PRODUK_URL;
    return `${produkUrl}/${namaFile}`;
};

const fetchNotaData = async () => {
    isLoading.value = true;
    try {
        const kodeTransaksi = route.params.kodeTransaksi || route.query.kode;

        if (!kodeTransaksi) {
            console.error("Kode transaksi tidak ditemukan!");
            return;
        }

        const payload = {
            kode: kodeTransaksi
        };

        const response = await offtakeService.getNotaData(payload);

        if (response && response.status) {
            notaData.value = response.notaData;
            document.title = `Nota_Offtake_${notaData.value.kode_transaksi}`;
        }
    } catch (error) {
        console.error("Gagal memuat data nota offtake:", error);
    } finally {
        isLoading.value = false;

        if (notaData.value) {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }
};

onMounted(() => {
    fetchNotaData();
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

    /* Memastikan Header dan Footer Diulang Otomatis di Setiap Halaman */
    .print-header {
        display: table-header-group;
    }

    .print-footer {
        display: table-footer-group;
    }

    /* Mencegah Baris Tabel Terpotong di Tengah Halaman */
    tr {
        page-break-inside: avoid;
    }
}
</style>
