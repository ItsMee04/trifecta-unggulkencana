<?php

namespace App\Services\Produk;

use App\Models\Produk\JenisProduk;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class JenisProdukService
{
    public function getJenisProduk()
    {
        return JenisProduk::where('status', 1)->orderBy('urutan', 'asc')->get();
    }

    public function createJenisProduk(array $data, ?UploadedFile $imageFile = null)
    {
        return DB::transaction(function () use ($data, $imageFile) {

            // 🌟 PERBAIKAN: Berikan kondisi jika gambar tidak di-upload
            $imageName = null;

            if ($imageFile) {
                // Proses kompresi gambar HANYA dijalankan jika file-nya ada
                $imageName = $this->uploadAndCompressNative($imageFile);
            }

            // 2. Simpan data jenis produk ke Database
            $data = JenisProduk::create([
                'jenis'  => $data['jenis'],
                'urutan' => $data['urutan'],
                'image'  => $imageName, // nilainya akan berupa nama file teks atau null jika kosong
            ]);

            return $data;
        });
    }

    /**
     * Service: Update Data Jenis Produk beserta Foto Baru (Jika Ada)
     */
    public function updateJenisProduk(int $id, array $data, ?UploadedFile $imageFile = null): ?JenisProduk
    {
        return DB::transaction(function () use ($id, $data, $imageFile) {
            // 1. 🌟 GANTI NAMA VARIABEL MENJADI $jenisProduk AGAR TIDAK BENTROK
            $jenisProduk = JenisProduk::find($id);
            if (!$jenisProduk) {
                return null;
            }

            // 2. Ambil nama gambar lama sebagai default
            $imageName = $jenisProduk->image;

            // 3. Jika ada file gambar baru yang diunggah
            if ($imageFile) {
                // Hapus file gambar lama dari storage
                $this->deleteOldImage($jenisProduk->image);

                // Proses kompresi gambar baru
                $imageName = $this->uploadAndCompressNative($imageFile);
            }

            // 4. 🌟 SEKARANG AMAN: Mengupdate model menggunakan array data asli dari controller
            $jenisProduk->update([
                'jenis'  => $data['jenis'],  // Ini mengambil array $data asli dari parameter fungsi
                'urutan' => $data['urutan'], // Ini juga mengambil array $data asli
                'image'  => $imageName,
            ]);

            return $jenisProduk;
        });
    }

    public function deleteJenisProduk(int $id): bool
    {
        // 1. Cari data jenis produk
        $data = JenisProduk::find($id);

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
        Storage::disk('public')->put('jenisproduk/image/' . $imageName, $rawImageData);

        return $imageName;
    }

    public function deleteOldImage(?string $fileName)
    {
        if ($fileName && Storage::disk('public')->exists('jenisproduk/image/' . $fileName)) {
            Storage::disk('public')->delete('jenisproduk/image/' . $fileName);
        }
    }
}
