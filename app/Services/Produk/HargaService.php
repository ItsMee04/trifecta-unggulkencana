<?php

namespace App\Services\Produk;

use App\Models\Produk\Harga;

class HargaService
{
    public function getHarga()
    {
        $data = Harga::with(['karat', 'jeniskarat'])->where('status', 1)->get();

        return $data;
    }

    public function createHarga(array $data): Harga
    {
        $data = Harga::create([
            'karat_id'      => $data['karat_id'],
            'jeniskarat_id' => $data['jeniskarat_id'],
            'harga'         => $data['harga'],
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateHarga(int $id, array $data): ?Harga
    {
        $harga = Harga::find($id);

        if (!$harga) {
            return null;
        }

        $harga->update([
            'karat_id'      => $data['karat_id'],
            'jeniskarat_id' => $data['jeniskarat_id'],
            'harga'         => $data['harga'],
        ]);

        return $harga;
    }

    public function deleteHarga(int $id): bool
    {
        $harga = Harga::find($id);

        if (!$harga) {
            return false;
        }

        $harga->status = 0;
        return $harga->save();
    }
}
