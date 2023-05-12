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
            $daily_attempt = DailyAttemptModel::where('user_id', $id_key);
            $wrong = $daily_attempt->value('wrong');
            $correct = $daily_attempt->value('correct');
            $points =  $daily_attempt->value('points'); 
            $total_score = ScoresModel::where('user_id', $id_key)->value('score');
        } else {
            $wrong = session()->get('wrong');
            $correct = session()->get('correct');
            $points = session()->get('points');
            $total_score = session()->get('total_score');  
        } 
/*      $attempts = AttemptModel::where('user_id', $user_id)->get();
        if($attempts) { $totalPoints = $attempts->sum('point'); }  */
         
        $noanswer = 7 - ($correct + $wrong);       
        $language = session()->get('language') ? session()->get('language') : 'fa';

        return Inertia::render('Quiz/Result', [
            'user' => Auth::user() ? Auth::user() : null,
            'language' => $language,
            'total_score' =>  $total_score,
            'correct' => $correct,
            'wrong' => $wrong,
            'noanswer' => $noanswer,
            'points' => $points
        ]);
    }

}
