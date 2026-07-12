<template>
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">

        <Transition appear enter-active-class="ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-show="isModalOpen" @click="closeModal"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-all"></div>
        </Transition>

        <div class="flex min-h-full items-center justify-center p-4 text-center">

            <Transition appear enter-active-class="ease-out duration-300"
                enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="ease-in duration-200"
                leave-from-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div v-show="isModalOpen"
                    class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 overflow-hidden text-left transition-all">
                    <div
                        class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between relative">
                        <h2 class="font-bold text-slate-900 dark:text-white text-base">
                            {{ isEdit ? 'EDIT JENIS PRODUK' : 'TAMBAH JENIS PRODUK' }}
                        </h2>

                        <button @click="closeModal" type="button" title="Close Modal"
                            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full transition active:scale-95">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <form @submit.prevent="submitJenisProduk" class="p-6 space-y-4 font-sans">
                        <div class="space-y-1.5">
                            <label for="jenisproduk" class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">
                                Jenis Produk
                            </label>
                            <input v-model="formJenisProduk.jenis" type="text" id="jenisproduk"
                                placeholder="e.g. Anting, Cincin ..."
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 text-slate-900 dark:text-white transition" />
                            <span v-if="errors.jenis" class="text-xs text-rose-500 font-medium block mt-1">
                                {{ errors.jenis }}
                            </span>
                        </div>

                        <div class="space-y-1.5">
                            <label for="urutan" class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">
                                Urutan
                            </label>
                            <input v-model="formJenisProduk.urutan" type="text" id="urutan"
                                placeholder="Urutan"
                                class="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-600 text-slate-900 dark:text-white transition" />
                            <span v-if="errors.urutan" class="text-xs text-rose-500 font-medium block mt-1">
                                {{ errors.urutan }}
                            </span>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-sm font-medium text-slate-900 dark:text-slate-200 mb-3 block">Foto
                                Jenis Produk</label>
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
                            <button type="button" @click="closeModal"
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
// Tambahkan ChevronDown, Search, dan Check dari lucide
import { X, User, ChevronDown, Search, Check } from 'lucide-vue-next';
import { useJenisProduk } from '../composables/useJenisProduk';

const { isModalOpen, isEdit, formJenisProduk, imagePreview, submitJenisProduk, errors, isLoading, closeModal } = useJenisProduk();

const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    formJenisProduk.image = file;
    imagePreview.value = URL.createObjectURL(file);
};
</script>
