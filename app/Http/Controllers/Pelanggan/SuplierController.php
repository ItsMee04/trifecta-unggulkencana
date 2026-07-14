<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Services\Pelanggan\SuplierService;
use Illuminate\Http\Request;

class SuplierController extends Controller
{
    protected SuplierService $suplierService;

    public function __construct(SuplierService $suplierService)
    {
        $this->suplierService = $suplierService;
    }

    public function getSuplier()
    {
        $data = $this->suplierService->getSuplier();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data suplier tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data suplier berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeSuplier(Request $request)
    {
        $request->validate([
            'nama'      => 'required|string|max:255',
            'kontak'    => 'nullable|numeric'
        ]);

        $data = $this->suplierService->createSuplier([
            'nama'      => $request->nama,
            'kontak'    => $request->kontak,
            'alamat'    => $request->alamat
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data suplier berhasil disimpan',
            'data'      => $data
        ], 201);
    }

    public function updateSuplier(Request $request)
    {
        $request->validate([
            'nama'      => 'required|string|max:255',
            'kontak'    => 'nullable|numeric'
        ]);

        $data = $this->suplierService->updateSuplier(
            $request->id,
            [
                'nama'      => $request->nama,
                'kontak'    => $request->kontak,
                'alamat'    => $request->alamat,
            ]
        );

        if (!$data) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data suplier tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data suplier berhasil diupdate',
            'data'      => $data
        ], 200);
    }

    public function deleteSuplier(Request $request)
    {
        $deleted = $this->suplierService->deleteSuplier($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data suplier tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data suplier berhasil dihapus',
        ], 200);
    }
}
