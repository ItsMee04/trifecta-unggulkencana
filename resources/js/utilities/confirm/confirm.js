import { h, render } from 'vue';
import { Trash2, CheckCircle2, X } from 'lucide-vue-next';

// ==========================================
// 1. CONFIRM DELETE (Merah / Rose)
// ==========================================
export const confirmDelete = (title = 'Apakah Anda yakin?', text = '') => {
    return new Promise((resolve) => {
        const mountNode = document.createElement('div');
        document.body.appendChild(mountNode);

        const closeAndDestroy = (result) => {
            const backdrop = mountNode.querySelector('.modal-backdrop');
            const card = mountNode.querySelector('.modal-card');

            if (backdrop && card) {
                backdrop.classList.replace('opacity-100', 'opacity-0');
                card.classList.replace('opacity-100', 'opacity-0');
                card.classList.replace('scale-100', 'scale-95');
            }

            setTimeout(() => {
                render(null, mountNode);
                mountNode.remove();
                resolve(result);
            }, 150);
        };

        const vnode = h('div', { class: 'fixed inset-0 z-50 flex items-center justify-center p-4 font-sans' }, [
            h('div', {
                class: 'modal-backdrop absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 transition-opacity duration-150 ease-out',
                onClick: () => closeAndDestroy(false)
            }),

            h('div', {
                class: 'modal-card bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 p-6 flex flex-col items-center justify-center text-center opacity-0 scale-95 transition-all duration-150 ease-out'
            }, [
                h('button', {
                    class: 'absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors',
                    onClick: () => closeAndDestroy(false)
                }, [h(X, { class: 'w-4 h-4' })]),

                h('div', { class: 'w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4' }, [
                    h(Trash2, { class: 'w-6 h-6' })
                ]),

                h('h3', { class: 'text-lg font-bold text-slate-900 dark:text-white tracking-tight' }, title),
                h('p', { class: 'text-sm text-slate-500 dark:text-slate-400 mt-2 p-0 m-0' }, text),

                h('div', { class: 'flex items-center justify-center gap-3 w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60' }, [
                    h('button', {
                        type: 'button',
                        class: 'w-full flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 focus:outline-none',
                        onClick: () => closeAndDestroy(false)
                    }, 'Batal'),

                    h('button', {
                        type: 'button',
                        class: 'w-full flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs active:scale-95 focus:outline-none',
                        onClick: () => closeAndDestroy(true)
                    }, 'Ya, Hapus!')
                ])
            ])
        ]);

        render(vnode, mountNode);

        requestAnimationFrame(() => {
            const backdrop = mountNode.querySelector('.modal-backdrop');
            const card = mountNode.querySelector('.modal-card');
            if (backdrop && card) {
                backdrop.classList.replace('opacity-0', 'opacity-100');
                card.classList.replace('opacity-0', 'opacity-100');
                card.classList.replace('scale-95', 'scale-100');
            }
        });
    });
};


// ==========================================
// 2. CONFIRM FINAL (Hijau / Emerald)
// ==========================================
export const confirmFinal = (title = 'Konfirmasi Finalization', text = '') => {
    return new Promise((resolve) => {
        const mountNode = document.createElement('div');
        document.body.appendChild(mountNode);

        const closeAndDestroy = (result) => {
            const backdrop = mountNode.querySelector('.modal-backdrop');
            const card = mountNode.querySelector('.modal-card');

            if (backdrop && card) {
                backdrop.classList.replace('opacity-100', 'opacity-0');
                card.classList.replace('opacity-100', 'opacity-0');
                card.classList.replace('scale-100', 'scale-95');
            }

            setTimeout(() => {
                render(null, mountNode);
                mountNode.remove();
                resolve(result);
            }, 150);
        };

        const vnode = h('div', { class: 'fixed inset-0 z-50 flex items-center justify-center p-4 font-sans' }, [
            // Backdrop Overlay
            h('div', {
                class: 'modal-backdrop absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 transition-opacity duration-150 ease-out',
                onClick: () => closeAndDestroy(false)
            }),

            // Card Modal Box
            h('div', {
                class: 'modal-card bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 p-6 flex flex-col items-center justify-center text-center opacity-0 scale-95 transition-all duration-150 ease-out'
            }, [

                // Tombol Close
                h('button', {
                    class: 'absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors',
                    onClick: () => closeAndDestroy(false)
                }, [h(X, { class: 'w-4 h-4' })]),

                // Icon Success / Check Box (Emerald)
                h('div', { class: 'w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4' }, [
                    h(CheckCircle2, { class: 'w-6 h-6' })
                ]),

                // Judul Modal
                h('h3', { class: 'text-lg font-bold text-slate-900 dark:text-white tracking-tight' }, title),

                // Deskripsi Text
                h('p', { class: 'text-sm text-slate-500 dark:text-slate-400 mt-2 p-0 m-0' }, text),

                // Action Buttons Group
                h('div', { class: 'flex items-center justify-center gap-3 w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60' }, [

                    // Tombol Batal
                    h('button', {
                        type: 'button',
                        class: 'w-full flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 focus:outline-none',
                        onClick: () => closeAndDestroy(false)
                    }, 'Batal'),

                    // Tombol Ya, Finalkan!
                    h('button', {
                        type: 'button',
                        class: 'w-full flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs active:scale-95 focus:outline-none',
                        onClick: () => closeAndDestroy(true)
                    }, 'Ya, Finalkan!')

                ])
            ])
        ]);

        render(vnode, mountNode);

        requestAnimationFrame(() => {
            const backdrop = mountNode.querySelector('.modal-backdrop');
            const card = mountNode.querySelector('.modal-card');
            if (backdrop && card) {
                backdrop.classList.replace('opacity-0', 'opacity-100');
                card.classList.replace('opacity-0', 'opacity-100');
                card.classList.replace('scale-95', 'scale-100');
            }
        });
    });
};
