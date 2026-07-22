<template>
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="isModalEditOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div
                class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl overflow-hidden flex flex-col">

                <!-- HEADER -->
                <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        Edit Detail Pembelian Produk
                    </h3>
                    <button type="button" @click="closeModal"
                        class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition cursor-pointer">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- BODY -->
                <form @submit.prevent="handleSubmit" class="p-5 flex flex-col gap-3">
                    <!-- KODE PRODUK & HARGA JUAL -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Kode Produk
                            </label>
                            <input type="text" :value="formPembelianDetail.kodeproduk" readonly
                                class="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl cursor-not-allowed" />
                        </div>
                        <div class="space-y-1">
                            <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Harga Jual Nota
                            </label>
                            <input type="text" :value="formatRupiah(formPembelianDetail.hargajual)" readonly
                                class="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl cursor-not-allowed" />
                        </div>
                    </div>

                    <!-- KONDISI BARANG -->
                    <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Kondisi Produk
                        </label>
                        <select v-model="formPembelianDetail.kondisi"
                            class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-400 transition">
                            <option :value="null" disabled>-- Pilih Kondisi Barang --</option>
                            <option v-for="item in kondisiList" :key="item.value" :value="item">
                                {{ item.label }}
                            </option>
                        </select>
                    </div>

                    <!-- JENIS HARGA BELI -->
                    <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Jenis Harga Beli
                        </label>
                        <select v-model="hargaBeliPilihan"
                            class="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-400 transition">
                            <option v-for="opsi in opsiHargaBeli" :key="opsi.value" :value="opsi">
                                {{ opsi.label }}
                            </option>
                        </select>
                    </div>

                    <!-- MANUAL HARGA -->
                    <div v-if="hargaBeliPilihan?.value === 'lebih_tinggi'" class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Harga Beli Manual (Rp)
                        </label>
                        <input type="number" v-model="hargaManual" placeholder="Input nominal..."
                            class="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-950 dark:focus:ring-blue-400 transition" />
                    </div>

                    <!-- PREVIEW HARGA BELI FIX -->
                    <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl flex items-center justify-between">
                        <span class="text-xs font-extrabold text-blue-950 dark:text-blue-300 uppercase tracking-tight">
                            Harga Beli Fix
                        </span>
                        <span class="text-sm font-mono font-black text-blue-950 dark:text-blue-300">
                            {{ formatRupiah(formPembelianDetail.hargabeli) }}
                        </span>
                    </div>

                    <!-- FOOTER -->
                    <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl uppercase tracking-wider transition cursor-pointer">
                            Batal
                        </button>
                        <button type="submit" :disabled="isLoadingPembelianDetail"
                            class="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer disabled:opacity-50">
                            <Loader2 v-if="isLoadingPembelianDetail" class="w-3.5 h-3.5 animate-spin" />
                            <span>{{ isLoadingPembelianDetail ? 'Simpan...' : 'Simpan Detail' }}</span>
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { X, Loader2 } from 'lucide-vue-next';
import { usePembelianDariToko } from '../composables/usePembelianDariToko';
import { toRupiah } from '../../../utilities/format/toRupiah';

const formatRupiah = toRupiah();

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
