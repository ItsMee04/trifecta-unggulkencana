<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Master\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function getUser()
    {
        $data = $this->userService->getUserAktif();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Data user tidak ditemukan',
                'data' => $data
            ], 200);
        }

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Data user berhasil ditemukan',
            'data' => $data
        ], 200);
    }

    /**
     * Controller: Update User dengan Validasi Kondisional
     */
    public function updateUser(Request $request)
    {
        // 1. Cek apakah ID dikirim dan User-nya ada
        $user = User::find($request->id);
        if (!$user) {
            return response()->json([
                'status'  => '404',
                'success' => false,
                'message' => 'Data user tidak ditemukan',
                'data'    => []
            ], 200);
        }

        // 2. Tentukan status kelengkapan akun saat ini
        $hasEmail = !empty($user->email);
        $hasPassword = !empty($user->password);

        // 3. Susun aturan validasi dinamis berdasarkan kondisi akun
        $rules = [
            'role_id' => 'nullable|exists:role,id',
        ];

        if (!$hasEmail || !$hasPassword) {
            // Kondisi Awal: Belum aktivasi (Email/Password masih kosong di DB) -> Wajib Diisi
            $rules['email'] = 'required|email|unique:users,email,' . $user->id;
            $rules['password'] = 'required|string|min:6';
        } else {
            // Kondisi Lanjutan: Sudah aktivasi -> Opsional untuk diubah
            if ($request->filled('email') && $request->email !== $user->email) {
                $rules['email'] = 'required|email|unique:users,email,' . $user->id;
            }

            if ($request->filled('password')) {
                // Proteksi: Cek apakah password baru sama dengan password lama
                if (Hash::check($request->password, $user->password)) {
                    return response()->json([
                        'status'  => '400',
                        'success' => false,
                        'message' => 'Password baru tidak boleh sama dengan password lama',
                        'data'    => []
                    ], 400);
                }
                $rules['password'] = 'required|string|min:6';
            }
        }

        // 4. Jalankan Validasi yang sudah disusun
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 5. Mapping data yang aman untuk dikirim ke Service (Bukan Request All)
        $payload = [];
        if ($request->has('email')) $payload['email'] = $request->email;
        if ($request->filled('password')) $payload['password'] = $request->password;
        if ($request->has('role_id')) $payload['role_id'] = $request->role_id;

        try {
            // 6. Eksekusi perubahan ke Service
            $updatedUser = $this->userService->updateUser($user->id, $payload);

            return response()->json([
                'status'  => '200',
                'success' => true,
                'message' => 'Data user berhasil diupdate',
                'data'    => $updatedUser
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Controller: Delete User
     */
    public function deleteUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validasi ID gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $result = $this->userService->deleteUser($request->id);

            if (!$result) {
                return response()->json([
                    'status'  => '404',
                    'success' => false,
                    'message' => 'Data user tidak ditemukan'
                ], 200);
            }

            return response()->json([
                'status'  => '200',
                'success' => true,
                'message' => 'User dan pegawai terkait berhasil dinonaktifkan'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }
}
