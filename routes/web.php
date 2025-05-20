<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UrlShortenerController;
use App\Http\Controllers\ClickController;

// Redirect root to React app
Route::get('/', function () {
    return view('app');
});

// Auth routes - harus di atas route redirect
Route::get('/login', function () {
    return view('app');
})->name('login');

Route::get('/register', function () {
    return view('app');
})->name('register');

// Dashboard route - harus di atas route redirect
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

// API Routes
Route::prefix('api')->group(function () {
    // Auth routes
    Route::post('/login', [App\Http\Controllers\Auth\LoginController::class, 'login']);
    Route::post('/register', [App\Http\Controllers\Auth\RegisterController::class, 'register']);
    Route::post('/logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [App\Http\Controllers\Auth\LoginController::class, 'me'])->middleware('auth:sanctum');

    // URL Shortener routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/short-urls', [UrlShortenerController::class, 'index']);
        Route::post('/short-urls', [UrlShortenerController::class, 'store']);
        Route::put('/short-urls/{id}', [UrlShortenerController::class, 'update']);
        Route::delete('/short-urls/{id}', [UrlShortenerController::class, 'destroy']);
    });
});

// Short URL redirect route
Route::get('/{code}', [UrlShortenerController::class, 'redirect'])
    ->where('code', '[a-zA-Z0-9]+')
    ->name('redirect');

// Handle all other routes through React
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');

// Fallback route untuk menangani URL yang tidak valid
Route::fallback(function () {
    return response()->json([
        'status' => 'error',
        'message' => 'URL tidak ditemukan'
    ], 404);
});


