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

    public function logout(Request $request)
    {
        try {
            $this->authService->logout($request->user());

            return response()->json([
                'success' => true,
                'message' => 'Berhasil logout dari sesi aktif.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal melakukan logout.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
