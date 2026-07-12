<?php

namespace App\Http\Controllers\Produk;

use App\Http\Controllers\Controller;
use App\Services\Produk\HargaService;
use Illuminate\Http\Request;

class HargaController extends Controller
{
    protected HargaService $hargaService;

    public function __construct(HargaService $hargaService)
    {
        $this->hargaService = $hargaService;
    }

    public function getHarga()
    {
        $data = $this->hargaService->getHarga();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data harga tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data harga berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeHarga(Request $request)
    {
        $request->validate([
            'karat_id'      => 'required|exists:karat,id',
            'jeniskarat_id' => 'required|exists:jeniskarat,id',
            'harga'         => 'required|numeric'
        ]);

        $harga = $this->hargaService->createHarga([
            'karat_id'      => $request->karat_id,
            'jeniskarat_id' => $request->jeniskarat_id,
            'harga'         => $request->harga,
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data harga berhasil disimpan',
            'data'      => $harga
        ], 201);
    }

    public function updateHarga(Request $request)
    {
        $request->validate([
            'karat_id'      => 'required|exists:karat,id',
            'jeniskarat_id' => 'required|exists:jeniskarat,id',
            'harga'         => 'required|numeric'
        ]);

        $harga = $this->hargaService->updateHarga(
            $request->id,
            [
                'karat_id'      => $request->karat_id,
                'jeniskarat_id' => $request->jeniskarat_id,
                'harga'         => $request->harga,
            ]
        );

        if (!$harga) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data harga tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data harga berhasil diupdate',
            'data'      => $harga
        ], 200);
    }

    public function deleteHarga(Request $request)
    {
        $deleted = $this->hargaService->deleteHarga($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data harga tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data harga berhasil dihapus',
        ], 200);
    }
}
