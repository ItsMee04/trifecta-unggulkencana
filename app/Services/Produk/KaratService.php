<?php

namespace App\Services\Produk;

use App\Models\Produk\Karat;

class KaratService
{
    public function getKarat()
    {
        $data = Karat::where('status', 1)->get();

        return $data;
    }

    public function createKarat(array $data): Karat
    {
        $data = Karat::create([
            'karat' => strtoupper($data['karat']),
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateKarat(int $id, array $data): ?Karat
    {
        $karat = Karat::find($id);

        if (!$karat) {
            return null;
        }

        $karat->update([
            'karat' => strtoupper($data['karat']),
        ]);

        return $karat;
    }

    public function deleteKarat(int $id): bool
    {
        $karat = Karat::find($id);

        if (!$karat) {
            return false;
        }

        $karat->status = 0;
        return $karat->save();
    }
}
