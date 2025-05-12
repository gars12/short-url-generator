<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UrlShortenerController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/shorten', [UrlShortenerController::class, 'shorten']);

Route::post('/short-url', [UrlShortenerController::class, 'store']);
