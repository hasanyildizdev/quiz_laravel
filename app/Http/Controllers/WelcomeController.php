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
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Session;
use App\Models\DailyAttemptModel;
use Illuminate\Support\Str;

class WelcomeController extends Controller
{


    public function index(Request $request)
    {     
        
/*         $attempts = count(session()->get('attempts', []));*/
        /* dd(session()->get('updated_at'));  */ 
        // Language
        $language_session = Session::has('language');
        if(!$language_session) {
            session()->put('language', 'fa');
            $language = 'fa';
        }else{
            $language = session()->get('language'); 
        }


        // Gunluk sorulari yenile
        if( Auth::check() ) {
            $user_id = Auth::id();
            $daily_attempt = DailyAttemptModel::where('user_id', $user_id);
            if($daily_attempt){
                $last_attempt_updated_date = $daily_attempt->value('updated_at')->format('Y-m-d'); 
                $current_date = date("Y-m-d", time());
                if($current_date > $last_attempt_updated_date) {
                    DailyAttemptModel::where('user_id', $user_id)->update([
                        'attempt_count' => 0,
                        'correct' => 0,
                        'wrong' => 0,
                        'points' => 0
                    ]);
                }
            }
        } else{
            $last_attempt_updated_date = session()->get('updated_at');
            $current_date = date("Y-m-d", time());
            if($current_date > $last_attempt_updated_date ){
                session()->put('attempt_count',0);
                session()->put('correct',0);
                session()->put('wrong',0);
                session()->put('points',0);
            }
        } 
        
        // question answered today 
        if( Auth::check() ) {
            $user_id = Auth::id();
            $daily_attempt = DailyAttemptModel::where('user_id', $user_id);
            if( $daily_attempt->exists()) {
                $questions_answered_today = $daily_attempt->value('attempt_count');
            } else{
                $questions_answered_today = 0;
            }
        } else if(session()->get('attempt_count')) {
            $questions_answered_today = session()->get('attempt_count');
        } else {
            $questions_answered_today = 0;
        }

        
        $remain_question_count =  7 - $questions_answered_today;
        $scores = ScoresResource::collection(ScoresModel::orderByDesc('score')->take(10)->get());
        return Inertia::render('Welcome', [
            'scores' => $scores,
            'user' => Auth::user() ? Auth::user() : null,
            'language' => $language,
            'remain_question_count' => $remain_question_count 
        ]);
    }



    public function set_language(Request $request) {
        session()->put('language', $request->language);
        return response()->json(['message' => 'Language changed successfully']); 
    }

    public function get_language() {
        return response()->json(session()->get('language')); 
    }
}
