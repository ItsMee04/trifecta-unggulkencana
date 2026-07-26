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
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanPenjualan");

        // 2. Buat Stored Procedure GetLaporanPenjualan
        DB::unprepared("
            CREATE PROCEDURE GetLaporanPenjualan(
                IN TANGGAL_AWAL DATE,
                IN TANGGAL_AKHIR DATE
            )
            BEGIN
                SELECT
                    tr.tanggal,
                    tr.kode,
                    jp.jenis,
                    pr.kodeproduk,
                    pr.berat,
                    k.karat,
                    kr.hargajual AS harga,

                    -- Perkalian berat dan hargajual per baris
                    (pr.berat * kr.hargajual) AS total_per_item,

                    -- Agregasi Window Function
                    SUM(pr.berat) OVER() AS TOTALBERAT,
                    SUM(kr.hargajual) OVER() AS TOTALHARGA,
                    SUM(pr.berat * kr.hargajual) OVER() AS TOTAL_SELURUH_HARGA,
                    COUNT(*) OVER() AS TOTALPOTONG

                FROM transaksidetail kr
                INNER JOIN transaksi tr ON kr.kode = tr.kode COLLATE utf8mb4_unicode_ci
                INNER JOIN produk pr ON kr.produk_id = pr.id
                INNER JOIN jenisproduk jp ON pr.jenisproduk_id = jp.id
                INNER JOIN karat k ON pr.karat_id = k.id
                WHERE tr.status = 2
                  AND kr.status = 2
                  AND DATE(tr.tanggal) BETWEEN TANGGAL_AWAL AND TANGGAL_AKHIR
                ORDER BY tr.kode ASC;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanPenjualan");
    }
};
