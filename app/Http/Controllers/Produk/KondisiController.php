<?php

namespace App\Http\Controllers\Produk;

use App\Http\Controllers\Controller;
use App\Services\Produk\KondisiService;
use Illuminate\Http\Request;

class KondisiController extends Controller
{
    protected KondisiService $kondisiService;

    public function __construct(KondisiService $kondisiService)
    {
        $this->kondisiService = $kondisiService;
    }

    public function getKondisi()
    {
        $data = $this->kondisiService->getKondisi();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data kondisi tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data kondisi berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeKondisi(Request $request)
    {
        $request->validate([
            'kondisi' => 'required|string|max:255',
        ]);

        $kondisi = $this->kondisiService->createKondisi([
            'kondisi'   => strtoupper($request->kondisi),
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data kondisi berhasil disimpan',
            'data'      => $kondisi
        ], 201);
    }

    public function updateKondisi(Request $request)
    {
        $request->validate([
            'kondisi' => 'required|string|max:255',
        ]);

        $kondisi = $this->kondisiService->updateKondisi(
            $request->id,
            [
                'kondisi' => strtoupper($request->kondisi)
            ]
        );

        if (!$kondisi) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kondisi tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kondisi berhasil diupdate',
            'data'      => $kondisi
        ], 200);
    }

    public function deleteKondisi(Request $request)
    {
        $deleted = $this->kondisiService->deleteKondisi($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data kondisi tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data kondisi berhasil dihapus',
        ], 200);
    }
}
