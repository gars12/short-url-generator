<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UrlShortenerController;
use App\Http\Controllers\ClickController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth routes - NONAKTIF KARENA SUDAH TERDEFINISI DI ROUTES/WEB.PHP
// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Route::get('/me', [AuthController::class, 'me']);
    // Route::post('/logout', [AuthController::class, 'logout']);
    
    // URL Shortener routes
    Route::get('/short-urls', [UrlShortenerController::class, 'index']);
    Route::post('/short-urls', [UrlShortenerController::class, 'store']);
    Route::put('/short-urls/{id}', [UrlShortenerController::class, 'update']);
    Route::delete('/short-urls/{id}', [UrlShortenerController::class, 'destroy']);
    
    // URL management routes
    Route::prefix('urls')->group(function () {
        Route::get('/', [UrlShortenerController::class, 'index']);
        Route::get('/paginate', [UrlShortenerController::class, 'paginate']);
        Route::get('/search', [UrlShortenerController::class, 'search']);
        Route::get('/{id}', [UrlShortenerController::class, 'show']);
        Route::put('/{id}', [UrlShortenerController::class, 'update']);
        Route::delete('/{id}', [UrlShortenerController::class, 'destroy']);
        Route::patch('/{id}/restore', [UrlShortenerController::class, 'restore']);
        
        // Click tracking routes
        Route::get('/{id}/click', [ClickController::class, 'getClickCount']);
        Route::post('/{id}/click', [ClickController::class, 'updateClickCount']);
    });
});

// Public route for URL redirection
Route::get('/{code}', [UrlShortenerController::class, 'redirect']);

