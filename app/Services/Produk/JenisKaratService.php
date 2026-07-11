<?php

namespace App\Services\Produk;

use App\Models\Produk\JenisKarat;

class JenisKaratService
{
    public function getJenisKarat()
    {
        $data = JenisKarat::with(['karat'])->where('status', 1)->get();

        return $data;
    }

    public function createJenisKarat(array $data): JenisKarat
    {
        $data = JenisKarat::create([
            'karat_id'  => $data['karat_id'],
            'jenis'     => strtoupper($data['jenis']),
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateJenisKarat(int $id, array $data): ?JenisKarat
    {
        $jeniskarat = JenisKarat::find($id);

        if (!$jeniskarat) {
            return null;
        }

        $jeniskarat->update([
            'karat_id'  => $data['karat_id'],
            'jenis' => strtoupper($data['jenis']),
        ]);

        return $jeniskarat;
    }

    public function deleteJenisKarat(int $id): bool
    {
        $jeniskarat = JenisKarat::find($id);

        if (!$jeniskarat) {
            return false;
        }

        $jeniskarat->status = 0;
        return $jeniskarat->save();
    }
}
