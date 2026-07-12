<?php

namespace App\Http\Controllers\Produk;

use App\Http\Controllers\Controller;
use App\Services\Produk\DiskonService;
use Illuminate\Http\Request;

class DiskonController extends Controller
{
    protected DiskonService $diskonService;

    public function __construct(DiskonService $diskonService)
    {
        $this->diskonService = $diskonService;
    }

    public function getDiskon()
    {
        $data = $this->diskonService->getDiskon();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data diskon tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data diskon berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeDiskon(Request $request)
    {
        $request->validate([
            'diskon'    => 'required|string|max:255',
            'nilai'     => 'required|numeric'
        ]);

        $data = $this->diskonService->createDiskon([
            'diskon'    => strtoupper($request->diskon),
            'nilai'     => $request->nilai
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data diskon berhasil disimpan',
            'data'      => $data
        ], 201);
    }

    public function updateDiskon(Request $request)
    {
        $request->validate([
            'diskon' => 'required|string|max:255',
            'nilai'  => 'required|numeric',
        ]);

        $data = $this->diskonService->updateDiskon(
            $request->id,
            [
                'diskon' => strtoupper($request->diskon),
                'nilai'  => $request->nilai
            ]
        );

        if (!$data) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data diskon tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data diskon berhasil diupdate',
            'data'      => $data
        ], 200);
    }

    public function deleteDiskon(Request $request)
    {
        $deleted = $this->diskonService->deleteDiskon($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data diskon tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data diskon berhasil dihapus',
        ], 200);
    }
}
