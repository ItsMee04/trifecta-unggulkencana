<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    /**
     * Mengambil data laporan penjualan terformat menggunakan Stored Procedure
     * berdasarkan rentang tanggal
     */
    public function getLaporanPenjualan(Request $request)
    {
        // 1. Validasi input rentang tanggal
        $request->validate([
            'tanggal_awal'  => 'required|date',
            'tanggal_akhir' => 'required|date|after_or_equal:tanggal_awal',
        ]);

        try {
            // 2. Eksekusi Stored Procedure GetLaporanPenjualan dengan parameter binding
            $data = DB::select("CALL GetLaporanPenjualan(?, ?)", [
                $request->tanggal_awal,
                $request->tanggal_akhir
            ]);

            if (empty($data)) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Data laporan penjualan tidak ditemukan pada periode ini.'
                ], 404);
            }

            // 3. Mapping data item dari setiap baris hasil query
            $items = array_map(function ($row) {
                return [
                    'tanggal'         => $row->tanggal,
                    'kode_transaksi'  => $row->kode,
                    'jenis_produk'    => $row->jenis,
                    'kode_produk'     => $row->kodeproduk,
                    'berat'           => (float) $row->berat,
                    'karat'           => $row->karat . 'K', // Append satuan karat
                    'harga'           => (float) $row->harga,
                    'total_per_item'  => (float) $row->total_per_item,
                ];
            }, $data);

            // 4. Susun struktur data ringkasan & daftar transaksi untuk Vue
            $laporanData = [
                'periode' => [
                    'tanggal_awal'  => $request->tanggal_awal,
                    'tanggal_akhir' => $request->tanggal_akhir,
                ],
                'summary' => [
                    'total_potong'        => (int) $data[0]->TOTALPOTONG,
                    'total_berat'         => (float) $data[0]->TOTALBERAT,
                    'total_harga'         => (float) $data[0]->TOTALHARGA,
                    'total_seluruh_harga' => (float) $data[0]->TOTAL_SELURUH_HARGA,
                ],
                'items' => $items
            ];

            return response()->json([
                'status'      => true,
                'laporanData' => $laporanData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memuat data laporan penjualan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengambil data laporan pembelian terformat menggunakan Stored Procedure
     * berdasarkan rentang tanggal
     */
    public function getLaporanPembelian(Request $request)
    {
        // 1. Validasi input rentang tanggal
        $request->validate([
            'tanggal_awal'  => 'required|date',
            'tanggal_akhir' => 'required|date|after_or_equal:tanggal_awal',
        ]);

        try {
            // 2. Eksekusi Stored Procedure GetLaporanPembelian dengan parameter binding
            $data = DB::select("CALL GetLaporanPembelian(?, ?)", [
                $request->tanggal_awal,
                $request->tanggal_akhir
            ]);

            if (empty($data)) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Data laporan pembelian tidak ditemukan pada periode ini.'
                ], 404);
            }

            // 3. Mapping data item dari setiap baris hasil query
            $items = array_map(function ($row) {
                return [
                    'tanggal'         => $row->tanggal,
                    'kode_transaksi'  => $row->kode,
                    'jenis_produk'    => $row->jenis,
                    'kode_produk'     => $row->kodeproduk,
                    'berat'           => (float) $row->berat,
                    'karat'           => $row->karat . 'K', // Append satuan karat
                    'harga'           => (float) $row->harga,
                    'harga_total'     => (float) $row->hargatotal,
                ];
            }, $data);

            // 4. Susun struktur data ringkasan & daftar transaksi untuk Vue
            $laporanData = [
                'periode' => [
                    'tanggal_awal'  => $request->tanggal_awal,
                    'tanggal_akhir' => $request->tanggal_akhir,
                ],
                'summary' => [
                    'total_potong'    => (int) $data[0]->TOTALPOTONG,
                    'total_berat'     => (float) $data[0]->TOTALBERAT,
                    'total_transaksi' => (float) $data[0]->TOTALTRANSAKSI,
                ],
                'items' => $items
            ];

            return response()->json([
                'status'      => true,
                'laporanData' => $laporanData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memuat data laporan pembelian: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengambil data laporan offtake terformat menggunakan Stored Procedure
     * berdasarkan rentang tanggal.
     */
    public function getLaporanOfftake(Request $request)
    {
        // 1. Validasi input rentang tanggal
        $request->validate([
            'tanggal_awal'  => 'required|date',
            'tanggal_akhir' => 'required|date|after_or_equal:tanggal_awal',
        ]);

        try {

            // 2. Eksekusi Stored Procedure GetLaporanOfftake
            $data = DB::select("CALL GetLaporanOfftake(?, ?)", [
                $request->tanggal_awal,
                $request->tanggal_akhir
            ]);

            if (empty($data)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Data laporan offtake tidak ditemukan pada periode ini.'
                ], 404);
            }

            // 3. Mapping data item
            $items = array_map(function ($row) {
                return [
                    'tanggal'          => $row->tanggal,
                    'kode_transaksi'   => $row->kode,
                    'kode_produk'      => $row->kodeproduk,
                    'nama_produk'      => $row->nama,
                    'jenis_produk'     => $row->jenis,
                    'berat'            => (float) $row->berat,
                    'karat'            => $row->karat . 'K',
                    'harga_jual'       => (float) $row->hargajual,
                    'total_produk'     => (float) $row->totalproduk,
                    'pegawai'          => $row->pegawai,
                ];
            }, $data);

            // 4. Susun response untuk Vue
            $laporanData = [
                'periode' => [
                    'tanggal_awal'  => $request->tanggal_awal,
                    'tanggal_akhir' => $request->tanggal_akhir,
                ],
                'summary' => [
                    // Grand Total seluruh transaksi
                    'total_transaksi' =>
                    (float) $data[0]->GRANDTOTALTRANSAKSI,

                    // Grand Total seluruh berat
                    'total_berat' =>
                    (float) $data[0]->GRANDTOTALBERAT,

                    // Grand Total seluruh potong
                    'total_potong' =>
                    (int) $data[0]->GRANDTOTALPOTONG,

                ],
                'items' => $items
            ];

            return response()->json([
                'status' => true,
                'laporanData' => $laporanData
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Gagal memuat data laporan offtake: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengambil data laporan perbaikan terformat menggunakan Stored Procedure
     * berdasarkan rentang tanggal.
     */
    public function getLaporanPerbaikan(Request $request)
    {
        // 1. Validasi input rentang tanggal
        $request->validate([
            'tanggal_awal'  => 'required|date',
            'tanggal_akhir' => 'required|date|after_or_equal:tanggal_awal',
        ]);

        try {

            // 2. Eksekusi Stored Procedure GetLaporanPerbaikan
            $data = DB::select("CALL GetLaporanPerbaikan(?, ?)", [
                $request->tanggal_awal,
                $request->tanggal_akhir
            ]);

            if (empty($data)) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Data laporan perbaikan tidak ditemukan pada periode ini.'
                ], 404);
            }

            // 3. Mapping data item
            $items = array_map(function ($row) {

                return [
                    'kode_transaksi' => $row->kode,
                    'kode_produk'    => $row->kodeproduk,
                    'nama_produk'    => $row->nama,
                    'jenis_produk'   => $row->jenis,
                    'berat'          => (float) $row->berat,
                    'karat'          => $row->karat . 'K',
                    'kondisi'        => $row->kondisi,
                    'keterangan'     => $row->keterangan,
                    'tanggal_masuk'  => $row->tanggalmasuk,
                    'tanggal_keluar' => $row->tanggalkeluar,
                ];
            }, $data);

            // 4. Susun struktur data untuk Vue
            $laporanData = [

                'periode' => [
                    'tanggal_awal'  => $request->tanggal_awal,
                    'tanggal_akhir' => $request->tanggal_akhir,
                ],

                'summary' => [
                    'total_potong' => (int) $data[0]->TOTALPOTONG,
                    'total_berat'  => (float) $data[0]->TOTALBERAT,
                ],

                'items' => $items,

            ];

            return response()->json([
                'status'      => true,
                'laporanData' => $laporanData
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'status'  => false,
                'message' => 'Gagal memuat data laporan perbaikan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengambil data laporan mutasi saldo terformat menggunakan Stored Procedure
     * berdasarkan rentang tanggal.
     */
    public function getLaporanMutasiSaldo(Request $request)
    {
        // 1. Validasi input rentang tanggal
        $request->validate([
            'tanggal_awal'  => 'required|date',
            'tanggal_akhir' => 'required|date|after_or_equal:tanggal_awal',
        ]);

        try {

            // 2. Eksekusi Stored Procedure GetLaporanMutasiSaldo
            $data = DB::select("CALL GetLaporanMutasiSaldo(?, ?)", [
                $request->tanggal_awal,
                $request->tanggal_akhir
            ]);

            if (empty($data)) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Data laporan mutasi saldo tidak ditemukan pada periode ini.'
                ], 404);
            }

            // 3. Mapping data item
            $items = array_map(function ($row) {
                return [
                    'tanggal'    => $row->tanggal,
                    'rekening'   => $row->rekening,
                    'keterangan' => $row->keterangan,
                    'jenis'      => $row->jenis,
                    'jumlah'     => (float) $row->jumlah,
                    'debit'      => (float) $row->debit,
                    'kredit'     => (float) $row->kredit,
                    'saldo'      => (float) $row->saldo,
                    'pegawai'    => $row->pegawai,
                ];
            }, $data);

            // 4. Susun struktur data untuk Vue
            $saldoAkhir = !empty($data)
                ? (float) end($data)->saldo
                : 0;

            $laporanData = [
                'periode' => [
                    'tanggal_awal' => $request->tanggal_awal,
                    'tanggal_akhir' => $request->tanggal_akhir,
                ],

                'summary' => [
                    'total_transaksi' => (int) $data[0]->TOTALTRANSAKSI,
                    'saldo_akhir'     => $saldoAkhir,
                ],

                'items' => $items
            ];

            return response()->json([
                'status'      => true,
                'laporanData' => $laporanData
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'status'  => false,
                'message' => 'Gagal memuat data laporan mutasi saldo: ' . $e->getMessage()
            ], 500);
        }
    }
}
