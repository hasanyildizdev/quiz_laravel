<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\ScoresModel;
use App\Http\Resources\ScoresResource;
use App\Models\AttemptModel;
use Illuminate\Support\Facades\Auth;


class WelcomeController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::check()) {
            AttemptModel::where('user_id', session('user_session_id'))->update(['user_id' => Auth::id()]);
        }

        $scores = ScoresResource::collection(ScoresModel::orderByDesc('score')->take(10)->get());

        if(Auth::check()){
            return Inertia::render('Welcome', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'laravelVersion' => Application::VERSION,
                'phpVersion' => PHP_VERSION,
                'scores' => $scores,
                'user' => Auth::user()
            ]);
        }else{
            return Inertia::render('Welcome', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'laravelVersion' => Application::VERSION,
                'phpVersion' => PHP_VERSION,
                'scores' => $scores,
            ]);
        }
    }
}
