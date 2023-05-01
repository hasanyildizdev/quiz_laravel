<?php

use App\Http\Controllers\ProfileController;
use Inertia\Inertia;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\ResultsController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\QuestionsController;
use App\Http\Controllers\CongratulationsController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MyProfileController;

Route::get('/', [WelcomeController::class, 'index']);

Route::get('/quiz', [GameController::class, 'index'])->name('quiz.index');
Route::post('/quiz/attempt', [GameController::class, 'attempt'])->name('quiz.attempt');

Route::get('/result', [ResultController::class, 'index'])->name('result.index');
Route::post('/result/store', [ResultController::class, 'store'])->name('result.store');
Route::get('/results', [ResultsController::class, 'index'])->name('results.index');
Route::post('/results/delete_score', [ResultsController::class, 'delete_score'])->name('results.delete_score'); 

Route::get('/ad', [AdController::class, 'index'])->name('ad.index');
Route::post('/ad/update', [AdController::class, 'update'])->name('ad.update');

Route::get('/users', [UsersController::class, 'index'])->name('users.index');
Route::post('/users/delete_user', [UsersController::class, 'delete_user'])->name('users.delete_user'); 

Route::get('/questions', [QuestionsController::class, 'index'])->name('questions.index');
Route::post('/questions/store', [QuestionsController::class, 'store'])->name('questions.store');
Route::post('/questions/delete', [QuestionsController::class, 'delete'])->name('questions.delete');

Route::get('/congratulations', [CongratulationsController::class, 'index'])->name('congratulations.index');
Route::get('/myprofile', [MyProfileController::class, 'index'])->name('myprofile.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'show'])->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
