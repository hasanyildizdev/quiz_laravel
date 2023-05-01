<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ScoresModel;
use App\Http\Resources\ScoresResource;
use Illuminate\Support\Facades\Auth;

class MyProfileController extends Controller
{
    public function index()
    {   
        $total_score = 0;
        $record = ScoresModel::where('user_id', Auth::id())->first();
        if ($record) {
          $total_score = $record->score;
        }         

        return Inertia::render('Quiz/MyProfile', [
            'total_score' => $total_score,
            'user' => Auth::user()
        ]);
    }
}
