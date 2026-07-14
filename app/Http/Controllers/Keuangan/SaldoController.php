<?php

namespace App\Http\Controllers\Keuangan;

use App\Http\Controllers\Controller;
use App\Services\Keuangan\SaldoService;
use Illuminate\Http\Request;

class SaldoController extends Controller
{
    protected SaldoService $saldoService;

    public function __construct(SaldoService $saldoService)
    {
        $this->saldoService = $saldoService;
    }

    public function getSaldo()
    {
        $data = $this->saldoService->getSaldo();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data saldo / rekening tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data saldo / rekening berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeSaldo(Request $request)
    {
        $request->validate([
            'rekening'      => 'required|string|max:255',
        ]);

        $data = $this->saldoService->createSaldo([
            'rekening'      => $request->rekening,
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data saldo / rekening berhasil disimpan',
            'data'      => $data
        ], 201);
    }

    public function updateSaldo(Request $request)
    {
        $request->validate([
            'rekening'      => 'required|string|max:255',
        ]);

        $data = $this->saldoService->updateSaldo(
            $request->id,
            [
                'rekening'      => $request->rekening,
            ]
        );

        if (!$data) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data saldo / rekening tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data saldo / rekening berhasil diupdate',
            'data'      => $data
        ], 200);
    }

    public function deleteSaldo(Request $request)
    {
        $deleted = $this->saldoService->deleteSaldo($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data saldo / rekening tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data saldo / rekening berhasil dihapus',
        ], 200);
    }
}
