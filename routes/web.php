<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GameController;
use App\Http\Controllers\Result;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/quiz', [GameController::class, 'index'])->name('quiz.index');
Route::post('/admin/store', [AdminController::class, 'store'])->name('admin.store');
Route::post('/admin/delete', [AdminController::class, 'delete'])->name('admin.delete');
Route::post('/admin/delete_user', [AdminController::class, 'delete_user'])->name('admin.delete_user');
Route::get('/result', [Result::class, 'index'])->name('result.index');
Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
