<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\ScoresModel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\DailyAttemptModel;

class ResultController extends Controller
{
    public function index()
    {           

        // id atama
        if (Auth::check()) {
            $id_key = Auth::id();
        } else {
            $id_key = session()->get('user_session_id');
            if (!$id_key) {
                $id_key = Str::random(40);                
                session()->put('user_session_id', $id_key);
            }
        } 

        $wrong = DailyAttemptModel::where('user_id', $id_key)->value('wrong');
        $correct = DailyAttemptModel::where('user_id', $id_key)->value('correct');
        $points =  DailyAttemptModel::where('user_id', $id_key)->value('points');
        $noanswer = 7 - ($correct + $wrong);         
        $total_score = ScoresModel::where('user_id', $id_key)->value('score');
        
        $language = session()->get('language');
        return Inertia::render('Quiz/Result', [
            'language' => $language,
            'total_score' =>  $total_score,
            'correct' => $correct,
            'wrong' => $wrong,
            'noanswer' => $noanswer,
            'points' => $points
        ]);
    }

}
