<?php

namespace Database\Seeders;

use App\Models\Produk\Produk;
use App\Services\Produk\ProdukService;
use Exception;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Milon\Barcode\DNS1D;
use Faker\Factory as Faker;

class ProdukSeeder extends Seeder
{
    protected ProdukService $produkService;

    // Injeksi Service agar bisa menggunakan generateUniqueCode
    public function __construct(ProdukService $produkService)
    {
        $this->produkService = $produkService;
    }

    public function run()
    {
        $faker = Faker::create('id_ID');
        $barcodeGenerator = new DNS1D();

        // 1. Ambil data relasi untuk memastikan foreign key valid
        $jenisProdukIds = DB::table('jenisproduk')->pluck('id')->toArray();
        $hargaList = DB::table('harga')->get();
        $kondisiIds = DB::table('kondisi')->pluck('id')->toArray();

        // Bersihkan folder barcode sebelum seeding agar rapi (opsional)
        Storage::disk('public')->deleteDirectory('produk/barcode');
        Storage::disk('public')->makeDirectory('produk/barcode');

        $this->command->info("Memulai seeding 100 produk...");

        for ($i = 0; $i < 100; $i++) {
            // Pilih harga acak (ini kunci agar karat/jeniskarat selalu cocok dengan harga)
            $selectedHarga = $faker->randomElement($hargaList);

            // Generate kode unik menggunakan service
            $kodeproduk = $this->produkService->generateUniqueCode();

            try {
                DB::transaction(function () use ($kodeproduk, $faker, $barcodeGenerator, $selectedHarga, $jenisProdukIds, $kondisiIds) {

                    // A. Generate Barcode (Sama persis dengan logic di Service)
                    $barcodeBase64 = $barcodeGenerator->getBarcodePNG($kodeproduk, 'C128', 2, 40);
                    $barcodeData = base64_decode($barcodeBase64);
                    $barcodePath = 'produk/barcode/' . $kodeproduk . '.png';
                    Storage::disk('public')->put($barcodePath, $barcodeData);

                    // B. Simpan ke Database
                    Produk::create([
                        'kodeproduk'     => $kodeproduk,
                        'nama'           => strtoupper($faker->word . ' ' . $faker->colorName),
                        'berat'          => $faker->randomFloat(1, 0.5, 10),
                        'jenisproduk_id' => $faker->randomElement($jenisProdukIds),
                        'karat_id'       => $selectedHarga->karat_id,
                        'jeniskarat_id'  => $selectedHarga->jeniskarat_id,
                        'lingkar'        => $faker->numberBetween(10, 30),
                        'panjang'        => $faker->numberBetween(15, 60),
                        'harga_id'       => $selectedHarga->id,
                        'hargabeli'      => $selectedHarga->harga - 50000,
                        'keterangan'     => 'STOK SEEDER ' . strtoupper($faker->bothify('??-####')),
                        'kondisi_id'     => $faker->randomElement($kondisiIds),
                        'image'          => null, // Sesuai permintaan
                        'status'         => 1,
                        'oleh'           => 1,
                    ]);
                });
            } catch (Exception $e) {
                $this->command->error("Gagal saat seeding produk ke-$i: " . $e->getMessage());
            }
        }

        $this->command->info("100 Produk berhasil di-seed!");
    }
}
