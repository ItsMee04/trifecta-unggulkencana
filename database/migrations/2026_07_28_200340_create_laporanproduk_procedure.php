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
        // 1. Hapus Stored Procedure lama jika sudah ada
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanProduk");

        // 2. Buat Stored Procedure GetLaporanProduk
        DB::unprepared("
            CREATE PROCEDURE GetLaporanProduk()
            BEGIN

                SELECT
                    p.kodeproduk,
                    p.nama,
                    p.berat,

                    jp.jenis AS jenisproduk,

                    k.karat,
                    jk.jenis AS jeniskarat,

                    p.lingkar,
                    p.panjang,

                    h.harga AS hargapergram,

                    p.keterangan,

                    kd.kondisi,

                    -- Status Produk di Nampan
                    (
                        SELECT COUNT(*)
                        FROM nampanproduk np
                        WHERE np.produk_id = p.id
                          AND np.jenis = 'MASUK'
                          AND np.status = 1
                    ) AS status_nampan,

                    -- Total Produk Sudah Masuk Nampan
                    SUM(
                        CASE
                            WHEN (
                                SELECT COUNT(*)
                                FROM nampanproduk np
                                WHERE np.produk_id = p.id
                                  AND np.jenis = 'MASUK'
                                  AND np.status = 1
                            ) > 0
                            THEN 1
                            ELSE 0
                        END
                    ) OVER() AS TOTALSUDAHMASUK,

                    -- Total Produk Belum Masuk Nampan
                    SUM(
                        CASE
                            WHEN (
                                SELECT COUNT(*)
                                FROM nampanproduk np
                                WHERE np.produk_id = p.id
                                  AND np.jenis = 'MASUK'
                                  AND np.status = 1
                            ) = 0
                            THEN 1
                            ELSE 0
                        END
                    ) OVER() AS TOTALBELUMMASUK,

                    -- Ringkasan Keseluruhan
                    COUNT(p.id) OVER() AS TOTALPOTONG,

                    SUM(p.berat) OVER() AS TOTALBERAT

                FROM produk p

                INNER JOIN jenisproduk jp
                    ON p.jenisproduk_id = jp.id

                INNER JOIN karat k
                    ON p.karat_id = k.id

                INNER JOIN jeniskarat jk
                    ON p.jeniskarat_id = jk.id

                INNER JOIN harga h
                    ON p.harga_id = h.id

                INNER JOIN kondisi kd
                    ON p.kondisi_id = kd.id

                WHERE p.status = 1

                ORDER BY
                    jp.urutan ASC,
                    p.kodeproduk ASC;

            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanProduk");
    }
};
