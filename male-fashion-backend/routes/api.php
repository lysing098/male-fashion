<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CarouselController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/




// Auth
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('refresh', [AuthController::class, 'refresh']);
use App\Http\Controllers\Auth\SocialAuthController;

Route::get('/auth/{provider}', [SocialAuthController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback']);

// Brand

Route::resource('brand', BrandController::class);

// Category
Route::resource('category',CategoryController::class);

// Product
Route::resource('product', ProductController::class);

// Carousel
Route::resource('carousel', CarouselController::class);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:api'])->group(function () {


    // Auth
    Route::post('logout', [AuthController::class, 'logout']);

    // Brand
    // Route::get('brand', [BrandController::class, 'index']);
    Route::post('brand', [BrandController::class, 'store']);
    Route::put('brand/{id}', [BrandController::class, 'update']);
    Route::delete('brand/{id}', [BrandController::class, 'destroy']);

    // Category
    // Route::get('category', [CategoryController::class, 'index']);
    Route::post('category', [CategoryController::class, 'store']);
    Route::put('category/{id}', [CategoryController::class, 'update']);
    Route::delete('category/{id}', [CategoryController::class, 'destroy']);

    // Product
    // Route::get('product', [ProductController::class, 'index']);
    Route::post('product', [ProductController::class, 'store']);
    Route::put('product/{id}', [ProductController::class, 'update']);
    Route::delete('product/{id}', [ProductController::class, 'destroy']);


    // Carousel
    // Route::get('carousel', [CarouselController::class, 'index']);
    Route::post('carousel', [CarouselController::class, 'store']);
    Route::put('carousel/{id}', [CarouselController::class, 'update']);
    Route::delete('carousel/{id}', [CarouselController::class, 'destroy']);
});
