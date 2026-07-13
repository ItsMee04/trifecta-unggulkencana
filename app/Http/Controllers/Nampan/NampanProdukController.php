<?php

namespace App\Http\Controllers\Nampan;

use App\Http\Controllers\Controller;
use App\Services\Nampan\NampanProdukService;
use Illuminate\Http\Request;

class NampanProdukController extends Controller
{
    protected NampanProdukService $nampanprodukService;

    public function __construct(NampanProdukService $nampanprodukService)
    {
        $this->nampanprodukService = $nampanprodukService;
    }

    public function getNampanProduk()
    {
        $data = $this->nampanprodukService->getNampanProduk();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => false,
                'message'   => 'Data nampan produk tidak ditemukan',
                'data'      => [],
            ], 200);
        }

        return response()->json([
            'status'    => true,
            'message'   => 'Data nampan produk berhasil ditemukan',
            'data'      => $data,
        ], 200);
    }

    public function getNampanProdukByNampan(Request $request)
    {
        $data = $this->nampanprodukService->getNampanProdukByNampan((int) $request->id);

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => false,
                'message'   => 'Data nampan produk tidak ditemukan',
                'data'      => [],
            ], 200);
        }

        return response()->json([
            'status'    => true,
            'message'   => 'Data nampan produk berhasil ditemukan',
            'data'      => $data,
        ], 200);
    }

    public function getProdukByJenisNampan(Request $request)
    {
        $data = $this->nampanprodukService->getProdukByJenisNampan((int) $request->jenisproduk);

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => false,
                'message'   => 'Data produk tidak ditemukan',
                'data'      => [],
            ], 200);
        }

        return response()->json([
            'status'    => true,
            'message'   => 'Data produk berhasil ditemukan',
            'data'      => $data,
        ], 200);
    }

    public function storeNampanProduk(Request $request)
    {
        $validated = $request->validate([
            'nampan_id'   => 'required|exists:nampan,id',
            'produk_id'   => 'required|array',
            'produk_id.*' => 'required|exists:produk,id'
        ]);

        try {
            $result = $this->nampanprodukService->storeNampanProduk($validated);

            return response()->json([
                'status'  => 'success',
                'message' => $result['inserted_count'] . " produk berhasil ditambahkan ke nampan.",
                'data'    => $result
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 200); // 200 atau 422 agar interceptor frontend dapat membaca pesan string custom
        }
    }

    public function pindahNampanProduk(Request $request)
    {
        $request->validate([
            'nampan' => 'required|exists:nampan,id',
            'produk' => 'required|exists:nampanproduk,id' // ID dari baris nampanproduk aktif
        ]);

        try {
            $this->nampanprodukService->pindahNampanProduk((int) $request->nampan, (int) $request->produk);

            return response()->json([
                'status'  => true,
                'message' => 'Produk berhasil dipindahkan.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal pindah: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteNampanProduk(Request $request)
    {
        $request->validate([
            'produk' => 'required|exists:nampanproduk,id'
        ]);

        try {
            $this->nampanprodukService->deleteNampanProduk((int) $request->produk);

            return response()->json([
                'status'  => true,
                'message' => 'Produk berhasil dikeluarkan dari nampan (History tersimpan).'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal menghapus produk: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getProdukInNampanByJenis(Request $request)
    {
        try {
            $data = $this->nampanprodukService->getProdukInNampanByJenis($request->get('jenis'));

            return response()->json([
                'status' => true,
                'data'   => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memuat filter produk: ' . $e->getMessage()
            ], 500);
        }
    }
}
