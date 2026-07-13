<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Services\Pelanggan\PelangganService;
use Illuminate\Http\Request;

class PelangganController extends Controller
{
    protected PelangganService $pelangganService;

    public function __construct(PelangganService $pelangganService)
    {
        $this->pelangganService = $pelangganService;
    }

    public function getPelanggan()
    {
        $data = $this->pelangganService->getPelanggan();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data pelanggan tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data pelanggan berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storePelanggan(Request $request)
    {
        $request->validate([
            'nama'      => 'required|string|max:255',
            'kontak'    => 'nullable|numeric'
        ]);

        $data = $this->pelangganService->createPelanggan([
            'nama'      => $request->nama,
            'kontak'    => $request->kontak,
            'alamat'    => $request->alamat,
            'tanggal'   => $request->tanggal
        ]);

        return response()->json([
            'status'    => 201,
            'success'   => true,
            'message'   => 'Data pelanggan berhasil disimpan',
            'data'      => $data
        ], 201);
    }

    public function updatePelanggan(Request $request)
    {
        $request->validate([
            'nama'      => 'required|string|max:255',
            'kontak'    => 'nullable|numeric'
        ]);

        $data = $this->pelangganService->updatePelanggan(
            $request->id,
            [
                'nama'      => $request->nama,
                'kontak'    => $request->kontak,
                'alamat'    => $request->alamat,
                'poin'      => $request->poin,
                'tanggal'   => $request->tanggal
            ]
        );

        if (!$data) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data pelanggan tidak ditemukan',
                'data'      => null
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data pelanggan berhasil diupdate',
            'data'      => $data
        ], 200);
    }

    public function deletePelanggan(Request $request)
    {
        $deleted = $this->pelangganService->deletePelanggan($request->id);

        if (!$deleted) {
            return response()->json([
                'status'    => 404,
                'success'   => false,
                'message'   => 'Data pelanggan tidak ditemukan',
            ], 200);
        }

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data pelanggan berhasil dihapus',
        ], 200);
    }
}
