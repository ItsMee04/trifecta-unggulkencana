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
                            {{ isEdit ? 'EDIT PEGAWAI' : 'TAMBAH PEGAWAI' }}
                        </h2>
                        <button @click="handleClose" type="button"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <form @submit.prevent="handleSubmit" class="p-6 space-y-4 font-sans text-xs">

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label
                                    class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">NIP</label>
                                <input v-model="formPegawai.nip" type="text" placeholder="Masukkan NIP"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.nip" class="text-xs text-rose-500 font-medium block mt-1">{{
                                    errors.nip }}</span>
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Nama
                                    Lengkap</label>
                                <input v-model="formPegawai.nama" type="text" placeholder="Masukkan Nama"
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.nama" class="text-xs text-rose-500 font-medium block mt-1">{{
                                    errors.nama }}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">No.
                                    Kontak /
                                    HP</label>
                                <input v-model="formPegawai.kontak" type="text" placeholder="e.g. 081234..."
                                    class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                <span v-if="errors.kontak" class="text-xs text-rose-500 font-medium block mt-1">{{
                                    errors.kontak }}</span>
                            </div>

                            <div class="space-y-1.5 relative">
                                <label
                                    class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Jabatan</label>

                                <div class="relative">
                                    <button type="button" @click="isJabatanDropdownOpen = !isJabatanDropdownOpen"
                                        class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-left flex items-center justify-between text-slate-900 dark:text-white transition focus:outline-none focus:border-indigo-500">
                                        <span :class="{ 'text-slate-400': !formPegawai.jabatan_id }">
                                            {{ labelJabatanTerpilih }}
                                        </span>
                                        <ChevronDown
                                            class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
                                            :class="{ 'rotate-180': isJabatanDropdownOpen }" />
                                    </button>
                                </div>

                                <div v-if="isJabatanDropdownOpen"
                                    class="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2 max-h-60 flex flex-col">
                                    <div class="relative shrink-0">
                                        <Search
                                            class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input v-model="searchJabatanQuery" type="text" placeholder="Cari jabatan..."
                                            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition" />
                                    </div>

                                    <ul
                                        class="overflow-y-auto flex-1 divide-y divide-slate-50 dark:divide-slate-900/50 pr-1 text-xs">
                                        <li v-for="jab in filteredDaftarJabatan" :key="jab.id"
                                            @click="pilihJabatan(jab)"
                                            class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer flex items-center justify-between font-medium transition"
                                            :class="{ 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold': formPegawai.jabatan_id === jab.id }">
                                            <span>{{ jab.jabatan.toUpperCase() }}</span>
                                            <Check v-if="formPegawai.jabatan_id === jab.id"
                                                class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </li>

                                        <li v-if="filteredDaftarJabatan.length === 0"
                                            class="px-3 py-4 text-center text-slate-400 dark:text-slate-500 italic">
                                            Jabatan tidak ditemukan.
                                        </li>
                                    </ul>
                                </div>

                                <span v-if="errors.jabatan_id" class="text-xs text-rose-500 font-medium block mt-1">{{
                                    errors.jabatan_id }}</span>
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Alamat
                                Rumah</label>
                            <textarea v-model="formPegawai.alamat" rows="2" placeholder="Masukkan alamat lengkap..."
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white transition resize-none"></textarea>
                            <span v-if="errors.alamat" class="text-xs text-rose-500 font-medium block mt-1">{{
                                errors.alamat }}</span>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Foto
                                Pegawai</label>
                            <div
                                class="flex items-center gap-4 p-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/30">

                                <div
                                    class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                                    <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover"
                                        alt="Preview Foto" />
                                    <User v-else class="w-6 h-6 text-slate-400" />
                                </div>

                                <div class="space-y-1">
                                    <input type="file" id="image" name="image" accept="image/*" @change="onFileChange"
                                        class="hidden" />

                                    <label for="image"
                                        class="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition inline-block active:scale-95">
                                        Choose Image
                                    </label>
                                    <p class="text-[10px] text-slate-400">Format: JPG, PNG. Maksimal 1MB.</p>
                                </div>
                            </div>
                            <span v-if="errors.image" class="text-xs text-rose-500 font-medium block mt-1">
                                {{ errors.image }}
                            </span>
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
// Tambahkan ChevronDown, Search, dan Check dari lucide
import { X, User, ChevronDown, Search, Check } from 'lucide-vue-next';
import { usePegawai } from '../composables/usePegawai';
import { jabatanService } from '../../jabatan/services/jabatanService';

const { isModalOpen, isEdit, formPegawai, imagePreview, submitPegawai, errors, isLoading, closeModal } = usePegawai();

const daftarJabatan = ref([]);

// ─── STATE TAMBAHAN UNTUK COMBOBOX ───
const isJabatanDropdownOpen = ref(false);
const searchJabatanQuery = ref('');

// Menampilkan teks jabatan terpilih pada tombol utama
const labelJabatanTerpilih = computed(() => {
    if (!formPegawai.jabatan_id || daftarJabatan.value.length === 0) return '-- Pilih Jabatan --';
    const ditemukan = daftarJabatan.value.find(j => j.id === formPegawai.jabatan_id);
    return ditemukan ? ditemukan.jabatan.toUpperCase() : '-- Pilih Jabatan --';
});

// Menyaring daftar jabatan berdasarkan input pencarian user secara real-time
const filteredDaftarJabatan = computed(() => {
    const q = searchJabatanQuery.value.toLowerCase().trim();
    if (!q) return daftarJabatan.value;
    return daftarJabatan.value.filter(j =>
        (j.jabatan || '').toLowerCase().includes(q)
    );
});

// Aksi saat user memilih salah satu opsi jabatan
const pilihJabatan = (jab) => {
    formPegawai.jabatan_id = jab.id;
    isJabatanDropdownOpen.value = false; // Tutup dropdown
    searchJabatanQuery.value = ''; // Reset keyword pencarian
};

watch(() => isModalOpen.value, (isOpen) => {
    if (!isOpen) {
        searchJabatanQuery.value = '';
        isJabatanDropdownOpen.value = false;
    } else {
        // Generasi preview gambar saat modal EDIT pegawai dibuka
        if (isEdit.value && formPegawai.image) {
            // Jika formPegawai.image berupa string nama file bawaan dari database
            if (typeof formPegawai.image === 'string') {
                // Ambil base domain backend utama Anda (e.g., http://localhost:8000)
                const apiBase = import.meta.env.VITE_STORAGE_URL;

                // Ambil nama filenya saja (bersihkan jika ada sisa path folder lama)
                const fileName = formPegawai.image.split('/').pop();

                // Gabungkan domain + path folder target sesuai konfigurasi Anda + nama file
                imagePreview.value = `${apiBase}/${fileName}`;
            }
            // Jika formPegawai.image berupa file baru yang baru saja di-upload user lewat layar
            else if (formPegawai.image instanceof File) {
                imagePreview.value = URL.createObjectURL(formPegawai.image);
            }
        }
    }
});

// Ambil data Dropdown dari API
onMounted(async () => {
    try {
        const res = await jabatanService.getJabatan();
        daftarJabatan.value = res.data || res;
    } catch (err) {
        console.error('Gagal memuat list jabatan:', err);
    }
});

const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    formPegawai.image = file;
    imagePreview.value = URL.createObjectURL(file);
};

const handleClose = () => {
    isJabatanDropdownOpen.value = false;
    searchJabatanQuery.value = '';
    closeModal();
};

const handleSubmit = async () => {
    await submitPegawai();
};
</script>
