<?php

namespace App\Services\Transaksi;

use App\Models\Produk\Produk;
use App\Models\Transaksi\Pembelian;
use App\Models\Transaksi\PembelianDetail;
use App\Models\Transaksi\Perbaikan;
use App\Models\Transaksi\Transaksi;
use App\Services\Produk\ProdukService;
use App\Services\Transaksi\PerbaikanService;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Milon\Barcode\DNS1D;

class PembelianService
{
    protected ProdukService $produkService;
    protected PerbaikanService $perbaikanService;

    public function __construct(
        ProdukService $produkService,
        PerbaikanService $perbaikanService
    ) {
        $this->produkService = $produkService;
        $this->perbaikanService = $perbaikanService;
    }

    public function generateKodeTransaksi(): string
    {
        $today = Carbon::now()->format('Ymd');
        $prefixToday = 'PM-' . $today . '-';

        $lastRecord = Pembelian::where('kode', 'like', 'PM-%')
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
        $transaksiAktif = Pembelian::where('oleh', Auth::id())
            ->where('status', 1)
            ->latest()
            ->first();

        if ($transaksiAktif) {
            return [
                'kode'    => $transaksiAktif->kode,
                'message' => 'Menggunakan kode transaksi aktif'
            ];
        }

        return [
            'kode'    => $this->generateKodeTransaksi(),
            'message' => 'Kode transaksi baru berhasil di-generate'
        ];
    }

    public function getTransaksiByKode(string $kode)
    {
        return Transaksi::where('kode', $kode)
            ->with(['pelanggan', 'diskon', 'transaksidetail', 'transaksidetail.produk'])
            ->get();
    }

    public function storeProdukToPembelianDetail(array $data)
    {
        $produk = Produk::with('karat')->where('id', $data['produk'])->firstOrFail();
        $sudahDipilih = PembelianDetail::where('produk_id', $produk->id)
            ->where('status', 1)
            ->exists();

        if ($sudahDipilih) {
            throw new Exception('Gagal! Produk ini sedang dalam proses transaksi aktif.');
        }

        DB::beginTransaction();
        try {
            Pembelian::firstOrCreate(
                ['kode' => $data['kode']],
                [
                    'tanggal'      => now(),
                    'jenis'        => 'DARITOKO',
                    'pelanggan_id' => $data['pelanggan_id'] ?? null,
                    'total'        => 0,
                    'terbilang'    => 'RUPIAH',
                    'oleh'         => Auth::id(),
                    'status'       => 1,
                ]
            );

            $detail = new PembelianDetail();
            $detail->kodetransaksi = $data['kodetransaksi'];
            $detail->kode          = $data['kode'];
            $detail->produk_id     = $produk->id;
            $detail->berat         = $produk->berat;
            $detail->karat         = $produk->karat->karat ?? null;
            $detail->lingkar       = $produk->lingkar;
            $detail->panjang       = $produk->panjang;
            $detail->jenis         = 'DARITOKO';
            $detail->oleh          = Auth::id();
            $detail->status        = 1;
            $detail->save();

            DB::commit();
            return $detail;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getPembelianDetail()
    {
        return PembelianDetail::with(['produk', 'kodetransaksi', 'kodetransaksi.transaksidetail', 'produk.karat', 'produk.harga', 'pembelian.pelanggan'])
            ->where('jenis', 'DARITOKO')
            ->where('status', 1)
            ->get();
    }

    public function updatePembelianDetail(array $data)
    {
        DB::beginTransaction();
        try {
            $detail = PembelianDetail::findOrFail($data['id']);

            $detail->hargabeli       = $data['hargabeli'];
            $detail->kondisi_id      = $data['kondisi_id'] ?? null;
            $detail->jenis_hargabeli = $data['jenis_hargabeli'];
            $detail->keterangan      = $data['keterangan'] ?? null;

            $totalDetail = $data['hargabeli'] * $detail->berat;
            $detail->total = $totalDetail;
            $detail->terbilang = $this->terbilang($totalDetail);
            $detail->save();

            $pembelian = Pembelian::where('kode', $detail->kode)->first();

            if ($pembelian) {
                $grandTotal = PembelianDetail::where('kode', $detail->kode)
                    ->where('status', 1)
                    ->sum('total');

                $pembelian->total = $grandTotal;
                $pembelian->terbilang = $this->terbilang($grandTotal);
                $pembelian->save();
            }

            DB::commit();
            return [
                'detail' => $detail,
                'header' => $pembelian
            ];
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function batalPembelianDetail(int $id)
    {
        DB::beginTransaction();
        try {
            $detail = PembelianDetail::where('id', $id)
                ->where('status', 1)
                ->firstOrFail();

            $kodeTransaksi = $detail->kode;

            $detail->update([
                'status' => 0,
                'oleh'   => Auth::id()
            ]);

            $transaksi = Pembelian::where('kode', $kodeTransaksi)->first();

            if ($transaksi) {
                $newTotal = PembelianDetail::where('kode', $kodeTransaksi)
                    ->where('status', 1)
                    ->sum('total');

                $transaksi->update([
                    'total'     => $newTotal,
                    'terbilang' => $this->terbilang($newTotal) . " RUPIAH",
                    'status'    => 0,
                ]);
            }

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function paymentPembelian(array $data)
    {
        DB::beginTransaction();
        try {
            $saldoAktif = DB::table('saldo')->where('status', 1)->first();
            if (!$saldoAktif) {
                throw new Exception("Tidak ada rekening saldo aktif untuk melakukan pembayaran.");
            }

            $pembelian = Pembelian::where('kode', $data['kode'])->firstOrFail();

            $details = PembelianDetail::where('kode', $data['kode'])
                ->where('status', 1)
                ->get();

            if ($details->isEmpty()) {
                throw new Exception("Tidak ada produk dalam keranjang pembelian.");
            }

            foreach ($details as $item) {
                $produk = Produk::findOrFail($item->produk_id);

                if ($item->kondisi_id == 1) {
                    $keteranganPerbaikan = "PENCUCIAN: Barang masuk dari pembelian " . $pembelian->kode;
                } else {
                    $keteranganPerbaikan = "DILEBUR: Barang masuk dari pembelian " . $pembelian->kode . ". Catatan: " . ($item->keterangan ?? 'Rusak');
                }

                $produk->update([
                    'status'    => 2,
                    'hargabeli' => $item->hargabeli,
                ]);

                Perbaikan::create([
                    'kode'          => $this->perbaikanService->generateKodeTransaksi(),
                    'produk_id'     => $produk->id,
                    'kondisi_id'    => $item->kondisi_id,
                    'keterangan'    => $keteranganPerbaikan,
                    'tanggalmasuk'  => now(),
                    'oleh'          => Auth::id(),
                    'status'        => 1,
                ]);

                $item->update(['status' => 2]);
            }

            $pembelian->update([
                'keterangan' => $data['keterangan'] ?? $pembelian->keterangan,
                'status'     => 2,
                'tanggal'    => now(),
            ]);

            DB::table('mutasisaldo')->insert([
                'saldo_id'   => $saldoAktif->id,
                'tanggal'    => now()->format('Y-m-d'),
                'keterangan' => "Pembelian produk (Buyback) Kode: " . $pembelian->kode,
                'jenis'      => 'KELUAR',
                'jumlah'     => $pembelian->total,
                'oleh'       => Auth::id(),
                'status'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('saldo')->where('id', $saldoAktif->id)->decrement('total', $pembelian->total);

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getPembelianDetailDariLuar()
    {
        return PembelianDetail::with(['produk', 'kodetransaksi', 'produk.karat', 'pembelian.pelanggan'])
            ->where('jenis', 'LUARTOKO')
            ->where('status', 1)
            ->get();
    }

    public function storeProdukToPembelianDetailDariLuar(array $data)
    {
        $exists = PembelianDetail::where('kode', $data['kode'])->exists();

        if ($exists) {
            throw new Exception('Gagal: Transaksi ini sudah memiliki barang. Hanya diperbolehkan 1 barang per transaksi.');
        }

        DB::beginTransaction();
        $barcodePath = null;

        try {
            $kodeproduk = $this->produkService->generateUniqueCode();

            $barcodeGenerator = new DNS1D();
            $barcodeBase64 = $barcodeGenerator->getBarcodeJPG($kodeproduk, 'C128', 1.2, 20);
            $barcodeData = base64_decode($barcodeBase64);
            $barcodePath = 'images/barcode/' . $kodeproduk . '.jpg';

            Storage::disk('public')->put($barcodePath, $barcodeData);

            $produk = Produk::create([
                'kodeproduk'     => $kodeproduk,
                'nama'           => strtoupper($data['nama']),
                'berat'          => $data['berat'],
                'jenisproduk_id' => $data['jenisproduk'],
                'karat_id'       => $data['karat'],
                'jeniskarat_id'  => $data['jeniskarat'],
                'lingkar'        => $data['lingkar'] ?? 0,
                'panjang'        => $data['panjang'] ?? 0,
                'harga_id'       => $data['hargajual'] ?? null,
                'hargabeli'      => $data['hargabeli'],
                'keterangan'     => strtoupper($data['keterangan'] ?? ''),
                'oleh'           => Auth::id(),
                'status'         => 0,
            ]);

            $pembelian = Pembelian::firstOrCreate(
                ['kode' => $data['kode']],
                [
                    'tanggal'   => now(),
                    'jenis'     => 'LUARTOKO',
                    'total'     => 0,
                    'terbilang' => 'NOL RUPIAH',
                    'oleh'      => Auth::id(),
                    'status'    => 1,
                ]
            );

            $detail = new PembelianDetail();
            $detail->kode       = $pembelian->kode;
            $detail->produk_id  = $produk->id;
            $detail->hargabeli  = $data['hargabeli'];
            $detail->berat      = $produk->berat;
            $detail->karat      = $produk->karat->karat ?? null;
            $detail->lingkar    = $produk->lingkar;
            $detail->panjang    = $produk->panjang;
            $detail->kondisi_id = $data['kondisi'] ?? null;
            $detail->jenis      = 'LUARTOKO';

            $totalPerProduk     = $detail->berat * (int)$data['hargabeli'];
            $detail->total      = $totalPerProduk;
            $detail->terbilang  = $this->terbilang($totalPerProduk);
            $detail->oleh       = Auth::id();
            $detail->status     = 1;
            $detail->save();

            DB::commit();
            return $detail;
        } catch (Exception $e) {
            DB::rollBack();

            if ($barcodePath && Storage::disk('public')->exists($barcodePath)) {
                Storage::disk('public')->delete($barcodePath);
            }

            throw $e;
        }
    }

    public function updatePembelianDetailDariLuar(array $data)
    {
        DB::beginTransaction();
        try {
            $detail = PembelianDetail::findOrFail($data['id']);

            $produk = Produk::findOrFail($detail->produk_id);
            $produk->update([
                'nama'           => strtoupper($data['nama']),
                'berat'          => $data['berat'],
                'jenisproduk_id' => $data['jenisproduk'],
                'karat_id'       => $data['karat'],
                'jeniskarat_id'  => $data['jeniskarat'],
                'lingkar'        => $data['lingkar'] ?? 0,
                'panjang'        => $data['panjang'] ?? 0,
                'harga_id'       => $data['hargajual'] ?? null,
                'hargabeli'      => $data['hargabeli'],
                'keterangan'     => strtoupper($data['keterangan'] ?? ''),
                'kondisi_id'     => $data['kondisi'] ?? null,
            ]);

            $detail->hargabeli  = $data['hargabeli'];
            $detail->berat      = $produk->berat;

            $produk->load('karat');
            $detail->karat      = $produk->karat->karat ?? null;

            $detail->lingkar    = $produk->lingkar;
            $detail->panjang    = $produk->panjang;
            $detail->kondisi_id = $data['kondisi'] ?? null;
            $detail->jenis      = 'LUARTOKO';

            $totalPerProduk     = (float)$produk->berat * (int)$data['hargabeli'];
            $detail->total      = $totalPerProduk;
            $detail->terbilang  = $this->terbilang($totalPerProduk);

            $detail->oleh       = Auth::id();
            $detail->status     = 1;
            $detail->save();

            DB::commit();
            return $detail;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function batalPembelianDetailDariLuar(int $id)
    {
        DB::beginTransaction();
        try {
            $detail = PembelianDetail::where('id', $id)
                ->where('status', 1)
                ->firstOrFail();

            $kodeTransaksi = $detail->kode;

            $detail->update([
                'status' => 0,
                'oleh'   => Auth::id()
            ]);

            if ($detail->produk_id) {
                $produk = Produk::find($detail->produk_id);
                if ($produk) {
                    $produk->update(['status' => 0]);
                }
            }

            $transaksi = Pembelian::where('kode', $kodeTransaksi)->first();

            if ($transaksi) {
                $transaksi->update([
                    'total'     => 0,
                    'terbilang' => "NOL RUPIAH",
                    'status'    => 0,
                ]);
            }

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function paymentPembelianDariLuar(array $data)
    {
        DB::beginTransaction();
        try {
            $saldoAktif = DB::table('saldo')->where('status', 1)->first();
            if (!$saldoAktif) {
                throw new Exception("Tidak ada rekening saldo aktif untuk melakukan pembayaran.");
            }

            $pembelian = Pembelian::where('kode', $data['kode'])->firstOrFail();

            $details = PembelianDetail::where('kode', $data['kode'])
                ->where('status', 1)
                ->get();

            if ($details->isEmpty()) {
                throw new Exception("Tidak ada produk dalam keranjang pembelian.");
            }

            $totalFix = $details->sum('total');
            $terbilangFix = $this->terbilang($totalFix) . " RUPIAH";

            foreach ($details as $item) {
                $produk = Produk::findOrFail($item->produk_id);

                if ($item->kondisi_id == 1) {
                    $keteranganPerbaikan = "PENCUCIAN: Barang masuk dari pembelian " . $pembelian->kode;
                } else {
                    $keteranganPerbaikan = "DILEBUR: Barang masuk dari pembelian " . $pembelian->kode . ". Catatan: " . ($item->keterangan ?? 'Rusak');
                }

                $produk->update([
                    'status'    => 2,
                    'hargabeli' => $item->hargabeli,
                ]);

                Perbaikan::create([
                    'kode'          => $this->perbaikanService->generateKodeTransaksi(),
                    'produk_id'     => $produk->id,
                    'kondisi_id'    => $item->kondisi_id,
                    'keterangan'    => $keteranganPerbaikan,
                    'tanggalmasuk'  => now(),
                    'oleh'          => Auth::id(),
                    'status'        => 1,
                ]);

                $item->update(['status' => 2]);
            }

            $updateData = [
                'total'      => $totalFix,
                'terbilang'  => $terbilangFix,
                'keterangan' => isset($data['keterangan']) ? strtoupper($data['keterangan']) : $pembelian->keterangan,
                'status'     => 2,
                'tanggal'    => now(),
                'oleh'       => Auth::id(),
            ];

            if ($data['sumber'] === 'supplier') {
                $updateData['suplier_id'] = $data['selectedId'];
                $updateData['pelanggan_id'] = null;
            } else {
                $updateData['pelanggan_id'] = $data['selectedId'];
                $updateData['suplier_id'] = null;
            }

            $pembelian->update($updateData);

            DB::table('mutasisaldo')->insert([
                'saldo_id'   => $saldoAktif->id,
                'tanggal'    => now()->format('Y-m-d'),
                'keterangan' => "Pembelian Luar (Buyback) " . ($data['sumber']) . " Kode: " . $pembelian->kode,
                'jenis'      => 'KELUAR',
                'jumlah'     => $totalFix,
                'oleh'       => Auth::id(),
                'status'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('saldo')->where('id', $saldoAktif->id)->decrement('total', $totalFix);

            DB::commit();
            return $totalFix;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getTransaksiPembelian()
    {
        return Pembelian::with(['pembeliandetail', 'pembeliandetail.produk', 'suplier', 'pelanggan', 'pembeliandetail.kondisi', 'oleh'])
            ->where('status', '!=', 0)
            ->get();
    }

    public function batalTransaksi(string $kode)
    {
        DB::beginTransaction();
        try {
            $pembelian = Pembelian::where('kode', $kode)->firstOrFail();

            if ($pembelian->status != 2) {
                throw new Exception("Transaksi tidak dapat dibatalkan karena status bukan 'Lunas'.");
            }

            $details = PembelianDetail::where('kode', $kode)->get();

            foreach ($details as $item) {
                $produk = Produk::find($item->produk_id);

                if ($produk) {
                    if ($pembelian->suplier_id || $pembelian->pelanggan_id) {
                        $produk->update(['status' => 0]);
                    } else {
                        $produk->update(['status' => 2]);
                    }
                }

                DB::table('perbaikan')
                    ->where('produk_id', $item->produk_id)
                    ->where('keterangan', 'like', '%' . $pembelian->kode . '%')
                    ->delete();

                $item->update(['status' => 3]);
            }

            DB::table('mutasisaldo')
                ->where('keterangan', 'like', '%' . $pembelian->kode . '%')
                ->where('jenis', 'KELUAR')
                ->delete();

            $saldoAktif = DB::table('saldo')->where('status', 1)->first();
            if ($saldoAktif) {
                DB::table('saldo')->where('id', $saldoAktif->id)->increment('total', $pembelian->total);
            }

            $pembelian->update([
                'status'     => 0,
                'keterangan' => "TRANSAKSI DIBATALKAN: " . $pembelian->keterangan,
            ]);

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
