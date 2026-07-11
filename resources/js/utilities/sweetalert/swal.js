import Swal from 'sweetalert2';

export const useAlert = () => {
    const confirmDelete = async (title = 'Apakah Anda yakin?', text = '') => {
        return await Swal.fire({
            title: title,
            text: text,
            iconColor: '#f43f5e', // Mengubah warna ikon bawaan Swal jadi Rose-500 (bukan oranye bawaan yang kaku)
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            buttonsStyling: false, // Wajib matikan style asli Swal

            customClass: {
                // Kontainer utama modal
                popup: 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl font-sans max-w-sm p-6 flex flex-col items-center justify-center text-center',

                // Penyesuaian Ikon agar pas di tengah
                icon: 'border-rose-500 dark:border-rose-500 m-0 mb-4 flex items-center justify-center scale-90',

                // Judul & Deskripsi Teks
                title: 'text-lg font-bold text-slate-900 dark:text-white p-0 tracking-tight m-0',
                htmlContainer: 'text-sm text-slate-500 dark:text-slate-400 mt-2 p-0 m-0',

                // Kontainer Pembungkus Tombol-Tombol
                actions: 'flex items-center justify-center gap-3 w-full mt-6 pt-2 border-t border-slate-100 dark:border-slate-800/60',

                // Tombol Konfirmasi (Rose/Hapus)
                confirmButton: 'flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs active:scale-95 focus:outline-none',

                // Tombol Batal (Sekarang lebih kontras, bersih, mirip gaya dashboard)
                cancelButton: 'flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 focus:outline-none'
            },
        });
    };

    return {
        confirmDelete
    };
};
