<?php

namespace App\Models\Pelanggan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suplier extends Model
{
    use HasFactory;
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    protected $table = 'suplier';
    protected $fillable = [
        'kode',
        'nama',
        'kontak',
        'alamat',
        'status'
    ];
}
