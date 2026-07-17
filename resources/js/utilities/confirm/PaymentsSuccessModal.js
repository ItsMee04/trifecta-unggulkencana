import { h, render } from 'vue';
import { CheckCircle2, Printer, ArrowRightCircle, MessageSquare, X } from 'lucide-vue-next';

export const showPaymentSuccess = (options = { kodeTransaksi: '', onPrint: () => { }, onNext: () => { }, onWhatsApp: () => { } }) => {
    return new Promise((resolve) => {
        // 1. Buat node container utama di body
        const mountNode = document.createElement('div');
        document.body.appendChild(mountNode);

        // 2. Fungsi untuk menutup dengan efek transisi keluar (Fade Out)
        const closeAndDestroy = (actionType) => {
            // 1. Jika aksi BUKAN 'next' dan BUKAN 'close',
            // jangan tutup modal, cukup panggil callback aksinya saja.
            if (actionType === 'print' || actionType === 'whatsapp') {
                if (actionType === 'print') options.onPrint?.();
                if (actionType === 'whatsapp') options.onWhatsApp?.();
                return; // Hentikan fungsi di sini, modal tidak akan ditutup
            }

            // 2. Jika aksi adalah 'next' atau 'close', jalankan logika penutupan modal
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

                // Panggil callback 'next' atau handle penutupan
                if (actionType === 'next') options.onNext?.();

                resolve(actionType);
            }, 150);
        };

        // 3. Bangun Virtual Node (VNode) HTML Modal
        const vnode = h('div', { class: 'fixed inset-0 z-50 flex items-center justify-center p-4 font-sans' }, [
            // Backdrop Overlay
            h('div', {
                class: 'modal-backdrop absolute inset-0 bg-slate-900/40 backdrop-blur-xs opacity-0 transition-opacity duration-150 ease-out',
                onClick: () => closeAndDestroy('close')
            }),

            // Card Modal Box
            h('div', {
                class: 'modal-card bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl relative z-10 p-6 flex flex-col items-center justify-center text-center opacity-0 scale-95 transition-all duration-150 ease-out'
            }, [

                // Tombol Close Pojok Kanan Atas
                h('button', {
                    class: 'absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors',
                    onClick: () => closeAndDestroy('close')
                }, [h(X, { class: 'w-4 h-4' })]),

                // Icon Success Check Circle
                h('div', { class: 'w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500 mb-4' }, [
                    h(CheckCircle2, { class: 'w-8 h-8' })
                ]),

                // Judul Modal
                h('h3', { class: 'text-lg font-bold text-slate-900 dark:text-white tracking-tight' }, 'Pembayaran Berhasil'),

                // Deskripsi Text beserta ID Transaksi
                h('div', { class: 'text-sm text-slate-500 dark:text-slate-400 mt-2 space-y-1' }, [
                    h('p', { class: 'm-0 p-0' }, 'Transaksi Anda telah tercatat ke dalam sistem.'),
                    h('p', { class: 'text-xs font-bold text-amber-500 tracking-wide bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-md inline-block mt-1' }, `#${options.kodeTransaksi}`)
                ]),

                // Action Buttons Grid Block
                h('div', { class: 'w-full flex flex-col gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60' }, [

                    // Row atas: Cetak Nota & Order Baru
                    h('div', { class: 'flex gap-2.5 w-full' }, [
                        // Tombol Cetak Nota
                        h('button', {
                            type: 'button',
                            class: 'w-full flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-all active:scale-95 focus:outline-none flex items-center justify-center gap-1.5',
                            onClick: () => closeAndDestroy('print')
                        }, [
                            h('span', 'Cetak Nota'),
                            h(Printer, { class: 'w-3.5 h-3.5' })
                        ]),

                        // Tombol Order Baru
                        h('button', {
                            type: 'button',
                            class: 'w-full flex-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 focus:outline-none flex items-center justify-center gap-1.5',
                            onClick: () => closeAndDestroy('next')
                        }, [
                            h('span', 'Order Baru'),
                            h(ArrowRightCircle, { class: 'w-3.5 h-3.5' })
                        ])
                    ]),

                    // Tombol Kirim WhatsApp Notifikasi (Full Width Row Bawah)
                    h('button', {
                        type: 'button',
                        class: 'w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95 focus:outline-none flex items-center justify-center gap-2',
                        onClick: () => closeAndDestroy('whatsapp')
                    }, [
                        h(MessageSquare, { class: 'w-4 h-4' }),
                        h('span', 'KIRIM NOTIFIKASI WHATSAPP')
                    ])

                ])
            ])
        ]);

        // 4. Render VNode ke DOM asli
        render(vnode, mountNode);

        // 5. Efek Masuk (Fade In)
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
