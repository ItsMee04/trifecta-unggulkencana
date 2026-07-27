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
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanOfftake");

        // 2. Buat Stored Procedure GetLaporanOfftake
        DB::unprepared("
            CREATE PROCEDURE GetLaporanOfftake(
                IN TANGGAL_AWAL DATE,
                IN TANGGAL_AKHIR DATE
            )
            BEGIN
                SELECT
                    *,
                    SUM(
                        CASE
                            WHEN baris_ke = 1 THEN totaltransaksi
                            ELSE 0
                        END
                    ) OVER() AS GRANDTOTALTRANSAKSI

                FROM (
                    SELECT
                        o.kode,
                        o.tanggal,

                        p.kodeproduk,
                        p.nama,
                        p.berat,

                        jp.jenis,
                        k.karat,

                        od.hargajual,
                        od.total AS totalproduk,

                        o.hargatotal AS totaltransaksi,

                        pg.nama AS pegawai,

                        -- Total per transaksi
                        SUM(od.total)
                            OVER(PARTITION BY o.kode) AS HARGATOTALPRODUK,

                        SUM(p.berat)
                            OVER(PARTITION BY o.kode) AS TOTALBERAT,

                        COUNT(*)
                            OVER(PARTITION BY o.kode) AS TOTALPOTONG,

                        -- Grand Total
                        SUM(p.berat)
                            OVER() AS GRANDTOTALBERAT,

                        COUNT(*)
                            OVER() AS GRANDTOTALPOTONG,

                        ROW_NUMBER()
                            OVER(PARTITION BY o.kode ORDER BY p.id) AS baris_ke

                    FROM offtakedetail od

                    INNER JOIN offtake o
                        ON od.kode = o.kode COLLATE utf8mb4_unicode_ci

                    INNER JOIN produk p
                        ON od.produk_id = p.id

                    INNER JOIN jenisproduk jp
                        ON p.jenisproduk_id = jp.id

                    INNER JOIN karat k
                        ON p.karat_id = k.id

                    INNER JOIN users u
                        ON od.oleh = u.id

                    INNER JOIN pegawai pg
                        ON u.pegawai_id = pg.id

                    WHERE o.status = 2
                      AND DATE(o.tanggal)
                          BETWEEN TANGGAL_AWAL AND TANGGAL_AKHIR

                ) AS subquery

                ORDER BY kode ASC;

            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanOfftake");
    }
};
