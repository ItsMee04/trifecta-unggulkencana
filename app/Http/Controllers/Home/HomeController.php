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
}
