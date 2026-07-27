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
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanPembelian");

        // 2. Buat Stored Procedure GetLaporanPembelian
        DB::unprepared("
            CREATE PROCEDURE GetLaporanPembelian(
                IN TANGGAL_AWAL DATE,
                IN TANGGAL_AKHIR DATE
            )
            BEGIN
                SELECT
                    pm.tanggal,
                    pm.kode,
                    jp.jenis,
                    pr.kodeproduk,
                    pr.berat,
                    k.karat,
                    kp.hargabeli AS harga,
                    pm.total AS hargatotal,

                    -- Agregasi Window Function
                    SUM(kp.berat) OVER() AS TOTALBERAT,
                    SUM(pm.total) OVER() AS TOTALTRANSAKSI,
                    COUNT(*) OVER() AS TOTALPOTONG

                FROM pembelian pm
                INNER JOIN pembeliandetail kp
                    ON pm.kode = kp.kode COLLATE utf8mb4_unicode_ci
                INNER JOIN produk pr
                    ON kp.produk_id = pr.id
                INNER JOIN jenisproduk jp
                    ON pr.jenisproduk_id = jp.id
                INNER JOIN karat k
                    ON pr.karat_id = k.id

                WHERE pm.status = 2
                  AND DATE(pm.tanggal) BETWEEN TANGGAL_AWAL AND TANGGAL_AKHIR

                ORDER BY pm.kode ASC;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanPembelian");
    }
};
