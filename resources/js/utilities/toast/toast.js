import { ref } from 'vue';

const toasts = ref([]);

export const useToast = () => {
  const show = (message, type = 'success', duration = 4000) => {
    const id = Date.now();

    // Tambahkan toast baru ke dalam array state
    toasts.value.push({ id, message, type });

    // Otomatis hapus toast setelah durasi berakhir
    setTimeout(() => {
      remove(id);
    }, duration);
  };

  const remove = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  // Shortcut fungsi pembantu agar pemanggilan di komponen sangat bersih
  return {
    toasts,
    remove,
    success: (msg, dur) => show(msg, 'success', dur),
    error: (msg, dur) => show(msg, 'error', dur),
    warning: (msg, dur) => show(msg, 'warning', dur),
    info: (msg, dur) => show(msg, 'info', dur),
  };
};
