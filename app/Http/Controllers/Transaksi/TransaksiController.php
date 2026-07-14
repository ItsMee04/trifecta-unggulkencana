<?php

namespace App\Http\Controllers\Transaksi;

use App\Http\Controllers\Controller;
use App\Models\Transaksi\Transaksi;
use App\Models\Transaksi\TransaksiDetail;
use App\Services\Transaksi\TransaksiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

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
            'pelanggan'       => 'required',
            'total'           => 'required|numeric',
            'diskon'          => 'nullable',
            'point_digunakan' => 'nullable|numeric'
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

    public function getSignedNotaPenjualanUrl(Request $request)
    {
        $route_name = 'produk.cetak_notapenjualan';
        $expiration = now()->addMinutes(10);

        $signedUrl = URL::temporarySignedRoute(
            $route_name,
            $expiration,
            ['kode' => $request->kode]
        );

        return response()->json(['url' => $signedUrl]);
    }

    public function CetakNotaPenjualan(Request $request)
    {
        if (!$request->hasValidSignature()) {
            abort(401, 'Link kadaluarsa atau tidak valid.');
        }

        $kode  = $request->query('kode');
        $jasper_file = resource_path('reports/CetakNotaPenjualan.jasper');
        $db = config('database.connections.mysql');

        $parameters = [
            'LOGO'                => public_path('assets/report/LOGOTOKO.png'),
            'LOGOTEXT'            => public_path('assets/report/LOGOTEXT.png'),
            'PRODUK'              => public_path('storage/images/produk/'),
            'TTD'                 => public_path('assets/ttd/'),
            'TERIMAKASIH'         => public_path('assets/report/thanksforshopping.png'),
            'KODETRANSAKSI_INPUT' => $kode,
        ];

        try {
            $tempDir = storage_path('app/temp_reports');
            if (!file_exists($tempDir)) mkdir($tempDir, 0755, true);

            $outputPath = $tempDir . '/nota-' . $kode . '-' . time();

            $jasper = new \PHPJasper\PHPJasper;
            $jasper->process(
                $jasper_file,
                $outputPath,
                [
                    'format' => ['pdf'],
                    'params' => $parameters,
                    'db_connection' => [
                        'driver'   => 'mysql',
                        'host'     => $db['host'],
                        'port'     => $db['port'],
                        'database' => $db['database'],
                        'username' => $db['username'],
                        'password' => $db['password'],
                    ],
                ]
            )->execute();

            $pdfPath = $outputPath . '.pdf';

            if (!file_exists($pdfPath)) {
                throw new \Exception("File PDF tidak terbentuk oleh Jasper.");
            }

            $pdfContent = file_get_contents($pdfPath);
            unlink($pdfPath);

            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="NOTA-' . $kode . '.pdf"',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
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
}
