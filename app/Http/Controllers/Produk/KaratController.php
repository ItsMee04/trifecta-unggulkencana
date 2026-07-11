<?php

namespace App\Http\Controllers\Produk;

use App\Http\Controllers\Controller;
use App\Services\Produk\KaratService;
use Illuminate\Http\Request;

class KaratController extends Controller
{
    protected KaratService $karatService;

    public function __construct(KaratService $karatService)
    {
        $this->karatService = $karatService;
    }

    public function getKarat()
    {
        $data = $this->karatService->getKarat();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data karat tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data karat berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeKarat(Request $request)
    {
        $request->validate([
            'karat' => 'required|string|max:255',
        ]);

        $karat = $this->karatService->createKarat([
            'karat'   => $request->karat,
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data karat berhasil disimpan',
            'data'      => $karat
        ], 201);
    }

    public function updateKarat(Request $request)
    {
        $request->validate([
            'karat' => 'required|string|max:255',
        ]);

        $karat = $this->karatService->updateKarat(
            $request->id,
            [
                'karat' => $request->karat
            ]
        );

        if (!$karat) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data karat tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data karat berhasil diupdate',
            'data'      => $karat
        ], 200);
    }

    public function deleteKarat(Request $request)
    {
        $deleted = $this->karatService->deleteKarat($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data karat tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data karat berhasil dihapus',
        ], 200);
    }
}
