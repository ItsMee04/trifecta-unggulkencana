<?php

namespace App\Models\Produk;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Karat extends Model
{
    use HasFactory;
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    protected $table = 'karat';
    protected $fillable = ['karat', 'status'];

    /**
     * Get all of the jeniskarat for the Karat
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function jeniskarat(): HasMany
    {
        return $this->hasMany(JenisKarat::class, 'karat_id', 'id');
    }
}
