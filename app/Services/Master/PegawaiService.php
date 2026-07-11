<?php

namespace App\Services\Master;

use App\Models\Master\Pegawai;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PegawaiService
{
    public function getPegawaiAktif()
    {
        return Pegawai::with(['jabatan'])->where('status', 1)->get();
    }

    public function createPegawai(array $data, UploadedFile $imageFile)
    {
        return DB::transaction(function () use ($data, $imageFile) {

            // 1. Proses kompresi gambar langsung di sini
            $imageName = $this->uploadAndCompressNative($imageFile);

            // 2. Simpan data pegawai ke Database
            $pegawai = Pegawai::create([
                'nip'        => $data['nip'],
                'nama'       => strtoupper($data['nama']),
                'alamat'     => strtoupper($data['alamat']),
                'kontak'     => strtoupper($data['kontak']),
                'jabatan_id' => $data['jabatan_id'],
                'image'      => $imageName,
            ]);

            // 3. Simpan data user terkait
            User::create([
                'pegawai_id' => $pegawai->id,
                'status'     => 2,
            ]);

            return $pegawai;
        });
    }

    /**
     * Service: Update Data Pegawai beserta Foto Baru (Jika Ada)
     */
    public function updatePegawai(int $id, array $data, ?UploadedFile $imageFile = null): ?Pegawai
    {
        return DB::transaction(function () use ($id, $data, $imageFile) {
            // 1. Cari data pegawai berdasarkan ID
            $pegawai = Pegawai::find($id);
            if (!$pegawai) {
                return null;
            }

            // 2. Ambil nama gambar lama sebagai default
            $imageName = $pegawai->image;

            // 3. Jika ada file gambar baru yang diunggah
            if ($imageFile) {
                // Hapus file gambar lama dari storage agar tidak membuang memori disk
                $this->deleteOldImage($pegawai->image);

                // Proses kompresi gambar baru ke format WebP menggunakan GD Native
                $imageName = $this->uploadAndCompressNative($imageFile);
            }

            // 4. Perbarui data di database
            $pegawai->update([
                'nip'        => $data['nip'],
                'nama'       => strtoupper($data['nama']),
                'alamat'     => strtoupper($data['alamat']),
                'kontak'     => strtoupper($data['kontak']),
                'jabatan_id' => $data['jabatan_id'],
                'image'      => $imageName, // Tetap yang lama atau ganti yang baru
            ]);

            return $pegawai;
        });
    }

    public function deletePegawai(int $id): bool
    {
        // 1. Cari data pegawai
        $pegawai = Pegawai::find($id);

        if (!$pegawai) {
            return false;
        }

        // 2. Bungkus dengan Transaksi agar sinkronisasi DB aman
        return DB::transaction(function () use ($pegawai) {
            // Ubah status pegawai menjadi 0 (Soft Delete/Nonaktif)
            $pegawai->status = 0;
            $pegawai->save();

            // Otomatis ubah status User terkait menjadi 0 agar tidak bisa login lagi
            User::where('pegawai_id', $pegawai->id)->update([
                'status' => 0,
            ]);

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
        Storage::disk('public')->put('pegawai/image/' . $imageName, $rawImageData);

        return $imageName;
    }

    public function deleteOldImage(?string $fileName)
    {
        if ($fileName && Storage::disk('public')->exists('pegawai/image/' . $fileName)) {
            Storage::disk('public')->delete('pegawai/image/' . $fileName);
        }
    }
}
