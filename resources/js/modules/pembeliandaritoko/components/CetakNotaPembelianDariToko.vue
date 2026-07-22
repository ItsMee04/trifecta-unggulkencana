<template>
    <div class="min-h-screen bg-zinc-800 flex items-center justify-center p-6 print:bg-white print:p-0">

        <div v-if="isLoading" class="text-white font-semibold animate-pulse print:hidden">
            <div class="flex flex-col items-center gap-3">
                <svg class="animate-spin h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <span>Menyiapkan Preview Nota Pembelian...</span>
            </div>
        </div>

        <div v-else-if="notaData"
            class="w-[21cm] h-[11cm] bg-white p-5 text-[10px] text-slate-800 shadow-2xl border border-zinc-700 flex flex-col justify-between print:shadow-none print:border-none print:p-4 print:mx-0">

            <div class="grid grid-cols-12 gap-2 items-center">
                <div class="col-span-8 flex gap-4 items-center">
                    <img :src="logoToko" alt="Logo Toko" class="w-[80px] h-[80px] object-contain flex-shrink-0" />

                    <div class="space-y-1">
                        <span
                            class="text-[9px] uppercase tracking-wider font-extrabold text-slate-800 block leading-none">
                            Toko Emas
                        </span>
                        <h2 class="text-[20px] font-black uppercase tracking-wide text-amber-500 leading-none">
                            Unggul Kencana
                        </h2>
                        <p class="text-[10px] italic text-slate-600 font-bold leading-tight">
                            "Kilau Abadi, Investasi Bernilai"
                        </p>
                        <p class="text-[9.5px] text-slate-500 font-medium leading-tight max-w-[380px]">
                            Ruko No. 8 Jl. Patimura, Karang Lewas, Purwokerto, Jawa Tengah, Indonesia
                        </p>
                        <p class="text-[10px] text-green-600 font-extrabold flex items-center gap-1 leading-none mt-1">
                            📲 <span class="font-mono">0822-2537-7888</span>
                        </p>
                    </div>
                </div>

                <div class="col-span-4 flex flex-col justify-between items-end self-stretch">
                    <h1
                        class="text-sm font-black uppercase tracking-wider text-slate-700 border-b-2 border-slate-300 pb-0.5 mb-1 inline-block">
                        Nota Pembelian
                    </h1>

                    <table class="text-[9px] text-left">
                        <tbody>
                            <tr>
                                <td class="text-slate-500 py-0.5 font-medium text-right" colspan="2">
                                    Purwokerto, {{ formatTanggal(notaData.tanggal) }}
                                </td>
                            </tr>
                            <tr>
                                <td class="py-0.5 pr-2 text-slate-500">Pelanggan</td>
                                <td class="py-0.5 font-bold uppercase text-slate-900">: {{ notaData.namapelanggan }}
                                </td>
                            </tr>
                            <tr>
                                <td class="py-0.5 pr-2 text-slate-500">Alamat / Kota</td>
                                <td class="py-0.5 text-slate-700 uppercase font-semibold">: {{ notaData.alamat }}</td>
                            </tr>
                            <tr>
                                <td class="py-0.5 pr-2 text-slate-500">No. HP</td>
                                <td class="py-0.5 text-slate-700 font-mono font-semibold">: {{ notaData.kontak }}
                                </td>
                            </tr>
                            <tr>
                                <td class="py-0.5 pr-2 text-slate-500">No. Transaksi</td>
                                <td class="py-0.5 font-mono font-bold text-slate-800">: {{ notaData.kode }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="flex-grow my-2 flex flex-col justify-between">
                <table
                    class="w-full h-full border border-slate-300 text-center border-collapse table-fixed flex flex-col">
                    <thead class="w-full">
                        <tr
                            class="bg-slate-100 text-[8px] uppercase font-bold text-slate-600 border-b border-slate-300 flex w-full">
                            <th class="border-r border-slate-300 py-1.5 w-[15%] flex items-center justify-center">Foto
                                Produk</th>
                            <th class="border-r border-slate-300 py-1.5 w-[42%] text-left px-3 flex items-center">Uraian
                                Produk</th>
                            <th class="border-r border-slate-300 py-1.5 w-[11%] flex items-center justify-center">Berat
                            </th>
                            <th class="border-r border-slate-300 py-1.5 w-[11%] flex items-center justify-center">Karat
                            </th>
                            <th
                                class="border-r border-slate-300 py-1.5 w-[11%] text-right pr-3 flex items-center justify-end">
                                Harga Beli</th>
                            <th class="py-1.5 w-[10%] text-right pr-3 flex items-center justify-end">Total</th>
                        </tr>
                    </thead>
                    <tbody class="flex-grow flex flex-col justify-start w-full overflow-y-auto">
                        <tr v-for="(item, index) in notaData.items" :key="index"
                            class="text-[9px] flex w-full items-center border-b border-slate-200 last:border-b-0 py-2 h-[140px]">

                            <td class="border-r border-slate-300 w-[15%] flex items-center justify-center p-1">
                                <img v-if="item.image" :src="dapatkanUrlFotoProduk(item.image)" alt="Produk"
                                    class="w-20 h-20 max-w-full max-h-full object-contain block rounded-md border border-slate-200 shadow mx-auto" />
                                <div v-else
                                    class="w-20 h-20 bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center text-[9px] text-slate-400 font-bold mx-auto">
                                    NO FOTO
                                </div>
                            </td>

                            <td
                                class="border-r border-slate-300 w-[42%] text-left px-3 font-semibold text-slate-700 h-full flex flex-col justify-center">
                                <span class="font-mono text-[9px] text-slate-400 block mb-0.5">#{{ item.kodeproduk }}</span>
                                <span class="line-clamp-3 leading-relaxed text-[10px]">
                                    {{ item.namaproduk }}
                                </span>
                            </td>

                            <td
                                class="border-r border-slate-300 w-[11%] font-mono h-full flex items-center justify-center text-[10px]">
                                {{ item.berat }} g
                            </td>

                            <td
                                class="border-r border-slate-300 w-[11%] font-mono h-full flex items-center justify-center text-[10px]">
                                {{ item.karat }}
                            </td>

                            <td
                                class="border-r border-slate-300 w-[11%] text-right pr-3 font-mono h-full flex items-center justify-end text-[10px]">
                                {{ formatRupiah(item.hargabeli) }}
                            </td>

                            <td
                                class="w-[10%] text-right pr-3 font-mono font-bold text-slate-900 h-full flex items-center justify-end text-[11px]">
                                {{ formatRupiah(item.keranjangtotal) }}
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="grid grid-cols-12 gap-3 items-end border-t border-slate-200 pt-2">
                <div class="col-span-5 text-[7px] text-slate-500 space-y-0.5 self-start">
                    <span class="font-bold text-red-600 block uppercase tracking-wider">⚠️ Perhatian:</span>
                    <p class="leading-tight">1. Bila dilebur ada penurunan kadar kurang lebih 10%.</p>
                    <p class="leading-tight">2. Bila dijual kembali ongkos hilang.</p>
                    <div class="mt-2 text-[8px] font-mono text-slate-400 bg-slate-50 px-1 py-0.5 rounded inline-block">
                        ID: <span class="font-bold">{{ generateHash(notaData.kode) }}</span>
                    </div>
                </div>

                <div class="col-span-7 flex flex-col justify-end">
                    <div
                        class="bg-amber-50/50 border border-amber-200 rounded p-1 mb-2 text-[8px] text-slate-700 italic">
                        <strong
                            class="not-italic text-amber-700 block font-bold text-[7px] uppercase tracking-wide">Terbilang:</strong>
                        "{{ notaData.terbilang }}"
                    </div>

                    <div class="grid grid-cols-12 items-center gap-2">
                        <div class="col-span-6 text-center">
                            <p class="text-[7px] text-slate-400 mb-6">Hormat Kami,</p>
                            <p
                                class="font-bold border-t border-slate-300 inline-block pt-0.5 text-slate-600 min-w-[100px] uppercase text-[8px]">
                                {{ notaData.namapegawai || 'ADMIN' }}
                            </p>
                        </div>

                        <div class="col-span-6 text-right">
                            <span class="text-[7px] text-slate-400 uppercase tracking-widest block">Grand Total</span>
                            <span
                                class="font-mono text-xs font-black text-slate-900 border-b-2 border-double border-slate-400 pb-0.5">
                                {{ formatRupiah(notaData.total) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { pembeliandaritokoService } from '../services/pembeliandaritokoService';
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

const fetchNotaRealData = async () => {
    isLoading.value = true;
    try {
        const kodeTransaksi = route.params.kodeTransaksi;

        if (!kodeTransaksi) {
            console.error("Kode transaksi tidak ditemukan di URL!");
            return;
        }

        // 🌟 PERBAIKAN 1: Kirim { kode: kodeTransaksi } langsung tanpa double 'params'
        const response = await pembeliandaritokoService.getNotaData({
            kode: kodeTransaksi
        });

        if (response && response.status) {
            // 🌟 PERBAIKAN 2: Controller sudah merapikan response menjadi objek notaData
            notaData.value = response.notaData;

            if (notaData.value?.kode) {
                document.title = `Nota_Pembelian_${notaData.value.kode}`;
            }
        }
    } catch (error) {
        console.error("Gagal memuat data nota pembelian dari server:", error);
    } finally {
        isLoading.value = false;

        if (notaData.value) {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }
};

const dapatkanUrlFotoProduk = (fotoString) => {
    if (!fotoString) return '';
    const namaFile = fotoString.split('/').pop();
    const produkUrl = import.meta.env.VITE_PRODUK_URL;
    return `${produkUrl}/${namaFile}`;
};

onMounted(() => {
    fetchNotaRealData();
});
</script>

<style>
@media print {
    @page {
        size: 21cm 11cm;
        margin: 0;
    }

    body {
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        background-color: #fff !important;
    }
}
</style>
