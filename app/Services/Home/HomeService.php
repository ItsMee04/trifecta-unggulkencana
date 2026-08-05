<?php

namespace App\Services\Home;

use App\Models\Pelanggan\Pelanggan;
use App\Models\Produk\Produk;
use App\Models\Transaksi\Offtake;
use App\Models\Transaksi\Pembelian;
use App\Models\Transaksi\Transaksi;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

    public function getTotalPemasukanHariIni()
    {
        $totalTransaksi = Transaksi::where('status', 2)
            ->where('tanggal', today())
            ->sum('total');

        $totalOfftake = Offtake::where('status', 2)
            ->where('tanggal', today())
            ->sum('total');

        $totalPenjualanMasuk = $totalTransaksi + $totalOfftake;

        return $totalPenjualanMasuk;
    }

    public function getTotalPengeluaranHariIni()
    {
        $totalTransaksi = Pembelian::where('status', 2)
            ->where('tanggal', today())
            ->sum('total');

        return $totalTransaksi;
    }

    public function getTransaksiChart()
    {
        // 7 hari terakhir
        $start = Carbon::now()->subDays(6)->startOfDay();
        $end   = Carbon::now()->endOfDay();

        // Categories (label x-axis)
        $categories = [];
        $dates = [];

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $dates[] = $date->format('Y-m-d');   // untuk key pencarian
            $categories[] = $date->format('d M'); // tampil di chart
        }

        // ===========================
        // PENJUALAN
        // ===========================
        $penjualan = DB::table('transaksi')
            ->selectRaw('DATE(tanggal) as tanggal, SUM(total) as total')
            ->where('status', 2)
            ->whereBetween('tanggal', [$start, $end])
            ->groupBy(DB::raw('DATE(tanggal)'))
            ->pluck('total', 'tanggal');

        // ===========================
        // PEMBELIAN
        // ===========================
        $pembelian = DB::table('pembelian')
            ->selectRaw('DATE(tanggal) as tanggal, SUM(total) as total')
            ->where('status', 2)
            ->whereBetween('tanggal', [$start, $end])
            ->groupBy(DB::raw('DATE(tanggal)'))
            ->pluck('total', 'tanggal');

        // ===========================
        // OFFTAKE
        // ===========================
        $offtake = DB::table('offtake')
            ->selectRaw('DATE(tanggal) as tanggal, SUM(hargatotal) as total')
            ->where('status', 2)
            ->whereBetween('tanggal', [$start, $end])
            ->groupBy(DB::raw('DATE(tanggal)'))
            ->pluck('total', 'tanggal');

        return [
            'categories' => $categories,

            'series' => [
                [
                    'name' => 'Penjualan',
                    'data' => collect($dates)
                        ->map(fn($date) => (int) ($penjualan[$date] ?? 0))
                        ->values(),
                ],
                [
                    'name' => 'Pembelian',
                    'data' => collect($dates)
                        ->map(fn($date) => (int) ($pembelian[$date] ?? 0))
                        ->values(),
                ],
                [
                    'name' => 'Offtake',
                    'data' => collect($dates)
                        ->map(fn($date) => (int) ($offtake[$date] ?? 0))
                        ->values(),
                ],
            ],
        ];
    }

    public function getProdukTerlarisChart()
    {
        $data = DB::table('transaksi as t')
            ->join('transaksidetail as td', 'td.kode', '=', 't.kode')
            ->join('produk as p', 'p.id', '=', 'td.produk_id')
            ->join('jenisproduk as jp', 'jp.id', '=', 'p.jenisproduk_id')

            ->where('t.status', 2)

            ->whereBetween('t.tanggal', [
                now()->subDays(6)->toDateString(),
                now()->toDateString()
            ])

            ->groupBy('jp.id', 'jp.jenis')

            ->select(
                'jp.jenis',
                DB::raw('COUNT(td.id) as total')
            )

            ->orderByDesc('total')
            ->get();

        return [
            'labels' => $data->pluck('jenis'),
            'series' => $data->pluck('total'),
        ];
    }
}
