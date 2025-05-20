<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShortUrl extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Menentukan nama tabel jika berbeda dengan nama model
    protected $table = 'short_urls';

    // Kolom yang dapat diisi
    protected $fillable = [
        'user_id',
        'original_url', // Kolom untuk URL asli
        'shortened_url', // Kolom untuk URL yang sudah dipendekkan
        'click_count', // Kolom untuk menghitung jumlah klik
        'expired_at', // Kolom untuk tanggal kedaluwarsa
    ];

    // Menentukan kolom yang harus diubah menjadi tipe data timestamp
    protected $dates = [
        'created_at', 
        'updated_at',
        'expired_at',
    ];

    protected $appends = ['full_shortened_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFullShortenedUrlAttribute()
    {
        return rtrim(config('app.url'), '/') . '/' . $this->shortened_url;
    }

}
