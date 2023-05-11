<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Session;
use App\Models\DailyAttemptModel;
use App\Models\AttemptModel;
use App\Models\ScoresModel;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        
        // Kullanici oturum actiginda id'leri degistir(session varsa)
        if (Auth::check()) {
            $user_id = Auth::id();
                    
            // Session to Question attempts varsa ekle
            $attempts = session()->get('attempts',[]);
            $attempts_count = count($attempts);
            if($attempts_count > 0) {
                foreach($attempts as $attempt){
                    AttemptModel::create([
                        'user_id' => $user_id,
                        'question_id' => $attempt['question_id'],
                        'point' => $attempt['point']
                    ]);
                }
            }
            
            //Question Attempt id degistir ayni attemptler varsa eskisini sil 
            $attempts = AttemptModel::where('user_id', $user_id )->orderBy('created_at', 'desc')->get()->groupBy('question_id');
            foreach( $attempts as $questionId => $groupedAttempts){
                $latestAttempt = $groupedAttempts->shift(); // revove and return first element of array
                foreach ($groupedAttempts as $attempt) {
                    $attempt->delete();
                }
            }

            // Daily Attempts
            $daily_attempt = DailyAttemptModel::where('user_id', $user_id);
            if( !$daily_attempt) {
                DailyAttemptModel::create([
                    'user_id' => $user_id,
                    'attempt_count' => session()->get('attempt_count'),
                    'correct' =>session()->get('correct'),
                    'wrong' => session()->get('wrong'),
                    'points' => session()->get('points')
                ]);
                // Daily Attempt id degistir
                $dailyAttempts = DailyAttemptModel::where('user_id', $user_id)->orderBy('created_at','desc')->get()->groupBy('user_id');
                foreach( $dailyAttempts as $questionId => $groupedAttempts){
                    $latestAttempt = $groupedAttempts->shift(); // revove and return first element of array
                    foreach ($groupedAttempts as $attempt) {
                        $attempt->delete();
                    }
                }
            } else {
                $last_attempt_updated_date = $daily_attempt->value('updated_at')->format('Y-m-d'); 
                $current_date = date("Y-m-d", time());
                if( $current_date > $last_attempt_updated_date ){
                    DailyAttemptModel::update([
                        'user_id' => $user_id,
                        'attempt_count' => session()->get('attempt_count'),
                        'correct' =>session()->get('correct'),
                        'wrong' => session()->get('wrong'),
                        'points' => session()->get('points')
                    ]);
                }
            } 

            /* Total points */
            $attempts = AttemptModel::where('user_id', $user_id)->get();
            if($attempts) {
                $totalPoints = $attempts->sum('point');
            } else{
                $totalPoints = session()->get('total_score');
            }

            /* Score kaydet */
            $user_score = ScoresModel::where('user_id', $user_id)->first();
            if($total_score_session > 0){
                if($user_score){
                    $user_score->score = $totalPoints;
                    $user_score->save();
                } else {
                    $user_name = Auth::user()->name;
                    ScoreModel::create([
                        'user_id' => $user_id,
                        'user_name' => $user_name,
                        'score' => $totalPoints
                    ]);
                }
            }
        }

        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {

        // Kullanici oturum kapattiginda dailyAttempts id'leri degistir(session varsa)
        if (Auth::check()) {
            $user_id = Auth::id();

            // Attempt id degistir ayni attemptler varsa eskisini sil 
            $attempts = AttemptModel::where('user_id', $user_id )->get()->toArray();
            if( count($attempts) > 0) {
                session()->forget('attempts');
                session()->put('attempts',$attempts);
            }
            
            // Daily Attempt id degistir
            $daily_attempt = DailyAttemptModel::where('user_id', $user_id );
            if($daily_attempt){
                $attempt_count = $daily_attempt->value('attempt_count');
                $wrong = $daily_attempt->value('wrong');
                $correct = $daily_attempt->value('correct');
                $points = $daily_attempt->value('points');
                session()->put('attempt_count', $attempt_count);
                session()->put('wrong', $wrong);
                session()->put('correct', $correct);
                session()->put('points', $points);
            }   
        }
    
        $total_score = session()->get('total_score');
        $music_status = session()->get('music_active');
        $language = session()->get('language');

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        session()->put('total_score', $total_score ? $total_score : 0 );
        session()->put('music_active', $music_status ? $music_status : true );
        session()->put('language', $language ? $language : 'fa' );

        return redirect('/');
    }
}
