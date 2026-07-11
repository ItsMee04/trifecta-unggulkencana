<?php

use App\Http\Controllers\Authentication\AuthenticationController;
use App\Http\Controllers\Master\JabatanController;
use App\Http\Controllers\Master\PegawaiController;
use App\Http\Controllers\Master\PermissionController;
use App\Http\Controllers\Master\RoleController;
use App\Http\Controllers\Master\UserController;
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
            Route::get('/', [JabatanController::class, 'getJabatan']);
            Route::post('store', [JabatanController::class, 'storeJabatan']);
            Route::post('update', [JabatanController::class, 'updateJabatan']);
            Route::post('delete', [JabatanController::class, 'deleteJabatan']);
        });

        Route::prefix('pegawai')->group(function () {
            Route::get('/', [PegawaiController::class, 'getPegawai']);
            Route::post('store', [PegawaiController::class, 'storePegawai']);
            Route::post('update', [PegawaiController::class, 'updatePegawai']);
            Route::post('delete', [PegawaiController::class, 'deletePegawai']);
        });

        Route::prefix('role')->group(function () {
            Route::get('/', [RoleController::class, 'getRole']);
            Route::post('store', [RoleController::class, 'storeRole']);
            Route::post('update', [RoleController::class, 'updateRole']);
            Route::post('delete', [RoleController::class, 'deleteRole']);
        });

        Route::prefix('user')->group(function () {
            Route::get('/', [UserController::class, 'getUser']);
            Route::post('store', [UserController::class, 'storeUser']);
            Route::post('update', [UserController::class, 'updateUser']);
            Route::post('delete', [UserController::class, 'deleteUser']);
        });

        Route::prefix('permission')->group(function () {
            Route::post('/', [PermissionController::class, 'getPermission']);
            Route::post('update', [PermissionController::class, 'updatePermission']);
        });

    });

    Route::prefix('produk')->group(function () {

        Route::prefix('kondisi')->group(function () {
            Route::get('/', [KondisiController::class, 'getKondisi']);
            Route::post('store', [KondisiController::class, 'storeKondisi']);
            Route::post('update', [KondisiController::class, 'updateKondisi']);
            Route::post('delete', [KondisiController::class, 'deleteKondisi']);
        });

        Route::prefix('karat')->group(function () {
            Route::get('/', [KaratController::class, 'getKarat']);
            Route::post('store', [KaratController::class, 'storeKarat']);
            Route::post('update', [KaratController::class, 'updateKarat']);
            Route::post('delete', [KaratController::class, 'deleteKarat']);
        });

    });
});
