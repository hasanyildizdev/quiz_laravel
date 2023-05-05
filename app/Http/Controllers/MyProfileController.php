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

        $completed_questions_count = 0;
        $questionsCount = QuestionsModel::count();
        
        if (Auth::check()) {
            $completed_questions_count = AttemptModel::where('user_id', Auth::id())->count() ?? 0;
        }else{
            $completed_questions_count = AttemptModel::where('user_id', session('user_session_id'))->count() ?? 0;
        }

        if( $completed_questions_count === $questionsCount ) {
            $quiz_completed = true;
        }else{
            $quiz_completed = false;
        }

        $total_score = 0;
        $record = ScoresModel::where('user_id', Auth::id())->first();
        if ($record) {
          $total_score = $record->score;
        }         

        return Inertia::render('Quiz/MyProfile', [
            'total_score' => $total_score,
            'user' => Auth::user(),
            'completed_question_count' => $completed_questions_count,
            'remaining_question_count' => $questionsCount -  $completed_questions_count,
            'quiz_completed' => $quiz_completed,
            'language' => session()->get('language')
        ]);
    }
}
