<?php

namespace App\Services\Authentication;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthenticationService
{
    /**
     * Memproses logika login, enkripsi token, dan mapping hak akses
     */
    public function login(string $email, string $password): array
    {
        // 1. Cari User beserta relasinya
        $user = User::with(['pegawai', 'role.permissions'])
            ->where('email', $email)
            ->first();

        // 2. Validasi kecocokan user & password
        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password yang Anda masukkan salah.'],
            ]);
        }

        // 3. Buat Token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Strukturkan ulang Permissions (Key-Value) untuk kebutuhan Sidebar di Vue
        $menuPermissions = [];
        if ($user->role && $user->role->permissions) {
            foreach ($user->role->permissions as $perm) {
                $menuPermissions[$perm->menu] = [
                    'read'   => (int)$perm->read,
                    'create' => (int)$perm->create,
                    'update' => (int)$perm->update,
                    'delete' => (int)$perm->delete,
                ];
            }
        }

        // 5. Kembalikan data yang sudah matang
        return [
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user' => [
                'id'         => $user->id,
                'username'   => $user->username,
                'email'      => $user->email,
                'role_name'  => $user->role->role ?? 'No Role',
                'nama'       => $user->pegawai->nama ?? $user->username,
                'avatar'     => $user->pegawai->image ?? null,
                'permissions'=> $menuPermissions
            ]
        ];
    }

    /**
     * Memproses logout dengan menghapus token aktif
     */
    public function logout(User $user): bool
    {
        if ($user) {
            $user->currentAccessToken()->delete();
            return true;
        }
        return false;
    }
}
