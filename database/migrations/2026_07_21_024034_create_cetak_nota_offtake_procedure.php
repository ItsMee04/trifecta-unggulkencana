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
        DB::unprepared("DROP PROCEDURE IF EXISTS GetNotaOfftake");

        // 2. Buat Stored Procedure GetNotaOfftake
        DB::unprepared("
            CREATE PROCEDURE GetNotaOfftake(
                IN p_kode_transaksi VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
            )
            BEGIN
                SELECT
                    o.kode AS kode_transaksi,
                    o.tanggal,
                    o.terbilang,
                    o.hargatotal AS grand_total,

                    s.nama AS supplier_nama,
                    s.kontak,
                    s.alamat,

                    pr.kodeproduk,
                    pr.nama AS produk_nama,
                    pr.image AS foto,
                    ko.berat,
                    ko.karat,
                    ko.hargajual AS harga_per_gram,
                    ko.total AS total_harga,

                    -- Total kotor seluruh item (Subtotal)
                    (SELECT IFNULL(SUM(ko2.total), 0)
                     FROM offtakedetail ko2
                     WHERE ko2.kode = o.kode AND ko2.status != 0) AS subtotal,

                    -- Potongan/Selisih harga
                    GREATEST(
                        (SELECT IFNULL(SUM(ko2.total), 0)
                         FROM offtakedetail ko2
                         WHERE ko2.kode = o.kode AND ko2.status != 0) - o.hargatotal,
                        0
                    ) AS potongan,

                    pg.nip,
                    pg.nama AS pegawai_nama

                FROM offtake o
                INNER JOIN offtakedetail ko ON o.kode = ko.kode COLLATE utf8mb4_unicode_ci
                INNER JOIN produk pr ON ko.produk_id = pr.id
                INNER JOIN suplier s ON o.suplier_id = s.id
                INNER JOIN users u ON o.oleh = u.id
                INNER JOIN pegawai pg ON u.pegawai_id = pg.id
                WHERE o.kode = p_kode_transaksi AND ko.status != 0;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS GetNotaOfftake');
    }
};
