<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use App\Services\Home\HomeService;
// use Illuminate\Http\Request;

class HomeController extends Controller
{
    protected HomeService $homeService;

    public function __construct(HomeService $homeService)
    {
        $this->homeService = $homeService;
    }

    public function getTotalProduk()
    {
        $totalProduk = $this->homeService->getTotalProduk();
        return response()->json([
            'status'    => 'true',
            'message'   => 'Berhasil mengambil total produk',
            'data'      => $totalProduk
        ]);
    }

    public function getTotalPenjualanHariIni()
    {
        $totalPenjualan = $this->homeService->getTotalPenjualanHariIni();
        return response()->json([
            'status'    => 'true',
            'message'   => 'Berhasil mengambil total penjualan hari ini',
            'data'      => $totalPenjualan
        ]);
    }

    public function getTotalPembelianHariIni()
    {
        $totalPembelian = $this->homeService->getTotalPembelianHariIni();
        return response()->json([
            'status'    => 'true',
            'message'   => 'Berhasil mengambil total pembelian hari ini',
            'data'      => $totalPembelian
        ]);
    }

    public function getTotalPelanggan()
    {
        $totalPelanggan = $this->homeService->getTotalPelanggan();
        return response()->json([
            'status'    => 'true',
            'message'   => 'Berhasil mengambil total pelanggan',
            'data'      => $totalPelanggan
        ]);
    }

    public function getTotalPemasukanHariIni()
    {
        $totalPemasukan = $this->homeService->getTotalPemasukanHariIni();
        return response()->json([
            'status'    => true,
            'message'   => 'Berhasil mengambil total pemasukan',
            'data'      => $totalPemasukan
        ]);
    }

    public function getTotalPengeluaranHariIni()
    {
        $totalPemasukan = $this->homeService->getTotalPengeluaranHariIni();
        return response()->json([
            'status'    => true,
            'message'   => 'Berhasil mengambil total pengeluaran',
            'data'      => $totalPemasukan
        ]);
    }

    public function getTransaksiChart()
    {
        try {
            $data = $this->homeService->getTransaksiChart();

            return response()->json([
                'status'  => true,
                'message' => 'Berhasil mengambil data transaksi.',
                'data'    => $data,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getProdukTerlarisChart()
    {
        try {
            $data = $this->homeService->getProdukTerlarisChart();

            return response()->json([
                'status'  => true,
                'message' => 'Berhasil mengambil data transaksi terlaris.',
                'data'    => $data,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getTransaksiPenjualanSatuMinggu()
    {
        try {
            $data = $this->homeService->getTransaksiPenjualanSatuMinggu();

            return response()->json([
                'status'  => true,
                'message' => 'Berhasil mengambil data transaksi dalam 7 hari terakhir.',
                'data'    => $data,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
