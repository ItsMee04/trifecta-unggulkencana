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
        DB::unprepared("DROP PROCEDURE IF EXISTS GetNotaPembelian");

        // 2. Buat Stored Procedure GetNotaPembelian
        DB::unprepared("
            CREATE PROCEDURE GetNotaPembelian(
                IN p_kode_transaksi VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
            )
            BEGIN
                SELECT
                    tr.kode AS kode_transaksi,
                    tr.created_at AS tanggal,
                    tr.total AS grand_total,

                    pl.nama AS pelanggan_nama,
                    pl.alamat,
                    pl.kontak,

                    pr.kodeproduk,
                    pr.nama AS produk_nama,
                    pr.image AS foto,
                    kr.berat,
                    kr.karat,
                    kr.hargabeli AS harga_per_gram,
                    kr.total AS total_harga,
                    kr.terbilang,

                    pg.nip,
                    pg.nama AS pegawai_nama

                FROM pembelian tr
                INNER JOIN pembeliandetail kr ON tr.kode = kr.kode COLLATE utf8mb4_unicode_ci
                INNER JOIN produk pr ON kr.produk_id = pr.id
                INNER JOIN pelanggan pl ON tr.pelanggan_id = pl.id
                INNER JOIN users us ON tr.oleh = us.id
                INNER JOIN pegawai pg ON us.pegawai_id = pg.id
                WHERE tr.kode = p_kode_transaksi;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS GetNotaPembelian');
    }
};
