<?php

namespace App\Http\Controllers\Produk;

use App\Http\Controllers\Controller;
use App\Services\Produk\JenisProdukService;
use Illuminate\Http\Request;

class JenisProdukController extends Controller
{
    protected JenisProdukService $jenisprodukService;

    public function __construct(JenisProdukService $jenisProdukService)
    {
        $this->jenisprodukService = $jenisProdukService;
    }

    public function getJenisProduk()
    {
        $data = $this->jenisprodukService->getJenisProduk();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data jenis produk tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data jenis poduk berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    public function storeJenisProduk(Request $request)
    {
        $request->validate([
            'jenis'     => 'required|string',
            'urutan'    => 'required|numeric',
            'image'     => 'nullable|file|mimes:jpeg,png,jpg|max:1024'
        ]);

        $data = $this->jenisprodukService->createJenisProduk([
            'jenis'     => $request->jenis,
            'urutan'    => $request->urutan,
        ], $request->file('image'));

        return response()->json([
            'status'    => 200,
            'success'   => true,
            'message'   => 'Data jenis produk berhasil ditambahkan',
            'data'      => $data
        ], 200);
    }

    public function updateJenisProduk(Request $request)
    {
        // 1. Ambil data hasil validasi langsung ke dalam variabel
        $validatedData = $request->validate([
            'id'         => 'required|integer|exists:jenisproduk,id', // Validasi id agar pasti aman
            'jenis'      => 'required|string',
            'urutan'     => 'required|numeric',
            'image'      => 'nullable|file|mimes:jpeg,png,jpg|max:1024'
        ]);

        // Ambil id dari data yang sudah tervalidasi
        $id = $validatedData['id'];

        try {
            // 2. Ambil file gambar (jika ada)
            $imageFile = $request->file('image');

            // 3. Kirim HANYA data yang tervalidasi ($validatedData), bukan $request->all()
            $data = $this->jenisprodukService->updateJenisProduk($id, $validatedData, $imageFile);

            if (!$data) {
                return response()->json([
                    'status'    => '404',
                    'success'   => false,
                    'message'   => 'Data jenis produk tidak ditemukan'
                ], 200); // Konsisten dengan format response Anda
            }

            return response()->json([
                'status'  => '200',
                'success' => true,
                'message' => 'Data jenis produk berhasil diperbarui',
                'data'    => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteJenisProduk(Request $request)
    {
        // 1. Validasi ID yang dikirim
        $validatedData = $request->validate([
            'id' => 'required|integer|exists:jenisproduk,id'
        ]);

        try {
            // 2. Eksekusi service delete
            $result = $this->jenisprodukService->deleteJenisProduk($validatedData['id']);

            if (!$result) {
                return response()->json([
                    'status'  => '404',
                    'success' => false,
                    'message' => 'Data jenis produk tidak ditemukan'
                ], 200);
            }

            return response()->json([
                'status'  => '200',
                'success' => true,
                'message' => 'Data jenis produk berhasil dinonaktifkan'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }
}
