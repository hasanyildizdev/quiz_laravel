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
        $questions_answered_today = DailyAttemptModel::where('user_id', $id_key)->value('attempt_count');
        if( $questions_answered_today >= 7) {
            $last_attempt_creaeted_date = DailyAttemptModel::where('user_id', $id_key)->value('created_at')->format('Y-m-d'); 
            $current_time = time();
            $current_date = date("Y-m-d", $current_time);
            if($current_date > $last_attempt_creaeted_date) {
                DailyAttemptModel::where('user_id', $id_key)->update([
                    'attempt_count' => 0,
                    'correct' => 0,
                    'wrong' => 0,
                    'points' => 0
                ]);
            }
        } 

        // Language
        $language_session = Session::has('language');
        if(!$language_session) {
            session()->put('language', 'fa');
            $language = 'fa';
        }else{
            $language = session()->get('language');
        }

        // Kullanici oturum actiginda id'leri degistir(session varsa)
        if (Auth::check() && Session::has('user_session_id')) {
            $user_id = Auth::id();

            // Attempt id degistir ayni attemptler varsa eskisini sil 
            AttemptModel::where('user_id', session()->get('user_session_id'))->update(['user_id' => $user_id]);
            $attempts = AttemptModel::where('user_id', $user_id)->orderBy('created_at', 'desc')->get()->groupBy('question_id');
            foreach( $attempts as $questionId => $groupedAttempts){
                $latestAttempt = $groupedAttempts->shift(); // revove and return first element of array
                foreach ($groupedAttempts as $attempt) {
                    $attempt->delete();
                }
            }

            // Score id degistir
            ScoresModel::where('user_id', session()->get('user_session_id'))->update(['user_id' => $user_id]);

            /* Score kaydet */
            $attempts = AttemptModel::where('user_id', $id_key)->get();
            $totalPoints = $attempts->sum('point');
            $user_name = Auth::user()->name;
            $user_score = ScoresModel::where('user_id', $id_key)->first();
            if ($user_score) {
                $user_score->score =$totalPoints;
                $user_score->save();
            } else {
                ScoresModel::create([
                    'user_id' => $id_key,
                    'user_name' => $user_name,
                    'score' => $totalPoints
                ]);
            }
            
            
            // Daily Attempt id degistir
            DailyAttemptModel::where('user_id', session()->get('user_session_id'))->update(['user_id' => $user_id]);
            $dailyAttempts = DailyAttemptModel::where('user_id', $user_id)->orderBy('created_at','desc')->get()->groupBy('user_id');
            foreach( $dailyAttempts as $questionId => $groupedAttempts){
                $latestAttempt = $groupedAttempts->shift(); // revove and return first element of array
                foreach ($groupedAttempts as $attempt) {
                    $attempt->delete();
                }
            }
        }
        
        $scores = ScoresResource::collection(ScoresModel::orderByDesc('score')->take(10)->get());
        $questions_answered_today = DailyAttemptModel::where('user_id', $id_key)->value('attempt_count');
        if( !$questions_answered_today ) {
            DailyAttemptModel::create([
                'user_id' => $id_key,
                'attempt_count' => 0,
                'correct' => 0,
                'wrong' => 0,
                'points' => 0
            ]);
            $questions_answered_today = 0;
        }
        $remain_question_count =  7 - $questions_answered_today;
        
        if(Auth::check()){
            return Inertia::render('Welcome', [
                'scores' => $scores,
                'user' => Auth::user(),
                'language' => $language,
                'remain_question_count' => $remain_question_count 
            ]);
        }else{
            return Inertia::render('Welcome', [
                'scores' => $scores,
                'language' => $language,
                'remain_question_count' => $remain_question_count 
            ]);
        }
    }

    public function set_language(Request $request) {
        session()->put('language', $request->language);
        return response()->json(['message' => 'Language changed successfully']); 
    }
}
