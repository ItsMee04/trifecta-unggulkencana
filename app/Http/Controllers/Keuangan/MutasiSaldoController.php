<?php

namespace App\Http\Controllers\Keuangan;

use App\Http\Controllers\Controller;
use App\Services\Keuangan\MutasiSaldoService;
use Exception;
use Illuminate\Http\Request;

class MutasiSaldoController extends Controller
{
    protected MutasiSaldoService $mutasisaldoService;

    public function __construct(MutasiSaldoService $mutasisaldoService)
    {
        $this->mutasisaldoService = $mutasisaldoService;
    }

    public function getMutasiSaldo()
    {
        $data = $this->mutasisaldoService->getMutasiSaldo();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data mutasi saldo tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data mutasi saldo berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeMutasiSaldo(Request $request)
    {
        // 1. Validasi Input
        $validated = $request->validate([
            'saldo_id'   => 'required|exists:saldo,id',
            'tanggal'    => 'required|date',
            'keterangan' => 'nullable|string',
            'jenis'      => 'required|in:MASUK,KELUAR', // Batasi tipe jenis demi keamanan
            'jumlah'     => 'required|integer|min:1',
        ]);

        try {
            // 2. Map request ke parameter array yang sesuai dengan Service
            $payload = [
                'saldo_id'   => $validated['saldo_id'],
                'tanggal'    => $validated['tanggal'],
                'keterangan' => $validated['keterangan'],
                'jenis'      => $validated['jenis'],
                'jumlah'     => $validated['jumlah'],
            ];

            // 3. Eksekusi logika bisnis melalui Service
            $mutasi = $this->mutasisaldoService->createMutasiSaldo($payload);

            return response()->json([
                'status'  => true,
                'message' => 'Data mutasi saldo berhasil disimpan',
                'data'    => $mutasi,
            ], 201);

        } catch (Exception $e) {
            // Tangani jika terjadi error (misalnya Saldo ID tidak ditemukan atau error query)
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memproses mutasi saldo: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function updateMutasiSaldo(Request $request)
    {
        // 1. Validasi Input
        $validated = $request->validate([
            'id'         => 'required|exists:mutasisaldo,id', // Sesuaikan nama tabel mutasi saldo Anda
            'tanggal'    => 'required|date',
            'keterangan' => 'nullable|string',
            'jenis'      => 'required|in:MASUK,KELUAR',
            'jumlah'     => 'required|integer|min:1',
        ]);

        try {
            $payload = [
                'tanggal'    => $validated['tanggal'],
                'keterangan' => $validated['keterangan'],
                'jenis'      => $validated['jenis'],
                'jumlah'     => $validated['jumlah'],
            ];

            // 2. Panggil Service Update
            $mutasi = $this->mutasisaldoService->updateMutasiSaldo($validated['id'], $payload);

            return response()->json([
                'status'  => true,
                'message' => 'Data mutasi saldo berhasil diupdate',
                'data'    => $mutasi,
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal mengupdate data mutasi: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function deleteMutasiSaldo(Request $request)
    {
        // 1. Validasi ID
        $validated = $request->validate([
            'id' => 'required|exists:mutasi_saldo,id', // Sesuaikan nama tabel mutasi saldo Anda
        ]);

        try {
            // 2. Panggil Service Delete
            $mutasi = $this->mutasisaldoService->deleteMutasiSaldo($validated['id']);

            return response()->json([
                'status'  => true,
                'message' => 'Data mutasi saldo berhasil dihapus',
                'data'    => $mutasi,
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal menghapus data mutasi: ' . $e->getMessage(),
            ], 400);
        }
    }
}
