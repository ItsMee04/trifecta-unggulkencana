<?php

namespace App\Services\Pelanggan;

use App\Models\Pelanggan\Suplier;

class SuplierService
{
    public function generateKodeSuplier()
    {
        // Ambil data terakhir berdasarkan ID
        $lastRecord = Suplier::orderBy('id', 'desc')->first();

        if (!$lastRecord) {
            $nextNumber = 1;
        } else {
            // Mengambil angka dari kode terakhir (menghapus 'PL-')
            $lastNumber = (int) str_replace('SP-', '', $lastRecord->kode);
            $nextNumber = $lastNumber + 1;
        }

        // Format: PL- + angka 6 digit (contoh: PL-000001)
        return 'SP-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    public function getSuplier()
    {
        $data = Suplier::where('status', 1)->get();

        return $data;
    }

    public function createSuplier(array $data): Suplier
    {
        $data = Suplier::create([
            'kode'      => $this->generateKodeSuplier(),
            'nama'      => strtoupper($data['nama']),
            'kontak'    => $data['kontak'],
            'alamat'    => strtoupper($data['alamat'])
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateSuplier(int $id, array $NewData): ?Suplier
    {
        $data = Suplier::find($id);

        if (!$data) {
            return null;
        }

        $data->update([
            'nama'      => strtoupper($NewData['nama']),
            'kontak'    => $NewData['kontak'],
            'alamat'    => strtoupper($NewData['alamat']),
        ]);

        return $data;
    }

    public function deleteSuplier(int $id): bool
    {
        $data = Suplier::find($id);

        if (!$data) {
            return false;
        }

        $data->status = 0;
        return $data->save();
    }
}
