<?php

namespace App\Services\Nampan;

use App\Models\Nampan\Nampan;
use Carbon\Carbon;

class NampanService
{
    public function getNampan()
    {
        $data = Nampan::with(['jenisproduk'])->where('status', 1)->get();

        return $data;
    }

    public function createNampan(array $data): Nampan
    {
        $data = Nampan::create([
            'nampan'            => strtoupper($data['nampan']),
            'jenisproduk_id'    => $data['jenisproduk_id'],
            'tanggal'           => Carbon::now()
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateNampan(int $id, array $newData): ?Nampan
    {
        // 1. Cari data lama di database, simpan ke variabel berbeda (misal: $nampan)
        $nampan = Nampan::find($id);

        if (!$nampan) {
            return null;
        }

        // 2. Update menggunakan data baru dari parameter $newData
        $nampan->update([
            'nampan'            => strtoupper($newData['nampan']),
            'jenisproduk_id'    => $newData['jenisproduk_id'],
            'tanggal'           => Carbon::now()
        ]);

        return $nampan;
    }

    public function deleteNampan(int $id): bool
    {
        $data = Nampan::find($id);

        if (!$data) {
            return false;
        }

        $data->status = 0;
        return $data->save();
    }
}
