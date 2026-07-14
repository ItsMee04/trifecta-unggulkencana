<?php

namespace App\Services\Keuangan;

use App\Models\Keuangan\MutasiSaldo;
use App\Models\Keuangan\Saldo;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MutasiSaldoService
{
    public function getMutasiSaldo()
    {
        $data = MutasiSaldo::with(['saldo'])->where('status', 1)->get();

        return $data;
    }

    public function createMutasiSaldo(array $data): MutasiSaldo
    {
        return DB::transaction(function () use ($data) {
            // 1. Cari data rekening/saldo
            $rekening = Saldo::findOrFail($data['saldo_id']);

            // 2. Buat record Mutasi Saldo
            $mutasi = MutasiSaldo::create([
                'saldo_id'   => $data['saldo_id'],
                'tanggal'    => $data['tanggal'],
                'keterangan' => strtoupper($data['keterangan']),
                'jenis'      => $data['jenis'],
                'jumlah'     => $data['jumlah'],
                'oleh'       => Auth::user()->id, // Menyimpan ID user yang login
            ]);

            // 3. Update nominal saldo pada rekening
            if ($data['jenis'] === 'MASUK') {
                $rekening->total += $data['jumlah'];
            } elseif ($data['jenis'] === 'KELUAR') {
                $rekening->total -= $data['jumlah'];
            }

            $rekening->save();

            return $mutasi;
        });
    }

    public function updateMutasiSaldo(int $id, array $data): MutasiSaldo
    {
        return DB::transaction(function () use ($id, $data) {
            // 1. Cari data mutasi saldo
            $mutasisaldo = MutasiSaldo::findOrFail($id);

            // 2. Ambil data rekening terkait (mendukung nama kolom saldo_id / saldo)
            $saldoId = $mutasisaldo->saldo_id ?? $mutasisaldo->saldo;
            $rekening = Saldo::findOrFail($saldoId);

            // 3. REVERT: Kembalikan nominal saldo ke kondisi awal sebelum mutasi lama dihitung
            if ($mutasisaldo->jenis === 'MASUK') {
                $rekening->total -= $mutasisaldo->jumlah;
            } elseif ($mutasisaldo->jenis === 'KELUAR') {
                $rekening->total += $mutasisaldo->jumlah;
            }

            // 4. Update data Mutasi dengan data baru
            $mutasisaldo->tanggal    = $data['tanggal'] ?? $mutasisaldo->tanggal;
            $mutasisaldo->keterangan = strtoupper($data['keterangan'] ?? '');
            $mutasisaldo->jenis      = $data['jenis'];
            $mutasisaldo->jumlah     = $data['jumlah'];
            $mutasisaldo->oleh       = Auth::user()->id;
            $mutasisaldo->save();

            // 5. APPLY: Hitung kembali saldo berdasarkan jenis mutasi yang baru
            if ($data['jenis'] === 'MASUK') {
                $rekening->total += $data['jumlah'];
            } elseif ($data['jenis'] === 'KELUAR') {
                $rekening->total -= $data['jumlah'];
            }

            $rekening->save();

            return $mutasisaldo;
        });
    }

    public function deleteMutasiSaldo(int $id): MutasiSaldo
    {
        return DB::transaction(function () use ($id) {
            // 1. Cari data mutasi saldo
            $mutasisaldo = MutasiSaldo::findOrFail($id);

            // 2. Ambil data rekening terkait
            $saldoId = $mutasisaldo->saldo_id ?? $mutasisaldo->saldo;
            $rekening = Saldo::find($saldoId);

            if ($rekening) {
                // 3. REVERT: Balikkan nominal saldo karena transaksi dibatalkan
                if ($mutasisaldo->jenis === 'MASUK') {
                    $rekening->total -= $mutasisaldo->jumlah;
                } elseif ($mutasisaldo->jenis === 'KELUAR') {
                    $rekening->total += $mutasisaldo->jumlah;
                }
                $rekening->save();
            }

            // 4. Soft Delete: Ubah status menjadi 0
            $mutasisaldo->status = 0;
            $mutasisaldo->save();

            return $mutasisaldo;
        });
    }
}
