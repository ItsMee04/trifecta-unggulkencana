<?php

namespace App\Http\Controllers\Transaksi;

use App\Http\Controllers\Controller;
use App\Models\Transaksi\Transaksi;
use App\Models\Transaksi\TransaksiDetail;
use App\Services\Transaksi\TransaksiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    protected TransaksiService $transaksiService;

    public function __construct(TransaksiService $transaksiService)
    {
        $this->transaksiService = $transaksiService;
    }

    public function getKodeTransaksi()
    {
        try {
            $result = $this->transaksiService->handleGetKodeTransaksi();

            return response()->json([
                'status'  => true,
                'message' => $result['message'],
                'kode'    => $result['kode']
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal generate kode: ' . $e->getMessage()], 500);
        }
    }

    public function storeProdukToTransaksiDetail(Request $request)
    {
        $validated = $request->validate([
            'kode'       => 'required',
            'kodeproduk' => 'required|exists:produk,kodeproduk',
            'harga'      => 'required|numeric',
            'berat'      => 'required|numeric',
            'karat'      => 'nullable|numeric',
            'lingkar'    => 'nullable|numeric',
            'panjang'    => 'nullable|numeric',
        ]);

        try {
            [$transaksi, $detail, $produk] = $this->transaksiService->storeProdukToDetail($validated);

            // Trigger WebSocket Event
            event(new \App\Events\TransaksiUpdated($transaksi));

            return response()->json([
                'status'  => true,
                'message' => 'Produk ' . $produk->nama . ' berhasil masuk keranjang',
                'data'    => $detail
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getTransaksiDetail()
    {
        $data = TransaksiDetail::with(['produk'])->where('status', 1)->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => false,
                'message'   => 'Data keranjang tidak ditemukan',
                'data'      => []
            ], 200);
        }

        return response()->json([
            'status'    => true,
            'message'   => 'Data keranjang berhasil diambil',
            'data'      => $data
        ], 200);
    }

    public function batalTransaksiDetail(Request $request)
    {
        $request->validate(['id' => 'required|integer']);

        try {
            $this->transaksiService->batalDetail($request->id);

            return response()->json([
                'status' => true,
                'message' => 'Produk dibatalkan dari keranjang'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal membatalkan produk: ' . $e->getMessage()
            ], 500);
        }
    }

    public function paymentTransaksi(Request $request)
    {
        $validated = $request->validate([
            'kode'            => 'required',
            'pelanggan_id'    => 'required|exists:pelanggan,id',
            'grand_total'     => 'required|numeric',
            'diskon_id'       => 'nullable',
            'point_to_use'    => 'nullable|numeric' // Menggunakan name parameter sesuai kiriman Vue
        ]);

        try {
            $this->transaksiService->processPayment($validated);

            return response()->json([
                'status' => true,
                'message' => 'Pembayaran Berhasil dan Poin telah diperbarui!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getTransaksiPenjualan()
    {
        $data = Transaksi::with(['transaksidetail', 'transaksidetail.produk', 'pelanggan', 'diskon', 'oleh'])
            ->where('status', '!=', 0)
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status'    => false,
                'message'   => 'Data transaksi tidak ditemukan',
                'data'      => []
            ], 400);
        }

        return response()->json([
            'status'    => true,
            'message'   => 'Data transaksi berhasil ditemukan',
            'data'      => $data,
        ], 200);
    }

    public function batalTransaksi(Request $request)
    {
        $request->validate([
            'kode' => 'required|exists:transaksi,kode',
        ]);

        try {
            $this->transaksiService->cancelTransaksi($request->kode);

            return response()->json([
                'status'  => true,
                'message' => "Transaksi {$request->kode} berhasil dibatalkan."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal membatalkan transaksi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function sendTelegramNotification(Request $request)
    {
        $request->validate([
            'pesan' => 'required|string',
        ]);

        try {
            $resData = $this->transaksiService->sendTelegram($request->pesan);

            return response()->json([
                'status'  => true,
                'message' => 'Notifikasi Telegram berhasil dikirim',
                'data'    => $resData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mengambil data nota penjualan terformat menggunakan Stored Procedure
     * untuk dikonsumsi oleh komponen cetak Vue (Print Preview)
     */
    public function getNotaData(Request $request)
    {
        $request->validate([
            'kode' => 'required|string|exists:transaksi,kode'
        ]);

        try {
            // 1. Eksekusi Stored Procedure dengan parameter binding yang aman
            $data = DB::select("CALL GetNotaTransaksi(?)", [$request->kode]);

            if (empty($data)) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Detail transaksi tidak ditemukan.'
                ], 404);
            }

            // 2. Format struktur data agar presisi dengan Props/State pada Vue Anda
            $notaData = [
                'tanggal'          => $data[0]->tanggal,
                'kode_transaksi'   => $data[0]->kode_transaksi,
                'nama_pelanggan'   => $data[0]->nama_pelanggan ?? 'PELANGGAN UMUM',
                'alamat_pelanggan' => $data[0]->alamat_pelanggan ?? 'PURWOKERTO',
                'hp_pelanggan'     => $data[0]->hp_pelanggan ?? '-',
                'terbilang'        => $data[0]->terbilang,
                'nama_admin'       => $data[0]->nama_admin ?? 'ADMIN',
                'grand_total'      => $data[0]->grand_total,
                'items' => [
                    [
                        // Menghasilkan URL publik untuk foto produk
                        'foto'           => $data[0]->foto ? asset('storage/images/produk/' . $data[0]->foto) : null,
                        'nama_produk'    => $data[0]->nama_produk,
                        'berat'          => $data[0]->berat,
                        'karat'          => $data[0]->karat . 'K', // Auto append satuan karat
                        'harga_per_gram' => $data[0]->harga_per_gram,
                        'diskon'         => $data[0]->diskon,
                        'total_harga'    => $data[0]->total_harga,
                    ]
                ]
            ];

            return response()->json([
                'status'   => true,
                'notaData' => $notaData
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memuat data nota: ' . $e->getMessage()
            ], 500);
        }
    }
}
