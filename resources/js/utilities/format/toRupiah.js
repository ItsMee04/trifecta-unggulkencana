/**
 * Mengubah angka/string menjadi format Rupiah (e.g., Rp 500.000)
 * @param {number|string} value - Angka yang akan diformat
 * @param {boolean} withSymbol - Apakah ingin menyertakan tulisan "Rp" atau tidak
 * @returns {string} Hasil format rupiah
 */
export const toRupiah = (value, withSymbol = true) => {
    const num = parseFloat(value);

    // Jika bukan angka valid, kembalikan string kosong atau Rp 0
    if (isNaN(num)) return withSymbol ? 'Rp 0' : '0';

    const formatter = new Intl.NumberFormat('id-ID', {
        style: withSymbol ? 'currency' : 'decimal',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    // Jika menggunakan simbol, Intl otomatis memberi spasi/format "Rp 500.000"
    return formatter.format(num);
};
