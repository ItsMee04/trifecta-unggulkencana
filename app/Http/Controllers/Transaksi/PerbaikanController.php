<?php

namespace App\Http\Controllers\Transaksi;

use App\Http\Controllers\Controller;
use App\Services\Transaksi\PerbaikanService;
use Exception;
use Illuminate\Http\Request;

class PerbaikanController extends Controller
{
    protected PerbaikanService $perbaikanService;

    public function __construct(PerbaikanService $perbaikanService)
    {
        $this->perbaikanService = $perbaikanService;
    }

    public function getKodeTransaksi()
    {
        try {
            $result = $this->perbaikanService->handleGetKodeTransaksi();

            return response()->json([
                'status'  => true,
                'message' => $result['message'],
                'kode'    => $result['kode']
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => 'Gagal generate kode: ' . $e->getMessage()], 500);
        }
    }

    public function getPerbaikan()
    {
        try {
            $data = $this->perbaikanService->getPerbaikan();

            if ($data->isEmpty()) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Data perbaikan tidak ditemukan',
                    'data'    => []
                ], 400);
            }

            return response()->json([
                'status'  => true,
                'message' => 'Data perbaikan berhasil ditemukan',
                'data'    => $data,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal mengambil data perbaikan: ' . $e->getMessage(),
                'data'    => []
            ], 500);
        }
    }

    public function finalPerbaikan(Request $request)
    {
        $request->validate([
            'kode' => 'required|exists:perbaikan,id',
        ]);

        try {
            $this->perbaikanService->finalPerbaikan($request->kode);

            return response()->json([
                'status'  => true,
                'message' => 'Final Perbaikan berhasil dan produk telah diaktifkan kembali'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memfinal perbaikan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function batalPerbaikan(Request $request)
    {
        $request->validate([
            'kode' => 'required|exists:perbaikan,id'
        ]);

        try {
            $this->perbaikanService->batalPerbaikan($request->kode);

            return response()->json([
                'status'  => true,
                'message' => 'Pembatalan Berhasil.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal membatalkan & refund: ' . $e->getMessage()
            ], 500);
        }
    }
}
