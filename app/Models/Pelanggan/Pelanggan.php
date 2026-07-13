<?php

namespace App\Models\Pelanggan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
    use HasFactory;
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    protected $table = 'pelanggan';
    protected $fillable = [
        'kode',
        'nama',
        'kontak',
        'alamat',
        'poin',
        'tanggal',
        'status'
    ];
}
