<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/quiz', [GameController::class, 'index'])->name('quiz.index');
Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
Route::post('/admin/store', [AdminController::class, 'store'])->name('admin.store');
Route::post('/admin/store_ad', [AdminController::class, 'store_ad'])->name('admin.store_ad');
Route::post('/admin/delete', [AdminController::class, 'delete'])->name('admin.delete');
Route::post('/admin/delete_user', [AdminController::class, 'delete_user'])->name('admin.delete_user');
Route::get('/result', [ResultController::class, 'index'])->name('result.index');
Route::post('/result/store', [ResultController::class, 'store'])->name('result.store');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
Route::post('/dashboard/store', [DashboardController::class, 'store'])->name('dashboard.store');
Route::post('/dashboard/store_ad', [DashboardController::class, 'store_ad'])->name('dashboard.store_ad');
Route::post('/dashboard/delete', [DashboardController::class, 'delete'])->name('dashboard.delete');
Route::post('/dashboard/delete_user', [DashboardController::class, 'delete_user'])->name('dashboard.delete_user');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
