<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Hapus procedure lama jika sudah ada
        DB::unprepared("DROP PROCEDURE IF EXISTS GetNotaTransaksi");

        // 2. Buat Stored Procedure baru dengan penanganan Collation yang ketat
        DB::unprepared("
            CREATE PROCEDURE GetNotaTransaksi(
                -- Paksa parameter input menggunakan collation utf8mb4_unicode_ci
                IN p_kode_transaksi VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
            )
            BEGIN
                SELECT
                    t.tanggal,
                    t.kode AS kode_transaksi,
                    t.total AS grand_total,
                    t.terbilang,
                    p.nama AS nama_pelanggan,
                    p.alamat AS alamat_pelanggan,
                    p.kontak AS hp_pelanggan,
                    peg.nama AS nama_admin,
                    pr.image AS foto,
                    pr.nama AS nama_produk,
                    td.berat,
                    td.karat,
                    td.hargajual AS harga_per_gram,
                    IFNULL(CONCAT(d.nilai, '%'), '0%') AS diskon,
                    td.total AS total_harga
                FROM transaksi t
                LEFT JOIN pelanggan p ON t.pelanggan_id = p.id
                LEFT JOIN diskon d ON t.diskon_id = d.id
                INNER JOIN users u ON t.oleh = u.id
                INNER JOIN pegawai peg ON u.pegawai_id = peg.id
                -- Tambahkan COLLATE pada JOIN di bawah ini agar aman jika collation kedua tabel berbeda
                INNER JOIN transaksidetail td ON t.kode = td.kode COLLATE utf8mb4_unicode_ci
                INNER JOIN produk pr ON td.produk_id = pr.id
                WHERE t.kode = p_kode_transaksi;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Disamakan dengan nama procedure yang dibuat di atas
        DB::unprepared('DROP PROCEDURE IF EXISTS GetNotaTransaksi');
    }
};
