<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Services\Inventory\StokService;
use Illuminate\Http\Request;

class StokController extends Controller
{
    protected StokService $stokService;

    public function __construct(StokService $stokService)
    {
        $this->stokService = $stokService;
    }

    public function getPeriodeStok()
    {
        $data = $this->stokService->getAllPeriodeStok();

        if ($data->isEmpty()) {
            return response()->json([
                'status'  => false,
                'message' => 'Data periode stok tidak ditemukan',
                'data'    => []
            ], 200);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Data periode stok berhasil diambil',
            'data'    => $data
        ], 200);
    }

    public function storePeriodeStok(Request $request)
    {
        $request->validate([
            'periode' => 'required|date|unique:stok,periode',
        ], [
            'periode.required' => 'Periode tidak boleh kosong.',
            'periode.unique'   => 'Periode stok untuk tanggal ini sudah ada.',
        ]);

        try {
            $data = $this->stokService->storePeriodeStok($request->periode);

            return response()->json([
                'status'  => true,
                'message' => 'Data periode berhasil disimpan',
                'data'    => $data
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getNampanProdukByPeriodeStok(Request $request)
    {
        $request->validate([
            'periode' => 'required',
        ]);

        $data = $this->stokService->getNampanProdukByPeriode($request->periode);

        if ($data === null) {
            return response()->json([
                'status'  => false,
                'message' => 'Periode tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Data nampan produk berhasil ditemukan',
            'data'    => $data,
        ], 200);
    }

    public function getRekapStokByPeriode(Request $request)
    {
        $request->validate([
            'periode' => 'required|exists:stok,id'
        ]);

        $result = $this->stokService->getRekapStokByPeriode($request->periode);

        if (!$result) {
            return response()->json([
                'status'  => false,
                'message' => 'Data periode stok tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'       => true,
            'message'      => 'Data stok harian berhasil ditemukan',
            'periode_info' => $result['periode_info'],
            'rekap'        => $result['rekap']
        ], 200);
    }

    public function finalPeriodeStok(Request $request)
    {
        $periode = $this->stokService->finalizePeriodeStok($request->id);

        if (!$periode) {
            return response()->json([
                'status'  => false,
                'message' => 'Data periode stok tidak ditemukan',
                'data'    => [],
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Data periode stok berhasil diperbarui',
            'data'    => $periode,
        ], 200);
    }
}
