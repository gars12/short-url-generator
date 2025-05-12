<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UrlShortenerController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/{shortenedUrl}', [UrlShortenerController::class, 'redirect']);
Route::get('/login', function () {
    return response()->json(['message' => 'Login route not implemented yet.']);
})->name('login');