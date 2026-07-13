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
                    class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 overflow-hidden text-left transition-all">

                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h2 class="font-bold text-slate-900 dark:text-white text-base">
                            {{ isEdit ? 'EDIT PRODUK' : 'TAMBAH PRODUK' }}
                        </h2>
                        <button @click="handleClose" type="button"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <form @submit.prevent="handleSubmit" class="p-6 space-y-4 font-sans text-xs">

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Nama
                                    Produk</label>
                                <input v-model="formProduk.nama" type="text" placeholder="Masukkan Nama Produk"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.nama" class="text-xs text-rose-500 font-medium block mt-1">{{
                                    errors.nama }}</span>
                            </div>

                            <div class="space-y-1.5 relative">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Jenis
                                    Produk</label>
                                <div class="relative">
                                    <button type="button"
                                        @click="isJenisProdukDropdownOpen = !isJenisProdukDropdownOpen"
                                        class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                        <span :class="{ 'text-slate-400': !formProduk.jenisproduk_id }">
                                            {{ labelJenisProdukTerpilih }}
                                        </span>
                                        <ChevronDown
                                            class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                            :class="{ 'rotate-180': isJenisProdukDropdownOpen }" />
                                    </button>
                                </div>
                                <div v-if="isJenisProdukDropdownOpen"
                                    class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                    <div class="relative shrink-0">
                                        <Search
                                            class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input v-model="searchJenisProdukQuery" type="text"
                                            placeholder="Cari jenis produk..."
                                            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                    </div>
                                    <ul
                                        class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                        <li v-for="jp in filteredDaftarJenisProduk" :key="jp.id"
                                            @click="pilihJenisProduk(jp)"
                                            class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                            :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': formProduk.jenisproduk_id === jp.id }">
                                            <span>{{ jp.jenis.toUpperCase() }}</span>
                                            <Check v-if="formProduk.jenisproduk_id === jp.id"
                                                class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </li>
                                    </ul>
                                </div>
                                <span v-if="errors.jenisproduk_id"
                                    class="text-xs text-rose-500 font-medium block mt-1">{{ errors.jenisproduk_id
                                    }}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1.5 relative">
                                <label
                                    class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Karat</label>
                                <div class="relative">
                                    <button type="button" @click="isKaratDropdownOpen = !isKaratDropdownOpen"
                                        class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                        <span :class="{ 'text-slate-400': !formProduk.karat_id }">
                                            {{ labelKaratTerpilih }}
                                        </span>
                                        <ChevronDown
                                            class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                            :class="{ 'rotate-180': isKaratDropdownOpen }" />
                                    </button>
                                </div>
                                <div v-if="isKaratDropdownOpen"
                                    class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                    <div class="relative shrink-0">
                                        <Search
                                            class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input v-model="searchKaratQuery" type="text" placeholder="Cari karat..."
                                            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                    </div>
                                    <ul
                                        class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                        <li v-for="kar in filteredDaftarKarat" :key="kar.id" @click="pilihKarat(kar)"
                                            class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                            :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': formProduk.karat_id === kar.id }">
                                            <span>{{ kar.karat.toUpperCase() }}</span>
                                            <Check v-if="formProduk.karat_id === kar.id"
                                                class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </li>
                                    </ul>
                                </div>
                                <span v-if="errors.karat_id" class="text-xs text-rose-500 font-medium block mt-1">{{
                                    errors.karat_id }}</span>
                            </div>

                            <div class="space-y-1.5 relative">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Jenis
                                    Karat</label>
                                <div class="relative">
                                    <button type="button" @click="isJenisKaratDropdownOpen = !isJenisKaratDropdownOpen"
                                        :disabled="!formProduk.karat_id"
                                        class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:cursor-not-allowed">
                                        <span :class="{ 'text-slate-400': !formProduk.jeniskarat_id }">
                                            {{ !formProduk.karat_id ? '-- Pilih Karat Terlebih Dahulu --' :
                                                labelJenisKaratTerpilih }}
                                        </span>
                                        <ChevronDown
                                            class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                            :class="{ 'rotate-180': isJenisKaratDropdownOpen }" />
                                    </button>
                                </div>
                                <div v-if="isJenisKaratDropdownOpen"
                                    class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                    <div class="relative shrink-0">
                                        <Search
                                            class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input v-model="searchJenisKaratQuery" type="text"
                                            placeholder="Cari jenis karat..."
                                            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                    </div>
                                    <ul
                                        class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                        <li v-for="jkar in filteredDaftarJenisKarat" :key="jkar.id"
                                            @click="pilihJenisKarat(jkar)"
                                            class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                            :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': formProduk.jeniskarat_id === jkar.id }">
                                            <span>{{ jkar.jenis.toUpperCase() }}</span>
                                            <Check v-if="formProduk.jeniskarat_id === jkar.id"
                                                class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </li>
                                    </ul>
                                </div>
                                <span v-if="errors.jeniskarat_id"
                                    class="text-xs text-rose-500 font-medium block mt-1">{{ errors.jeniskarat_id
                                    }}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Berat
                                    (Gram)</label>
                                <input v-model="formProduk.berat" type="text" placeholder="Contoh: 2.50"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.berat" class="text-xs text-rose-500 font-medium block mt-1">{{
                                    errors.berat }}</span>
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Harga
                                    Jual Dasar / Gram</label>
                                <div class="relative flex items-center">
                                    <span class="absolute left-3.5 text-slate-400 text-sm font-semibold">Rp</span>
                                    <input :value="formatRupiah(displayHargaMaster)" type="text" readonly disabled
                                        class="w-full pl-10 pr-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 cursor-not-allowed select-none" />
                                </div>
                                <p class="text-[10px] text-slate-400 mt-0.5">*Otomatis terisi dari master tabel harga.
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Lingkar
                                    <span class="text-slate-400 font-normal">(Boleh Kosong)</span></label>
                                <input v-model="formProduk.lingkar" type="text"
                                    placeholder="Masukkan lingkar angka bulat"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.lingkar" class="text-xs text-rose-500 font-medium block mt-1">{{
                                    errors.lingkar }}</span>
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Panjang
                                    <span class="text-slate-400 font-normal">(Boleh Kosong)</span></label>
                                <input v-model="formProduk.panjang" type="text"
                                    placeholder="Masukkan panjang angka bulat"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.panjang" class="text-xs text-rose-500 font-medium block mt-1">{{
                                    errors.panjang }}</span>
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label
                                class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Keterangan</label>
                            <textarea v-model="formProduk.keterangan" rows="2"
                                placeholder="Masukkan keterangan tambahan..."
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition resize-none"></textarea>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Foto
                                Produk</label>
                            <div
                                class="flex items-center gap-4 p-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/30">
                                <div
                                    class="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                                    <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover"
                                        alt="Preview Foto" />
                                    <Package v-else class="w-6 h-6 text-slate-400" />
                                </div>
                                <div class="space-y-1">
                                    <input type="file" id="image-produk" accept="image/*" @change="onFileChange"
                                        class="hidden" />
                                    <label for="image-produk"
                                        class="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition inline-block active:scale-95">
                                        Choose Image
                                    </label>
                                    <p class="text-[10px] text-slate-400">Format: JPG, PNG, WEBP. Maksimal 2MB.</p>
                                </div>
                            </div>
                            <span v-if="errors.image" class="text-xs text-rose-500 font-medium block mt-1">{{
                                errors.image }}</span>
                        </div>

                        <div
                            class="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <button type="button" @click="handleClose"
                                class="px-5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-rose-900/50 rounded-xl transition active:scale-95 focus:outline-none">
                                Cancel
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
import { ref, onMounted, computed, watch } from 'vue';
import { X, ChevronDown, Search, Check, Package } from 'lucide-vue-next';
import { useProduk } from '../composables/useProduk';
import { jenisprodukService } from '../../jenisproduk/services/jenisprodukService';
import { karatService } from '../../karat/services/karatService';
import { jeniskaratService } from '../../jeniskarat/services/jeniskaratService';
import { hargaService } from '../../harga/services/hargaService'; // Import Service Harga untuk cari relasi nominal

const { isModalOpen, isEdit, formProduk, imagePreview, submitProduk, errors, isLoading, closeModal } = useProduk();

const daftarJenisProduk = ref([]);
const daftarKarat = ref([]);
const daftarJenisKarat = ref([]);
const masterDaftarHarga = ref([]); // Menyimpan seluruh baris tabel harga dari DB

// ─── STATE TAMBAHAN UNTUK COMBOBOX ───
const isJenisProdukDropdownOpen = ref(false);
const isKaratDropdownOpen = ref(false);
const isJenisKaratDropdownOpen = ref(false);

const searchJenisProdukQuery = ref('');
const searchKaratQuery = ref('');
const searchJenisKaratQuery = ref('');
const displayHargaMaster = ref(0); // State lokal untuk render nominal Rp ke view input

// ─── STATE LOCKER EDIT (ANTI ASYNC RACE-CONDITION) ───
// Menggunakan Set untuk mencatat harga_id mana yang sudah berhasil dimuat saat pertama kali edit dibuka
const loadedHargaIds = ref(new Set());

// Kosongkan rekaman locker setiap kali modal ditutup agar bersih saat membuka produk berikutnya
watch(() => isModalOpen.value, (isOpen) => {
    if (!isOpen) {
        loadedHargaIds.value.clear();
    }
});

// ─── COMPUTED LABELS ───
const labelJenisProdukTerpilih = computed(() => {
    if (!formProduk.jenisproduk_id || daftarJenisProduk.value.length === 0) return '-- Pilih Jenis Produk --';
    const ditemukan = daftarJenisProduk.value.find(jp => jp.id === formProduk.jenisproduk_id);
    return ditemukan ? ditemukan.jenis.toUpperCase() : '-- Pilih Jenis Produk --';
});

const labelKaratTerpilih = computed(() => {
    if (!formProduk.karat_id || daftarKarat.value.length === 0) return '-- Pilih Karat --';
    const ditemukan = daftarKarat.value.find(k => k.id === formProduk.karat_id);
    return ditemukan ? ditemukan.karat.toUpperCase() : '-- Pilih Karat --';
});

const labelJenisKaratTerpilih = computed(() => {
    if (!formProduk.jeniskarat_id || daftarJenisKarat.value.length === 0) return '-- Pilih Jenis Karat --';
    const ditemukan = daftarJenisKarat.value.find(jk => jk.id === formProduk.jeniskarat_id);
    return ditemukan ? ditemukan.jenis.toUpperCase() : '-- Pilih Jenis Karat --';
});

// ─── COMPUTED SEARCH FILTERS ───
const filteredDaftarJenisProduk = computed(() => {
    const q = searchJenisProdukQuery.value.toLowerCase().trim();
    if (!q) return daftarJenisProduk.value;
    return daftarJenisProduk.value.filter(jp => (jp.jenis || '').toLowerCase().includes(q));
});

const filteredDaftarKarat = computed(() => {
    const q = searchKaratQuery.value.toLowerCase().trim();
    if (!q) return daftarKarat.value;
    return daftarKarat.value.filter(k => (k.karat || '').toLowerCase().includes(q));
});

const filteredDaftarJenisKarat = computed(() => {
    if (!formProduk.karat_id) return [];
    let hasil = daftarJenisKarat.value.filter(jk => jk.karat_id === formProduk.karat_id);
    const q = searchJenisKaratQuery.value.toLowerCase().trim();
    if (q) hasil = hasil.filter(jk => (jk.jenis || '').toLowerCase().includes(q));
    return hasil;
});

// ─── ACTIONS (SELECT SELECTION) ───
const pilihJenisProduk = (jp) => {
    formProduk.jenisproduk_id = jp.id;
    isJenisProdukDropdownOpen.value = false;
    searchJenisProdukQuery.value = '';
};

const pilihKarat = (kar) => {
    if (formProduk.karat_id !== kar.id) {
        formProduk.jeniskarat_id = null; // Reset anak jika induk berganti
    }
    formProduk.karat_id = kar.id;
    isKaratDropdownOpen.value = false;
    searchKaratQuery.value = '';
};

const pilihJenisKarat = (jkarat) => {
    formProduk.jeniskarat_id = jkarat.id;
    isJenisKaratDropdownOpen.value = false;
    searchJenisKaratQuery.value = '';
};

// ─── 🌟 AUTOMATIC HARGA AUTOMATION (ANTI INFINITE LOOP) ───
watch(
    () => [formProduk.karat_id, formProduk.jeniskarat_id, masterDaftarHarga.value, formProduk.harga_id],
    ([newKarat, newJenisKarat, currentMasterHarga, currentHargaId]) => {
        // 1. Jika data master harga dari API belum selesai di-fetch, amankan ke nilai 0 dulu tanpa merusak state form
        if (!currentMasterHarga || currentMasterHarga.length === 0) {
            displayHargaMaster.value = 0;
            return;
        }

        // 2. SKENARIO A: MODE EDIT & HARGA ID BAWAAN DB SUDAH SIAP & BELUM PERNAH DI-LOCK
        if (isEdit.value && currentHargaId && !loadedHargaIds.value.has(currentHargaId)) {
            const matchHargaById = currentMasterHarga.find(h => h.id == currentHargaId);
            if (matchHargaById) {
                displayHargaMaster.value = matchHargaById.harga;
                loadedHargaIds.value.add(currentHargaId); // 🔒 Kunci ID ini agar di putaran watch berikutnya bisa pindah ke otomatisasi dropdown
                return; // 🛑 Hentikan aliran kode di sini
            }
        }

        // 3. SKENARIO B: TAMBAH BARU / USER SUDAH MENGUBAH PILIHAN DROPDOWN SECARA MANUAL
        if (!newKarat || !newJenisKarat) {
            // Cegah mutasi berulang jika nilainya memang sudah kosong
            if (formProduk.harga_id !== '') {
                formProduk.harga_id = '';
            }
            displayHargaMaster.value = 0;
            return;
        }

        // Cari baris harga baru berdasarkan kombinasi dropdown karat & jenis karat teranyar
        const matchHargaByKombinasi = currentMasterHarga.find(
            h => h.karat_id == newKarat && h.jeniskarat_id == newJenisKarat
        );

        if (matchHargaByKombinasi) {
            // 🌟 KUNCI AMAN: Hanya update jika ID kombinasi baru BERBEDA dengan yang sekarang terpasang
            if (formProduk.harga_id !== matchHargaByKombinasi.id) {
                formProduk.harga_id = matchHargaByKombinasi.id;
            }
            displayHargaMaster.value = matchHargaByKombinasi.harga;
        } else {
            // Cegah mutasi berulang jika nilainya memang sudah kosong
            if (formProduk.harga_id !== '') {
                formProduk.harga_id = '';
            }
            displayHargaMaster.value = 0;
        }
    },
    { immediate: true, deep: true }
);

// Pemuatan data dari backend saat modal dirender
onMounted(async () => {
    try {
        const [resJenis, resKarat, resJenisKarat, resHarga] = await Promise.all([
            jenisprodukService.getJenisProduk(),
            karatService.getKarat(),
            jeniskaratService.getJenisKarat(),
            hargaService.getHarga() // Ambil list data harga master
        ]);

        daftarJenisProduk.value = resJenis.data || resJenis;
        daftarKarat.value = resKarat.data || resKarat;
        daftarJenisKarat.value = resJenisKarat.data || resJenisKarat;
        masterDaftarHarga.value = resHarga.data || resHarga; // Begitu ini terisi, skenario A di fungsi watch di atas otomatis langsung tereksekusi ulang dengan aman
    } catch (err) {
        console.error('Gagal memuat list drop down:', err);
    }
});

const formatRupiah = (val) => {
    if (!val) return '0';
    return new Intl.NumberFormat('id-ID').format(val);
};

const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    formProduk.image = file;
    imagePreview.value = URL.createObjectURL(file);
};

const handleClose = () => {
    isJenisProdukDropdownOpen.value = false;
    isKaratDropdownOpen.value = false;
    isJenisKaratDropdownOpen.value = false;
    searchJenisProdukQuery.value = '';
    searchKaratQuery.value = '';
    searchJenisKaratQuery.value = '';
    displayHargaMaster.value = 0;
    closeModal();
};

const handleSubmit = async () => {
    await submitProduk();
};
</script>
