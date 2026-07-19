<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Services\Authentication\AuthenticationService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthenticationController extends Controller
{
    protected AuthenticationService $authService;

    // Inject langsung AuthenticationService ke dalam constructor
    public function __construct(AuthenticationService $authService)
    {
        $this->authService = $authService;
    }

    public function login(Request $request)
    {
        // 1. Validasi Input HTTP
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            // 2. Oper data ke Service
            $result = $this->authService->login($request->email, $request->password);

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil!',
                ...$result
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors'  => $e->errors()
            ], 421);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada sistem internal server.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function me(Request $request)
    {
        // Panggil instance service Anda, oper user yang sedang aktif ($request->user())
        $userData = $this->authService->me($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Sesi pengguna berhasil diverifikasi',
            'user'    => $userData
        ], 200);
    }

    public function logout(Request $request)
    {
        // 🌟 HAPUS $request->user() dari dalam kurung ini
        $logout = $this->authService->logout();

        if ($logout) {
            return response()->json([
                'success' => true,
                'message' => 'Berhasil logout'
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal logout, sesi tidak ditemukan'
        ], 401);
    }
}
