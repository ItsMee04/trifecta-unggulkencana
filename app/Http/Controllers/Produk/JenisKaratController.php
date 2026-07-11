<?php

namespace App\Http\Controllers\Produk;

use App\Http\Controllers\Controller;
use App\Services\Produk\JenisKaratService;
use Illuminate\Http\Request;

class JenisKaratController extends Controller
{
    protected JenisKaratService $jeniskaratService;

    public function __construct(JenisKaratService $jeniskaratService)
    {
        $this->jeniskaratService = $jeniskaratService;
    }

    public function getJenisKarat()
    {
        $data = $this->jeniskaratService->getJenisKarat();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data jenis karat tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data jenis karat berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeJenisKarat(Request $request)
    {
        $request->validate([
            'karat_id'  => 'required|exists:karat,id',
            'jenis'     => 'required|string'
        ]);

        $jeniskarat = $this->jeniskaratService->createJenisKarat([
            'karat_id'  => $request->karat_id,
            'jenis'     => $request->jenis,
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data jenis karat berhasil disimpan',
            'data'      => $jeniskarat
        ], 201);
    }

    public function updateJenisKarat(Request $request)
    {
        $request->validate([
            'karat_id'  => 'required|exists:karat,id',
            'jenis'     => 'required|string'
        ]);

        $jeniskarat = $this->jeniskaratService->updateJenisKarat(
            $request->id,
            [
                'karat_id'  => $request->karat_id,
                'jenis'     => $request->jenis,
            ]
        );

        if (!$jeniskarat) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data jenis karat tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jenis karat berhasil diupdate',
            'data'      => $jeniskarat
        ], 200);
    }

    public function deleteJenisKarat(Request $request)
    {
        $deleted = $this->jeniskaratService->deleteJenisKarat($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data jenis karat tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jenis karat berhasil dihapus',
        ], 200);
    }
}
