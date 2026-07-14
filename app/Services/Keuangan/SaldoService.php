<?php

namespace App\Services\Keuangan;

use App\Models\Keuangan\Saldo;
use Illuminate\Support\Facades\Auth;

class SaldoService
{
    public function getSaldo()
    {
        $data = Saldo::where('status', 1)->get();

        return $data;
    }

    public function createSaldo(array $data): Saldo
    {
        $data = Saldo::create([
            'rekening'      => strtoupper($data['rekening']),
            'oleh'          => Auth::user()->id
        ]);

        return $data;
    }

    // Tambahkan int pada $id agar Intelephense tahu ini adalah angka
    public function updateSaldo(int $id, array $NewData): ?Saldo
    {
        $data = Saldo::find($id);

        if (!$data) {
            return null;
        }

        $data->update([
            'rekening'      => strtoupper($NewData['rekening']),
            'oleh'          => Auth::user()->id
        ]);

        return $data;
    }

    public function deleteSaldo(int $id): bool
    {
        $data = Saldo::find($id);

        if (!$data) {
            return false;
        }

        $data->status = 0;
        return $data->save();
    }
}
