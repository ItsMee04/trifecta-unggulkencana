<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     * * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $menu
     * @param  string  $action
     */
    public function handle(Request $request, Closure $next, string $menu, string $action): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Cek matriks permission
        $hasPermission = DB::table('permission')
            ->where('role_id', $user->role_id)
            ->where('menu', $menu)
            ->where($action, 1)
            ->exists();

        if (!$hasPermission) {
            return response()->json(['message' => 'Access Denied. Anda tidak memiliki akses untuk aksi ini.'], 403);
        }

        return $next($request);
    }
}
