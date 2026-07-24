<template>
    <div v-if="isNotaModalOpen" class="fixed inset-0 z-50 overflow-y-auto font-sans">

        <Transition appear enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-show="isNotaModalOpen" @click="closeNotaModal"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-all"></div>
        </Transition>

        <div class="flex min-h-full items-center justify-center p-4 text-center">

            <Transition appear enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

                <div v-show="isNotaModalOpen"
                    class="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 overflow-hidden text-left transition-all">

                    <div
                        class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between relative">
                        <h2 class="font-bold text-slate-900 dark:text-white text-base">
                            DETAIL NOTA PENJUALAN
                        </h2>

                        <button @click="closeNotaModal" type="button" title="Close Modal"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <div class="p-6 space-y-4 font-sans">

                        <!-- Tampilan Loading (Memuat data...) -->
                        <div v-if="isLoadingNota" class="py-12 flex flex-col items-center justify-center gap-3">
                            <svg class="animate-spin h-8 w-8 text-blue-950 dark:text-indigo-400"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Memuat data...
                            </p>
                        </div>

                        <!-- Content Preview Nota -->
                        <div v-else-if="selectedNotaData"
                            class="w-[21cm] min-h-[11cm] mx-auto bg-white p-5 text-[10px] text-slate-800 border border-slate-200 rounded-xl flex flex-col justify-between">

                            <div class="grid grid-cols-12 gap-2 items-center">
                                <div class="col-span-8 flex gap-4 items-center">
                                    <img :src="logoToko" alt="Logo Toko"
                                        class="w-[80px] h-[80px] object-contain flex-shrink-0" />

                                    <div class="space-y-1">
                                        <span
                                            class="text-[9px] uppercase tracking-wider font-extrabold text-slate-800 block leading-none">
                                            Toko Emas
                                        </span>
                                        <h2
                                            class="text-[20px] font-black uppercase tracking-wide text-amber-500 leading-none">
                                            Unggul Kencana
                                        </h2>
                                        <p class="text-[10px] italic text-slate-600 font-bold leading-tight">
                                            "Kilau Abadi, Investasi Bernilai"
                                        </p>
                                        <p class="text-[9.5px] text-slate-500 font-medium leading-tight max-w-[380px]">
                                            Ruko No. 8 Jl. Patimura, Karang Lewas, Purwokerto, Jawa Tengah, Indonesia
                                        </p>
                                        <p
                                            class="text-[10px] text-green-600 font-extrabold flex items-center gap-1 leading-none mt-1">
                                            📲 <span class="font-mono">0822-2537-7888</span>
                                        </p>
                                    </div>
                                </div>

                                <div class="col-span-4 flex flex-col justify-between items-end self-stretch">
                                    <h1
                                        class="text-sm font-black uppercase tracking-wider text-slate-700 border-b-2 border-slate-300 pb-0.5 mb-1 inline-block">
                                        Nota Penjualan
                                    </h1>

                                    <table class="text-[9px] text-left">
                                        <tbody>
                                            <tr>
                                                <td class="text-slate-500 py-0.5 font-medium text-right" colspan="2">
                                                    Purwokerto, {{ formatTanggal(selectedNotaData.tanggal) }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="py-0.5 pr-2 text-slate-500">Pelanggan</td>
                                                <td class="py-0.5 font-bold uppercase text-slate-900">: {{
                                                    selectedNotaData.nama_pelanggan }}</td>
                                            </tr>
                                            <tr>
                                                <td class="py-0.5 pr-2 text-slate-500">Alamat / Kota</td>
                                                <td class="py-0.5 text-slate-700 uppercase font-semibold">: {{
                                                    selectedNotaData.alamat_pelanggan }}</td>
                                            </tr>
                                            <tr>
                                                <td class="py-0.5 pr-2 text-slate-500">No. HP</td>
                                                <td class="py-0.5 text-slate-700 font-mono font-semibold">: {{
                                                    selectedNotaData.hp_pelanggan }}</td>
                                            </tr>
                                            <tr>
                                                <td class="py-0.5 pr-2 text-slate-500">No. Transaksi</td>
                                                <td class="py-0.5 font-mono font-bold text-slate-800">: {{
                                                    selectedNotaData.kode_transaksi }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="flex-grow my-4">
                                <table class="w-full border border-slate-300 text-center border-collapse table-fixed">
                                    <thead>
                                        <tr
                                            class="bg-slate-100 text-[8px] uppercase font-bold text-slate-600 border-b border-slate-300 flex w-full">
                                            <th
                                                class="border-r border-slate-300 py-1.5 w-[15%] flex items-center justify-center">
                                                Foto Produk</th>
                                            <th
                                                class="border-r border-slate-300 py-1.5 w-[40%] text-left px-3 flex items-center">
                                                Uraian Produk</th>
                                            <th
                                                class="border-r border-slate-300 py-1.5 w-[10%] flex items-center justify-center">
                                                Berat</th>
                                            <th
                                                class="border-r border-slate-300 py-1.5 w-[10%] flex items-center justify-center">
                                                Karat</th>
                                            <th
                                                class="border-r border-slate-300 py-1.5 w-[12%] text-right pr-3 flex items-center justify-end">
                                                Harga @Gram</th>
                                            <th
                                                class="border-r border-slate-300 py-1.5 w-[10%] flex items-center justify-center">
                                                Diskon</th>
                                            <th class="py-1.5 w-[13%] text-right pr-3 flex items-center justify-end">
                                                Total</th>
                                        </tr>
                                    </thead>
                                    <tbody class="w-full">
                                        <tr v-for="(item, index) in selectedNotaData.items" :key="index"
                                            class="text-[9px] flex w-full items-center border-b border-slate-200 last:border-b-0 py-2">
                                            <td
                                                class="border-r border-slate-300 w-[15%] flex items-center justify-center p-1">
                                                <img v-if="item.foto" :src="dapatkanUrlFotoProduk(item.foto)"
                                                    alt="Produk"
                                                    class="w-20 h-20 max-w-full max-h-full object-contain block rounded-md border border-slate-200 shadow mx-auto" />
                                                <div v-else
                                                    class="w-20 h-20 bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center text-[9px] text-slate-400 font-bold mx-auto">
                                                    NO FOTO
                                                </div>
                                            </td>
                                            <td
                                                class="border-r border-slate-300 w-[40%] text-left px-3 font-semibold text-slate-700 h-full flex items-center">
                                                <span class="line-clamp-3 leading-relaxed text-[10px]">{{
                                                    item.nama_produk }}</span>
                                            </td>
                                            <td
                                                class="border-r border-slate-300 w-[10%] font-mono h-full flex items-center justify-center text-[10px]">
                                                {{ item.berat }} g</td>
                                            <td
                                                class="border-r border-slate-300 w-[10%] font-mono h-full flex items-center justify-center text-[10px]">
                                                {{ item.karat }}</td>
                                            <td
                                                class="border-r border-slate-300 w-[12%] text-right pr-3 font-mono h-full flex items-center justify-end text-[10px]">
                                                {{ formatRupiah(item.harga_per_gram) }}</td>
                                            <td
                                                class="border-r border-slate-300 w-[10%] font-mono text-red-500 h-full flex items-center justify-center text-[10px]">
                                                {{ item.diskon || '0%' }}</td>
                                            <td
                                                class="w-[13%] text-right pr-3 font-mono font-bold text-slate-900 h-full flex items-center justify-end text-[11px]">
                                                {{ formatRupiah(item.total_harga) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="grid grid-cols-12 gap-3 items-end border-t border-slate-200 pt-3">
                                <div class="col-span-5 text-[7px] text-slate-500 space-y-0.5 self-start">
                                    <span class="font-bold text-red-600 block uppercase tracking-wider">⚠️
                                        Perhatian:</span>
                                    <p class="leading-tight">1. Bila dilebur ada penurunan kadar kurang lebih 10%.</p>
                                    <p class="leading-tight">2. Bila dijual kembali ongkos hilang.</p>
                                    <div
                                        class="mt-2 text-[8px] font-mono text-slate-400 bg-slate-50 px-1 py-0.5 rounded inline-block">
                                        ID: <span class="font-bold">{{ generateHash(selectedNotaData.kode_transaksi)
                                        }}</span>
                                    </div>
                                </div>

                                <div class="col-span-7 flex flex-col justify-end">
                                    <div
                                        class="bg-amber-50/50 border border-amber-200 rounded p-1.5 mb-2 text-[8px] text-slate-700 italic">
                                        <strong
                                            class="not-italic text-amber-700 block font-bold text-[7px] uppercase tracking-wide">Terbilang:</strong>
                                        "{{ selectedNotaData.terbilang }}"
                                    </div>

                                    <div class="grid grid-cols-12 items-center gap-2">
                                        <div class="col-span-6 text-center">
                                            <p class="text-[7px] text-slate-400 mb-6">Hormat Kami,</p>
                                            <p
                                                class="font-bold border-t border-slate-300 inline-block pt-0.5 text-slate-600 min-w-[100px] uppercase text-[8px]">
                                                {{ selectedNotaData.nama_admin || 'ADMIN' }}</p>
                                        </div>

                                        <div class="col-span-6 text-right">
                                            <span
                                                class="text-[7px] text-slate-400 uppercase tracking-widest block">Grand
                                                Total</span>
                                            <span
                                                class="font-mono text-xs font-black text-slate-900 border-b-2 border-double border-slate-400 pb-0.5">{{
                                                    formatRupiah(selectedNotaData.grand_total) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Bagian Footer Modal -->
                        <div
                            class="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <!-- Tombol Close -->
                            <button type="button" @click="closeNotaModal"
                                class="px-5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-rose-900/50 rounded-xl transition active:scale-95 focus:outline-none">
                                Cancel / Close
                            </button>

                            <!-- Tombol Cetak Nota Ke Tab Baru -->
                            <button v-if="selectedNotaData" type="button" @click="cetakKeTabBaru"
                                class="px-5 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition active:scale-95 focus:outline-none flex items-center gap-2">
                                <Printer class="w-4 h-4" />
                                <span>Cetak Nota</span>
                            </button>
                        </div>

                    </div>

                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup>
import { X, Printer } from 'lucide-vue-next'; // Tambahkan Printer icon
import { useRouter } from 'vue-router'; // 1. Import useRouter
import { useTransaksi } from '../composables/useTransaksi';
import logoTokoImg from '@/assets/img/LOGOTOKO.png';

const router = useRouter(); // 2. Inisialisasi router

// Mengambil state & method langsung dari composable
const {
    isNotaModalOpen,
    isLoadingNota,
    selectedNotaData,
    closeNotaModal
} = useTransaksi();

const logoToko = logoTokoImg;

// 3. Method untuk membuka CetakNotaTransaksi di tab baru
const cetakKeTabBaru = () => {
    if (!selectedNotaData.value?.kode_transaksi) return;

    try {
        const routeData = router.resolve({
            name: 'CetakNotaTransaksi',
            params: { kodeTransaksi: selectedNotaData.value.kode_transaksi }
        });
        window.open(routeData.href, '_blank');
    } catch (error) {
        console.error('Gagal membuka tab cetak nota:', error);
    }
};

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
    const namaFile = fotoString.split('/').pop();
    const produkUrl = import.meta.env.VITE_PRODUK_URL;
    return `${produkUrl}/${namaFile}`;
};
</script>
