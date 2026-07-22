<?php

namespace App\Services\Transaksi;

use App\Models\Produk\Produk;
use App\Models\Transaksi\Pembelian;
use App\Models\Transaksi\PembelianDetail;
use App\Models\Transaksi\Perbaikan;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PerbaikanService
{
    public function generateKodeTransaksi(): string
    {
        $today = Carbon::now()->format('Ymd');
        $prefixToday = 'PB-' . $today . '-';

        $lastRecord = Perbaikan::where('kode', 'like', 'PB-%')
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
        $transaksiAktif = Perbaikan::where('oleh', Auth::id())
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

    public function getPerbaikan()
    {
        return Perbaikan::with(['produk', 'kondisi'])
            ->where('status', '!=', 0)
            ->get();
    }

    public function finalPerbaikan(int $idPerbaikan): bool
    {
        DB::beginTransaction();
        try {
            $perbaikan = Perbaikan::findOrFail($idPerbaikan);

            $perbaikan->keterangan    = "Produk selesai diperbaiki";
            $perbaikan->tanggalkeluar = Carbon::now();
            $perbaikan->status        = 2;
            $perbaikan->save();

            Produk::where('id', $perbaikan->produk_id)->update([
                'status' => 1
            ]);

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function batalPerbaikan(int $idPerbaikan): bool
    {
        DB::beginTransaction();
        try {
            $perbaikan = Perbaikan::findOrFail($idPerbaikan);

            $pembelianDetail = PembelianDetail::where('produk_id', $perbaikan->produk_id)
                ->where('status', '!=', 0)
                ->first();

            if ($pembelianDetail) {
                $nominalRefund = $pembelianDetail->total;
                $kodeNota = $pembelianDetail->kode;

                $pembelian = Pembelian::where('kode', $kodeNota)->first();
                if ($pembelian) {
                    $pembelian->update(['status' => 0]);
                }

                $pembelianDetail->update(['status' => 0]);

                $saldoAktif = DB::table('saldo')->where('status', 1)->first();

                if ($saldoAktif && $nominalRefund > 0) {
                    DB::table('saldo')->where('id', $saldoAktif->id)->increment('total', $nominalRefund);

                    DB::table('mutasisaldo')->insert([
                        'saldo_id'   => $saldoAktif->id,
                        'tanggal'    => now()->format('Y-m-d'),
                        'keterangan' => "PEMBATALAN Pembelian & Perbaikan. Kode Nota: " . $kodeNota,
                        'jenis'      => 'MASUK',
                        'jumlah'     => $nominalRefund,
                        'oleh'       => Auth::id(),
                        'status'     => 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            $perbaikan->update(['status' => 0]);

            $produk = Produk::find($perbaikan->produk_id);
            if ($produk) {
                $produk->update(['status' => 0]);
            }

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
