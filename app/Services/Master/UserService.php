<?php

namespace App\Services\Master;

use App\Models\Master\Pegawai;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getUserAktif()
    {
        $data = User::with(['pegawai', 'role'])->where('status', 1)->get();

        return $data;
    }

    /**
     * Service: Update Data User (Aman & Terfiltrasi)
     */
    public function updateUser(int $id, array $data): ?User
    {
        return DB::transaction(function () use ($id, $data) {
            $user = User::find($id);
            if (!$user) {
                return null;
            }

            // Siapkan data yang akan diupdate
            $updateData = [];

            if (isset($data['email'])) {
                $updateData['email'] = $data['email'];
            }

            if (!empty($data['password'])) {
                $updateData['password'] = Hash::make($data['password']);
            }

            if (isset($data['role_id'])) {
                $updateData['role_id'] = $data['role_id'];
            }

            // Eksekusi update jika ada data yang diubah
            if (!empty($updateData)) {
                $user->update($updateData);
            }

            return $user;
        });
    }

    /**
     * Service: Soft Delete User beserta Pegawai terkait
     */
    public function deleteUser(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $user = User::find($id);
            if (!$user) {
                return false;
            }

            // Nonaktifkan user
            $user->status = 0;
            $user->save();

            // Otomatis nonaktifkan pegawai terkait jika ada hubungan
            if ($user->pegawai_id) {
                Pegawai::where('id', $user->pegawai_id)->update(['status' => 0]);
            }

            return true;
        });
    }
}
