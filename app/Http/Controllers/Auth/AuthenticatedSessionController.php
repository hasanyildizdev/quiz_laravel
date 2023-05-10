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

        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {

        // Kullanici oturum kapattiginda dailyAttemp id'leri degistir(session varsa)
        if (Auth::check() && Session::has('user_session_id')) {
            $user_id = Auth::id();

            // Attempt id degistir ayni attemptler varsa eskisini sil 
            AttemptModel::where('user_id', $user_id )->update(['user_id' => session()->get('user_session_id')]);
            $attempts = AttemptModel::where('user_id', session()->get('user_session_id'))->orderBy('created_at', 'desc')->get()->groupBy('question_id');
            foreach( $attempts as $questionId => $groupedAttempts){
                $latestAttempt = $groupedAttempts->shift(); // revove and return first element of array
                foreach ($groupedAttempts as $attempt) {
                    $attempt->delete();
                }
            }
            
            // Daily Attempt id degistir
            DailyAttemptModel::where('user_id', $user_id )->update(['user_id' => session()->get('user_session_id')]);
            $dailyAttempts = DailyAttemptModel::where('user_id', session()->get('user_session_id'))->orderBy('created_at','desc')->get()->groupBy('user_id');
            foreach( $dailyAttempts as $questionId => $groupedAttempts){
                $latestAttempt = $groupedAttempts->shift(); // remove and return first element of array
                foreach ($groupedAttempts as $attempt) {
                    $attempt->delete();
                }
            }
        }
    
        $user_session_id = session()->get('user_session_id');
        $music_status = session()->get('music_active');
        $language = session()->get('language');

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if($user_session_id){
            session()->put('user_session_id',$user_session_id);
        }
        if($music_status) {
            session()->put('music_active', $music_status);
        }
        if($language) {
            session()->put('language', $language);
        }

        return redirect('/');
    }
}
