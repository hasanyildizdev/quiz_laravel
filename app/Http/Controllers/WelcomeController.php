<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\ScoresModel;
use App\Http\Resources\ScoresResource;
class WelcomeController extends Controller
{
    public function index(Request $request)
    {

        $scores = ScoresResource::collection(ScoresModel::orderByDesc('score')->take(10)->get());

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'scores' => $scores
        ]);
    }
}
