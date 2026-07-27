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
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanPerbaikan");

        // 2. Buat Stored Procedure GetLaporanPerbaikan
        DB::unprepared("
            CREATE PROCEDURE GetLaporanPerbaikan(
                IN TANGGAL_AWAL DATE,
                IN TANGGAL_AKHIR DATE
            )
            BEGIN
                SELECT
                    p.kode,
                    pr.kodeproduk,
                    pr.nama,
                    pr.berat,
                    jp.jenis,
                    kr.karat,
                    k.kondisi,
                    p.keterangan,
                    p.tanggalmasuk,
                    p.tanggalkeluar,

                    -- Grand Total
                    SUM(pr.berat) OVER() AS TOTALBERAT,
                    COUNT(*) OVER() AS TOTALPOTONG

                FROM perbaikan p

                INNER JOIN produk pr
                    ON p.produk_id = pr.id

                INNER JOIN kondisi k
                    ON p.kondisi_id = k.id

                INNER JOIN jenisproduk jp
                    ON pr.jenisproduk_id = jp.id

                INNER JOIN karat kr
                    ON pr.karat_id = kr.id

                INNER JOIN users u
                    ON p.oleh = u.id

                INNER JOIN pegawai pg
                    ON u.pegawai_id = pg.id

                WHERE p.status != 0
                  AND DATE(p.tanggalmasuk)
                      BETWEEN TANGGAL_AWAL AND TANGGAL_AKHIR

                ORDER BY p.kode ASC;

            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanPerbaikan");
    }
};
