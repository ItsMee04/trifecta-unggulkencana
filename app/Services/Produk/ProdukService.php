<?php

namespace App\Services\Produk;

use App\Models\Produk\Produk;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Milon\Barcode\DNS1D;

class ProdukService
{
    public function getProduk()
    {
        return Produk::with(['jenisproduk', 'karat', 'jeniskarat', 'harga', 'kondisi'])->where('status', 1)->get();
    }

    public function createProduk(array $data, ?UploadedFile $imageFile = null)
    {
        // Penampung path untuk kebutuhan hapus file jika transaksi DB gagal
        $barcodePath = null;
        $imageName = null;

        // 🌟 PERBAIKAN 1: Generate kode unik SEBELUM masuk ke DB::transaction
        // Ini akan mencegah terjadinya deadlock di MySQL
        $kodeproduk = $this->generateUniqueCode();

        try {
            // Hilangkan variabel $this dari use() karena kita panggil generate di luar,
            // dan masukkan $kodeproduk ke dalam closure transaksi
            return DB::transaction(function () use ($data, $imageFile, $kodeproduk, &$barcodePath, &$imageName) {

                // A. BACA KODE PRODUK YANG SUDAH DIGENERATE DI ATAS
                // (Hapus baris: $kodeproduk = $this->generateUniqueCode(); yang ada di sini sebelumnya)

                // B. Generate Barcode PNG (C128)
                $barcodeGenerator = new DNS1D();
                $barcodeBase64 = $barcodeGenerator->getBarcodePNG($kodeproduk, 'C128', 2, 40);
                $barcodeData = base64_decode($barcodeBase64);

                $barcodePath = 'produk/barcode/' . $kodeproduk . '.png';
                Storage::disk('public')->put($barcodePath, $barcodeData);

                // C. Proses Kompresi Gambar
                if ($imageFile) {
                    $imageName = $this->uploadAndCompressNative($imageFile);
                }

                // D. Simpan ke Database
                $produk = Produk::create([
                    'kodeproduk'        => $kodeproduk,
                    'nama'              => strtoupper($data['nama']),
                    'berat'             => $data['berat'],
                    'jenisproduk_id'    => $data['jenisproduk_id'],
                    'karat_id'          => $data['karat_id'],
                    'jeniskarat_id'     => $data['jeniskarat_id'],
                    'lingkar'           => $data['lingkar'] ?? 0,
                    'panjang'           => $data['panjang'] ?? 0,
                    'harga_id'          => $data['harga_id'],
                    'hargabeli'         => $data['hargabeli'] ?? 0,
                    'keterangan'        => isset($data['keterangan']) ? strtoupper($data['keterangan']) : null,
                    'image'             => $imageName,
                    'oleh'              => Auth::user()->id
                ]);

                return $produk;
            });
        } catch (\Exception $e) {
            // 🔴 TRANS-ROLLBACK: Hapus file di storage jika penulisan ke DB gagal
            if ($barcodePath && Storage::disk('public')->exists($barcodePath)) {
                Storage::disk('public')->delete($barcodePath);
            }
            if ($imageName && Storage::disk('public')->exists('produk/image/' . $imageName)) {
                Storage::disk('public')->delete('produk/image/' . $imageName);
            }
            throw $e;
        }
    }

    /**
     * Service: Update Data Produk beserta Foto Baru (Jika Ada)
     */
    public function updateProduk(int $id, array $data, ?UploadedFile $imageFile = null): ?Produk
    {
        return DB::transaction(function () use ($id, $data, $imageFile) {
            // 🌟 Diubah menjadi $produk
            $produk = Produk::find($id);
            if (!$produk) {
                return null;
            }

            $imageName = $produk->image;

            if ($imageFile) {
                // Hapus file gambar lama
                $this->deleteOldImage($produk->image);

                // Proses kompresi gambar baru
                $imageName = $this->uploadAndCompressNative($imageFile);
            }

            // Jalankan update menggunakan instance objek $produk
            $produk->update([
                'nama'              => strtoupper($data['nama']),
                'berat'             => $data['berat'],
                'jenisproduk_id'    => $data['jenisproduk_id'],
                'karat_id'          => $data['karat_id'],
                'jeniskarat_id'     => $data['jeniskarat_id'],
                'lingkar'           => $data['lingkar'] ?? 0,
                'panjang'           => $data['panjang'] ?? 0,
                'harga_id'          => $data['harga_id'],
                'hargabeli'         => $data['hargabeli'] ?? 0,
                'keterangan'        => $data['keterangan'],
                'image'             => $imageName,
            ]);

            return $produk;
        });
    }

    public function deleteProduk(int $id): bool
    {
        // 1. Cari data produk
        $data = Produk::find($id);

        if (!$data) {
            return false;
        }

        // 2. Bungkus dengan Transaksi agar sinkronisasi DB aman
        return DB::transaction(function () use ($data) {
            // Ubah status pegawai menjadi 0 (Soft Delete/Nonaktif)
            $data->status = 0;
            $data->save();

            return true;
        });
    }

    /**
     * Helper: Kompres Gambar Otomatis ke WebP Menggunakan PHP Native GD
     */
    private function uploadAndCompressNative(UploadedFile $file): string
    {
        // 1. Tentukan nama file unik berformat .webp
        $imageName = time() . '.webp';

        // 2. Baca file gambar asli berdasarkan ekstensinya menggunakan GD Native
        $extension = strtolower($file->getClientOriginalExtension());
        $gdImage = match ($extension) {
            'jpg', 'jpeg' => imagecreatefromjpeg($file->getRealPath()),
            'png'         => imagecreatefrompng($file->getRealPath()),
            default       => @imagecreatefromstring(file_get_contents($file->getRealPath())),
        };

        // Antisipasi jika file korup atau tidak terbaca
        if (!$gdImage) {
            throw new \Exception("Format gambar tidak didukung atau file rusak.");
        }

        // 3. Tangkap output gambar ke dalam buffer memory PHP (Output Buffering)
        ob_start();
        // Lakukan konversi otomatis ke WebP dengan tingkat kualitas 75%
        imagewebp($gdImage, null, 75);
        $rawImageData = ob_get_clean();

        // 4. Hancurkan resource gambar dari RAM agar server tidak bengkak
        imagedestroy($gdImage);

        // 5. Simpan file biner matang ke Storage publik Laravel
        Storage::disk('public')->put('produk/image/' . $imageName, $rawImageData);

        return $imageName;
    }

    public function deleteOldImage(?string $fileName)
    {
        if ($fileName && Storage::disk('public')->exists('produk/image/' . $fileName)) {
            Storage::disk('public')->delete('produk/image/' . $fileName);
        }
    }

    public function generateUniqueCode(): string
    {
        $length = 10;

        // Menggunakan Str::random agar lebih aman (Cryptographically Secure)
        // Jika ingin tetap pakai logika manual for-loop Anda juga bisa di sini
        $code = Str::random($length);

        // Validasi agar tidak duplikat di database
        $exists = Produk::where('kodeproduk', $code)->exists();

        if ($exists) {
            return $this->generateUniqueCode(); // Rekursif jika kode sudah ada
        }

        return $code;
    }
}
