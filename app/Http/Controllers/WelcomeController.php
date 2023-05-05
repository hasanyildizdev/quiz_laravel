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

class WelcomeController extends Controller
{
    public function index(Request $request)
    {

        // Language
        $language_session = Session::has('language');
        if(!$language_session) {
            session()->put('language', 'fa');
            $language = 'fa';
        }else{
            $language = session()->get('language');
        }

        if (Auth::check()) {
            $user_id = Auth::id();
            AttemptModel::where('user_id', session('user_session_id'))->update(['user_id' => $user_id]);

            $attempts = AttemptModel::where('user_id', $user_id)->orderBy('created_at', 'desc')->get()->groupBy('question_id');
            foreach( $attempts as $questionId => $groupedAttempts){
                $latestAttempt = $groupedAttempts->shift();
                foreach ($groupedAttempts as $attempt) {
                    $attempt->delete();
                }
            }
        }

        $scores = ScoresResource::collection(ScoresModel::orderByDesc('score')->take(10)->get());

        if(Auth::check()){
            return Inertia::render('Welcome', [
                'scores' => $scores,
                'user' => Auth::user(),
                'language' => $language
            ]);
        }else{
            return Inertia::render('Welcome', [
                'scores' => $scores,
                'language' => $language
            ]);
        }
    }

    public function set_language(Request $request) {
        session()->put('language', $request->language);
        return response()->json(['message' => 'Language changed successfully']); 
    }
}
