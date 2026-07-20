<?php

namespace App\Services\Transaksi;

use App\Models\Produk\Produk;
use App\Models\Transaksi\Offtake;
use App\Models\Transaksi\OfftakeDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\URL;
use PHPJasper\PHPJasper;

class OfftakeService
{
    public function generateKodeTransaksi(): string
    {
        $today = Carbon::now()->format('Ymd');
        $prefixToday = 'OF-' . $today . '-';

        $lastRecord = Offtake::where('kode', 'like', 'OF-%')
            ->orderBy('kode', 'desc')
            ->first();

        if (!$lastRecord) {
            $nextNumber = 1;
        } else {
            $segments = explode('-', $lastRecord->kode);
            $lastNumber = (int) end($segments);
            $nextNumber = $lastNumber + 1;
        }

        return $prefixToday . str_pad($nextNumber, 7, '0', STR_PAD_LEFT);
    }

    public function terbilang(int $angka): string
    {
        $angka = abs((int)$angka);
        $huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        $hasil = "";

        if ($angka < 12) {
            $hasil = $huruf[$angka];
        } elseif ($angka < 20) {
            $hasil = $this->terbilang($angka - 10) . " Belas";
        } elseif ($angka < 100) {
            $hasil = $this->terbilang(floor($angka / 10)) . " Puluh " . $this->terbilang($angka % 10);
        } elseif ($angka < 200) {
            $hasil = "Seratus " . $this->terbilang($angka - 100);
        } elseif ($angka < 1000) {
            $hasil = $this->terbilang(floor($angka / 100)) . " Ratus " . $this->terbilang($angka % 100);
        } elseif ($angka < 2000) {
            $hasil = "Seribu " . $this->terbilang($angka - 1000);
        } elseif ($angka < 1000000) {
            $hasil = $this->terbilang(floor($angka / 1000)) . " Ribu " . $this->terbilang($angka % 1000);
        } elseif ($angka < 1000000000) {
            $hasil = $this->terbilang(floor($angka / 1000000)) . " Juta " . $this->terbilang($angka % 1000000);
        } elseif ($angka < 1000000000000) {
            $hasil = $this->terbilang(floor($angka / 1000000000)) . " Miliar " . $this->terbilang($angka % 1000000000);
        } elseif ($angka < 1000000000000000) {
            $hasil = $this->terbilang(floor($angka / 1000000000000)) . " Triliun " . $this->terbilang($angka % 1000000000000);
        } else {
            return "Angka Terlalu Besar";
        }

        return trim($hasil);
    }

    public function handleGetKodeTransaksi(): array
    {
        $transaksiAktif = Offtake::where('oleh', Auth::id())
            ->where('status', 1)
            ->latest()
            ->first();

        if ($transaksiAktif) {
            return [
                'kode' => $transaksiAktif->kode,
                'message' => 'Menggunakan kode transaksi aktif'
            ];
        }

        return [
            'kode' => $this->generateKodeTransaksi(),
            'message' => 'Kode transaksi baru berhasil di-generate'
        ];
    }

    public function storeProdukToDetail(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $offtake = Offtake::firstOrCreate(
                ['kode' => $data['kode']],
                [
                    'tanggal'    => now(),
                    'suplier_id' => null,
                    'oleh'       => Auth::id(),
                    'status'     => 1,
                ]
            );

            $items = $data['items'];
            $failedItems = [];

            foreach ($items as $item) {
                $existingDetail = OfftakeDetail::where('produk_id', $item['produk_id'])
                    ->where('status', 1)
                    ->first();

                if ($existingDetail) {
                    $namaProduk = DB::table('produk')->where('id', $item['produk_id'])->value('nama');
                    $failedItems[] = "Produk [$namaProduk] sudah ada di daftar transaksi (Kode: {$existingDetail->kode})";
                    continue;
                }

                $totalHargaItem = $item['harga'] * $item['berat'];

                $detail = new OfftakeDetail();
                $detail->kode      = $data['kode'];
                $detail->produk_id = $item['produk_id'];
                $detail->hargajual = $item['harga'];
                $detail->berat     = $item['berat'];
                $detail->karat     = $item['karat'] ?? 0;
                $detail->lingkar   = $item['lingkar'] ?? 0;
                $detail->panjang   = $item['panjang'] ?? 0;
                $detail->total     = $totalHargaItem;
                $detail->terbilang = $this->terbilang($totalHargaItem) . " RUPIAH";
                $detail->oleh      = Auth::id();
                $detail->status    = 1;
                $detail->save();
            }

            if (count($failedItems) === count($items)) {
                throw new \Exception("SEMUA_DUPLIKAT:" . json_encode($failedItems));
            }

            $msg = 'Produk berhasil ditambahkan.';
            if (count($failedItems) > 0) {
                $msg .= ' Namun ' . count($failedItems) . ' produk dilewati karena sudah ada di daftar.';
            }

            return [
                'message' => $msg,
                'failed'  => $failedItems,
                'data'    => $offtake
            ];
        });
    }

    public function getOfftakeDetail()
    {
        return OfftakeDetail::with(['produk'])->where('status', 1)->get();
    }

    public function batalOfftakeDetail(int $id): array
    {
        return DB::transaction(function () use ($id) {
            $detail = OfftakeDetail::where('id', $id)
                ->where('status', 1)
                ->firstOrFail();

            $kodeOfftake = $detail->kode;

            $detail->update([
                'status' => 0,
                'oleh'   => Auth::id()
            ]);

            $sisaProdukAktif = OfftakeDetail::where('kode', $kodeOfftake)
                ->where('status', 1)
                ->count();

            $offtake = Offtake::where('kode', $kodeOfftake)->first();

            if ($offtake) {
                if ($sisaProdukAktif > 0) {
                    $newTotal = OfftakeDetail::where('kode', $kodeOfftake)
                        ->where('status', 1)
                        ->sum('total');

                    $offtake->update([
                        'total'      => $newTotal,
                        'hargatotal' => $newTotal,
                        'terbilang'  => $this->terbilang($newTotal) . " RUPIAH",
                    ]);
                } else {
                    $offtake->update([
                        'total'      => 0,
                        'hargatotal' => 0,
                        'terbilang'  => 'NOL RUPIAH',
                        'status'     => 0,
                    ]);
                }
            }

            return [
                'message'   => $sisaProdukAktif > 0 ? 'Produk berhasil dihapus.' : 'Produk terakhir dihapus, transaksi menjadi kosong.',
                'sisa_item' => $sisaProdukAktif
            ];
        });
    }

    public function paymentOfftake(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $saldoAktif = DB::table('saldo')->where('status', 1)->first();
            if (!$saldoAktif) {
                throw new \Exception("Tidak ada rekening saldo aktif untuk menerima pembayaran.");
            }

            $offtake = Offtake::where('kode', $data['kode'])->first();
            if (!$offtake) {
                throw new \Exception("Data Offtake dengan kode " . $data['kode'] . " tidak ditemukan.");
            }

            if ($offtake->status != 1) {
                throw new \Exception("Transaksi Offtake ini sudah pernah diproses atau statusnya tidak aktif.");
            }

            $details = OfftakeDetail::where('kode', $data['kode'])->where('status', 1)->get();
            if ($details->isEmpty()) {
                throw new \Exception("Tidak ada produk dalam daftar offtake.");
            }

            foreach ($details as $detail) {
                $produk = Produk::findOrFail($detail->produk_id);
                $produk->update(['status' => 3]);
                $detail->update(['status' => 2]);

                $nampanAktif = DB::table('nampanproduk')
                    ->where('produk_id', $produk->id)
                    ->where('status', 1)
                    ->first();

                if ($nampanAktif) {
                    DB::table('nampanproduk')->where('id', $nampanAktif->id)->update(['status' => 2]);
                    DB::table('nampanproduk')->insert([
                        'nampan_id'  => $nampanAktif->nampan_id,
                        'produk_id'  => $produk->id,
                        'jenis'      => 'KELUAR',
                        'tanggal'    => now(),
                        'oleh'       => Auth::id(),
                        'status'     => 2,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            $terbilangFix = $this->terbilang($data['total']) . " RUPIAH";

            $offtake->update([
                'suplier_id' => $data['suplier_id'],
                'hargatotal' => $data['total'],
                'status'     => 2,
                'terbilang'  => $terbilangFix,
                'keterangan' => $data['keterangan'] ?? null,
                'tanggal'    => now(),
            ]);

            DB::table('mutasisaldo')->insert([
                'saldo_id'   => $saldoAktif->id,
                'tanggal'    => now()->format('Y-m-d'),
                'keterangan' => "Penerimaan Offtake Supplier (" . $offtake->kode . ")",
                'jenis'      => 'MASUK',
                'jumlah'     => $data['total'],
                'oleh'       => Auth::id(),
                'status'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('saldo')->where('id', $saldoAktif->id)->increment('total', $data['total']);

            return [
                'rekening' => $saldoAktif->rekening
            ];
        });
    }

    public function getTransaksiOfftake()
    {
        return Offtake::with(['offtakedetail', 'offtakedetail.produk', 'offtakedetail.produk.karat', 'suplier', 'oleh'])
            ->where('status', '!=', 0)
            ->get();
    }

    public function batalTransaksi(string $kode, ?string $keterangan = null): void
    {
        DB::transaction(function () use ($kode, $keterangan) {
            $offtake = Offtake::where('kode', $kode)->firstOrFail();

            if ($offtake->status != 2) {
                throw new \Exception("Transaksi tidak dapat dibatalkan karena status bukan 'Lunas'.");
            }

            $saldoAktif = DB::table('saldo')->where('status', 1)->first();
            if (!$saldoAktif) {
                throw new \Exception("Rekening saldo aktif tidak ditemukan untuk penyesuaian dana.");
            }

            $details = OfftakeDetail::where('kode', $kode)->get();

            foreach ($details as $detail) {
                $produk = Produk::find($detail->produk_id);
                if ($produk) {
                    $produk->update(['status' => 1]);
                }
                $detail->update(['status' => 0]);
            }

            DB::table('mutasisaldo')
                ->where('keterangan', 'like', '%' . $offtake->kode . '%')
                ->where('jenis', 'MASUK')
                ->delete();

            DB::table('saldo')
                ->where('id', $saldoAktif->id)
                ->decrement('total', $offtake->hargatotal);

            $offtake->update([
                'status'     => 0,
                'keterangan' => "PEMBATALAN OFFTAKE: " . ($keterangan ?? $offtake->keterangan),
            ]);
        });
    }

    public function generateSignedNotaUrl(string $kode): string
    {
        return URL::temporarySignedRoute(
            'produk.cetak_notaofftake',
            now()->addMinutes(10),
            ['kode' => $kode]
        );
    }

    public function generateNotaPdf(string $kode): string
    {
        $jasper_file = resource_path('reports/CetakNotaOfftake.jasper');
        $db = config('database.connections.mysql');

        $parameters = [
            'LOGO'                  => public_path('assets/report/LOGOTOKO.png'),
            'LOGOTEXT'              => public_path('assets/report/LOGOTEXT.png'),
            'PRODUK'                => public_path('storage/images/produk/'),
            'TERIMAKASIH'           => public_path('assets/report/thanksforshopping.png'),
            'TTD'                   => public_path('assets/ttd/'),
            'KODETRANSAKSI_INPUT'   => $kode,
        ];

        $tempDir = storage_path('app/temp_reports');
        if (!file_exists($tempDir)) mkdir($tempDir, 0755, true);

        $outputName = 'nota-' . $kode . '-' . time();
        $outputPath = $tempDir . '/' . $outputName;

        $jasper = new PHPJasper;
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

        return $pdfContent;
    }

    public function sendTelegram(string $pesan)
    {
        $botToken = config('services.telegram.bot_token');
        $chatId   = config('services.telegram.chat_id');

        $httpClient = app()->environment('local') ? Http::withoutVerifying() : Http::withOptions([]);

        $response = $httpClient->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
            'chat_id'    => $chatId,
            'text'       => $pesan,
            'parse_mode' => 'Markdown',
        ]);

        if (!$response->successful()) {
            throw new \Exception('Telegram API error: ' . json_encode($response->json()));
        }

        return $response->json();
    }
}
