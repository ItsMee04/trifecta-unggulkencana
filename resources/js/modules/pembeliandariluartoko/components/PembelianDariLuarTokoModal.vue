<template>
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">

        <!-- Backdrop Transition -->
        <Transition appear enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-show="isModalOpen" @click="handleClose"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-all"></div>
        </Transition>

        <div class="flex min-h-full items-center justify-center p-4 text-center">

            <!-- Modal Content Transition -->
            <Transition appear enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div v-show="isModalOpen"
                    class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 overflow-hidden text-left transition-all">

                    <!-- Header -->
                    <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h2 class="font-bold text-slate-900 dark:text-white text-base">
                            {{ isEdit ? 'EDIT PRODUK' : 'TAMBAH PRODUK' }}
                        </h2>
                        <button @click="handleClose" type="button"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <form @submit.prevent="handleSubmitProduk" class="p-6 space-y-4 font-sans">

                        <!-- Nama Produk -->
                        <div class="space-y-1.5">
                            <label for="namaProduk" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                Nama Produk
                            </label>
                            <input v-model="formProduk.nama" type="text" id="namaProduk" placeholder="Masukkan nama produk"
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 text-slate-900 dark:text-white transition" />
                            <span v-if="errors.nama" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.nama }}</span>
                        </div>

                        <!-- Grid Row 1: Berat & Jenis Produk -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Berat -->
                            <div class="space-y-1.5">
                                <label for="beratProduk" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                    Berat (g)
                                </label>
                                <input v-model="formProduk.berat" type="text" id="beratProduk" placeholder="Masukkan berat"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.berat" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.berat }}</span>
                            </div>

                            <!-- Jenis Produk Dropdown -->
                            <div class="space-y-1.5 relative">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Jenis Produk</label>
                                <button type="button" @click="toggleDropdown('jenisproduk')"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                    <span :class="{ 'text-slate-400': !formProduk.jenisproduk }">
                                        {{ labelJenisProdukTerpilih }}
                                    </span>
                                    <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': openDropdown === 'jenisproduk' }" />
                                </button>

                                <div v-if="openDropdown === 'jenisproduk'"
                                    class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                    <div class="relative shrink-0">
                                        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input v-model="searchQuery.jenisproduk" type="text" placeholder="Cari Jenis Produk..."
                                            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                    </div>
                                    <ul class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                        <li v-for="item in filteredJenisProduk" :key="item.value || item.id" @click="pilihJenisProduk(item)"
                                            class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                            :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': isSelected('jenisproduk', item) }">
                                            <span>{{ String(item.label || item.nama || item).toUpperCase() }}</span>
                                            <Check v-if="isSelected('jenisproduk', item)" class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </li>
                                        <li v-if="filteredJenisProduk.length === 0" class="px-3 py-4 text-center text-slate-400 italic">
                                            Jenis Produk tidak ditemukan.
                                        </li>
                                    </ul>
                                </div>
                                <span v-if="errors.jenisproduk" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.jenisproduk }}</span>
                            </div>
                        </div>

                        <!-- Grid Row 2: Karat & Jenis Karat -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Karat Dropdown -->
                            <div class="space-y-1.5 relative">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Karat</label>
                                <button type="button" @click="toggleDropdown('karat')"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                    <span :class="{ 'text-slate-400': !formProduk.karat }">
                                        {{ labelKaratTerpilih }}
                                    </span>
                                    <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': openDropdown === 'karat' }" />
                                </button>

                                <div v-if="openDropdown === 'karat'"
                                    class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                    <div class="relative shrink-0">
                                        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input v-model="searchQuery.karat" type="text" placeholder="Cari Karat..."
                                            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                    </div>
                                    <ul class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                        <li v-for="item in filteredKarat" :key="item.value || item.id" @click="pilihKarat(item)"
                                            class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                            :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': isSelected('karat', item) }">
                                            <span>{{ String(item.label || item.nama || item).toUpperCase() }}</span>
                                            <Check v-if="isSelected('karat', item)" class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </li>
                                        <li v-if="filteredKarat.length === 0" class="px-3 py-4 text-center text-slate-400 italic">
                                            Karat tidak ditemukan.
                                        </li>
                                    </ul>
                                </div>
                                <span v-if="errors.karat" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.karat }}</span>
                            </div>

                            <!-- Jenis Karat Dropdown -->
                            <div class="space-y-1.5 relative">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Jenis Karat</label>
                                <button type="button" @click="formProduk.karat ? toggleDropdown('jeniskarat') : null"
                                    :disabled="!formProduk.karat"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed">
                                    <span :class="{ 'text-slate-400': !formProduk.jeniskarat }">
                                        {{ labelJenisKaratTerpilih }}
                                    </span>
                                    <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': openDropdown === 'jeniskarat' }" />
                                </button>

                                <div v-if="openDropdown === 'jeniskarat'"
                                    class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                    <div class="relative shrink-0">
                                        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input v-model="searchQuery.jeniskarat" type="text" placeholder="Cari Jenis Karat..."
                                            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                    </div>
                                    <ul class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                        <li v-for="item in filteredJenisKarat" :key="item.value || item.id" @click="pilihJenisKarat(item)"
                                            class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                            :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': isSelected('jeniskarat', item) }">
                                            <span>{{ String(item.label || item.nama || item).toUpperCase() }}</span>
                                            <Check v-if="isSelected('jeniskarat', item)" class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </li>
                                        <li v-if="filteredJenisKarat.length === 0" class="px-3 py-4 text-center text-slate-400 italic">
                                            Jenis Karat tidak ditemukan.
                                        </li>
                                    </ul>
                                </div>
                                <span v-if="errors.jeniskarat" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.jeniskarat }}</span>
                            </div>
                        </div>

                        <!-- Grid Row 3: Kondisi & Harga Beli -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Kondisi Dropdown -->
                            <div class="space-y-1.5 relative">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 block">Kondisi</label>
                                <button type="button" @click="toggleDropdown('kondisi')"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                    <span :class="{ 'text-slate-400': !formProduk.kondisi }">
                                        {{ labelKondisiTerpilih }}
                                    </span>
                                    <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': openDropdown === 'kondisi' }" />
                                </button>

                                <div v-if="openDropdown === 'kondisi'"
                                    class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                    <div class="relative shrink-0">
                                        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input v-model="searchQuery.kondisi" type="text" placeholder="Cari Kondisi..."
                                            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                    </div>
                                    <ul class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                        <li v-for="item in filteredKondisi" :key="item.value || item.id" @click="pilihKondisi(item)"
                                            class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                            :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': isSelected('kondisi', item) }">
                                            <span>{{ String(item.label || item.nama || item).toUpperCase() }}</span>
                                            <Check v-if="isSelected('kondisi', item)" class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </li>
                                        <li v-if="filteredKondisi.length === 0" class="px-3 py-4 text-center text-slate-400 italic">
                                            Kondisi tidak ditemukan.
                                        </li>
                                    </ul>
                                </div>
                                <span v-if="errors.kondisi" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.kondisi }}</span>
                            </div>

                            <!-- Harga Beli -->
                            <div class="space-y-1.5">
                                <label for="hargaBeli" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                    Harga Beli
                                </label>
                                <input v-model="formProduk.hargabeli" type="text" id="hargaBeli" placeholder="Masukkan harga beli"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.hargabeli" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.hargabeli }}</span>
                            </div>
                        </div>

                        <!-- Grid Row 4: Lingkar & Panjang -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Lingkar -->
                            <div class="space-y-1.5">
                                <label for="lingkarProduk" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                    Lingkar
                                </label>
                                <input v-model="formProduk.lingkar" type="text" id="lingkarProduk" placeholder="Masukkan lingkar"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.lingkar" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.lingkar }}</span>
                            </div>

                            <!-- Panjang -->
                            <div class="space-y-1.5">
                                <label for="panjangProduk" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                    Panjang
                                </label>
                                <input v-model="formProduk.panjang" type="text" id="panjangProduk" placeholder="Masukkan panjang"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.panjang" class="text-xs text-rose-500 font-medium block mt-1">{{ errors.panjang }}</span>
                            </div>
                        </div>

                        <!-- Keterangan -->
                        <div class="space-y-1.5">
                            <label for="keterangan" class="text-sm font-medium text-slate-900 dark:text-slate-200 block">
                                Keterangan
                            </label>
                            <textarea v-model="formProduk.keteranganproduk" id="keterangan" rows="3" placeholder="Masukkan keterangan..."
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition"></textarea>
                        </div>

                        <!-- Footer Action Buttons -->
                        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                            <button type="button" @click="handleClose"
                                class="px-5 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-100 dark:border-rose-900/50 rounded-xl transition active:scale-95 focus:outline-none cursor-pointer">
                                Batal
                            </button>

                            <button type="submit" :disabled="isLoading"
                                class="bg-blue-950 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-semibold text-sm transition shadow-xs active:scale-95 focus:outline-none cursor-pointer">
                                {{ isLoading ? 'Memproses...' : (isEdit ? 'UPDATE' : 'SIMPAN') }}
                            </button>
                        </div>

                    </form>

                </div>
            </Transition>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { X, ChevronDown, Search, Check } from 'lucide-vue-next';
import { usePembelianDariLuarToko } from '../composables/usePembelianDariLuarToko';

const {
    isModalOpen,
    isLoading,
    formProduk,
    errors,
    isEdit,
    jenisprodukList,
    karatList,
    jeniskaratList,
    kondisiList,
    handleKaratChange,
    handleSubmitProduk,
    closeModal,
} = usePembelianDariLuarToko();

const openDropdown = ref(null);

const searchQuery = reactive({
    jenisproduk: '',
    karat: '',
    jeniskarat: '',
    kondisi: '',
});

const toggleDropdown = (name) => {
    openDropdown.value = openDropdown.value === name ? null : name;
};

const isSelected = (field, item) => {
    const val = formProduk[field];
    if (!val) return false;
    if (typeof val === 'object') {
        return val.value === item.value || val.id === item.id;
    }
    return val === item.value || val === item.id || val === item;
};

const labelJenisProdukTerpilih = computed(() => {
    const item = formProduk.jenisproduk;
    if (!item) return '-- Pilih Jenis Produk --';
    return String(item.label || item.nama || item).toUpperCase();
});

const labelKaratTerpilih = computed(() => {
    const item = formProduk.karat;
    if (!item) return '-- Pilih Karat --';
    return String(item.label || item.nama || item).toUpperCase();
});

const labelJenisKaratTerpilih = computed(() => {
    if (!formProduk.karat) return 'Pilih Karat dahulu';
    const item = formProduk.jeniskarat;
    if (!item) return '-- Pilih Jenis Karat --';
    return String(item.label || item.nama || item).toUpperCase();
});

const labelKondisiTerpilih = computed(() => {
    const item = formProduk.kondisi;
    if (!item) return '-- Pilih Kondisi --';
    return String(item.label || item.nama || item).toUpperCase();
});

const filterList = (list, query) => {
    const q = query.toLowerCase().trim();
    if (!q) return list || [];
    return (list || []).filter(item => {
        const text = String(item.label || item.nama || item.jenis || '').toLowerCase();
        return text.includes(q);
    });
};

const filteredJenisProduk = computed(() => filterList(jenisprodukList.value, searchQuery.jenisproduk));
const filteredKarat = computed(() => filterList(karatList.value, searchQuery.karat));
const filteredJenisKarat = computed(() => filterList(jeniskaratList.value, searchQuery.jeniskarat));
const filteredKondisi = computed(() => filterList(kondisiList.value, searchQuery.kondisi));

const pilihJenisProduk = (item) => {
    formProduk.jenisproduk = item;
    openDropdown.value = null;
    searchQuery.jenisproduk = '';
};

const pilihKarat = (item) => {
    formProduk.karat = item;
    if (typeof handleKaratChange === 'function') handleKaratChange(item);
    openDropdown.value = null;
    searchQuery.karat = '';
};

const pilihJenisKarat = (item) => {
    formProduk.jeniskarat = item;
    openDropdown.value = null;
    searchQuery.jeniskarat = '';
};

const pilihKondisi = (item) => {
    formProduk.kondisi = item;
    openDropdown.value = null;
    searchQuery.kondisi = '';
};

const handleClose = () => {
    openDropdown.value = null;
    Object.keys(searchQuery).forEach(k => searchQuery[k] = '');
    if (typeof closeModal === 'function') {
        closeModal();
    } else if (isModalOpen) {
        isModalOpen.value = false;
    }
};
</script>
