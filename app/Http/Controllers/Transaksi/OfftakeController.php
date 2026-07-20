<?php

namespace App\Http\Controllers\Transaksi;

use App\Http\Controllers\Controller;
use App\Services\Transaksi\OfftakeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
                ], 200);
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
            ], 200);
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
            ], 200);
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

    /**
     * Mengambil data nota offtake terformat menggunakan Stored Procedure
     * untuk dikonsumsi oleh komponen cetak Vue (Print Preview)
     */
    public function getNotaData(Request $request)
    {
        $request->validate([
            'kode' => 'required|string|exists:offtake,kode'
        ]);

        try {
            // 1. Eksekusi Stored Procedure dengan parameter binding yang aman
            $data = DB::select("CALL GetNotaOfftake(?)", [$request->kode]);

            if (empty($data)) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Detail transaksi offtake tidak ditemukan.'
                ], 404);
            }

            // 2. Map daftar items produk
            $items = array_map(function ($item) {
                return [
                    'kodeproduk'     => $item->kodeproduk,
                    'nama_produk'    => $item->produk_nama,
                    'foto'           => $item->foto ? asset('storage/images/produk/' . $item->foto) : null,
                    'berat'          => (float) $item->berat,
                    'karat'          => $item->karat . 'K',
                    'harga_per_gram' => (float) $item->harga_per_gram,
                    'total_harga'    => (float) $item->total_harga,
                ];
            }, $data);

            // 3. Format struktur data agar presisi dengan Props/State pada Vue Anda
            $notaData = [
                'tanggal'        => $data[0]->tanggal,
                'kode_transaksi' => $data[0]->kode_transaksi,
                'supplier_nama'  => $data[0]->supplier_nama,
                'kontak'         => $data[0]->kontak ?? '-',
                'alamat'         => $data[0]->alamat ?? '-',
                'subtotal'       => (float) $data[0]->subtotal,
                'potongan'       => (float) $data[0]->potongan,
                'grand_total'    => (float) $data[0]->grand_total,
                'terbilang'      => $data[0]->terbilang,
                'pegawai_nama'   => $data[0]->pegawai_nama,
                'nip'            => $data[0]->nip,
                'items'          => $items
            ];

            return response()->json([
                'status'   => true,
                'notaData' => $notaData
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memuat data nota offtake: ' . $e->getMessage()
            ], 500);
        }
    }
}
