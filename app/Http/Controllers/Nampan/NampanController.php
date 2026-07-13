<?php

namespace App\Http\Controllers\Nampan;

use App\Http\Controllers\Controller;
use App\Services\Nampan\NampanService;
use Illuminate\Http\Request;

class NampanController extends Controller
{
    protected NampanService $nampanService;

    public function __construct(NampanService $nampanService)
    {
        $this->nampanService = $nampanService;
    }

    public function getNampan()
    {
        $data = $this->nampanService->getNampan();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data nampan tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data nampan berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeNampan(Request $request)
    {
        $request->validate([
            'nampan'            => 'required|string|max:255',
            'jenisproduk_id'    => 'required|exists:jenisproduk,id',
        ]);

        $data = $this->nampanService->createNampan([
            'nampan'            => $request->nampan,
            'jenisproduk_id'    => $request->jenisproduk_id,
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data nampan berhasil disimpan',
            'data'      => $data
        ], 201);
    }

    public function updateNampan(Request $request)
    {
        $request->validate([
            'nampan'            => 'required|string|max:255',
            'jenisproduk_id'    => 'required|exists:jenisproduk,id',
        ]);

        $data = $this->nampanService->updateNampan(
            $request->id,
            [
                'nampan'            => $request->nampan,
                'jenisproduk_id'    => $request->jenisproduk_id,
            ]
        );

        if (!$data) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data nampan tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data nampan berhasil diupdate',
            'data'      => $data
        ], 200);
    }

    public function deleteNampan(Request $request)
    {
        $deleted = $this->nampanService->deleteNampan($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data nampan tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data nampan berhasil dihapus',
        ], 200);
    }
}
