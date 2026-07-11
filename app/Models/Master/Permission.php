<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;
    protected $table = 'permission';
    protected $fillable = ['role_id', 'menu', 'read', 'create', 'update', 'delete'];

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
}
