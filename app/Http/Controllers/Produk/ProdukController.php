<?php

namespace App\Http\Controllers\Produk;

use App\Http\Controllers\Controller;
use App\Services\Produk\ProdukService;
use Illuminate\Http\Request;

class ProdukController extends Controller
{
    protected ProdukService $produkService;

    public function __construct(ProdukService $produkService)
    {
        $this->produkService = $produkService;
    }

    public function getProduk()
    {
        $data = $this->produkService->getProduk();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data produk tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data produk berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeProduk(Request $request)
    {
        $request->validate([
            'nama'          => 'required',
            'berat'         => ['required', 'regex:/^\d+\.\d{1,}$/'],
            'jenisproduk_id'=> 'required|exists:jenisproduk,id',
            'karat_id'      => 'required|exists:karat,id',
            'jeniskarat_id' => 'required|exists:jeniskarat,id',
            'lingkar'       => 'nullable|integer',
            'panjang'       => 'nullable|integer',
            'harga_id'      => 'required|exists:harga,id',
            'keterangan'    => 'nullable|string',
            'image'         => 'nullable|file|mimes:jpeg,png,jpg|max:1024'
        ]);

        $data = $this->produkService->createProduk([
            'nama'              => $request->nama,
            'berat'             => $request->berat,
            'jenisproduk_id'    => $request->jenisproduk_id,
            'karat_id'          => $request->karat_id,
            'jeniskarat_id'     => $request->jenisproduk_id,
            'lingkar'           => $request->lingkar,
            'panjang'           => $request->panjang,
            'harga_id'          => $request->harga_id,
            'keterangan'        => $request->keterangan,
        ], $request->file('image'));

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data produk berhasil ditambahkan',
            'data'      => $data
        ], 200);
    }

    public function updateProduk(Request $request)
    {
        // 1. Ambil data hasil validasi langsung ke dalam variabel
        $validatedData = $request->validate([
            'id'            => 'required|integer|exists:produk,id', // Validasi id agar pasti aman
            'nama'          => 'required',
            'berat'         => ['required', 'regex:/^\d+\.\d{1,}$/'],
            'jenisproduk_id'=> 'required|exists:jenisproduk,id',
            'karat_id'      => 'required|exists:karat,id',
            'jeniskarat_id' => 'required|exists:jeniskarat,id',
            'lingkar'       => 'nullable|integer',
            'panjang'       => 'nullable|integer',
            'harga_id'      => 'required|exists:harga,id',
            'keterangan'    => 'nullable|string',
            'image'         => 'nullable|file|mimes:jpeg,png,jpg|max:1024'
        ]);

        // Ambil id dari data yang sudah tervalidasi
        $id = $validatedData['id'];

        try {
            // 2. Ambil file gambar (jika ada)
            $imageFile = $request->file('image');

            // 3. Kirim HANYA data yang tervalidasi ($validatedData), bukan $request->all()
            $data = $this->produkService->updateProduk($id, $validatedData, $imageFile);

            if (!$data) {
                return response()->json([
                    'status'    => '404',
                    'success'   => false,
                    'message'   => 'Data produk tidak ditemukan'
                ], 200); // Konsisten dengan format response Anda
            }

            return response()->json([
                'status'  => '200',
                'success' => true,
                'message' => 'Data produk berhasil diperbarui',
                'data'    => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteProduk(Request $request)
    {
        // 1. Validasi ID yang dikirim
        $validatedData = $request->validate([
            'id' => 'required|integer|exists:produk,id'
        ]);

        try {
            // 2. Eksekusi service delete
            $result = $this->produkService->deleteProduk($validatedData['id']);

            if (!$result) {
                return response()->json([
                    'status'  => '404',
                    'success' => false,
                    'message' => 'Data produk tidak ditemukan'
                ], 200);
            }

            return response()->json([
                'status'  => '200',
                'success' => true,
                'message' => 'Data produk berhasil dinonaktifkan'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }
}
