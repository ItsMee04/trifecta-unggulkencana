<?php

namespace App\Http\Controllers\Transaksi;

use App\Http\Controllers\Controller;
use App\Services\Transaksi\PembelianService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PembelianController extends Controller
{
    protected PembelianService $pembelianService;

    public function __construct(PembelianService $pembelianService)
    {
        $this->pembelianService = $pembelianService;
    }

    public function getKodeTransaksi()
    {
        try {
            $result = $this->pembelianService->handleGetKodeTransaksi();

            return response()->json([
                'status'  => true,
                'message' => $result['message'],
                'kode'    => $result['kode']
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => 'Gagal generate kode: ' . $e->getMessage()], 500);
        }
    }

    public function getTransaksiByKode(Request $request)
    {
        $request->validate([
            'kode' => 'required',
        ]);

        try {
            $data = $this->pembelianService->getTransaksiByKode($request->kode);

            if ($data->isEmpty()) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Data transaksi tidak ditemukan',
                    'data'    => []
                ], 404);
            }

            return response()->json([
                'status'  => true,
                'message' => 'Data transaksi berhasil diambil',
                'data'    => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function storeProdukToPembelianDetail(Request $request)
    {
        $request->validate([
            'kode'          => 'required',
            'kodetransaksi' => 'required',
            'produk'        => 'required|exists:transaksidetail,produk_id'
        ]);

        try {
            $detail = $this->pembelianService->storeProdukToPembelianDetail($request->all());

            return response()->json([
                'status'  => true,
                'message' => 'Produk berhasil ditambahkan ke keranjang.',
                'data'    => $detail
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getPembelianDetail()
    {
        try {
            $data = $this->pembelianService->getPembelianDetail();

            if ($data->isEmpty()) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Data keranjang tidak ditemukan',
                    'data'    => []
                ]);
            }

            return response()->json([
                'status'  => true,
                'message' => 'Data keranjang berhasil diambil',
                'data'    => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function updatePembelianDetail(Request $request)
    {
        $request->validate([
            'id'              => 'required|exists:pembeliandetail,id',
            'hargabeli'       => 'required|numeric|min:0',
            'kondisi_id'      => 'nullable|exists:kondisi,id',
            'jenis_hargabeli' => 'required|string',
            'keterangan'      => 'nullable|string'
        ]);

        try {
            $result = $this->pembelianService->updatePembelianDetail($request->all());

            return response()->json([
                'status'  => true,
                'message' => 'Detail dan Total Pembelian berhasil diperbarui',
                'data'    => $result['detail'],
                'header'  => $result['header']
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function batalPembelianDetail(Request $request)
    {
        $request->validate([
            'id' => 'required'
        ]);

        try {
            $this->pembelianService->batalPembelianDetail($request->id);

            return response()->json([
                'status'  => true,
                'message' => 'Produk dibatalkan dari keranjang'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal membatalkan produk: ' . $e->getMessage()
            ], 500);
        }
    }

    public function paymentPembelian(Request $request)
    {
        $request->validate([
            'kode' => 'required',
        ]);

        try {
            $this->pembelianService->paymentPembelian($request->all());

            return response()->json([
                'status'  => true,
                'message' => 'Transaksi Pembelian Berhasil. Produk otomatis masuk ke daftar Perbaikan/Pencucian.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal bayar pembelian: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getPembelianDetailDariLuar(Request $request)
    {
        try {
            $data = $this->pembelianService->getPembelianDetailDariLuar();

            if ($data->isEmpty()) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Data keranjang tidak ditemukan',
                    'data'    => []
                ]);
            }

            return response()->json([
                'status'  => true,
                'message' => 'Data keranjang berhasil diambil',
                'data'    => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function storeProdukToPembelianDetailDariLuar(Request $request)
    {
        $request->validate([
            'nama'        => 'required',
            'berat'       => ['required', 'regex:/^\d+\.\d{1,}$/'],
            'jenisproduk' => 'required|exists:jenisproduk,id',
            'karat'       => 'required|exists:karat,id',
            'jeniskarat'  => 'required|exists:jeniskarat,id',
            'lingkar'     => 'nullable|integer',
            'panjang'     => 'nullable|integer',
            'hargabeli'   => 'required|integer',
            'keterangan'  => 'nullable|string',
            'kode'        => 'required',
        ]);

        try {
            $detail = $this->pembelianService->storeProdukToPembelianDetailDariLuar($request->all());

            return response()->json([
                'status'  => true,
                'message' => 'Produk berhasil didaftarkan ke detail pembelian.',
                'data'    => $detail
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updatePembelianDetailDariLuar(Request $request)
    {
        $request->validate([
            'id'          => 'required|exists:pembeliandetail,id',
            'nama'        => 'required',
            'berat'       => ['required', 'regex:/^\d+\.\d{1,}$/'],
            'jenisproduk' => 'required|exists:jenisproduk,id',
            'karat'       => 'required|exists:karat,id',
            'jeniskarat'  => 'required|exists:jeniskarat,id',
            'lingkar'     => 'nullable|integer',
            'panjang'     => 'nullable|integer',
            'hargabeli'   => 'required|integer',
            'keterangan'  => 'nullable|string',
            'kode'        => 'required',
        ]);

        try {
            $detail = $this->pembelianService->updatePembelianDetailDariLuar($request->all());

            return response()->json([
                'status'  => true,
                'message' => 'Detail dan Total Pembelian berhasil diperbarui',
                'data'    => $detail,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function batalPembelianDetailDariLuar(Request $request)
    {
        $request->validate([
            'id' => 'required'
        ]);

        try {
            $this->pembelianService->batalPembelianDetailDariLuar($request->id);

            return response()->json([
                'status'  => true,
                'message' => 'Barang dan Transaksi berhasil dibatalkan.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal membatalkan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function paymentPembelianDariLuar(Request $request)
    {
        $request->validate([
            'kode'       => 'required',
            'sumber'     => 'required|in:supplier,pelanggan',
            'selectedId' => 'required|integer',
            'keterangan' => 'nullable|string',
        ]);

        try {
            $totalFix = $this->pembelianService->paymentPembelianDariLuar($request->all());

            return response()->json([
                'status'  => true,
                'message' => 'Pembayaran Berhasil. Produk telah masuk ke sistem gudang/perbaikan.',
                'total'   => $totalFix
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal proses pembayaran: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTransaksiPembelian()
    {
        try {
            $data = $this->pembelianService->getTransaksiPembelian();

            if ($data->isEmpty()) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Data transaksi tidak ditemukan',
                    'data'    => []
                ], 400);
            }

            return response()->json([
                'status'  => true,
                'messaage' => 'Data transaksi berhasil ditemukan',
                'data'    => $data,
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function batalTransaksi(Request $request)
    {
        $request->validate([
            'kode' => 'required',
        ]);

        try {
            $this->pembelianService->batalTransaksi($request->kode);

            return response()->json([
                'status'  => true,
                'message' => 'Pembatalan Berhasil.'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal membatalkan transaksi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getNotaData(Request $request)
    {
        $request->validate([
            'kode' => 'required|string|exists:pembelian,kode'
        ]);

        try {
            // 1. Eksekusi Stored Procedure GetNotaPembelian
            $data = DB::select("CALL GetNotaPembelian(?)", [$request->kode]);

            if (empty($data)) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Detail transaksi pembelian tidak ditemukan.'
                ], 404);
            }

            // 2. Ambil informasi header dari baris pertama
            $header = $data[0];

            // 3. Petakan seluruh item produk sesuai alias dari Stored Procedure
            $items = array_map(function ($item) {
                return [
                    'kodeproduk'     => $item->kodeproduk,
                    'namaproduk'     => $item->produk_nama, // 👈 Sesuai alias: pr.nama AS produk_nama
                    'berat'          => $item->berat,
                    'karat'          => str_contains($item->karat, 'K') ? $item->karat : $item->karat . 'K',
                    'hargabeli'      => $item->harga_per_gram, // 👈 Sesuai alias: kr.hargabeli AS harga_per_gram
                    'image'          => $item->foto, // 👈 Sesuai alias: pr.image AS foto
                    'keranjangtotal' => $item->total_harga, // 👈 Sesuai alias: kr.total AS total_harga
                ];
            }, $data);

            // 4. Susun struktur response notaData agar pas dengan komponen Vue
            $notaData = [
                'kode'          => $header->kode_transaksi, // 👈 Sesuai alias: tr.kode AS kode_transaksi
                'namapelanggan' => $header->pelanggan_nama ?? 'PELANGGAN UMUM', // 👈 Sesuai alias: pl.nama AS pelanggan_nama
                'alamat'        => $header->alamat ?? 'PURWOKERTO',
                'kontak'        => $header->kontak ?? '-',
                'nip'           => $header->nip ?? '-',
                'namapegawai'   => $header->pegawai_nama ?? 'ADMIN', // 👈 Sesuai alias: pg.nama AS pegawai_nama
                'total'         => $header->grand_total, // 👈 Sesuai alias: tr.total AS grand_total
                'terbilang'     => $header->terbilang,
                'tanggal'       => $header->tanggal ?? now()->toDateTimeString(), // 👈 Sesuai alias: tr.created_at AS tanggal
                'items'         => $items
            ];

            return response()->json([
                'status'   => true,
                'notaData' => $notaData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memuat data nota pembelian: ' . $e->getMessage()
            ], 500);
        }
    }
}
