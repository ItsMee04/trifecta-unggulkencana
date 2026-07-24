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

                    <!-- Header Modal -->
                    <div
                        class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between relative">
                        <h2 class="font-bold text-slate-900 dark:text-white text-base">
                            DETAIL NOTA OFFTAKE SUPPLIER
                        </h2>

                        <button @click="closeNotaModal" type="button" title="Close Modal"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Body Modal -->
                    <div class="p-6 space-y-4 font-sans">

                        <!-- Tampilan Loading (Memuat data...) -->
                        <div v-if="isLoadingNota" class="py-12 flex flex-col items-center justify-center gap-3">
                            <svg class="animate-spin h-8 w-8 text-amber-500"
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

                        <!-- Content Preview Nota Offtake -->
                        <div v-else-if="selectedNotaData"
                            class="w-[21cm] min-h-[11cm] mx-auto bg-white p-6 text-[10px] text-slate-800 border border-slate-200 rounded-xl flex flex-col justify-between">

                            <div>
                                <!-- Header Nota -->
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
                                            <p class="text-[9px] text-green-600 font-extrabold flex items-center gap-1 leading-none">
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
                                                        Purwokerto, {{ formatTanggal(selectedNotaData.tanggal) }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="py-0.5 pr-2 text-slate-500">Supplier</td>
                                                    <td class="py-0.5 font-bold uppercase text-slate-900">: {{
                                                        selectedNotaData.supplier_nama || selectedNotaData.nama_suplier || '-' }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="py-0.5 pr-2 text-slate-500">No. HP / Kontak</td>
                                                    <td class="py-0.5 text-slate-700 font-mono font-semibold">: {{
                                                        selectedNotaData.kontak || selectedNotaData.hp_suplier || '-' }}</td>
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

                                <!-- Tabel Barang -->
                                <div class="mt-4">
                                    <table class="w-full border border-slate-300 border-collapse table-fixed">
                                        <thead>
                                            <tr class="bg-slate-100 text-[9px] uppercase font-bold text-slate-700 border-b border-slate-300">
                                                <th class="border-r border-slate-300 py-2 w-[6%] text-center">No</th>
                                                <th class="border-r border-slate-300 py-2 w-[12%] text-center">Foto</th>
                                                <th class="border-r border-slate-300 py-2 w-[38%] text-left px-3">Uraian / Nama Perhiasan</th>
                                                <th class="border-r border-slate-300 py-2 w-[10%] text-center">Karat</th>
                                                <th class="border-r border-slate-300 py-2 w-[10%] text-center">Berat (g)</th>
                                                <th class="border-r border-slate-300 py-2 w-[12%] text-right pr-2">Estimasi @g</th>
                                                <th class="py-2 w-[12%] text-right pr-3">Total Sub</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-200 text-[10px]">
                                            <tr v-for="(item, index) in selectedNotaData.items" :key="index">
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
                                                <td class="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800 text-left">
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
                                    </table>
                                </div>
                            </div>

                            <!-- Footer Nota -->
                            <div class="border-t-2 border-slate-800 pt-3 mt-4">
                                <div class="grid grid-cols-12 gap-3 items-end">
                                    <div class="col-span-6 text-[8px] text-slate-500 space-y-1">
                                        <p class="font-bold text-slate-700 uppercase tracking-wider">Keterangan / Catatan:</p>
                                        <p class="italic text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
                                            "{{ selectedNotaData.keterangan || 'Tidak ada catatan tambahan.' }}"
                                        </p>
                                        <div class="pt-1 text-[8px] font-mono text-slate-400">
                                            ID Hash Validasi: <span class="font-bold">{{ generateHash(selectedNotaData.kode_transaksi) }}</span>
                                        </div>
                                    </div>

                                    <div class="col-span-6 flex flex-col justify-end">
                                        <div class="grid grid-cols-12 items-end gap-2">
                                            <div class="col-span-6 text-center">
                                                <p class="text-[8px] text-slate-400 mb-8">Penerima / Supplier,</p>
                                                <p class="font-bold border-t border-slate-300 inline-block pt-0.5 text-slate-700 min-w-[100px] uppercase text-[9px]">
                                                    ( {{ selectedNotaData.supplier_nama || selectedNotaData.nama_suplier || 'SUPPLIER' }} )
                                                </p>
                                            </div>

                                            <div class="col-span-6 text-right">
                                                <span class="text-[8px] text-slate-400 uppercase tracking-widest block">Total Terima Dana</span>
                                                <span class="font-mono text-sm font-black text-slate-900 border-b-2 border-double border-slate-800 pb-0.5">
                                                    {{ formatRupiah(selectedNotaData.grand_total) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Bagian Footer Modal (Aksi) -->
                        <div class="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <button type="button" @click="closeNotaModal"
                                class="px-5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-rose-900/50 rounded-xl transition active:scale-95 focus:outline-none">
                                Cancel / Close
                            </button>

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
import { X, Printer } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useOfftake } from '../composables/useOfftake';
import logoTokoImg from '@/assets/img/LOGOTOKO.png';

const router = useRouter();

const {
    isNotaModalOpen,
    isLoadingNota,
    selectedNotaData,
    closeNotaModal
} = useOfftake();

const logoToko = logoTokoImg;

const cetakKeTabBaru = () => {
    if (!selectedNotaData.value?.kode_transaksi) return;

    try {
        const routeData = router.resolve({
            name: 'CetakNotaOfftake',
            params: { kodeTransaksi: selectedNotaData.value.kode_transaksi }
        });
        window.open(routeData.href, '_blank');
    } catch (error) {
        console.error('Gagal membuka tab cetak nota:', error);
    }

    console.log(selectedNotaData.value?.kode_transaksi)
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
    if (fotoString.startsWith('http://') || fotoString.startsWith('https://')) {
        return fotoString;
    }
    const namaFile = fotoString.split('/').pop();
    const produkUrl = import.meta.env.VITE_PRODUK_URL;
    return `${produkUrl}/${namaFile}`;
};
</script>
