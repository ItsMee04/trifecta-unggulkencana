<?php

namespace App\Services\Home;

use App\Models\Pelanggan\Pelanggan;
use App\Models\Produk\Produk;
use App\Models\Transaksi\Pembelian;
use App\Models\Transaksi\Transaksi;

class HomeService
{
    public function getTotalProduk()
    {
        $data = Produk::where('status', 1)->count();
        return $data;
    }

    public function getTotalPenjualanHariIni()
    {
        $data = Transaksi::where('tanggal', today())
            ->where('status', 2)
            ->count();
        return $data;
    }

    public function getTotalPembelianHariIni()
    {
        $data = Pembelian::where('tanggal', today())
            ->where('status', 1)
            ->count();
        return $data;
    }

    public function getTotalPelanggan()
    {
        $data = Pelanggan::where('status', 1)->count();
        return $data;
    }
}
