<?php

use App\Http\Controllers\Authentication\AuthenticationController;
use App\Http\Controllers\Master\JabatanController;
use App\Http\Controllers\Master\PegawaiController;
use App\Http\Controllers\Master\PermissionController;
use App\Http\Controllers\Master\RoleController;
use App\Http\Controllers\Master\UserController;
use App\Http\Controllers\Produk\JenisKaratController;
use App\Http\Controllers\Produk\KaratController;
use App\Http\Controllers\Produk\KondisiController;
// use Illuminate\Http\Request;
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

    });
});
