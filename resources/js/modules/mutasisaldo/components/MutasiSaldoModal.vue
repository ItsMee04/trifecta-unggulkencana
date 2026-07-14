<template>
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">

        <Transition appear enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-show="isModalOpen" @click="handleClose"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-all"></div>
        </Transition>

        <div class="flex min-h-full items-center justify-center p-4 text-center">

            <Transition appear enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div v-show="isModalOpen"
                    class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 overflow-hidden text-left transition-all">

                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h2 class="font-bold text-slate-900 dark:text-white text-base">
                            {{ isEdit ? 'EDIT MUTASI SALDO' : 'TAMBAH MUTASI SALDO' }}
                        </h2>
                        <button @click="handleClose" type="button"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <form @submit.prevent="submitMutasiSaldo" class="p-6 space-y-4 font-sans">

                        <div class="space-y-1.5 relative">
                            <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Buku Rekening / Saldo</label>
                            <div class="relative">
                                <button type="button" @click="toggleSaldoDropdown"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                    <span :class="{ 'text-slate-400': !formMutasiSaldo.saldo_id }">
                                        {{ labelSaldoTerpilih }}
                                    </span>
                                    <ChevronDown
                                        class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': isSaldoDropdownOpen }" />
                                </button>
                            </div>

                            <div v-if="isSaldoDropdownOpen"
                                class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                <div class="relative shrink-0">
                                    <Search
                                        class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                    <input v-model="searchSaldoQuery" type="text"
                                        placeholder="Cari buku rekening / saldo..."
                                        class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                </div>

                                <ul class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                    <li v-for="sal in filteredDaftarSaldo" :key="sal.id" @click="pilihSaldo(sal)"
                                        class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                        :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': formMutasiSaldo.saldo_id === sal.id }">
                                        <span>{{ sal.rekening.toUpperCase() }}</span>
                                        <Check v-if="formMutasiSaldo.saldo_id === sal.id"
                                            class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                    </li>
                                    <li v-if="filteredDaftarSaldo.length === 0"
                                        class="px-3 py-4 text-center text-slate-400 dark:text-slate-500 italic">
                                        Buku rekening / saldo tidak ditemukan.
                                    </li>
                                </ul>
                            </div>
                            <span v-if="errors.saldo_id" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.saldo_id }}</span>
                        </div>

                        <div class="space-y-1.5">
                            <label for="tanggal" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Tanggal</label>
                            <input v-model="formMutasiSaldo.tanggal" type="date" id="tanggal"
                                @click="$event.target.showPicker()"
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 text-slate-900 dark:text-white transition dark:[color-scheme:dark] cursor-pointer" />
                            <span v-if="errors.tanggal" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.tanggal }}</span>
                        </div>

                        <div class="space-y-1.5 relative">
                            <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Jenis Transaksi</label>
                            <div class="relative">
                                <button type="button" @click="toggleJenisDropdown"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                    <span :class="{ 'text-slate-400': !formMutasiSaldo.jenis }">
                                        {{ labelJenisTerpilih }}
                                    </span>
                                    <ChevronDown
                                        class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': isJenisDropdownOpen }" />
                                </button>
                            </div>

                            <div v-if="isJenisDropdownOpen"
                                class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                <ul class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                    <li v-for="option in opsiJenis" :key="option" @click="pilihJenis(option)"
                                        class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                        :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': formMutasiSaldo.jenis === option }">
                                        <span>{{ option }}</span>
                                        <Check v-if="formMutasiSaldo.jenis === option"
                                            class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                    </li>
                                </ul>
                            </div>
                            <span v-if="errors.jenis" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.jenis }}</span>
                        </div>

                        <div class="space-y-1.5">
                            <label for="jumlah" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Jumlah / Nominal</label>
                            <input v-model="formMutasiSaldo.jumlah" type="text" id="jumlah" placeholder="Masukkan jumlah / nominal"
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 text-slate-900 dark:text-white transition dark:[color-scheme:dark]" />
                            <span v-if="errors.jumlah" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.jumlah }}</span>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Keterangan</label>
                            <textarea v-model="formMutasiSaldo.keterangan" rows="2" placeholder="Masukkan keterangan..."
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition resize-none"></textarea>
                            <span v-if="errors.keterangan" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.keterangan }}</span>
                        </div>

                        <div class="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <button type="button" @click="handleClose"
                                class="px-5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-rose-900/50 rounded-xl transition active:scale-95 focus:outline-none">
                                Cancel / Close
                            </button>

                            <button type="submit" :disabled="isLoading"
                                class="bg-blue-950 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-semibold text-sm transition shadow-xs active:scale-95 focus:outline-none">
                                {{ isLoading ? 'Saving...' : 'Save Changes' }}
                            </button>
                        </div>
                    </form>

                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { X, User, ChevronDown, Search, Check } from 'lucide-vue-next';
import { useMutasiSaldo } from '../composables/useMutasiSaldo';
import { saldoService } from '../../saldo/services/saldoService';

const { isModalOpen, isEdit, formMutasiSaldo, submitMutasiSaldo, errors, isLoading, closeModal } = useMutasiSaldo();

const daftarSaldo = ref([]);

// ─── STATE & LOGIKADROP DOWN SALDO ───
const isSaldoDropdownOpen = ref(false);
const searchSaldoQuery = ref('');

const labelSaldoTerpilih = computed(() => {
    if (!formMutasiSaldo.saldo_id || daftarSaldo.value.length === 0) return '-- Pilih Saldo --';
    const ditemukan = daftarSaldo.value.find(s => s.id === formMutasiSaldo.saldo_id);
    return ditemukan ? ditemukan.rekening.toUpperCase() : '-- Pilih Saldo --';
});

const filteredDaftarSaldo = computed(() => {
    const q = searchSaldoQuery.value.toLowerCase().trim();
    if (!q) return daftarSaldo.value;
    return daftarSaldo.value.filter(s => (s.rekening || '').toLowerCase().includes(q));
});

const pilihSaldo = (sal) => {
    formMutasiSaldo.saldo_id = sal.id;
    isSaldoDropdownOpen.value = false;
    searchSaldoQuery.value = '';
};

const toggleSaldoDropdown = () => {
    isSaldoDropdownOpen.value = !isSaldoDropdownOpen.value;
    if (isSaldoDropdownOpen.value) isJenisDropdownOpen.value = false; // Tutup dropdown sebelah jika terbuka
};


// ─── STATE & LOGIKA DROPDOWN JENIS STATIS ───
const isJenisDropdownOpen = ref(false);
const opsiJenis = ref(['MASUK', 'KELUAR']);

const labelJenisTerpilih = computed(() => {
    return formMutasiSaldo.jenis ? formMutasiSaldo.jenis : '-- Pilih Jenis Transaksi --';
});

const pilihJenis = (option) => {
    formMutasiSaldo.jenis = option;
    isJenisDropdownOpen.value = false;
};

const toggleJenisDropdown = () => {
    isJenisDropdownOpen.value = !isJenisDropdownOpen.value;
    if (isJenisDropdownOpen.value) isSaldoDropdownOpen.value = false; // Tutup dropdown sebelah jika terbuka
};


// Ambil data Dropdown dari API
onMounted(async () => {
    try {
        const res = await saldoService.getSaldo();
        daftarSaldo.value = res.data || res;
    } catch (err) {
        console.error('Gagal memuat list buku rekening / saldo:', err);
    }
});

const handleClose = () => {
    isSaldoDropdownOpen.value = false;
    isJenisDropdownOpen.value = false;
    searchSaldoQuery.value = '';
    closeModal();
};
</script>
