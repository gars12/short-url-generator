<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShortUrl;

class UrlShortenerController extends Controller
{
    public function shorten(Request $request)
    {
        // Validasi input
        $request->validate([
            'original_url' => 'required|url',  // Validasi URL asli
        ]);

        // Membuat short code secara acak (misal, 6 karakter)
        $shortCode = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 6);

        // Membuat shortened URL
        $shortenedUrl = url('/') . '/' . $shortCode;

        // Menyimpan URL asli dan URL pendek ke database
        $shortUrl = ShortUrl::create([
            'original_url' => $request->original_url,
            'shortened_url' => $shortenedUrl,
        ]);

        // Mengembalikan response JSON
        return response()->json([
            'original_url' => $shortUrl->original_url,
            'shortened_url' => $shortUrl->shortened_url,
        ]);
    }
}


