<template>
    <!-- Modal Overlay -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isModalEditOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">

            <!-- Modal Box -->
            <div
                class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transition-all">

                <!-- Modal Header -->
                <div
                    class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <div>
                        <h3 class="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                            Edit Detail Pembelian Produk
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Atur kondisi perhiasan dan jenis penyesuaian harga beli dari pelanggan.
                        </p>
                    </div>
                    <button @click="closeModal"
                        class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Modal Body -->
                <form @submit.prevent="handleSubmit" id="formEditDetail" class="p-6 space-y-4 overflow-y-auto flex-1">
                    <!-- GRID KODE & HARGA JUAL NOTA -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label
                                class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Kode Produk
                            </label>
                            <input type="text" :value="formPembelianDetail.kodeproduk" readonly
                                class="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed focus:outline-hidden" />
                        </div>
                        <div class="space-y-1">
                            <label
                                class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Harga Jual Nota
                            </label>
                            <input type="text" :value="formatRupiah(formPembelianDetail.hargajual)" readonly
                                class="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 cursor-not-allowed focus:outline-hidden" />
                        </div>
                    </div>

                    <!-- KONDISI BARANG -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Kondisi Produk
                        </label>
                        <select v-model="formPembelianDetail.kondisi"
                            class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 transition">
                            <option :value="null" disabled>-- Pilih Kondisi Barang --</option>
                            <option v-for="item in kondisiList" :key="item.value" :value="item">
                                {{ item.label }}
                            </option>
                        </select>
                    </div>

                    <!-- JENIS HARGA BELI -->
                    <div class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Jenis Harga Beli
                        </label>
                        <select v-model="hargaBeliPilihan"
                            class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 transition">
                            <option v-for="opsi in opsiHargaBeli" :key="opsi.value" :value="opsi">
                                {{ opsi.label }}
                            </option>
                        </select>
                    </div>

                    <!-- MANUAL HARGA -->
                    <div v-if="hargaBeliPilihan?.value === 'lebih_tinggi'" class="space-y-1.5">
                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Harga Beli Manual (Rp)
                        </label>
                        <input v-model="hargaManual" type="number" placeholder="Masukkan nominal harga beli..."
                            class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 transition" />
                    </div>

                    <!-- PREVIEW HASIL HARGA BELI -->
                    <div
                        class="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl flex items-center justify-between">
                        <span class="text-xs font-extrabold text-blue-950 dark:text-blue-300 uppercase tracking-tight">
                            Total Harga Beli Fix
                        </span>
                        <span class="text-base font-mono font-black text-blue-950 dark:text-blue-300">
                            {{ formatRupiah(formPembelianDetail.hargabeli) }}
                        </span>
                    </div>
                </form>

                <!-- Modal Footer -->
                <div
                    class="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
                    <button type="button" @click="closeModal"
                        class="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition uppercase tracking-wider cursor-pointer">
                        Batal
                    </button>
                    <button type="submit" form="formEditDetail" :disabled="isLoadingPembelianDetail"
                        class="px-5 py-2 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 uppercase tracking-wider cursor-pointer">
                        <Loader2 v-if="isLoadingPembelianDetail" class="w-4 h-4 animate-spin" />
                        <span>{{ isLoadingPembelianDetail ? 'Simpan...' : 'Simpan Detail' }}</span>
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { X, Loader2 } from 'lucide-vue-next';
import { usePembelianDariToko } from '../composables/usePembelianDariToko';
import {toRupiah } from '../../../utilities/format/toRupiah';

const { formatRupiah } = toRupiah()

const {
    isModalEditOpen,
    kondisiList,
    formPembelianDetail,
    isLoadingPembelianDetail,
    handleSubmitEdit,
    fetchKondisi,
} = usePembelianDariToko();

const opsiHargaBeli = [
    { label: 'Harga Jual', value: 'hargajual' },
    { label: 'Potongan 4%', value: 'potongan_4' },
    { label: 'Lebih Tinggi (Custom)', value: 'lebih_tinggi' }
];

const hargaBeliPilihan = ref(opsiHargaBeli[0]);
const hargaManual = ref('');

const hargaAkhir = computed(() => {
    const jual = parseFloat(formPembelianDetail.hargajual || 0);

    if (hargaBeliPilihan.value?.value === 'hargajual') {
        return jual;
    }
    if (hargaBeliPilihan.value?.value === 'potongan_4') {
        return Math.round(jual * 0.96);
    }
    if (hargaBeliPilihan.value?.value === 'lebih_tinggi') {
        return Number(hargaManual.value) || 0;
    }
    return jual;
});

const closeModal = () => {
    isModalEditOpen.value = false;
};

const handleSubmit = async () => {
    await handleSubmitEdit();
};

watch(hargaAkhir, (newVal) => {
    formPembelianDetail.hargabeli = newVal;
}, { immediate: true });

watch(hargaBeliPilihan, (newVal) => {
    formPembelianDetail.jenis_hargabeli = newVal?.value;
    if (newVal?.value !== 'lebih_tinggi') {
        hargaManual.value = '';
    }
});

watch(() => formPembelianDetail.id, () => {
    const foundOpsi = opsiHargaBeli.find(o => o.value === formPembelianDetail.jenis_hargabeli);
    hargaBeliPilihan.value = foundOpsi || opsiHargaBeli[0];
    hargaManual.value = formPembelianDetail.jenis_hargabeli === 'lebih_tinggi' ? formPembelianDetail.hargabeli : '';
});

onMounted(() => {
    fetchKondisi();
});
</script>
