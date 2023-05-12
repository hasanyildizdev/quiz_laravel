<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ScoresModel;
use App\Http\Resources\ScoresResource;
use Illuminate\Support\Facades\Auth;
use App\Models\QuestionsModel;
use Illuminate\Support\Facades\Session;
use App\Models\AttemptModel;

class MyProfileController extends Controller
{
    public function index()
    {   
        
        if(!Auth::check()){
            return redirect('login');
        }

        $user_id = Auth::id();
        $questionsCount = QuestionsModel::count();
        $completed_questions_count = AttemptModel::where('user_id', $user_id)->count() ?? 0;
        $score = ScoresModel::where('user_id', $user_id)->first();
        $quiz_completed = ($completed_questions_count === $questionsCount) ? true : false;
        $language = session()->get('language') ? session()->get('language') : 'fa';

        return Inertia::render('Quiz/MyProfile', [
            'total_score' => $score->score,
            'user' => Auth::user(),
            'completed_question_count' => $completed_questions_count,
            'remaining_question_count' => $questionsCount -  $completed_questions_count,
            'quiz_completed' => $quiz_completed,
            'language' => $language
        ]);
    }
}
