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
}
