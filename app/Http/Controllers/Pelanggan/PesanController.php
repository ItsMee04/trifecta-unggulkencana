<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Services\Pelanggan\PesanService;
use Illuminate\Http\Request;

class PesanController extends Controller
{
    protected PesanService $pesanService;

    public function __construct(PesanService $pesanService)
    {
        $this->pesanService = $pesanService;
    }

    public function getPesan()
    {
        $data = $this->pesanService->getPesan();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data pesan / template pesan tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data pesan / template pesan berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storePesan(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'pesan' => 'nullable|string'
        ]);

        $data = $this->pesanService->createPesan([
            'judul' => $request->judul,
            'pesan' => $request->pesan,
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data pesan / template pesan berhasil disimpan',
            'data'      => $data
        ], 201);
    }

    public function updatePesan(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'pesan' => 'nullable|string'
        ]);

        $data = $this->pesanService->updatePesan(
            $request->id,
            [
                'judul' => $request->judul,
                'pesan' => $request->pesan,
            ]
        );

        if (!$data) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data pesan / template pesan tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data pesan / template pesan berhasil diupdate',
            'data'      => $data
        ], 200);
    }

    public function deletePesan(Request $request)
    {
        $deleted = $this->pesanService->deletePesan($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data pesan / template pesan tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data pesan / template pesan berhasil dihapus',
        ], 200);
    }
}
