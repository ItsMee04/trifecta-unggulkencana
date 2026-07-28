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
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanMutasiSaldo");

        // 2. Buat Stored Procedure GetLaporanMutasiSaldo
        DB::unprepared("
            CREATE PROCEDURE GetLaporanMutasiSaldo(
                IN TANGGAL_AWAL DATE,
                IN TANGGAL_AKHIR DATE
            )
            BEGIN
                SELECT
                    ms.tanggal,
                    ms.keterangan,
                    ms.jenis,

                    -- Nominal transaksi
                    ms.jumlah,

                    -- Pisahkan menjadi debit dan kredit
                    CASE
                        WHEN ms.jenis = 'MASUK'
                        THEN ms.jumlah
                        ELSE 0
                    END AS debit,

                    CASE
                        WHEN ms.jenis = 'KELUAR'
                        THEN ms.jumlah
                        ELSE 0
                    END AS kredit,

                    s.rekening,

                    -- Saldo berjalan (Running Balance)
                    SUM(
                        CASE
                            WHEN ms.jenis = 'MASUK'
                            THEN ms.jumlah
                            ELSE -ms.jumlah
                        END
                    ) OVER (
                        ORDER BY ms.tanggal ASC, ms.id ASC
                        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                    ) AS saldo,

                    pg.nama AS pegawai,

                    -- Summary
                    SUM(ms.jumlah) OVER() AS TOTALMUTASI,
                    COUNT(*) OVER() AS TOTALTRANSAKSI

                FROM mutasisaldo ms

                INNER JOIN saldo s
                    ON ms.saldo_id = s.id

                INNER JOIN users u
                    ON ms.oleh = u.id

                INNER JOIN pegawai pg
                    ON u.pegawai_id = pg.id

                WHERE s.status != 0
                AND DATE(ms.tanggal) BETWEEN TANGGAL_AWAL AND TANGGAL_AKHIR

                ORDER BY ms.tanggal ASC, ms.id ASC;

            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS GetLaporanMutasiSaldo");
    }
};
