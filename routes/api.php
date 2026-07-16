<?php

use App\Http\Controllers\Authentication\AuthenticationController;
use App\Http\Controllers\Keuangan\MutasiSaldoController;
use App\Http\Controllers\Keuangan\SaldoController;
use App\Http\Controllers\Master\JabatanController;
use App\Http\Controllers\Master\PegawaiController;
use App\Http\Controllers\Master\PermissionController;
use App\Http\Controllers\Master\RoleController;
use App\Http\Controllers\Master\UserController;
use App\Http\Controllers\Nampan\NampanController;
use App\Http\Controllers\Nampan\NampanProdukController;
use App\Http\Controllers\Pelanggan\PelangganController;
use App\Http\Controllers\Pelanggan\PesanController;
use App\Http\Controllers\Pelanggan\SuplierController;
use App\Http\Controllers\Produk\DiskonController;
use App\Http\Controllers\Produk\HargaController;
use App\Http\Controllers\Produk\JenisKaratController;
use App\Http\Controllers\Produk\JenisProdukController;
use App\Http\Controllers\Produk\KaratController;
use App\Http\Controllers\Produk\KondisiController;
use App\Http\Controllers\Produk\ProdukController;
use App\Http\Controllers\Transaksi\TransaksiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (Bisa diakses tanpa login)
|--------------------------------------------------------------------------
*/

Route::post('login', [AuthenticationController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Wajib membawa Token Sanctum yang valid)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Route untuk logout
    Route::post('logout', [AuthenticationController::class, 'logout']);

    // Grup Route Master Data (Sekarang aman di dalam middleware)
    Route::prefix('master')->group(function () {

        Route::prefix('jabatan')->group(function () {
            Route::get('/', [JabatanController::class, 'getJabatan'])->middleware('check_permission:jabatan,read');
            Route::post('store', [JabatanController::class, 'storeJabatan'])->middleware('check_permission:jabatan,create');
            Route::post('update', [JabatanController::class, 'updateJabatan'])->middleware('check_permission:jabatan,update');
            Route::post('delete', [JabatanController::class, 'deleteJabatan'])->middleware('check_permission:jabatan,delete');
        });

        Route::prefix('pegawai')->group(function () {
            Route::get('/', [PegawaiController::class, 'getPegawai'])->middleware('check_permission:pegawai,read');
            Route::post('store', [PegawaiController::class, 'storePegawai'])->middleware('check_permission:pegawai,create');
            Route::post('update', [PegawaiController::class, 'updatePegawai'])->middleware('check_permission:pegawai,update');
            Route::post('delete', [PegawaiController::class, 'deletePegawai'])->middleware('check_permission:jeniskarat,delete');
        });

        Route::prefix('role')->group(function () {
            Route::get('/', [RoleController::class, 'getRole'])->middleware('check_permission:role,read');
            Route::post('store', [RoleController::class, 'storeRole'])->middleware('check_permission:role,create');
            Route::post('update', [RoleController::class, 'updateRole'])->middleware('check_permission:role,update');
            Route::post('delete', [RoleController::class, 'deleteRole'])->middleware('check_permission:role,delete');
        });

        Route::prefix('user')->group(function () {
            Route::get('/', [UserController::class, 'getUser'])->middleware('check_permission:users,read');
            Route::post('store', [UserController::class, 'storeUser'])->middleware('check_permission:users,create');
            Route::post('update', [UserController::class, 'updateUser'])->middleware('check_permission:users,update');
            Route::post('delete', [UserController::class, 'deleteUser'])->middleware('check_permission:users,delete');
        });

        Route::prefix('permission')->group(function () {
            Route::post('/', [PermissionController::class, 'getPermission']);
            Route::post('update', [PermissionController::class, 'updatePermission']);
        });
    });

    Route::prefix('produk')->group(function () {

        Route::prefix('kondisi')->group(function () {
            Route::get('/', [KondisiController::class, 'getKondisi'])->middleware('check_permission:kondisi,read');
            Route::post('store', [KondisiController::class, 'storeKondisi'])->middleware('check_permission:kondisi,create');
            Route::post('update', [KondisiController::class, 'updateKondisi'])->middleware('check_permission:kondisi,update');
            Route::post('delete', [KondisiController::class, 'deleteKondisi'])->middleware('check_permission:kondisi,delete');
        });

        Route::prefix('karat')->group(function () {
            Route::get('/', [KaratController::class, 'getKarat'])->middleware('check_permission:karat,read');
            Route::post('store', [KaratController::class, 'storeKarat'])->middleware('check_permission:karat,create');
            Route::post('update', [KaratController::class, 'updateKarat'])->middleware('check_permission:karat,update');
            Route::post('delete', [KaratController::class, 'deleteKarat'])->middleware('check_permission:karat,delete');
        });

        Route::prefix('jeniskarat')->group(function () {
            Route::get('/', [JenisKaratController::class, 'getJenisKarat'])->middleware('check_permission:jeniskarat,read');
            Route::post('store', [JenisKaratController::class, 'storeJenisKarat'])->middleware('check_permission:jeniskarat,create');
            Route::post('update', [JenisKaratController::class, 'updateJenisKarat'])->middleware('check_permission:jeniskarat,update');
            Route::post('delete', [JenisKaratController::class, 'deleteJenisKarat'])->middleware('check_permission:jeniskarat,delete');
        });

        Route::prefix('harga')->group(function () {
            Route::get('/', [HargaController::class, 'getHarga'])->middleware('check_permission:harga,read');
            Route::post('store', [HargaController::class, 'storeHarga'])->middleware('check_permission:harga,create');
            Route::post('update', [HargaController::class, 'updateHarga'])->middleware('check_permission:harga,update');
            Route::post('delete', [HargaController::class, 'deleteHarga'])->middleware('check_permission:harga,delete');
        });

        Route::prefix('diskon')->group(function () {
            Route::get('/', [DiskonController::class, 'getDiskon'])->middleware('check_permission:diskon,read');
            Route::post('store', [DiskonController::class, 'storeDiskon'])->middleware('check_permission:diskon,create');
            Route::post('update', [DiskonController::class, 'updateDiskon'])->middleware('check_permission:diskon,update');
            Route::post('delete', [DiskonController::class, 'deleteDiskon'])->middleware('check_permission:diskon,delete');
        });

        Route::prefix('jenisproduk')->group(function () {
            Route::get('/', [JenisProdukController::class, 'getJenisProduk'])->middleware('check_permission:jenisproduk,read');
            Route::post('store', [JenisProdukController::class, 'storeJenisProduk'])->middleware('check_permission:jenisproduk,create');
            Route::post('update', [JenisProdukController::class, 'updateJenisProduk'])->middleware('check_permission:jenisproduk,update');
            Route::post('delete', [JenisProdukController::class, 'deleteJenisProduk'])->middleware('check_permission:jenisproduk,delete');
        });

        Route::prefix('produk')->group(function () {
            Route::get('/', [ProdukController::class, 'getProduk'])->middleware('check_permission:produk,read');
            Route::post('store', [ProdukController::class, 'storeProduk'])->middleware('check_permission:produk,create');
            Route::post('update', [ProdukController::class, 'updateProduk'])->middleware('check_permission:produk,update');
            Route::post('delete', [ProdukController::class, 'deleteProduk'])->middleware('check_permission:produk,delete');
        });
    });

    Route::prefix('nampan')->group(function () {

        Route::prefix('nampan')->group(function () {
            Route::get('/', [NampanController::class, 'getNampan'])->middleware('check_permission:nampan,read');
            Route::post('store', [NampanController::class, 'storeNampan'])->middleware('check_permission:nampan,create');
            Route::post('update', [NampanController::class, 'updateNampan'])->middleware('check_permission:nampan,update');
            Route::post('delete', [NampanController::class, 'deleteNampan'])->middleware('check_permission:nampan,delete');
        });

        Route::prefix('nampanproduk')->group(function () {
            Route::get('/', [NampanProdukController::class, 'getNampanProduk'])->middleware('check_permission:nampanproduk,read');
            Route::post('getNampanProdukByNampan', [NampanProdukController::class, 'getNampanProdukByNampan'])->middleware('check_permission:nampanproduk,read');
            Route::post('getProdukByJenisNampan', [NampanProdukController::class, 'getProdukByJenisNampan'])->middleware('check_permission:nampanproduk,read');
            Route::post('getProdukInNampanByJenis', [NampanProdukController::class, 'getProdukInNampanByJenis'])->middleware('check_permission:nampanproduk,read');
            Route::post('store', [NampanProdukController::class, 'storeNampanProduk'])->middleware('check_permission:nampanproduk,create');
            Route::post('update', [NampanProdukController::class, 'pindahNampanProduk'])->middleware('check_permission:nampanproduk,update');
            Route::post('delete', [NampanProdukController::class, 'deleteNampanProduk'])->middleware('check_permission:nampanproduk,delete');
        });
    });

    Route::prefix('pelanggan')->group(function () {

        Route::prefix('pelanggan')->group(function () {
            Route::get('/', [PelangganController::class, 'getPelanggan'])->middleware('check_permission:pelanggan,read');
            Route::post('store', [PelangganController::class, 'storePelanggan'])->middleware('check_permission:pelanggan,create');
            Route::post('update', [PelangganController::class, 'updatePelanggan'])->middleware('check_permission:pelanggan,update');
            Route::post('delete', [PelangganController::class, 'deletePelanggan'])->middleware('check_permission:pelanggan,delete');
        });

        Route::prefix('suplier')->group(function () {
            Route::get('/', [SuplierController::class, 'getSuplier'])->middleware('check_permission:suplier,read');
            Route::post('store', [SuplierController::class, 'storeSuplier'])->middleware('check_permission:suplier,create');
            Route::post('update', [SuplierController::class, 'updateSuplier'])->middleware('check_permission:suplier,update');
            Route::post('delete', [SuplierController::class, 'deleteSuplier'])->middleware('check_permission:suplier,delete');
        });

        Route::prefix('pesan')->group(function () {
            Route::get('/', [PesanController::class, 'getPesan'])->middleware('check_permission:pesan,read');
            Route::post('store', [PesanController::class, 'storePesan'])->middleware('check_permission:pesan,create');
            Route::post('update', [PesanController::class, 'updatePesan'])->middleware('check_permission:pesan,update');
            Route::post('delete', [PesanController::class, 'deletePesan'])->middleware('check_permission:pesan,delete');
        });
    });

    Route::prefix('keuangan')->group(function () {

        Route::prefix('saldo')->group(function () {
            Route::get('/', [SaldoController::class, 'getSaldo'])->middleware('check_permission:saldo,read');
            Route::post('store', [SaldoController::class, 'storeSaldo'])->middleware('check_permission:saldo,create');
            Route::post('update', [SaldoController::class, 'updateSaldo'])->middleware('check_permission:saldo,update');
            Route::post('delete', [SaldoController::class, 'deleteSaldo'])->middleware('check_permission:saldo,delete');
        });

        Route::prefix('mutasisaldo')->group(function () {
            Route::get('/', [MutasiSaldoController::class, 'getMutasiSaldo'])->middleware('check_permission:mutasisaldo,read');
            Route::post('store', [MutasiSaldoController::class, 'storeMutasiSaldo'])->middleware('check_permission:mutasisaldo,create');
            Route::post('update', [MutasiSaldoController::class, 'updateMutasiSaldo'])->middleware('check_permission:mutasisaldo,update');
            Route::post('delete', [MutasiSaldoController::class, 'deleteMutasiSaldo'])->middleware('check_permission:mutasisaldo,delete');
        });
    });

    Route::prefix('transaksi')->group(function () {

        Route::prefix('transaksi')->group(function () {
            Route::get('getKodeTransaksi', [TransaksiController::class, 'getKodeTransaksi'])->middleware('check_permission:transaksi,read');
            Route::post('storeProdukToTransaksiDetail', [TransaksiController::class, 'storeProdukToTransaksiDetail'])->middleware('check_permission:transaksi,create');
            Route::get('getTransaksiDetail', [TransaksiController::class, 'getTransaksiDetail'])->middleware('check_permission:transaksi,read');
            Route::post('batalTransaksiDetail', [TransaksiController::class, 'batalTransaksiDetail'])->middleware('check_permission:transaksi,update');
            Route::post('paymentTransaksi', [TransaksiController::class, 'paymentTransaksi'])->middleware('check_permission:transaksi,create');
            Route::post('getSignedNotaPenjualanUrl', [TransaksiController::class, 'getSignedNotaPenjualanUrl'])->middleware('check_permission:transaksi,read');
            Route::post('sendnotification', [TransaksiController::class, 'sendTelegramNotification'])->middleware('check_permission:transaksi,create');
        });

    });
});
