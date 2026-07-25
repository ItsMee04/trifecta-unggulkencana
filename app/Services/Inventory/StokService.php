<?php

namespace App\Services\Inventory;

use App\Models\Inventory\Stok;
use App\Models\Nampan\NampanProduk;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StokService
{
    /**
     * Generate Kode Stok Unik
     */
    public function generateKodeStok(): string
    {
        $today = Carbon::now()->format('Ymd');
        $prefixToday = 'ST-' . $today . '-';

        $lastRecord = Stok::where('kode', 'like', 'ST-%')
            ->orderBy('kode', 'desc')
            ->first();

        if (!$lastRecord) {
            $nextNumber = 1;
        } else {
            $segments = explode('-', $lastRecord->kode);
            $lastNumber = (int) end($segments);
            $nextNumber = $lastNumber + 1;
        }

        return $prefixToday . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);
    }

    /**
     * Ambil Semua Periode Stok Aktif
     */
    public function getAllPeriodeStok()
    {
        return Stok::where('status', '!=', 0)->get();
    }

    /**
     * Simpan Periode Stok Baru
     */
    public function storePeriodeStok(string $periodeDate)
    {
        return DB::transaction(function () use ($periodeDate) {
            $kode = $this->generateKodeStok();

            return Stok::create([
                'kode'    => $kode,
                'periode' => $periodeDate,
                'oleh'    => Auth::id(),
                'status'  => 1,
            ]);
        });
    }

    /**
     * Ambil Detail Nampan Produk Berdasarkan ID Periode
     */
    public function getNampanProdukByPeriode(int $periodeId)
    {
        $periode = Stok::find($periodeId);

        if (!$periode) {
            return null;
        }

        return NampanProduk::with(['nampan', 'produk', 'user'])
            ->where('tanggal', $periode->periode)
            ->get();
    }

    /**
     * Kalkulasi Rekapitulasi Stok Harian
     */
    public function getRekapStokByPeriode(int $periodeId)
    {
        $periodeAktif = Stok::find($periodeId);

        if (!$periodeAktif) {
            return null;
        }

        $tanggalPilihan = $periodeAktif->periode;

        $rekap = DB::table('jenisproduk as jp')
            ->select('jp.jenis as nama_kategori')
            ->addSelect(DB::raw("
                COALESCE((
                    SELECT SUM(CASE WHEN n2.jenis = 'MASUK' THEN 1 ELSE -1 END)
                    FROM nampanproduk n2
                    JOIN produk p2 ON n2.produk_id = p2.id
                    WHERE p2.jenisproduk_id = jp.id AND DATE(n2.tanggal) < '{$tanggalPilihan}'
                ), 0) as unit_awal,

                COALESCE((
                    SELECT SUM(CASE WHEN n2.jenis = 'MASUK' THEN p2.berat ELSE -p2.berat END)
                    FROM nampanproduk n2
                    JOIN produk p2 ON n2.produk_id = p2.id
                    WHERE p2.jenisproduk_id = jp.id AND DATE(n2.tanggal) < '{$tanggalPilihan}'
                ), 0) as berat_awal,

                COALESCE((
                    SELECT SUM(CASE WHEN n3.jenis = 'MASUK' THEN 1 ELSE 0 END)
                    FROM nampanproduk n3
                    JOIN produk p3 ON n3.produk_id = p3.id
                    WHERE p3.jenisproduk_id = jp.id AND DATE(n3.tanggal) = '{$tanggalPilihan}'
                ), 0) as unit_masuk,

                COALESCE((
                    SELECT SUM(CASE WHEN n3.jenis = 'KELUAR' THEN 1 ELSE 0 END)
                    FROM nampanproduk n3
                    JOIN produk p3 ON n3.produk_id = p3.id
                    WHERE p3.jenisproduk_id = jp.id AND DATE(n3.tanggal) = '{$tanggalPilihan}'
                ), 0) as unit_keluar,

                COALESCE((
                    SELECT SUM(CASE WHEN n3.jenis = 'MASUK' THEN p3.berat ELSE 0 END)
                    FROM nampanproduk n3
                    JOIN produk p3 ON n3.produk_id = p3.id
                    WHERE p3.jenisproduk_id = jp.id AND DATE(n3.tanggal) = '{$tanggalPilihan}'
                ), 0) as berat_masuk,

                COALESCE((
                    SELECT SUM(CASE WHEN n3.jenis = 'KELUAR' THEN p3.berat ELSE 0 END)
                    FROM nampanproduk n3
                    JOIN produk p3 ON n3.produk_id = p3.id
                    WHERE p3.jenisproduk_id = jp.id AND DATE(n3.tanggal) = '{$tanggalPilihan}'
                ), 0) as berat_keluar
            "))
            ->get();

        $dataFinal = $rekap->map(function ($item) {
            return [
                'kategori'   => $item->nama_kategori,
                'stok_awal'  => [
                    'unit'  => (int)$item->unit_awal,
                    'berat' => round($item->berat_awal, 3)
                ],
                'masuk'      => [
                    'unit'  => (int)$item->unit_masuk,
                    'berat' => round($item->berat_masuk, 3)
                ],
                'keluar'     => [
                    'unit'  => (int)$item->unit_keluar,
                    'berat' => round($item->berat_keluar, 3)
                ],
                'stok_akhir' => [
                    'unit'  => (int)($item->unit_awal + $item->unit_masuk - $item->unit_keluar),
                    'berat' => round(($item->berat_awal + $item->berat_masuk - $item->berat_keluar), 3)
                ]
            ];
        });

        return [
            'periode_info' => [
                'tanggal' => $tanggalPilihan,
                'status'  => $periodeAktif->status
            ],
            'rekap' => $dataFinal
        ];
    }

    /**
     * Finalisasi / Hapus Periode Stok
     */
    public function finalizePeriodeStok(int $periodeId)
    {
        $periode = Stok::find($periodeId);

        if (!$periode) {
            return null;
        }

        $periode->update([
            'status' => 2,
        ]);

        return $periode;
    }
}
