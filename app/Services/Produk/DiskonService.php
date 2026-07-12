<?php

namespace App\Services\Produk;

use App\Models\Produk\Diskon;

class DiskonService
{
    public function getDiskon()
    {
        $data = Diskon::where('status', 1)->get();

        return $data;
    }

    public function createDiskon(array $data): Diskon
    {
        $data = Diskon::create([
            'diskon'    => strtoupper($data['diskon']),
            'nilai'     => $data['nilai']
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateDiskon(int $id, array $data): ?Diskon
    {
        $data = Diskon::find($id);

        if (!$data) {
            return null;
        }

        $data->update([
            'diskon'    => strtoupper($data['diskon']),
            'nilai'     => $data['nilai']
        ]);

        return $data;
    }

    public function deleteDiskon(int $id): bool
    {
        $data = Diskon::find($id);

        if (!$data) {
            return false;
        }

        $data->status = 0;
        return $data->save();
    }
}
