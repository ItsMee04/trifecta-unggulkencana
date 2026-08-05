<?php

namespace App\Services\Home;

use App\Models\Produk\Produk;
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
}
