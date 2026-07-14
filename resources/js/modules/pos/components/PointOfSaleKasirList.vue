<template>
    <div class="w-full lg:w-4/12 flex flex-col bg-slate-50 border-l border-slate-200 h-full">
        <div class="p-5 bg-white border-b border-slate-200 flex justify-between items-center">
            <div>
                <h5 class="text-lg font-bold text-slate-800 tracking-tight">DAFTAR ORDER</h5>
                <span class="text-xs font-medium text-slate-500">ID Transaksi : #{{ TransaksiID }}</span>
            </div>
        </div>

        <div class="sr-only">
            <input type="text" ref="barcodeInput" v-model="scanQuery" @keyup.enter="handleBarcodeScan"
                placeholder="Scanner active..." />
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-5">

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h6 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Informasi Pelanggan</h6>
                <div class="flex items-center gap-2 relative">
                    <div class="flex-grow relative">
                        <button type="button" @click="isPelangganDropdownOpen = !isPelangganDropdownOpen"
                            class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 flex justify-between items-center">
                            <span>{{ formPOS.pelanggan ? formPOS.pelanggan.label : 'Pilih pelanggan' }}</span>
                            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div v-if="isPelangganDropdownOpen"
                            class="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            <div class="p-2 sticky top-0 bg-white border-b border-slate-100">
                                <input type="text" v-model="searchPelangganQuery" placeholder="Cari nama/kontak..."
                                    class="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs focus:outline-hidden focus:border-amber-500 focus:bg-white" />
                            </div>
                            <ul class="py-1">
                                <li v-for="item in filteredPelangganList" :key="item.value"
                                    @click="formPOS.pelanggan = item; isPelangganDropdownOpen = false; searchPelangganQuery = ''"
                                    class="px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
                                    <span>{{ item.label }}</span>
                                    <span class="text-slate-400 text-[10px]">{{ item.kontak }}</span>
                                </li>
                                <li v-if="filteredPelangganList.length === 0"
                                    class="px-3 py-2 text-xs text-slate-400 text-center">
                                    Pelanggan tidak ditemukan
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <p v-if="errors.pelanggan" class="mt-1 text-xs text-red-500 font-medium">{{ errors.pelanggan }}</p>

                <div v-if="formPOS.pelanggan"
                    class="mt-3 bg-amber-50/50 rounded-lg p-3 border border-amber-100 flex justify-between items-center">
                    <div class="text-xs">
                        <p class="text-slate-500 font-medium">Saldo Poin Pelanggan</p>
                        <p class="text-slate-800 font-bold text-sm">{{ formPOS.pelanggan.point || 0 }} Poin</p>
                    </div>
                    <label class="inline-flex items-center cursor-pointer gap-2">
                        <input type="checkbox" v-model="usePoint" class="sr-only peer">
                        <div
                            class="relative w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500">
                        </div>
                        <span class="text-xs font-semibold text-slate-600 selection:bg-transparent">Gunakan</span>
                    </label>
                </div>

                <div v-if="usePoint" class="mt-2">
                    <input type="number" v-model.number="inputPoint" placeholder="Masukkan jumlah poin..."
                        class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                    <p v-if="errors.point" class="mt-1 text-[11px] text-red-500">{{ errors.point }}</p>
                    <p class="mt-1 text-[10px] text-slate-400">*Kelipatan minimal 10 poin (1 Poin = Rp 1.000)</p>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col p-4">
                <h6 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Item Keranjang</h6>

                <div v-if="TransaksiDetail.length === 0"
                    class="py-8 text-center flex flex-col items-center justify-center">
                    <svg class="w-10 h-10 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p class="text-xs text-slate-400">Keranjang masih kosong</p>
                </div>

                <div v-else class="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                    <div v-for="item in TransaksiDetail" :key="item.id" class="py-3 flex items-start gap-3 group">
                        <div class="flex-1 min-w-0">
                            <h5 class="text-sm font-semibold text-slate-800 truncate">{{ item.nama || item.nama_produk
                                }}</h5>
                            <p class="text-xs text-slate-400 mt-0.5">
                                {{ item.berat }}g | {{ item.karat }}K | Rp {{ Number(item.hargajual ||
                                0).toLocaleString('id-ID') }}/g
                            </p>
                        </div>
                        <div class="text-right flex flex-col items-end justify-between h-full gap-2">
                            <span class="text-sm font-bold text-slate-800">
                                Rp {{ Number(item.total || 0).toLocaleString('id-ID') }}
                            </span>
                            <button type="button" @click="handleDelete(item.id)"
                                class="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h6 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 font-medium">Promo /
                    Diskon</h6>
                <div class="relative">
                    <button type="button" @click="isDiskonDropdownOpen = !isDiskonDropdownOpen"
                        class="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 flex justify-between items-center">
                        <span>{{ formPOS.diskon ? formPOS.diskon.label : 'Pilih promo diskon' }}</span>
                        <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div v-if="isDiskonDropdownOpen"
                        class="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        <div class="p-2 sticky top-0 bg-white border-b border-slate-100">
                            <input type="text" v-model="searchDiskonQuery" placeholder="Cari diskon..."
                                class="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs focus:outline-hidden focus:border-amber-500 focus:bg-white" />
                        </div>
                        <ul class="py-1">
                            <li @click="formPOS.diskon = null; isDiskonDropdownOpen = false; searchDiskonQuery = ''"
                                class="px-3 py-2 text-xs text-red-500 hover:bg-slate-50 cursor-pointer font-medium">
                                Tanpa Diskon
                            </li>
                            <li v-for="item in filteredDiskonList" :key="item.value"
                                @click="formPOS.diskon = item; isDiskonDropdownOpen = false; searchDiskonQuery = ''"
                                class="px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
                                <span>{{ item.label }}</span>
                                <span class="text-emerald-600 font-semibold">{{ item.nilai }}%</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="p-5 bg-white border-t border-slate-200 space-y-4">
            <div class="space-y-2 text-xs font-medium text-slate-600">
                <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span class="text-slate-800 font-semibold">Rp {{ calculateSubtotal.toLocaleString('id-ID') }}</span>
                </div>
                <div v-if="calculateDiskon > 0" class="flex justify-between text-emerald-600">
                    <span>Diskon ({{ formPOS.diskon?.nilai }}%)</span>
                    <span>- Rp {{ calculateDiskon.toLocaleString('id-ID') }}</span>
                </div>
                <div v-if="calculatePotonganPoint > 0" class="flex justify-between text-amber-600">
                    <span>Potongan Poin</span>
                    <span>- Rp {{ calculatePotonganPoint.toLocaleString('id-ID') }}</span>
                </div>
            </div>

            <div class="pt-3 border-t border-dashed border-slate-200 flex justify-between items-center">
                <span class="text-sm font-bold text-slate-800">Grand Total</span>
                <span class="text-xl font-black text-amber-500">
                    Rp {{ calculateGrandTotal.toLocaleString('id-ID') }}
                </span>
            </div>

            <button type="button" @click="handlePayment" :disabled="isLoading || TransaksiDetail.length === 0"
                class="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 select-none">
                <span v-if="isLoading"
                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>PROSES PEMBAYARAN</span>
            </button>
            <p v-if="errors.payment" class="text-center text-xs font-medium text-red-500 mt-1">{{ errors.payment }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { usePOS } from '../composables/usePOS';

const {
    TransaksiID,
    PelangganList,
    DiskonList,
    selectedDiskonNilai,
    TransaksiDetail,
    isLoading,
    errors,
    formPOS,
    usePoint,
    inputPoint,
    calculatePotonganPoint,
    scanQuery,
    handleBarcodeScan,
    handleDelete,
    paymentTransaksi,
    fetchPelanggan,
    fetchDiskon,
    fetchKodeTransaksi,
    fetchTransaksiDetail,

    // Dropdown States
    isPelangganDropdownOpen,
    isDiskonDropdownOpen,
    searchPelangganQuery,
    searchDiskonQuery,
    filteredPelangganList,
    filteredDiskonList
} = usePOS();

const barcodeInput = ref(null);

// Menjaga agar scanner barcode tersembunyi tetap focus
const ensureFocus = () => {
    if (
        barcodeInput.value &&
        document.activeElement !== barcodeInput.value &&
        !isPelangganDropdownOpen.value &&
        !isDiskonDropdownOpen.value
    ) {
        barcodeInput.value.focus();
    }
};

// Hitung-hitungan Penjualan
const calculateSubtotal = computed(() => {
    return TransaksiDetail.value.reduce((acc, item) => {
        return acc + Number(item.total || 0);
    }, 0);
});

const calculateDiskon = computed(() => {
    return (calculateSubtotal.value * Number(selectedDiskonNilai.value || 0)) / 100;
});

const calculateGrandTotal = computed(() => {
    const total = calculateSubtotal.value - calculateDiskon.value - Number(calculatePotonganPoint.value || 0);
    return total < 0 ? 0 : total;
});

const handlePayment = () => {
    paymentTransaksi(calculateGrandTotal.value);
};

onMounted(() => {
    fetchPelanggan();
    fetchDiskon();
    fetchKodeTransaksi();
    fetchTransaksiDetail();

    nextTick(() => {
        ensureFocus();
    });

    // Pasang listener klik global agar fokus kembali otomatis saat kasir scan
    document.addEventListener('click', ensureFocus);
});

onUnmounted(() => {
    document.removeEventListener('click', ensureFocus);
});
</script>
