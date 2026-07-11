<?php

namespace App\Services\Produk;

use App\Models\Produk\Kondisi;

class KondisiService
{
    public function getKondisi()
    {
        $data = Kondisi::where('status', 1)->get();

        return $data;
    }

    public function createKondisi(array $data): Kondisi
    {
        $data = Kondisi::create([
            'kondisi' => strtoupper($data['kondisi']),
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateKondisi(int $id, array $data): ?Kondisi
    {
        $kondisi = Kondisi::find($id);

        if (!$kondisi) {
            return null;
        }

        $kondisi->update([
            'kondisi' => strtoupper($data['kondisi']),
        ]);

        return $kondisi;
    }

    public function deleteKondisi(int $id): bool
    {
        $kondisi = Kondisi::find($id);

        if (!$kondisi) {
            return false;
        }

        $kondisi->status = 0;
        return $kondisi->save();
    }
}
