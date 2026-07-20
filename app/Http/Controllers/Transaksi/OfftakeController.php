<?php

namespace App\Http\Controllers\Transaksi;

use App\Http\Controllers\Controller;
use App\Services\Transaksi\OfftakeService;
use Illuminate\Http\Request;

class OfftakeController extends Controller
{
    protected OfftakeService $offtakeService;

    // Inject OfftakeService melalui Constructor
    public function __construct(OfftakeService $offtakeService)
    {
        $this->offtakeService = $offtakeService;
    }

    public function getKodeTransaksi()
    {
        try {
            $result = $this->offtakeService->handleGetKodeTransaksi();

            return response()->json([
                'status'  => true,
                'message' => $result['message'],
                'kode'    => $result['kode']
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal generate kode: ' . $e->getMessage()], 500);
        }
    }

    public function storeProdukToOfftakeDetail(Request $request)
    {
        $request->validate([
            'kode' => 'required',
            'items' => 'required|array|min:1',
            'items.*.produk_id' => 'required|exists:produk,id',
            'items.*.harga' => 'required|numeric',
            'items.*.berat' => 'required|numeric',
        ]);

        try {
            $result = $this->offtakeService->storeProdukToDetail($request->all());

            return response()->json([
                'status'  => true,
                'message' => $result['message'],
                'failed'  => $result['failed'],
                'data'    => $result['data']
            ]);
        } catch (\Exception $e) {
            // Tangkap exception duplikasi khusus dari service
            if (str_starts_with($e->getMessage(), 'SEMUA_DUPLIKAT:')) {
                $failedItems = json_decode(str_replace('SEMUA_DUPLIKAT:', '', $e->getMessage()), true);
                return response()->json([
                    'status'  => false,
                    'message' => 'Semua produk yang dipilih sudah ada di daftar transaksi aktif.',
                    'errors'  => $failedItems
                ], 400);
            }

            return response()->json([
                'status'  => false,
                'message' => 'Gagal memproses: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getOfftakeDetail()
    {
        $data = $this->offtakeService->getOfftakeDetail();

        if ($data->isEmpty()) {
            return response()->json([
                'status'  => false,
                'message' => 'Data keranjang tidak ditemukan',
                'data'    => []
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Data keranjang berhasil diambil',
            'data'    => $data
        ], 200);
    }

    public function batalOfftakeDetail(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:offtakedetail,id'
        ]);

        try {
            $result = $this->offtakeService->batalOfftakeDetail($request->id);

            return response()->json([
                'status'    => true,
                'message'   => $result['message'],
                'sisa_item' => $result['sisa_item']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal membatalkan produk: ' . $e->getMessage()
            ], 500);
        }
    }

    public function paymentOfftake(Request $request)
    {
        $request->validate([
            'kode'       => 'required',
            'suplier_id' => 'required',
            'total'      => 'required|numeric',
            'keterangan' => 'nullable|string'
        ]);

        try {
            $result = $this->offtakeService->paymentOfftake($request->all());

            return response()->json([
                'status'  => true,
                'message' => 'Offtake berhasil. Dana masuk ke rekening: ' . $result['rekening']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTransaksiOfftake()
    {
        $data = $this->offtakeService->getTransaksiOfftake();

        if ($data->isEmpty()) {
            return response()->json([
                'status'  => false,
                'message' => 'Data transaksi tidak ditemukan',
                'data'    => []
            ], 400);
        }

        return response()->json([
            'status'   => true,
            'messaage' => 'Data transaksi berhasil ditemukan',
            'data'     => $data,
        ], 200);
    }

    public function batalTransaksi(Request $request)
    {
        $request->validate([
            'kode' => 'required',
        ]);

        try {
            $this->offtakeService->batalTransaksi($request->kode, $request->keterangan ?? null);

            return response()->json([
                'status'  => true,
                'message' => 'Pembatalan Offtake Berhasil. Dana telah ditarik dari saldo dan produk kembali tersedia di stok.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal membatalkan offtake: ' . $e->getMessage()
            ], 500);
        }
    }
}
