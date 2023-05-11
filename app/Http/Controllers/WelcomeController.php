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


        // Gunluk sorulari yenile
        $last_attempt_creaeted_date = DailyAttemptModel::where('user_id', '=',  (string) $id_key)->value('created_at')->format('Y-m-d'); 
        $current_time = time();
        $current_date = date("Y-m-d", $current_time);
        if($current_date > $last_attempt_creaeted_date) {
            DailyAttemptModel::where('user_id', '=',  (string) $id_key)->update([
                'attempt_count' => 0,
                'correct' => 0,
                'wrong' => 0,
                'points' => 0
            ]);
        }
        

        // Language
        $language_session = Session::has('language');
        if(!$language_session) {
            session()->put('language', 'fa');
            $language = 'fa';
        }else{
            $language = session()->get('language'); 
        }

        // question answered today 
        $daily_attempt = DailyAttemptModel::where('user_id', '=',  (string) $id_key);
        if(!$daily_attempt->exists()) {
            DailyAttemptModel::create([
                'user_id' => $id_key,
                'attempt_count' => 0,
                'correct' => 0,
                'wrong' => 0,
                'points' => 0
            ]);
            $questions_answered_today = 0;
        } else {
            $questions_answered_today = DailyAttemptModel::where('user_id', '=',  (string) $id_key)->value('attempt_count');
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
