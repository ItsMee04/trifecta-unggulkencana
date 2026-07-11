<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Services\Master\PermissionService;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    public function getPermission(Request $request)
    {
        $validatedData = $request->validate([
            'id' => 'required|integer|exists:role,id'
        ]);

        try {
            // 2. Eksekusi service delete
            $result = $this->permissionService->getPermission($validatedData['id']);

            if (!$result) {
                return response()->json([
                    'status'  => '404',
                    'success' => false,
                    'message' => 'Data hak akses tidak ditemukan'
                ], 200);
            }

            return response()->json([
                'status'  => '200',
                'success' => true,
                'message' => 'Data hak akses berhasil ditemukan',
                'data'    => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updatePermission(Request $request)
    {
        // Validasi disesuaikan untuk menerima array batch permissions
        $request->validate([
            'role_id'              => 'required|integer|exists:role,id', // pastikan nama tabel role sesuai
            'permissions'          => 'required|array',
            'permissions.*.menu'   => 'required|string|max:100',
            'permissions.*.read'   => 'nullable|integer|in:0,1',
            'permissions.*.create' => 'nullable|integer|in:0,1',
            'permissions.*.update' => 'nullable|integer|in:0,1',
            'permissions.*.delete' => 'nullable|integer|in:0,1',
        ]);

        try {
            // Oper langsung seluruh data ke Service
            $this->permissionService->updateBulkPermissions(
                $request->role_id,
                $request->permissions
            );

            return response()->json([
                'success' => true,
                'message' => 'Izin berhasil diperbarui'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
