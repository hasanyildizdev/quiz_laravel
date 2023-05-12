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
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    // Attempts
    public function create_attempts_func() {
        $user_id = Auth::id();
        $attempts_session = session()->get('attempts',[]);
        $attempts_count = count($attempts_session);
        if($attempts_count > 0) {
            foreach($attempts_session as $attempt){
                AttemptModel::create([
                    'user_id' => $user_id,
                    'question_id' => $attempt['question_id'],
                    'point' => $attempt['point']
                ]);
            }
        }
        // Attempts ayni varsa eskisini sil 
        $attempts = AttemptModel::where('user_id', $user_id );
        if($attempts) {
            $attempts_sorted = $attempts->orderBy('created_at', 'desc')->get()->groupBy('question_id');
            foreach( $attempts_sorted as $questionId => $groupedAttempts) {
                $latestAttempt = $groupedAttempts->shift(); // revove and return first element of array
                foreach ($groupedAttempts as $attempt) {
                    $attempt->delete();
                }
            }
        }
        return true;
    }

    // Daily Attempt Create
    public function create_daily_attempts_func() {
        $user_id = Auth::id();
        DailyAttemptModel::create([
            'user_id' => $user_id,
            'attempt_count' => session()->get('attempt_count'),
            'correct' =>session()->get('correct'),
            'wrong' => session()->get('wrong'),
            'points' => session()->get('points')
        ]);
        // Daily Attempt ayni varsa sil
        $dailyAttempts = DailyAttemptModel::where('user_id', $user_id)->orderBy('created_at','desc')->get()->groupBy('user_id');
        foreach( $dailyAttempts as $questionId => $groupedAttempts){
            $latestAttempt = $groupedAttempts->shift(); // revove and return first element of array
            foreach ($groupedAttempts as $attempt) {
                $attempt->delete();
            }
        }
        return true;
    }

    // Daily Attempt Update
    public function update_daily_attempt_func() {
        $user_id = Auth::id();
        DailyAttemptModel::where('user_id', $user_id)->update([
            'attempt_count' => session()->get('attempt_count'),
            'correct' =>session()->get('correct'),
            'wrong' => session()->get('wrong'),
            'points' => session()->get('points')
        ]);
        return true;
    }

    /* Score kaydet */
    public function create_score_func() {
        $user_id = Auth::id();
        $totalPoints = session()->get('total_score') ? session()->get('total_score') : 0;
        $user_score = ScoresModel::where('user_id', $user_id)->first();
        if($user_score){
            $user_score->score = $totalPoints;
            $user_score->save();
        } else {
            $user_name = Auth::user()->name;
            ScoresModel::create([
                'user_id' => $user_id,
                'user_name' => $user_name,
                'score' => $totalPoints
            ]);
        }
        return true;
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        
        if ( Auth::check() ) {
            $user_id = Auth::id();
            
            $daily_attempt = DailyAttemptModel::where('user_id', $user_id);
            if( !$daily_attempt->exists() ) {
                $this->create_attempts_func();
                $this->create_daily_attempts_func();
                $this->create_score_func();
            } else {
                $last_attempt_updated_date = $daily_attempt->value('updated_at') ? $daily_attempt->value('updated_at')->format('Y-m-d') : "2020-01-01" ; 
                $current_date = date("Y-m-d", time());
                if( $current_date > $last_attempt_updated_date ){
                    $this->create_attempts_func();
                    $this->update_daily_attempt_func();
                    $this->create_score_func();
                }
            }
        }

        $request->session()->regenerate();
        return redirect()->intended(RouteServiceProvider::HOME);
    }

    public function destroy(Request $request): RedirectResponse
    {
        // Oturum kapattiginda
        if (Auth::check()) {
            $user_id = Auth::id();

            // Attemptleri session'a aktar
            $attempts = AttemptModel::where('user_id', $user_id )->get()->toArray();
            if( count($attempts) > 0) {
                session()->forget('attempts');              
            }
            
            // Daily Attempt session'a aktar
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
        $attempt_count = session()->get('attempt_count');
        $wrong = session()->get('wrong');
        $correct = session()->get('correct');
        $points = session()->get('points');
        $updated_at = session()->get('updated_at');

        $music_status = session()->get('music_active');
        $language = session()->get('language');

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        session()->put('total_score', $total_score ? $total_score : 0 );
        session()->put('attempt_count', $attempt_count ? $attempt_count : 0 );
        session()->put('wrong', $wrong ? $wrong : 0 );
        session()->put('correct', $correct ? $correct : 0 );
        session()->put('points', $points ? $points : 0 );
        session()->put('updated_at', $updated_at ? $updated_at : 0 );
        session()->put('attempts',$attempts);

        session()->put('music_active', $music_status ? $music_status : true );
        session()->put('language', $language ? $language : 'fa' );

        return redirect('/');
    }
}
