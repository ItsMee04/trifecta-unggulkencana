<?php

namespace App\Services\Pelanggan;

use App\Models\Pelanggan\Pelanggan;

class PelangganService
{
    public function generateKodePelanggan()
    {
        // Ambil data terakhir berdasarkan ID
        $lastRecord = Pelanggan::orderBy('id', 'desc')->first();

        if (!$lastRecord) {
            $nextNumber = 1;
        } else {
            // Mengambil angka dari kode terakhir (menghapus 'PL-')
            $lastNumber = (int) str_replace('PL-', '', $lastRecord->kode);
            $nextNumber = $lastNumber + 1;
        }

        // Format: PL- + angka 6 digit (contoh: PL-000001)
        return 'PL-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }

    public function getPelanggan()
    {
        $data = Pelanggan::where('status', 1)->get();

        return $data;
    }

    public function createPelanggan(array $data): Pelanggan
    {
        $data = Pelanggan::create([
            'kode'      => $this->generateKodePelanggan(),
            'nama'      => strtoupper($data['nama']),
            'kontak'    => $data['kontak'],
            'alamat'    => strtoupper($data['alamat']),
            'tanggal'   => $data['tanggal']
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updatePelanggan(int $id, array $NewData): ?Pelanggan
    {
        $data = Pelanggan::find($id);

        if (!$data) {
            return null;
        }

        $data->update([
            'nama'      => strtoupper($NewData['nama']),
            'kontak'    => $NewData['kontak'],
            'alamat'    => strtoupper($NewData['alamat']),
            'poin'      => $NewData['poin'],
            'tanggal'   => $NewData['tanggal']
        ]);

        return $data;
    }

    public function deletePelanggan(int $id): bool
    {
        $data = Pelanggan::find($id);

        if (!$data) {
            return false;
        }

        $data->status = 0;
        return $data->save();
    }
}
