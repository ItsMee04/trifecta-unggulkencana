<?php

namespace App\Services\Transaksi;

use App\Models\Produk\Produk;
use App\Models\Transaksi\Transaksi;
use App\Models\Transaksi\TransaksiDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class TransaksiService
{
    public function generateKodeTransaksi()
    {
        $today = Carbon::now()->format('Ymd');
        $prefixToday = 'TR-' . $today . '-';

        $lastRecord = Transaksi::where('kode', 'like', 'TR-%')
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

    public function terbilang(int $angka)
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

    public function handleGetKodeTransaksi()
    {
        $transaksiAktif = Transaksi::where('oleh', Auth::id())
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

    public function storeProdukToDetail(array $data)
    {
        $produk = Produk::where('kodeproduk', $data['kodeproduk'])->firstOrFail();

        // 1. Validasi isi keranjang
        $sudahAdaIsi = TransaksiDetail::where('kode', $data['kode'])
            ->where('status', 1)
            ->exists();

        if ($sudahAdaIsi) {
            throw new \Exception('Gagal! Transaksi ini sudah berisi produk. Satu transaksi hanya boleh untuk satu produk emas.');
        }

        // 2. Validasi status produk global
        $isExistsGlobal = TransaksiDetail::where('produk_id', $produk->id)
            ->where('status', 1)
            ->exists();

        if ($isExistsGlobal) {
            throw new \Exception('Gagal! Produk ini sedang dalam proses transaksi aktif.');
        }

        return DB::transaction(function () use ($data, $produk) {
            // 3. Header Transaksi
            $transaksi = Transaksi::firstOrCreate(
                ['kode' => $data['kode']],
                [
                    'tanggal'   => now(),
                    'oleh'      => Auth::id(),
                    'status'    => 1,
                    'total'     => 0,
                    'terbilang' => 'Nol Rupiah'
                ]
            );

            // 4. Perhitungan & Simpan Detail
            $totalHargaBarang = $data['harga'] * $data['berat'];
            $terbilangBarang  = $this->terbilang($totalHargaBarang);

            $detail = new TransaksiDetail();
            $detail->kode       = $data['kode'];
            $detail->produk_id  = $produk->id;
            $detail->hargajual  = $data['harga'];
            $detail->berat      = $data['berat'];
            $detail->karat      = $data['karat'] ?? 0;
            $detail->lingkar    = $data['lingkar'] ?? 0;
            $detail->panjang    = $data['panjang'] ?? 0;
            $detail->total      = $totalHargaBarang;
            $detail->terbilang  = $terbilangBarang . " Rupiah";
            $detail->oleh       = Auth::id();
            $detail->status     = 1;
            $detail->save();

            // 5. Sinkronisasi Header
            $transaksi->increment('total', $detail->total);
            $transaksi->refresh();
            $transaksi->update([
                'terbilang' => $this->terbilang($transaksi->total) . " Rupiah"
            ]);

            return [$transaksi, $detail->load('produk'), $produk];
        });
    }

    public function batalDetail(int $id)
    {
        return DB::transaction(function () use ($id) {
            $detail = TransaksiDetail::where('id', $id)
                ->where('status', 1)
                ->firstOrFail();

            $kodeTransaksi = $detail->kode;

            $detail->update([
                'status' => 0,
                'oleh'   => Auth::id()
            ]);

            $transaksi = Transaksi::where('kode', $kodeTransaksi)->first();

            if ($transaksi) {
                $newTotal = TransaksiDetail::where('kode', $kodeTransaksi)
                    ->where('status', 1)
                    ->sum('total');

                $transaksi->update([
                    'total'     => $newTotal,
                    'terbilang' => $this->terbilang($newTotal) . " Rupiah",
                    'status'    => 0,
                ]);
            }

            return true;
        });
    }

    public function processPayment(array $data)
    {
        return DB::transaction(function () use ($data) {
            $saldoAktif = DB::table('saldo')->where('status', 1)->first();
            if (!$saldoAktif) {
                throw new \Exception("Rekening saldo aktif tidak ditemukan.");
            }

            $transaksi = Transaksi::where('kode', $data['kode'])->firstOrFail();
            $detail = TransaksiDetail::where('kode', $data['kode'])->where('status', 1)->first();
            if (!$detail) {
                throw new \Exception("Detail transaksi tidak ditemukan atau sudah diproses.");
            }

            $produk = Produk::findOrFail($detail->produk_id);

            // Logika Poin
            $jumlahPoinBaru = floor((float) $produk->berat);
            $jumlahPoinPakai = $data['point_digunakan'] ?? 0;

            // Update Header
            $transaksi->update([
                'pelanggan_id'  => $data['pelanggan'],
                'diskon_id'     => $data['diskon'] ?? null,
                'total'         => $data['total'],
                'point_dapat'   => $jumlahPoinBaru,
                'point_dipakai' => $jumlahPoinPakai,
                'status'        => 2,
                'tanggal'       => now(),
            ]);

            $produk->update(['status' => 2]);
            $detail->update(['status' => 2]);

            // Logic Nampan
            $nampanLama = DB::table('nampanproduk')
                ->where('produk_id', $produk->id)
                ->where('status', 1)
                ->first();

            if ($nampanLama) {
                DB::table('nampanproduk')->where('id', $nampanLama->id)->update(['status' => 2]);
                DB::table('nampanproduk')->insert([
                    'nampan_id'  => $nampanLama->nampan_id,
                    'produk_id'  => $produk->id,
                    'jenis'      => 'KELUAR',
                    'tanggal'    => now(),
                    'oleh'       => Auth::id(),
                    'status'     => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Mutasi Saldo
            DB::table('mutasisaldo')->insert([
                'saldo_id'   => $saldoAktif->id,
                'tanggal'    => now(),
                'keterangan' => "Penjualan " . $produk->nama . " (" . $transaksi->kode . ")",
                'jenis'      => 'MASUK',
                'jumlah'     => $data['total'],
                'oleh'       => Auth::id(),
                'status'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            DB::table('saldo')->where('id', $saldoAktif->id)->increment('total', $data['total']);

            // Poin Pelanggan (Masuk)
            if ($jumlahPoinBaru > 0) {
                DB::table('poinpelanggan')->insert([
                    'pelanggan_id' => $data['pelanggan'],
                    'kode'         => $data['kode'],
                    'jumlah'       => $jumlahPoinBaru,
                    'oleh'         => Auth::id(),
                    'status'       => 1,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
                DB::table('pelanggan')->where('id', $data['pelanggan'])->increment('point', $jumlahPoinBaru);
            }

            // Poin Pelanggan (Keluar)
            if ($jumlahPoinPakai > 0) {
                $currentPoint = DB::table('pelanggan')->where('id', $data['pelanggan'])->value('point');
                if ($currentPoint < $jumlahPoinPakai) {
                    throw new \Exception("Saldo poin pelanggan tidak mencukupi untuk ditukarkan.");
                }

                DB::table('poinpelanggan')->insert([
                    'pelanggan_id' => $data['pelanggan'],
                    'kode'         => $data['kode'],
                    'jumlah'       => -$jumlahPoinPakai,
                    'oleh'         => Auth::id(),
                    'status'       => 1,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
                DB::table('pelanggan')->where('id', $data['pelanggan'])->decrement('point', $jumlahPoinPakai);
            }

            return true;
        });
    }

    public function cancelTransaksi(string $kode)
    {
        return DB::transaction(function () use ($kode) {
            $transaksi = Transaksi::where('kode', $kode)->firstOrFail();

            if ($transaksi->status == 0) {
                throw new \Exception("Transaksi ini sudah dibatalkan sebelumnya.");
            }

            $detail = TransaksiDetail::where('kode', $kode)->first();
            if (!$detail) {
                throw new \Exception("Detail transaksi tidak ditemukan.");
            }

            $produk = Produk::findOrFail($detail->produk_id);
            $produk->update(['status' => 1]);

            $logTerakhir = DB::table('nampanproduk')
                ->where('produk_id', $produk->id)
                ->orderBy('id', 'desc')
                ->first();

            $nampanId = $logTerakhir ? $logTerakhir->nampan_id : null;

            DB::table('nampanproduk')->insert([
                'produk_id'  => $produk->id,
                'nampan_id'  => $nampanId,
                'jenis'      => 'KELUAR',
                'tanggal'    => now(),
                'oleh'       => Auth::id(),
                'status'     => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $mutasi = DB::table('mutasisaldo')
                ->where('keterangan', 'like', '%' . $transaksi->kode . '%')
                ->where('jenis', 'MASUK')
                ->first();

            if ($mutasi) {
                DB::table('saldo')->where('id', $mutasi->saldo_id)->decrement('total', $mutasi->jumlah);
                DB::table('mutasisaldo')->where('id', $mutasi->id)->delete();
            }

            $transaksi->update(['status' => 0]);
            $detail->update(['status' => 0]);

            return $transaksi;
        });
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
