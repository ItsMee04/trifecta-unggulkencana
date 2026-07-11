<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\Master\JabatanService;
use Illuminate\Http\Request;

class JabatanController extends Controller
{
    protected JabatanService $jabatanService;

    public function __construct(JabatanService $jabatanService)
    {
        $this->jabatanService = $jabatanService;
    }

    public function getJabatan()
    {
        $data = $this->jabatanService->getJabatanAktif();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data jabatan tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data jabatan berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeJabatan(Request $request)
    {
        $request->validate([
            'jabatan' => 'required|string|max:255',
        ]);

        $jabatan = $this->jabatanService->createJabatan([
            'jabatan'   => $request->jabatan,
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data jabatan berhasil disimpan',
            'data'      => $jabatan
        ], 201);
    }

    public function updateJabatan(Request $request)
    {
        $request->validate([
            'jabatan' => 'required|string|max:255',
        ]);

        $jabatan = $this->jabatanService->updateJabatan(
            $request->id,
            [
                'jabatan' => $request->jabatan
            ]
        );

        if (!$jabatan) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data jabatan tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jabatan berhasil diupdate',
            'data'      => $jabatan
        ], 200);
    }

    public function deleteJabatan(Request $request)
    {
        $deleted = $this->jabatanService->deleteJabatan($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data jabatan tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jabatan berhasil dihapus',
        ], 200);
    }
}
