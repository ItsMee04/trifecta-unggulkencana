<?php

namespace App\Services\Nampan;

use App\Models\Nampan\NampanProduk;
use App\Models\Produk\Produk;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NampanProdukService
{
    public function getNampanProduk()
    {
        return NampanProduk::with(['nampan', 'produk', 'produk.karat', 'produk.harga', 'user'])->where('status', 1)->get();
    }

    public function getNampanProdukByNampan(int $id)
    {
        return NampanProduk::with(['nampan', 'produk', 'user'])
            ->where('nampan_id', $id)
            ->where('status', 1)->get();
    }

    public function getProdukByJenisNampan(int $jenisProdukId)
    {
        return Produk::with(['jenisproduk', 'karat', 'jeniskarat', 'harga', 'kondisi'])
            ->where('status', 1)
            ->where('jenisproduk_id', $jenisProdukId)
            ->where(function ($query) {
                // Kondisi A: Produk belum pernah masuk tabel nampanproduk sama sekali
                $query->whereDoesntHave('nampanproduk')
                    // Kondisi B: Log terakhirnya KELUAR dengan status 0
                    ->orWhereExists(function ($subQuery) {
                        $subQuery->select(DB::raw(1))
                            ->from('nampanproduk as np1')
                            ->join(DB::raw('(SELECT produk_id, MAX(id) as max_id FROM nampanproduk GROUP BY produk_id) as np2'), 'np1.id', '=', 'np2.max_id')
                            ->whereColumn('np1.produk_id', 'produk.id')
                            ->where('np1.jenis', 'KELUAR')
                            ->where('np1.status', 0);
                    });
            })
            ->get();
    }

    public function storeNampanProduk(array $data)
    {
        return DB::transaction(function () use ($data) {
            $nampanId = $data['nampan_id'];
            $produkIds = $data['produk_id'];
            $userId = Auth::id();
            $sekarang = Carbon::now();

            // Cek duplikasi produk aktif di nampan manapun
            $activeInOtherNampan = NampanProduk::with('nampan')
                ->whereIn('produk_id', $produkIds)
                ->where('status', 1)
                ->first();

            if ($activeInOtherNampan) {
                throw new \Exception("Gagal! Produk masih aktif di nampan: " . ($activeInOtherNampan->nampan->nampan ?? 'Lain'));
            }

            $dataToInsert = [];
            foreach ($produkIds as $id) {
                $dataToInsert[] = [
                    'nampan_id'  => $nampanId,
                    'produk_id'  => $id,
                    'jenis'      => 'MASUK',
                    'tanggal'    => $sekarang->format('Y-m-d'),
                    'oleh'       => $userId,
                    'status'     => 1,
                    'created_at' => $sekarang,
                    'updated_at' => $sekarang,
                ];
            }

            NampanProduk::insert($dataToInsert);

            return [
                'nampan_id' => $nampanId,
                'inserted_count' => count($produkIds)
            ];
        });
    }

    public function pindahNampanProduk(int $nampanTujuanId, int $nampanProdukId)
    {
        return DB::transaction(function () use ($nampanTujuanId, $nampanProdukId) {
            $recordAktif = NampanProduk::findOrFail($nampanProdukId);
            $tglSekarang = now()->toDateString();
            $userId = Auth::id();

            // Matikan yang lama
            $recordAktif->update(['status' => 0]);

            // Catatan History Keluar
            NampanProduk::create([
                'nampan_id' => $recordAktif->nampan_id,
                'produk_id' => $recordAktif->produk_id,
                'jenis'     => 'KELUAR',
                'tanggal'   => $tglSekarang,
                'status'    => 0,
                'oleh'      => $userId
            ]);

            // Catatan Masuk Baru ke Nampan Tujuan
            NampanProduk::create([
                'nampan_id' => $nampanTujuanId,
                'produk_id' => $recordAktif->produk_id,
                'jenis'     => 'MASUK',
                'tanggal'   => $tglSekarang,
                'status'    => 1,
                'oleh'      => $userId
            ]);

            return true;
        });
    }

    public function deleteNampanProduk(int $nampanProdukId)
    {
        return DB::transaction(function () use ($nampanProdukId) {
            $recordAktif = NampanProduk::findOrFail($nampanProdukId);
            $tglSekarang = now()->toDateString();

            // Update status record aktif menjadi 0
            $recordAktif->update(['status' => 0]);

            // Bukti riwayat KELUAR
            NampanProduk::create([
                'nampan_id' => $recordAktif->nampan_id,
                'produk_id' => $recordAktif->produk_id,
                'jenis'     => 'KELUAR',
                'tanggal'   => $tglSekarang,
                'status'    => 0,
                'oleh'      => Auth::id()
            ]);

            return true;
        });
    }

    public function getProdukInNampanByJenis(int $jenisId)
    {
        $query = NampanProduk::with([
            'nampan',
            'produk.karat',
            'produk.jeniskarat',
            'produk.harga'
        ])
        ->where('status', 1)
        ->whereHas('produk', function ($q) {
            $q->where('status', 1);
        });

        if ($jenisId && $jenisId !== 'all') {
            $query->whereHas('nampan', function ($q) use ($jenisId) {
                $q->where('jenisproduk_id', $jenisId);
            });
        }

        return $query->get()->map(function ($item) {
            $produk = $item->produk;
            $nampan = $item->nampan;

            if (!$produk) return null;

            return [
                'nampan'         => $nampan->nampan ?? '-',
                'jenisproduk_id' => $nampan->jenisproduk_id ?? null,
                'kodeproduk'     => $produk->kodeproduk ?? '-',
                'nama'           => $produk->nama ?? '-',
                'berat'          => $produk->berat ?? 0,
                'karat'          => $produk->karat->karat ?? '-',
                'jeniskarat'     => $produk->jeniskarat->jenis ?? '-',
                'lingkar'        => $produk->lingkar ?? '-',
                'panjang'        => $produk->panjang ?? '-',
                'harga'          => $produk->harga->harga ?? 0,
                'image'          => $produk->image ?? 'default.png',
                'status'         => $produk->status ?? 1,
            ];
        })->filter()->values();
    }
}
